import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { MapPin, Calendar, Search, Filter } from 'lucide-react';
import { MOCK_HOTSPOTS } from '../../services/mockData';

const TravelerHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHotspots = MOCK_HOTSPOTS.filter(h =>
        h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-32 min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">DISCOVER</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Zone: NE-Pilot</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                            placeholder="Search coordinates..."
                            className="pl-10 bg-white/5 border-white/5 focus:bg-white/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" className="px-3 md:px-4 h-11 w-11 flex items-center justify-center">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recommended Nodes</h2>
                    <span className="text-xs text-blue-500 cursor-pointer hover:text-blue-400">View All</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredHotspots.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-600">No signals found in this sector.</p>
                        </div>
                    ) : (
                        filteredHotspots.map(spot => (
                            <Card
                                key={spot.id}
                                className="group overflow-hidden cursor-pointer border-white/5 bg-white/5 hover:border-white/20 transition-all duration-500"
                                onClick={() => navigate(`/hotspot/${spot.id}`)}
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={spot.images[0]}
                                        alt={spot.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />

                                    <div className="absolute top-3 right-3 z-20">
                                        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                                            {spot.sensitivity === 'PROTECTED' ? '🔒' : '●'}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-20">
                                        <div className="flex items-center gap-1 text-blue-400 text-xs font-mono mb-1">
                                            <MapPin className="h-3 w-3" />
                                            {spot.district.toUpperCase()}
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight leading-none group-hover:text-blue-200 transition-colors">{spot.title}</h3>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                        {spot.description}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {spot.seasonality}
                                        </div>
                                        <span className="px-2 py-1 bg-white/5 rounded border border-white/5 text-gray-300">
                                            {spot.status}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelerHome;
