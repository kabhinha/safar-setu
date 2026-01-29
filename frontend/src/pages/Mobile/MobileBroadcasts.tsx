import { useEffect, useState } from 'react';
import { Radio, AlertTriangle, ShieldAlert, Info, ChevronLeft, Calendar, MapPin } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Broadcast {
    id: string;
    category: 'FESTIVAL' | 'ROUTE_CLOSURE' | 'ADVISORY' | 'CROWD_WARNING';
    title: string;
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    created_at?: string;
    valid_until?: string;
}

const MobileBroadcasts = () => {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBroadcasts = async () => {
            try {
                // TODO: Use env variable for API base
                const res = await fetch('http://127.0.0.1:8000/api/v1/public/broadcasts');
                if (res.ok) {
                    const data = await res.json();
                    setBroadcasts(Array.isArray(data) ? data : data.results || []);
                }
            } catch (err) {
                console.error("Failed to load broadcasts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBroadcasts();
    }, []);

    const getIcon = (broadcast: Broadcast) => {
        if (broadcast.severity === 'CRITICAL' || broadcast.category === 'CROWD_WARNING') return ShieldAlert;
        if (broadcast.severity === 'WARNING' || broadcast.category === 'ROUTE_CLOSURE') return AlertTriangle;
        if (broadcast.category === 'FESTIVAL') return Calendar; // Or Party/Sparkles
        return Info;
    };

    const getColor = (broadcast: Broadcast) => {
        if (broadcast.severity === 'CRITICAL' || broadcast.category === 'CROWD_WARNING') return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (broadcast.severity === 'WARNING' || broadcast.category === 'ROUTE_CLOSURE') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        if (broadcast.category === 'FESTIVAL') return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-12">
            {/* Header */}
            <div className="bg-[#1e293b]/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-20 px-4 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full">
                    <ChevronLeft className="w-6 h-6 text-gray-400" />
                </button>
                <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                    <Radio className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-tight">Live Broadcasts</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Real-time Updates</p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {broadcasts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No active broadcasts at this time.</p>
                    </div>
                ) : (
                    broadcasts.map(broadcast => {
                        const Icon = getIcon(broadcast);
                        const colorClass = getColor(broadcast);

                        return (
                            <div key={broadcast.id} className={`p-4 rounded-xl border ${colorClass} bg-opacity-10 backdrop-blur-sm`}>
                                <div className="flex items-start gap-3">
                                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 border px-1.5 py-0.5 rounded border-current">
                                                {broadcast.category.replace('_', ' ')}
                                            </span>
                                            {broadcast.created_at && (
                                                <span className="text-[10px] opacity-60">
                                                    {new Date(broadcast.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-sm mb-1 leading-tight">{broadcast.title || broadcast.message}</h3>
                                        {broadcast.title && <p className="text-xs opacity-80 leading-relaxed">{broadcast.message}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="text-center py-6">
                <p className="text-[10px] text-gray-600">Sikkim Tourism Broadcast Network</p>
            </div>
        </div>
    );
};

export default MobileBroadcasts;
