import React, { useState } from 'react';
import { QrCode, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VendorScan = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [resultMsg, setResultMsg] = useState('');

    const handleConfirm = async () => {
        if (!token) return;
        setLoading(true);
        setStatus('IDLE');
        setResultMsg('');

        try {
            const res = await fetch('http://localhost:8000/api/v1/commerce/scan/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token_value: token })
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('SUCCESS');
                setResultMsg(data.message || "Deal Confirmed!");
            } else {
                setStatus('ERROR');
                setResultMsg(data.error || "Invalid Token");
            }
        } catch (err) {
            console.error(err);
            setStatus('ERROR');
            setResultMsg("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">

            <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl border border-white/10 shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
                        <Camera className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Vendor Scanner</h1>
                    <p className="text-slate-400 text-center mt-2">
                        Enter the token from the traveler's QR code (simulated scan).
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                        QR Token ID (UUID)
                    </label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste QR Token here..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                    />

                    <button
                        onClick={handleConfirm}
                        disabled={loading || !token}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Processing...' : 'Confirm Deal'}
                    </button>
                </div>

                {status === 'SUCCESS' && (
                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-green-400">Success</p>
                            <p className="text-sm text-green-300">{resultMsg}</p>
                        </div>
                    </div>
                )}

                {status === 'ERROR' && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-red-400">Error</p>
                            <p className="text-sm text-red-300">{resultMsg}</p>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-slate-600 text-xs mt-8">
                Pilot Mode: Manual Token Entry
            </p>
        </div>
    );
};

export default VendorScan;
