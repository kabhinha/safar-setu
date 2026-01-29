import React, { useState, useEffect } from 'react';
import { HotspotCard } from '../HotspotCard';
import type { DiscoveryResult } from '../../../../contracts/kioskDiscovery';

export const SightsPanel: React.FC = () => {
    const [sights, setSights] = useState<DiscoveryResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const CATEGORIES = [
        { id: 'MONASTERY', label: 'Monasteries' },
        { id: 'VIEWPOINT', label: 'Viewpoints' },
        { id: 'HERITAGE', label: 'Heritage' },
    ];

    useEffect(() => {
        setLoading(true);
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
                const list = Array.isArray(data) ? data : (data.results || []);
                const mapped: DiscoveryResult[] = list.map((item: any) => ({
                    hotspot_id: item.id,
                    title: item.title,
                    short_description: item.short_description,
                    district_name: item.district,
                    cluster_label: item.cluster_label,
                    typical_duration_min: typeof item.duration_minutes === 'number' ? item.duration_minutes : 60,
                    distance_band: item.hotspot_type === 'SIGHT' ? (item.category || 'Sight') : 'Hotspot',
                    approx_travel_time_min: null,
                    nearest_transport_hub: null,
                }));
                setSights(mapped);
                setLoading(false);
            })
            .catch(err => {
                setError("Unable to load sights.");
                setLoading(false);
            });
    }, [activeCategory]);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!activeCategory
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    All Sights
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400">Loading sights...</p>
                </div>
            ) : error ? (
                <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/30 text-center">
                    <p className="text-red-400 font-bold">{error}</p>
                </div>
            ) : sights.length === 0 ? (
                <div className="p-6 bg-slate-800 rounded-2xl text-center">
                    <p className="text-slate-400">No sights found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 pb-8">
                    {sights.map((item) => (
                        <HotspotCard key={item.hotspot_id} data={item} />
                    ))}
                </div>
            )}
        </div>
    );
};
