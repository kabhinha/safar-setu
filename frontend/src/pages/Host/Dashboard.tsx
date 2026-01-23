import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Eye } from 'lucide-react';

import api from '../../services/api';

const HostDashboard = () => {
    const { logout } = useAuth(); // token not needed manually
    const navigate = useNavigate();
    const [hotspots, setHotspots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotspots = async () => {
            try {
                const response = await api.get('/listings/host/hotspots/');
                setHotspots(response.data);
            } catch (error) {
                console.error("Failed to fetch listings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotspots();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'LIVE': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'APPROVED': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'UNDER_REVIEW': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'CHANGES_REQUESTED': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'; // DRAFT
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 pb-24 text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Access Node Management</h1>
                    <p className="text-gray-400 text-sm">Manage your registered signals</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={logout} className="border-red-500/30 text-red-400 hover:bg-red-500/10">Abort Session</Button>
                    <Button onClick={() => navigate('/host/create')} className="gap-2 bg-blue-600 hover:bg-blue-500 border-none">
                        <Plus className="h-4 w-4" /> Initialize Signal
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Scanning network...</div>
            ) : hotspots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-400 mb-4">No active signals found.</p>
                    <Button onClick={() => navigate('/host/create')}>Create First Signal</Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {hotspots.map(h => (
                        <div key={h.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-800 rounded-lg overflow-hidden">
                                    {h.media && h.media[0] ? (
                                        <img src={h.media[0].file} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-600 font-mono text-xs">NO IMG</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{h.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(h.status)}`}>
                                            {h.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-0.5 rounded">{h.district}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" onClick={() => navigate(`/host/edit/${h.id}`)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                {/* Only show View button if Live */}
                                {h.status === 'LIVE' && (
                                    <Button size="sm" variant="outline" onClick={() => navigate(`/hotspot/${h.id}`)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostDashboard;
