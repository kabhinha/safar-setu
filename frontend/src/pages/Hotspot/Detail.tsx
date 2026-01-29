import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, MapPin, CheckCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

interface HotspotDetail {
    id: string;
    name: string;
    description: string;
    district: string;
    media: { file: string }[];
    status: string;
    tags: string[]; // Start using tags for activities/features
    duration_minutes?: number;
}

const HotspotDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const isKioskMode = searchParams.get('mode') === 'kiosk';

    const [hotspot, setHotspot] = useState<HotspotDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // If it's kiosk mode, we might need a public endpoint, but the user said "apart from kiosk module"
                // Assuming standard traveler web access here which requires auth usually, 
                // but HotspotViewSet allows AllowAny for Read.
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${API_BASE}/listings/hotspots/${id}/`, { headers });

                if (!response.ok) {
                    throw new Error('Signal lost. Node unreachable.');
                }
                const data = await response.json();
                setHotspot(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load node data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetail();
    }, [id, token]);

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Acquiring Signal...</div>;
    if (error || !hotspot) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500">{error || "Node not found."}</div>;

    const coverImage = hotspot.media && hotspot.media.length > 0
        ? hotspot.media[0].file
        : 'https://images.unsplash.com/photo-1544983059-00f7e41c4de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    return (
        <div className="pb-24 bg-[#0a0a0a] min-h-screen">
            <div className="relative h-72 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />
                <img src={coverImage} alt={hotspot.name} className="w-full h-full object-cover opacity-80" />

                <Button
                    variant="secondary"
                    className="absolute top-4 left-4 h-10 w-10 p-0 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 z-20"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="h-5 w-5 text-white" />
                </Button>

                {isKioskMode && (
                    <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold border border-blue-400/50 shadow-lg z-20">
                        KIOSK: DISCOVERY ONLY
                    </div>
                )}
            </div>

            <div className="p-5 -mt-12 relative z-20">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight leading-none">{hotspot.name}</h1>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 font-mono">
                    <span className="flex items-center gap-1 text-blue-400"><MapPin className="h-4 w-4" /> {hotspot.district}</span>
                    <span className="text-gray-600">|</span>
                    {/* Placeholder for sensitivity if not in backend yet */}
                    <span className="text-green-500">OPEN ACCESS</span>
                </div>

                <div className="space-y-8">
                    {/* Story Section */}
                    <div className="glass p-5 rounded-2xl">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Narrative Data</h3>
                        <p className="text-gray-300 leading-relaxed font-light">
                            {hotspot.description}
                        </p>
                    </div>

                    {/* Activities / Tags */}
                    {hotspot.tags && hotspot.tags.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Available Modules</h3>
                            <div className="flex flex-wrap gap-2">
                                {hotspot.tags.map((tag, i) => (
                                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 text-gray-300 rounded-lg text-sm hover:border-white/20 transition-colors cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

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
                        {isKioskMode ? (
                            <div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl text-center space-y-4">
                                <div className="mx-auto h-32 w-32 bg-white p-2 rounded-xl">
                                    {/* Placeholder for Dynamic QR - In prod use a QR lib */}
                                    <div className="h-full w-full bg-black/10 flex items-center justify-center text-xs text-black/50 font-mono text-center">
                                        HANDOFF<br />QR CODE
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Take this with you</h3>
                                    <p className="text-sm text-blue-200/70">
                                        Scan to save "{hotspot.name}" to your Curiosity ID
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Button variant="primary" className="w-full h-14 text-base shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:opacity-90">
                                Initialize Booking Protocol
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotspotDetail;
