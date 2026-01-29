import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { HotspotCard } from '../components/HotspotCard';
import type { DiscoveryResult } from '../../../contracts/kioskDiscovery';

export const KioskSights: React.FC = () => {
    const navigate = useNavigate();
    const [sights, setSights] = useState<DiscoveryResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const CATEGORIES = [
        { id: 'MONASTERY', label: 'Monasteries' },
        { id: 'VIEWPOINT', label: 'Viewpoints' },
        { id: 'HERITAGE', label: 'Heritage' },
        { id: 'NATURE', label: 'Nature' }
    ];

    useEffect(() => {
        setLoading(true);
        // Build query string
        let url = 'http://localhost:8000/api/v1/listings/public/sights/';
        if (activeCategory) {
            url += `?category=${activeCategory}`;
        }

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch sights");
                return res.json();
            })
            .then(data => {
                // Handle both paginated ({ results: [] }) and non-paginated ([]) responses
                const list = Array.isArray(data) ? data : (data.results || []);

                // Map API response to DiscoveryResult for Card reuse
                const mapped: DiscoveryResult[] = list.map((item: any) => ({
                    hotspot_id: item.id,
                    title: item.title,
                    short_description: item.short_description,
                    district_name: item.district,
                    cluster_label: item.cluster_label,
                    // Parse duration if string "60 min" or just number
                    typical_duration_min: typeof item.duration_minutes === 'number' ? item.duration_minutes : 60,
                    distance_band: item.hotspot_type === 'SIGHT' ? (item.category || 'Sight') : 'Hotspot',
                    approx_travel_time_min: null,
                    nearest_transport_hub: null,
                    // Add cover image if strictly needed, though HotspotCard might default
                }));
                setSights(mapped);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Unable to load sights. Please try again.");
                setLoading(false);
            });
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <header className="max-w-7xl mx-auto flex flex-col gap-6 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-xl">Back to Home</span>
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="bg-purple-500/10 p-2 rounded-lg">
                                <Camera className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-bold">Sights</h1>
                        </div>
                        <p className="text-slate-400 text-lg ml-14">Monasteries, Viewpoints & Heritage</p>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${!activeCategory
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl text-slate-400">Loading sights...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-10 bg-red-500/10 rounded-2xl border border-red-500/30">
                        <h2 className="text-2xl font-bold text-red-400 mb-2">Unavailable</h2>
                        <p className="text-slate-300">{error}</p>
                    </div>
                ) : sights.length === 0 ? (
                    <div className="text-center p-10 bg-slate-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-slate-200 mb-2">No sights found</h2>
                        <p className="text-slate-400">Try a different category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sights.map((item) => (
                            <div key={item.hotspot_id} className="animate-fade-in">
                                <HotspotCard data={item} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
