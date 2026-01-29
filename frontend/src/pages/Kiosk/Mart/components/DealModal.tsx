import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import type { Product, InitiateResponse } from '../../../../contracts/commerce';

interface DealModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
}

type Step = 'INITIATING' | 'QR_DISPLAY' | 'SUCCESS' | 'ERROR';

export const DealModal: React.FC<DealModalProps> = ({ isOpen, product, onClose }) => {
    const [step, setStep] = useState<Step>('INITIATING');
    const [dealData, setDealData] = useState<InitiateResponse | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // Reset state when opening
    useEffect(() => {
        if (isOpen && product) {
            setStep('INITIATING');
            setDealData(null);
            setErrorMsg('');
            initiateDeal(product);
        }
    }, [isOpen, product]);

    // Polling Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (step === 'QR_DISPLAY' && dealData) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`http://localhost:8000/api/v1/commerce/deals/${dealData.deal_id}/status/`);
                    const data = await res.json();

                    if (data.status === 'VENDOR_CONFIRMED' || data.status === 'CLOSED') {
                        setStep('SUCCESS');
                        clearInterval(interval);
                    } else if (data.status === 'EXPIRED' || data.status === 'CANCELLED') {
                        setErrorMsg('Deal expired or cancelled.');
                        setStep('ERROR');
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [step, dealData]);

    const initiateDeal = async (prod: Product) => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/commerce/deals/initiate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: prod.id,
                    kiosk_id: 'KIOSK_01', // Hardcoded for pilot
                    district_id: 'GANGTOK'
                })
            });

            if (!res.ok) throw new Error("Failed to initiate deal");

            const data: InitiateResponse = await res.json();
            setDealData(data);
            setStep('QR_DISPLAY');
        } catch (err) {
            console.error(err);
            setErrorMsg("Could not connect to commerce server.");
            setStep('ERROR');
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 text-center">

                    {step === 'INITIATING' && (
                        <div className="py-12 flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                            <p className="text-slate-300 text-lg">Reserving {product.title}...</p>
                        </div>
                    )}

                    {step === 'QR_DISPLAY' && dealData && (
                        <div className="flex flex-col items-center gap-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-white">Show QR to Vendor</h2>
                            <p className="text-slate-400 max-w-xs mx-auto">
                                Please allow the vendor to scan this code to confirm your purchase.
                            </p>

                            <div className="bg-white p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
                                <QRCode value={dealData.token_value} size={200} level="H" />
                            </div>

                            <div className="bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                                <span className="text-emerald-400 text-sm font-medium">Waiting for confirmation...</span>
                            </div>

                            <p className="text-xs text-slate-500 font-mono mt-2">
                                Token: {dealData.token_value} <br />
                                ID: {dealData.deal_id.slice(0, 8)}
                            </p>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="py-8 flex flex-col items-center gap-6 animate-fade-in">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white">Deal Confirmed!</h2>
                                <p className="text-emerald-400 text-lg">Thank you for purchasing.</p>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-2xl border border-white/5 w-full mt-4">
                                <p className="text-slate-300 mb-2">Please collect your item:</p>
                                <p className="text-xl font-bold text-white">{product.title}</p>
                                <p className="text-emerald-400 font-mono mt-1">₹{product.price}</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors mt-4"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    {step === 'ERROR' && (
                        <div className="py-12 flex flex-col items-center gap-4 animate-fade-in">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-red-500">Something went wrong</h3>
                            <p className="text-slate-400">{errorMsg}</p>
                            <button
                                onClick={() => setStep('INITIATING')}
                                className="px-6 py-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 text-white transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
