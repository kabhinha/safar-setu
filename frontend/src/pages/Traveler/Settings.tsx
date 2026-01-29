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
        <div className="min-h-screen bg-slate-50 pt-[56px] pb-20">
            {/* Header */}
            <div className="py-4 px-6 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 p-0 h-auto hover:bg-transparent">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">System Settings</h1>
                </div>
            </div>

            <div className="p-6 max-w-lg mx-auto space-y-8">

                {/* Identity Card */}
                <Card className="p-6 border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide">Personal Details</h2>
                            <p className="text-xs text-slate-500">Official record maintenance</p>
                        </div>
                        {user?.role && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200 uppercase tracking-widest font-bold">
                                {user.role}
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">First Name</label>
                                <input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:border-slate-400 outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Last Name</label>
                                <input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:border-slate-400 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 opacity-70 pointer-events-none">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email (Locked)</label>
                            <input
                                value={formData.email}
                                readOnly
                                className="w-full bg-slate-50 border border-dashed border-slate-300 rounded px-3 py-2 text-sm text-slate-500"
                            />
                        </div>

                        {msg && (
                            <div className={`p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {msg.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 shadow-sm" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                        </Button>
                    </form>
                </Card>

                {/* Security Section */}
                <Card className="p-6 border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                        <Shield className="h-5 w-5 text-slate-400" />
                        <span className="font-bold text-xs tracking-wider uppercase">Data Privacy</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Your data is handled according to the State Tourism Data Privacy Act.
                        Contact the Data Officer for data deletion requests.
                    </p>
                </Card>

            </div>
        </div>
    );
};

export default Settings;
