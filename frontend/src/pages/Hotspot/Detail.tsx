import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_HOTSPOTS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, MapPin, CheckCircle } from 'lucide-react';

const HotspotDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hotspot = MOCK_HOTSPOTS.find(h => h.id === id);

    if (!hotspot) {
        return <div className="p-10 text-center text-gray-500">Node not found.</div>;
    }

    return (
        <div className="pb-24 bg-[#0a0a0a] min-h-screen">
            <div className="relative h-72 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />
                <img src={hotspot.images[0]} alt={hotspot.title} className="w-full h-full object-cover opacity-80" />

                <Button
                    variant="secondary"
                    className="absolute top-4 left-4 h-10 w-10 p-0 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 z-20"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="h-5 w-5 text-white" />
                </Button>
            </div>

            <div className="p-5 -mt-12 relative z-20">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight leading-none">{hotspot.title}</h1>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 font-mono">
                    <span className="flex items-center gap-1 text-blue-400"><MapPin className="h-4 w-4" /> {hotspot.district}</span>
                    <span className="text-gray-600">|</span>
                    <span className={hotspot.sensitivity === 'PROTECTED' ? 'text-amber-500' : 'text-green-500'}>{hotspot.sensitivity}</span>
                </div>

                <div className="space-y-8">
                    {/* Story Section */}
                    <div className="glass p-5 rounded-2xl">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Narrative Data</h3>
                        <p className="text-gray-300 leading-relaxed font-light">
                            {hotspot.story}
                        </p>
                    </div>

                    {/* Activities */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Available Modules</h3>
                        <div className="flex flex-wrap gap-2">
                            {hotspot.activities.map((act, i) => (
                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 text-gray-300 rounded-lg text-sm hover:border-white/20 transition-colors cursor-default">
                                    {act}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Host Info */}
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                            H
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">Local Node</span>
                                <CheckCircle className="h-3 w-3 text-blue-500" />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-yellow-500/80 text-[10px]">★</span>)}
                                </div>
                                <span className="text-xs text-gray-500">Verified</span>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-white/10">Signal</Button>
                    </div>

                    <div className="pt-4">
                        <Button variant="primary" className="w-full h-14 text-base shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:opacity-90">
                            Initialize Booking Protocol
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotspotDetail;
