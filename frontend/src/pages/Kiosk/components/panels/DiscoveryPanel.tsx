import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import type { DiscoveryRequest, DiscoveryResult, DistrictOption } from '../../../../contracts/kioskDiscovery';
import { HotspotCard } from '../HotspotCard';

const TIME_OPTIONS = [
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '3h+', value: 180 },
    { label: 'Full Day', value: 480 },
];

const INTEREST_TAGS = ['Nature', 'Culture', 'Food', 'Crafts', 'Quiet', 'Adventure', 'History'];

export const DiscoveryPanel: React.FC = () => {
    const [view, setView] = useState<'input' | 'results'>('input');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DiscoveryResult[]>([]);

    // Form State
    const [districts, setDistricts] = useState<DistrictOption[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<number | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    useEffect(() => {
        // Fetch Districts on mount
        fetch('http://localhost:8000/api/public/districts/')
            .then(res => res.json())
            .then(data => {
                setDistricts(data);
                if (data.length > 0 && !selectedDistrict) setSelectedDistrict(data[0].district_id);
            })
            .catch(err => console.error("Failed to fetch districts", err));
    }, []);

    const toggleInterest = (tag: string) => {
        if (selectedInterests.includes(tag)) {
            setSelectedInterests(selectedInterests.filter(t => t !== tag));
        } else {
            setSelectedInterests([...selectedInterests, tag]);
        }
    };

    const handleSearch = () => {
        if (!selectedDistrict || !selectedTime) return;
        setLoading(true);
        const request: DiscoveryRequest = {
            available_time: selectedTime,
            interest_tags: selectedInterests,
            district_id: selectedDistrict
        };

        fetch('http://localhost:8000/api/public/kiosk/discover/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(res => res.json())
            .then(data => {
                setResults(data.results || []);
                setView('results');
            })
            .catch(err => console.error("Discovery failed", err))
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Header / Nav for Panel state */}
            {view === 'results' && (
                <button
                    onClick={() => setView('input')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-bold">Back to Filters</span>
                </button>
            )}

            {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Finding perfect matches...</p>
                </div>
            ) : view === 'input' ? (
                <div className="space-y-8">
                    {/* Where */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-teal-400">
                            <MapPin className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Select District</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {districts.map(d => (
                                <button
                                    key={d.district_id}
                                    onClick={() => setSelectedDistrict(d.district_id)}
                                    className={`px-3 py-2 rounded-lg text-left text-sm border transition-all ${selectedDistrict === d.district_id
                                            ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                                            : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                                        }`}
                                >
                                    {d.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Time */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-blue-400">
                            <Clock className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Time Available</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {TIME_OPTIONS.map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => setSelectedTime(opt.value)}
                                    className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedTime === opt.value
                                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                            : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Interests */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-purple-400">
                            <Compass className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Interests</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {INTEREST_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleInterest(tag)}
                                    className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedInterests.includes(tag)
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                            : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </section>

                    <button
                        onClick={handleSearch}
                        disabled={!selectedDistrict || !selectedTime}
                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-all active:scale-95 ${(!selectedDistrict || !selectedTime)
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        Find Experiences
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 pb-8">
                    {results.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            <p>No matching experiences found.</p>
                        </div>
                    ) : (
                        results.map((item) => (
                            <HotspotCard key={item.hotspot_id} data={item} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
