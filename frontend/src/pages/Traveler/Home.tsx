import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { MapPin, Calendar, Search, Filter } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

// Interfaces for Backend Data
interface Media {
    id: number;
    file: string;
    media_type: string;
    caption: string;
}

interface Hotspot {
    id: string; // UUID from backend
    name: string;
    description: string;
    short_description?: string;
    district: string;
    media: Media[];
    sensitivity_level?: string;
}

const TravelerHome = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotspots = async () => {
            try {
                const headers: any = {
                    'Content-Type': 'application/json',
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${API_BASE}/listings/hotspots/`, {
                    headers: headers
                });

                if (response.ok) {
                    const data = await response.json();
                    setHotspots(data);
                } else {
                    console.error("Failed to fetch hotspots");
                }
            } catch (error) {
                console.error("Error fetching hotspots:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotspots();
    }, [token]);

    const filteredHotspots = hotspots.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <div className="sticky top-[56px] z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 p-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">YOUR SAFAR FEED</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Official Updates & Context</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Locate resources..."
                            className="pl-9 bg-slate-100 border-slate-200 text-slate-900 focus:bg-white transition-all h-9 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="px-3 h-9 w-9 flex items-center justify-center border-slate-200">
                        <Filter className="h-4 w-4 text-slate-500" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Signals</h2>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer hover:text-slate-800">Index</span>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading Grid...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredHotspots.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-600">No signals found in this sector.</p>
                            </div>
                        ) : (
                            filteredHotspots.map(spot => (
                                <Card
                                    key={spot.id}
                                    className="group overflow-hidden cursor-pointer border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                                    onClick={() => navigate(`/m/hotspot/${spot.id}`)}
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img
                                            src={spot.media && spot.media.length > 0 ? spot.media[0].file : 'https://images.unsplash.com/photo-1544983059-00f7e41c4de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={spot.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                        <div className="absolute bottom-3 left-3">
                                            <div className="flex items-center gap-1 text-white/90 text-[10px] font-bold uppercase mb-1">
                                                <MapPin className="h-3 w-3" />
                                                {spot.district}
                                            </div>
                                            <h3 className="text-lg font-bold text-white leading-none">{spot.name}</h3>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {spot.description}
                                        </p>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-slate-400" />
                                                All Seasons
                                            </div>
                                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                                {spot.sensitivity_level || 'Open'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelerHome;
