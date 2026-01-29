import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { X, Smartphone, Loader2, AlertCircle } from 'lucide-react';

interface QrModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceId: string | number;
    resourceType: 'SIGHT' | 'HOTSPOT';
    title: string;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, resourceId, resourceType, title }) => {
    const [tokenData, setTokenData] = useState<{ token: string; deep_link: string; expires_in_sec: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setTokenData(null);
            setError(null);
            return;
        }

        const fetchToken = async () => {
            setLoading(true);
            setError(null);
            try {
                // Determine API URL (assuming proxy or absolute)
                // Using relative path assuming /api proxy setup in Vite or same domain
                const response = await fetch('http://localhost:8000/api/v1/listings/public/qr-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        resource_type: resourceType,
                        resource_id: resourceId,
                        context: { source: 'KIOSK_MODAL' }
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to generate secure token');
                }

                const data = await response.json();
                setTokenData(data);
            } catch (err) {
                console.error(err);
                setError('Could not generate QR Code. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, [isOpen, resourceId, resourceType]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl border border-white/10 p-6 shadow-2xl relative flex flex-col items-center text-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">Take it with you</h3>
                <p className="text-sm text-gray-400 mb-6">Scan to view <span className="text-white font-semibold">{title}</span> on your phone.</p>

                <div className="bg-white p-4 rounded-xl shadow-inner mb-6 min-h-[200px] flex items-center justify-center w-full max-w-[240px]">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                            <span className="text-xs text-slate-500 font-medium">Generating Secure QR...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-2 text-red-500">
                            <AlertCircle className="w-8 h-8" />
                            <span className="text-xs font-medium">{error}</span>
                        </div>
                    ) : tokenData ? (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <QRCode
                                value={`${window.location.origin}${tokenData.deep_link}`}
                                size={200}
                                viewBox={`0 0 256 256`}
                                className="w-full h-auto"
                            />
                        </div>
                    ) : null}
                </div>

                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                    {loading ? 'Connecting...' : error ? 'Error' : 'No App Required • Secure Link'}
                </p>
                {tokenData && (
                    <p className="text-[10px] text-blue-400/60 font-mono">
                        Expires in ~10 mins
                    </p>
                )}
            </div>
        </div>
    );
};
