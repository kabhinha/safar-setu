import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Monitor, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GovtNavbar from '../../components/layout/GovtNavbar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const Authenticator = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('http://localhost:8000/api/v1/auth/kiosk-code/');
            const data = response.data;
            setCode(data.formatted_code);
            setExpiresIn(data.expires_in_seconds);
        } catch (err) {
            console.error(err);
            setError('System Error: Could not generate entry token.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateCode();
    }, []);

    useEffect(() => {
        if (!expiresIn || expiresIn <= 0) return;
        const interval = setInterval(() => {
            setExpiresIn((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresIn]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <GovtNavbar showUserBadge={false} />

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">

                <div className="text-center space-y-2 max-w-xs">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                            <Monitor className="h-6 w-6 text-slate-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Kiosk Connection</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Enter this secure token on the public terminal to access your Mission Log.
                    </p>
                </div>

                <Card className="w-full max-w-sm bg-white border-slate-200 shadow-sm overflow-hidden relative p-8 text-center">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                        <div
                            className="h-full bg-slate-900 transition-all duration-1000 ease-linear"
                            style={{ width: `${(expiresIn / 120) * 100}%` }}
                        />
                    </div>

                    {loading ? (
                        <div className="py-8 flex justify-center">
                            <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                        </div>
                    ) : error ? (
                        <div className="py-8 text-red-600 text-xs font-bold">{error}</div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="text-4xl font-mono font-bold tracking-widest text-slate-900">
                                {code || '---'}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                <Shield className="h-3 w-3" />
                                Valid for {Math.floor(expiresIn / 60)}:{(expiresIn % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    )}
                </Card>

                <Button
                    variant="outline"
                    onClick={generateCode}
                    disabled={loading || expiresIn > 100}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 min-w-[200px]"
                >
                    <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate Token
                </Button>

                <div className="mt-auto">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <ArrowLeft className="h-3 w-3" /> Return
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Authenticator;
