import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User } from '../types';
import api from '../services/api';

interface AuthState {
    user: User | null;
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token
        const token = localStorage.getItem('token');
        if (token) {
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
            // 1. Get Token
            // Adapting to backend expectation: "username" instead of "email" if needed, 
            // but usually TokenObtainPairView uses username field. 
            // If User model uses email as username, or we send email as username.
            // Let's assume standardized payload { username: creds.email, password: creds.password }
            // or just pass as is if backend handles email.
            // Standard DRF TokenObtainPairView expects 'username' key by default unless customized.

            const payload = {
                email: creds.email,
                password: creds.password
            };

            const res = await api.post('/auth/login/', payload);
            const { access, refresh } = res.data;

            if (!access) throw new Error("No access token received");

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);

            // 2. Fetch User Profile
            const profileRes = await api.get('/users/me/');
            const userProfile = profileRes.data;

            // Ensure role matches (optional security check)
            // if (userProfile.role !== role) ...

            localStorage.setItem('user', JSON.stringify(userProfile));
            setUser(userProfile);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (data: any) => {
        // API call to register
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
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshProfile }}>
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
