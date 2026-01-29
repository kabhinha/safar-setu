import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DiscoveryRequest, DiscoveryResult } from '../../contracts/kioskDiscovery';
import { ArrowLeft } from 'lucide-react';
import { HotspotCard } from './components/HotspotCard'; // Will create next

export const KioskDiscoveryResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const request = location.state?.request as DiscoveryRequest;

    const [results, setResults] = useState<DiscoveryResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!request) {
            navigate('/kiosk/discover');
            return;
        }

        setLoading(true);
        fetch('http://localhost:8000/api/public/kiosk/discover/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                setResults(data.results || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Unable to load recommendations. Please try again.");
                setLoading(false);
            });
    }, [request, navigate]);

    if (!request) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <header className="max-w-7xl mx-auto flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-xl">Back</span>
                </button>
                <div className="text-right">
                    <h1 className="text-3xl font-bold">Top Recommendations</h1>
                    <p className="text-slate-400">Based on your time & interests</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl text-slate-400">Finding safe spots for you...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-10 bg-red-500/10 rounded-2xl border border-red-500/30">
                        <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
                        <p className="text-slate-300">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center p-10 bg-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-200 mb-2">No matches found</h2>
                        <p className="text-slate-400">Try adjusting your time or interests.</p>
                        <button
                            onClick={() => navigate('/kiosk/discover')}
                            className="mt-6 px-8 py-3 bg-teal-600 rounded-xl hover:bg-teal-500 font-bold"
                        >
                            Change Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((item) => (
                            <div
                                key={item.hotspot_id}
                                className="animate-fade-in"
                            >
                                <HotspotCard data={item} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
