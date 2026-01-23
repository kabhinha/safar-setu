import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Authenticator = () => {
    const navigate = useNavigate();
    // const { user } = useAuth(); 
    const [code, setCode] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/kiosk-code/');
            const data = response.data;

            setCode(data.formatted_code); // "123-456"
            setExpiresIn(data.expires_in_seconds);
        } catch (err) {
            console.error(err);
            setError('Could not generate code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on mount
    useEffect(() => {
        generateCode();
    }, []);

    // Countdown Timer
    useEffect(() => {
        if (!expiresIn || expiresIn <= 0) return;

        const interval = setInterval(() => {
            setExpiresIn((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresIn]);

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold">Kiosk Connect</h1>
            </div>

            {/* Main Card */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full gap-8">

                <div className="text-center space-y-2">
                    <div className="flex justify-center gap-4 text-blue-400 mb-4 opacity-80">
                        <Smartphone className="h-8 w-8" />
                        <RefreshCw className="h-6 w-6 animate-spin-slow self-center" />
                        <Monitor className="h-10 w-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Connect to Kiosk</h2>
                    <p className="text-gray-400 text-sm">
                        Enter this code on the public kiosk to login securely for 10 minutes.
                    </p>
                </div>

                {/* Code Display */}
                <div className="bg-[#1e293b] border border-blue-500/30 p-8 rounded-3xl w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${(expiresIn / 120) * 100}%` }}
                        />
                    </div>

                    {loading ? (
                        <div className="h-16 flex items-center justify-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-sm font-medium">{error}</div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-5xl font-mono font-bold tracking-wider text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                                {code || '---'}
                            </div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                                Valid for {Math.floor(expiresIn / 60)}:{(expiresIn % 60).toString().padStart(2, '0')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Regeneration */}
                <button
                    onClick={generateCode}
                    disabled={loading || expiresIn > 100} // Don't spam
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-all active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Get new code
                </button>
            </div>

            <div className="mt-auto text-center p-4">
                <p className="text-[10px] text-gray-600 uppercase">
                    Do not share this code with anyone else.
                </p>
            </div>
        </div>
    );
};

export default Authenticator;
