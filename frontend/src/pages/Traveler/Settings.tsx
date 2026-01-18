import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Save, Loader2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Settings = () => {
    const { user, refreshProfile } = useAuth(); // We might need to refresh user state
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
    });
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg(null);
        try {
            await api.patch('/users/me/', formData);
            if (refreshProfile) await refreshProfile();
            // Ideally update context, but for now just show success
            setMsg({ type: 'success', text: 'Profile updated successfully' });
            // Refresh user data if context supports it, or simple hack:
            // window.location.reload(); // crude but effective for MVP
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Header */}
            <div className="pt-12 pb-6 px-6 border-b border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 h-auto">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Configuration</h1>
                </div>
            </div>

            <div className="p-6 max-w-lg mx-auto space-y-8">

                {/* Identity Card */}
                <Card className="p-6 border-white/10 bg-white/5 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Identity Access</h2>
                            <p className="text-xs text-gray-500">Manage your persona details</p>
                        </div>
                        {user?.role && (
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20 uppercase tracking-widest font-bold">
                                {user.role}
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">First Name</label>
                                <input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Last Name</label>
                                <input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 opacity-50 pointer-events-none">
                            <label className="text-xs font-mono text-gray-400 uppercase">Email (Immutable)</label>
                            <input
                                value={formData.email}
                                readOnly
                                className="w-full bg-black/40 border border-dashed border-white/10 rounded px-3 py-2 text-sm text-gray-500"
                            />
                        </div>

                        {msg && (
                            <div className={`p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {msg.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                        </Button>
                    </form>
                </Card>

                {/* Security Section */}
                <Card className="p-6 border-white/10 bg-white/5 space-y-4 opacity-75">
                    <div className="flex items-center gap-3 text-yellow-500/80">
                        <Shield className="h-5 w-5" />
                        <span className="font-bold text-sm tracking-wider uppercase">Security Clearance</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Security settings and KYC verification are managed by the administration node.
                        Contact a moderator to request clearance upgrades.
                    </p>
                </Card>

            </div>
        </div>
    );
};

export default Settings;
