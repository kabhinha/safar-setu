import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Check, Eye, FileText } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const { token, logout } = useAuth();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            // Fetch all for now, filter client side or use search param
            const response = await api.get('/listings/mod/hotspots/');
            // Filter only UNDER_REVIEW
            setQueue(response.data.filter((h: any) => h.status === 'UNDER_REVIEW'));
        } catch (error) {
            console.error("Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchQueue();
    }, [token]);

    const handleAction = async (id: string, action: 'approve' | 'request_changes', notes = '') => {
        if (!confirm(`Are you sure you want to ${action}?`)) return;

        try {
            const url = `/listings/mod/hotspots/${id}/${action}/`;
            // api is already configured for JSON content type
            const payload = action === 'request_changes' ? { notes } : {};

            await api.post(url, payload);

            alert(`Success: ${action}`);
            fetchQueue(); // Refresh list
        } catch (e: any) {
            const msg = e.response?.data?.error || e.message;
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 text-white pb-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Moderation Control</h1>
                    <p className="text-gray-400">Review incoming signals</p>
                </div>
                <Button variant="outline" onClick={logout} className="border-red-500/30 text-red-400">Logout</Button>
            </div>

            {loading ? (
                <div>Loading queue...</div>
            ) : queue.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-xl text-center text-gray-500">
                    All caught up! No pending reviews.
                </div>
            ) : (
                <div className="space-y-4">
                    {queue.map(h => (
                        <div key={h.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{h.name}</h3>
                                <p className="text-gray-400 text-sm mb-2">{h.short_description}</p>
                                <div className="flex gap-2">
                                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs">
                                        {h.district}
                                    </span>
                                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs">
                                        Host: {h.host_info?.username || 'Unknown'}
                                    </span>
                                </div>
                                {/* Basic details peek */}
                                <div className="mt-2 text-xs text-gray-500 max-w-xl">
                                    {h.description.substring(0, 150)}...
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button size="sm" variant="outline" onClick={() => window.open(`/hotspot/${h.id}`, '_blank')}>
                                    <Eye className="w-4 h-4 mr-2" /> View Preview
                                </Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-500 border-none"
                                    onClick={() => handleAction(h.id, 'approve')}>
                                    <Check className="w-4 h-4 mr-2" /> Approve
                                </Button>
                                <Button size="sm" variant="secondary" className="hover:bg-yellow-500/20"
                                    onClick={() => {
                                        const note = prompt("Enter notes for changes:");
                                        if (note) handleAction(h.id, 'request_changes', note);
                                    }}>
                                    <FileText className="w-4 h-4 mr-2" /> Request Changes
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
