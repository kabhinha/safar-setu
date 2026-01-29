import { useEffect, useState } from 'react';
import { Radio, AlertTriangle, ShieldAlert, Info, ChevronLeft, Calendar, MapPin } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicMobileLayout } from '../../components/layout/PublicMobileLayout';

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
        <PublicMobileLayout>
            <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            </div>
        </PublicMobileLayout>
    );

    return (
        <PublicMobileLayout>
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                        <Radio className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">Live Broadcasts</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Real-time Updates</p>
                    </div>
                </div>

                {broadcasts.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <Info className="w-8 h-8 mx-auto mb-2 opacity-60" />
                        <p>No active broadcasts at this time.</p>
                    </div>
                ) : (
                    broadcasts.map(broadcast => {
                        const Icon = getIcon(broadcast);
                        const colorClass = getColor(broadcast);

                        return (
                            <div key={broadcast.id} className={`p-4 rounded-xl border ${colorClass} bg-white shadow-sm`}>
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
                                        <h3 className="font-bold text-sm mb-1 leading-tight text-slate-900">{broadcast.title || broadcast.message}</h3>
                                        {broadcast.title && <p className="text-xs text-slate-700 leading-relaxed">{broadcast.message}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                <div className="text-center py-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sikkim Tourism Broadcast Network</p>
                </div>
            </div>
        </PublicMobileLayout>
    );
};

export default MobileBroadcasts;
