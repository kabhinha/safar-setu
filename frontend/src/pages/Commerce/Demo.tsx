import { useState, useEffect } from 'react';
import { commerceService } from '../../services/commerce';
import type { Product, DealResponse } from '../../services/commerce';
import QRCode from 'react-qr-code';
import { ShoppingBag, ScanLine, CheckCircle } from 'lucide-react';

const CommerceDemo = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeDeal, setActiveDeal] = useState<DealResponse | null>(null);
    const [dealStatus, setDealStatus] = useState<string>('');

    // Vendor State
    const [scanInput, setScanInput] = useState('');
    const [vendorMessage, setVendorMessage] = useState('');
    const [vendorDealId, setVendorDealId] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    // Poll status if deal is active
    useEffect(() => {
        let interval: any;
        if (activeDeal && dealStatus !== 'CLOSED' && dealStatus !== 'CANCELLED') {
            interval = setInterval(async () => {
                try {
                    const statusData = await commerceService.checkStatus(activeDeal.deal_id);
                    setDealStatus(statusData.status);
                } catch (e) { console.error(e); }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [activeDeal, dealStatus]);

    const loadProducts = async () => {
        try {
            const data = await commerceService.getProducts();
            setProducts(data);
        } catch (e) {
            console.error("Failed to load products", e);
        }
    };

    const handleBuy = async (p: Product) => {
        try {
            const deal = await commerceService.initiateDeal(p.id);
            setActiveDeal(deal);
            setDealStatus(deal.status);
        } catch (e) { alert('Failed to start deal'); }
    };

    const handleVendorScan = async () => {
        try {
            const res = await commerceService.scanToken(scanInput);
            setVendorMessage(res.message);
            setVendorDealId(res.deal_id);
            setScanInput(''); // clear
        } catch (e: unknown) {
            const err = e as { response?: { data?: { error?: string } } };
            setVendorMessage(err.response?.data?.error || 'Scan Failed');
        }
    };

    const handleGenerateVendorToken = async () => {
        if (!vendorDealId) return;
        try {
            const res = await commerceService.getVendorToken(vendorDealId);
            // Auto-fill scanner for demo convenience
            setScanInput(res.token_value);
            setVendorMessage("Vendor Token Generated! Scan to Close.");
        } catch (e) { alert('Failed to gen token'); }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Commerce Module Demo: Dual-QR Closure
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

                {/* LEFT: TRAVELER VIEW */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                        <ShoppingBag className="text-blue-400" />
                        <h2 className="text-xl font-bold text-blue-100">Traveler Kiosk</h2>
                    </div>

                    {!activeDeal ? (
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm mb-4">Select a local product to pick up:</p>
                            <div className="grid gap-3">
                                {products.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50">
                                        <div>
                                            <h3 className="font-bold text-slate-200">{p.title}</h3>
                                            <p className="text-sm text-slate-500">{p.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-green-400">₹{p.price}</span>
                                            <button
                                                onClick={() => handleBuy(p)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20"
                                            >
                                                Pick Up
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {products.length === 0 && <div className="text-slate-500 italic">No products loaded. (Did you run seed?)</div>}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="inline-block p-4 bg-white rounded-2xl mb-6 shadow-2xl shadow-blue-900/20">
                                {dealStatus === 'CLOSED' ? (
                                    <CheckCircle className="h-48 w-48 text-green-500" />
                                ) : (
                                    <QRCode value={activeDeal.token_value} size={192} />
                                )}
                            </div>

                            <h3 className="text-2xl font-bold mb-2">
                                {dealStatus === 'INITIATED' && 'Show to Vendor'}
                                {dealStatus === 'VENDOR_CONFIRMED' && 'Vendor Confirmed!'}
                                {dealStatus === 'CLOSED' && 'Enjoy!'}
                            </h3>

                            <p className="font-mono text-sm text-slate-400 bg-slate-950 inline-block px-3 py-1 rounded border border-slate-800">
                                Status: <span className="text-yellow-400">{dealStatus}</span>
                            </p>

                            <div className="mt-8 text-left bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-xs text-slate-500 mb-1">DEBUG: TOKEN VALUE</p>
                                <code className="break-all font-mono text-xs text-slate-300">{activeDeal.token_value}</code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(activeDeal.token_value)}
                                    className="block mt-2 text-xs text-blue-400 hover:underline"
                                >
                                    Copy for Simulation
                                </button>
                            </div>

                            {dealStatus === 'CLOSED' && (
                                <button onClick={() => { setActiveDeal(null); setDealStatus(''); }} className="mt-6 text-slate-400 hover:text-white underline">
                                    Start New Order
                                </button>
                            )}
                        </div>
                    )}
                </div>


                {/* RIGHT: VENDOR VIEW */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4 relative z-10">
                        <ScanLine className="text-purple-400" />
                        <h2 className="text-xl font-bold text-purple-100">Vendor Scanner</h2>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Scan QR Payload</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    placeholder="Paste token UUID here..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none font-mono"
                                />
                                <button
                                    onClick={handleVendorScan}
                                    className="px-6 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg shadow-purple-900/20"
                                >
                                    Scan
                                </button>
                            </div>
                        </div>

                        {vendorMessage && (
                            <div className={`p-4 rounded-xl border ${vendorMessage.includes('Failed') || vendorMessage.includes('error') ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-green-500/10 border-green-500/30 text-green-200'}`}>
                                {vendorMessage}
                            </div>
                        )}

                        {/* Action to Generate Vendor Token if Confirmed */}
                        {vendorMessage.includes('Confirmed') && vendorDealId && (
                            <div className="p-6 bg-slate-800/80 rounded-2xl border border-dashed border-slate-600 text-center">
                                <p className="text-slate-300 mb-4">Item Handover Ready?</p>
                                <button
                                    onClick={handleGenerateVendorToken}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-xl hover:opacity-90 transition-opacity"
                                >
                                    Generate Confirmation QR
                                </button>
                            </div>
                        )}

                        {/* Simulation Helper */}
                        <div className="mt-8 pt-8 border-t border-slate-800/50 text-xs text-slate-600">
                            <strong>Simulation Guide:</strong>
                            <ol className="list-decimal list-inside mt-2 space-y-1">
                                <li>User picks item &rarr; Copy Token URL</li>
                                <li>Paste in Scanner &rarr; Click Scan (Status: VENDOR_CONFIRMED)</li>
                                <li>Click "Generate Confirmation QR" &rarr; Auto-pastes new token</li>
                                <li>Click Scan again &rarr; (Status: CLOSED)</li>
                            </ol>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommerceDemo;
