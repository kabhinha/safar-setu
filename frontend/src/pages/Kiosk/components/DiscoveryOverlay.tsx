import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import type { DiscoveryRequest, DiscoveryResult, DistrictOption } from '../../../contracts/kioskDiscovery';
import { HotspotCard } from './HotspotCard';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const TIME_OPTIONS = [
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '3h+', value: 180 },
    { label: 'Full Day', value: 480 },
];

const INTEREST_TAGS = ['Nature', 'Culture', 'Food', 'Crafts', 'Quiet', 'Adventure', 'History'];

export const DiscoveryOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<'input' | 'results'>('input');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DiscoveryResult[]>([]);

    // Form State
    const [districts, setDistricts] = useState<DistrictOption[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<number | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setView('input');
            setResults([]);
            // Fetch Districts
            fetch('http://localhost:8000/api/public/districts/')
                .then(res => res.json())
                .then(data => {
                    setDistricts(data);
                    if (data.length > 0 && !selectedDistrict) setSelectedDistrict(data[0].district_id);
                })
                .catch(err => console.error("Failed to fetch districts", err));
        }
    }, [isOpen]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-6">
            <div className="bg-[#1e293b] w-full max-w-6xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">

                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20">
                    <div className="flex items-center gap-4">
                        {view === 'results' && (
                            <button
                                onClick={() => setView('input')}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-slate-400" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                                {view === 'input' ? 'Plan Your Experience' : 'Recommended For You'}
                            </h2>
                            {view === 'results' && (
                                <p className="text-xs text-slate-400">
                                    Based on {selectedTime}m • {selectedInterests.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 animate-pulse">Finding perfect matches...</p>
                        </div>
                    ) : view === 'input' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
                            <div className="space-y-10">
                                {/* Where */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4 text-teal-400">
                                        <MapPin className="w-6 h-6" />
                                        <h3 className="text-xl font-semibold">Select District</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {districts.map(d => (
                                            <button
                                                key={d.district_id}
                                                onClick={() => setSelectedDistrict(d.district_id)}
                                                className={`px-4 py-3 rounded-xl text-left border transition-all ${selectedDistrict === d.district_id
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
                                    <div className="flex items-center gap-3 mb-4 text-blue-400">
                                        <Clock className="w-6 h-6" />
                                        <h3 className="text-xl font-semibold">Available Time</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {TIME_OPTIONS.map(opt => (
                                            <button
                                                key={opt.label}
                                                onClick={() => setSelectedTime(opt.value)}
                                                className={`px-5 py-2 rounded-full border transition-all ${selectedTime === opt.value
                                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="flex flex-col h-full">
                                {/* Interests */}
                                <section className="flex-1">
                                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                                        <Compass className="w-6 h-6" />
                                        <h3 className="text-xl font-semibold">Result Interests</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {INTEREST_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleInterest(tag)}
                                                className={`px-5 py-2 rounded-full border transition-all ${selectedInterests.includes(tag)
                                                    ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Action Button - Pinned Bottom Right of grid col */}
                                <div className="mt-auto pt-8 flex justify-end">
                                    <button
                                        onClick={handleSearch}
                                        disabled={!selectedDistrict || !selectedTime}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-xl font-bold transition-all active:scale-95 hover:scale-105 ${(!selectedDistrict || !selectedTime)
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            }`}
                                    >
                                        Find Experiences
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    <p className="text-xl">No matching experiences found. Try adjusting your filters.</p>
                                </div>
                            ) : (
                                results.map((item) => (
                                    <div key={item.hotspot_id} className="animate-fade-in-up">
                                        <HotspotCard data={item} />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
