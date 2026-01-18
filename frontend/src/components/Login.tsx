import React, { useState } from 'react';
import { api } from '../api';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                // Login Flow (Legacy Token)
                const res = await api.login(token);
                if (res.data.valid) {
                    onLoginSuccess(res.data.token);
                }
            } else {
                // Register Flow
                if (!email || !password || !token) {
                    throw new Error("All fields required");
                }
                await api.register(email, password, token);
                setSuccessMsg("Registration Successful! Please login.");
                setIsLogin(true);
                // Clear sensitive fields
                setPassword('');
            }
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message || 'Authentication Failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="p-8 bg-slate-800 rounded-lg shadow-xl border border-slate-700 w-96">
                <h1 className="text-2xl font-bold mb-2 text-center text-blue-400">Project X</h1>
                <p className="text-center text-slate-400 text-sm mb-6">Government Pilot /// Invite Only</p>

                {successMsg && <div className="mb-4 text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:border-blue-500 outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Invite Code</label>
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:border-blue-500 outline-none"
                            placeholder={isLogin ? "Enter Access Token..." : "Enter Invite Code..."}
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                        {isLogin ? "Have an invite? Register here" : "Back to Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};
