import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DiscoveryRequest, DistrictOption } from '../../contracts/kioskDiscovery';
import { ArrowRight, Clock, Compass, MapPin } from 'lucide-react';

const TIME_OPTIONS = [
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '3h+', value: 180 },
    { label: 'Full Day', value: 480 },
];

const INTEREST_TAGS = ['Nature', 'Culture', 'Food', 'Crafts', 'Quiet', 'Adventure', 'History'];

export const KioskDiscovery: React.FC = () => {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState<DistrictOption[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>(''); // Default to empty or first
    const [selectedTime, setSelectedTime] = useState<number | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    useEffect(() => {
        // Fetch Districts
        fetch('http://localhost:8000/api/public/districts/')
            .then(res => res.json())
            .then(data => {
                setDistricts(data);
                if (data.length > 0) setSelectedDistrict(data[0].district_id);
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
        if (!selectedDistrict) return;

        const request: DiscoveryRequest = {
            available_time: selectedTime || 0, // 0 implies any or handle on backend? Backend handles nulls usually, let's send 0 if not selected or validate.
            // Actually plan says "Time required". Let's enforce time selection or default to max.
            interest_tags: selectedInterests,
            district_id: selectedDistrict
        };

        // Navigate to results with state
        navigate('/kiosk/discover/results', { state: { request } });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                            Discovery Mode
                        </h1>
                        <p className="text-slate-400 mt-2 text-xl">Find what fits your time & mood.</p>
                    </div>
                    <button onClick={() => navigate('/kiosk')} className="text-slate-400 hover:text-white">
                        Cancel
                    </button>
                </header>

                <main className="space-y-10">
                    {/* Section 1: Where */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-teal-400">
                            <MapPin className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold">Where are you?</h2>
                        </div>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full md:w-1/2 bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-xl focus:border-teal-500 outline-none transition-colors"
                        >
                            <option value="" disabled>Select District</option>
                            {districts.map(d => (
                                <option key={d.district_id} value={d.district_id}>{d.name}</option>
                            ))}
                        </select>
                    </section>

                    {/* Section 2: Time */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-blue-400">
                            <Clock className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold">How much time do you have?</h2>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {TIME_OPTIONS.map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => setSelectedTime(opt.value)}
                                    className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${selectedTime === opt.value
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Interests */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 text-purple-400">
                            <Compass className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold">What are you into?</h2>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {INTEREST_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleInterest(tag)}
                                    className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${selectedInterests.includes(tag)
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Action */}
                    <div className="pt-8 flex justify-end">
                        <button
                            onClick={handleSearch}
                            disabled={!selectedDistrict || !selectedTime}
                            className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-2xl font-bold shadow-xl transition-transform active:scale-95 hover:scale-105 ${(!selectedDistrict || !selectedTime)
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-teal-500/20'
                                }`}
                        >
                            Show Recommendations
                            <ArrowRight className="w-8 h-8" />
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};
