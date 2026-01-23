import { useState, useEffect } from 'react';
import { X, Smartphone, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KioskLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (token: string, user: any) => void;
}

const KioskLoginModal = ({ isOpen, onClose, onLogin }: KioskLoginModalProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCode('');
            setError(null);
            setSuccess(false);
        }
    }, [isOpen]);

    const handleNumberClick = (num: string) => {
        if (code.length < 6) {
            setCode(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setCode(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setCode('');
    };

    const handleSubmit = async () => {
        if (code.length !== 6) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/api/v1/kiosk/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setSuccess(true);
            setTimeout(() => {
                onLogin(data.access, data.user);
                onClose();
            }, 1000);

        } catch (err: any) {
            setError(err.message || 'Invalid Request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-[#1e293b] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full">
                    <X className="h-6 w-6 text-gray-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <Smartphone className="h-8 w-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect Your Phone</h2>
                    <p className="text-gray-400 text-sm">
                        Enter the 6-digit code displayed on your mobile authenticator.
                    </p>
                </div>

                {/* Code Display */}
                <div className="mb-8 flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-14 w-12 rounded-lg bg-black/50 border-2 flex items-center justify-center text-2xl font-bold transition-all",
                                i < code.length ? "border-blue-500 text-white" : "border-white/10 text-gray-600",
                                error && "border-red-500 text-red-500",
                                success && "border-green-500 text-green-500"
                            )}
                        >
                            {code[i] || ''}
                        </div>
                    ))}
                </div>

                {/* Feedback */}
                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Connected! Redirecting...
                    </div>
                )}

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num.toString())}
                            disabled={loading || success}
                            className="h-16 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-2xl font-bold text-white disabled:opacity-50"
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={handleClear} disabled={loading || success} className="h-16 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold active:scale-95 transition-all">
                        C
                    </button>
                    <button onClick={() => handleNumberClick('0')} disabled={loading || success} className="h-16 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-2xl font-bold text-white">
                        0
                    </button>
                    <button onClick={handleBackspace} disabled={loading || success} className="h-16 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                        ←
                    </button>
                </div>

                {/* Submit Action */}
                <button
                    onClick={handleSubmit}
                    disabled={code.length !== 6 || loading || success}
                    className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Connect'}
                </button>

            </div>
        </div>
    );
};

export default KioskLoginModal;
