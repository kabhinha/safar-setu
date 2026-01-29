import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User } from '../types';
import api from '../services/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (creds: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // In a real app, we would validate token and fetch user profile here
            // For now, we'll try to retrieve stored user or just generic persistence
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (creds: any) => {
        try {
            // ... (keep logic)
            // But ensure we setToken state
            const payload = {
                email: creds.email,
                password: creds.password
            };

            const res = await api.post('/auth/login/', payload);
            const { access, refresh } = res.data;

            if (!access) throw new Error("No access token received");

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            setToken(access); // Update state

            // 2. Fetch User Profile
            const profileRes = await api.get('/users/me/');
            const userProfile = profileRes.data;

            localStorage.setItem('user', JSON.stringify(userProfile));
            setUser(userProfile);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (data: any) => {
        await api.post('/auth/signup/', data);
    };

    const refreshProfile = async () => {
        try {
            const profileRes = await api.get('/users/me/');
            const userProfile = profileRes.data;
            localStorage.setItem('user', JSON.stringify(userProfile));
            setUser(userProfile);
        } catch (error) {
            console.error('Failed to refresh profile', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refresh');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
