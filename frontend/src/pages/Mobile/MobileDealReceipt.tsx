import { useParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMobileToken } from './hooks/useMobileToken';

const MobileDealReceipt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const { token: queryToken, isValid, hasTokenParam } = useMobileToken();

    const tokenFromPath = id || '';
    const token = queryToken || tokenFromPath;
    const hasTokenValue = token.trim().length > 0 || (hasTokenParam && isValid);
    const tokenInvalid = (hasTokenParam && !isValid) || (!isAuthenticated && !hasTokenValue);

    if (tokenInvalid) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 text-center">
                <p className="text-lg font-semibold">QR expired. Please rescan at kiosk.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-32 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Deal Voucher
                </h1>
                <p className="text-gray-400 text-center mb-10 text-sm max-w-[250px]">
                    Present this secure token to the vendor to claim your item.
                </p>

                <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest mb-4 text-center">
                        SECURE TOKEN ID
                    </p>

                    <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-2">
                        <p className="text-xl font-mono font-bold text-white text-center break-all tracking-wider">
                            {token}
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-green-400 font-bold uppercase">Active & Valid</span>
                    </div>
                </div>
            </div>

            <div className="p-6 text-center z-10">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                    Secured by SafarSetu Pilot
                </p>
            </div>
        </div>
    );
};

export default MobileDealReceipt;
