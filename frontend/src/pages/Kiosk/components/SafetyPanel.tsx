import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Phone, Users, ArrowLeft } from 'lucide-react';

// Types
interface CrowdData {
    density_state: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: string;
}
interface Restriction {
    id: string;
    restriction_type: string;
    message: string;
    severity: string;
}
interface EmergencyContact {
    id: string;
    label: string;
    phone: string;
    active: boolean;
    notes?: string;
}

const SafetyPanel = () => {
    // const { setStep } = useKiosk();
    const [crowd, setCrowd] = useState<CrowdData | null>(null);
    const [restrictions, setRestrictions] = useState<Restriction[]>([]);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Parallel fetch
                const [crowdRes, restRes, emRes] = await Promise.allSettled([
                    axios.get('http://127.0.0.1:8000/api/v1/safety/public/crowd'),
                    axios.get('http://127.0.0.1:8000/api/v1/safety/public/restrictions'),
                    axios.get('http://127.0.0.1:8000/api/v1/safety/public/emergency'),
                ]);

                if (crowdRes.status === 'fulfilled' && crowdRes.value.data.length > 0) {
                    setCrowd(crowdRes.value.data[0]); // Take latest
                }
                if (restRes.status === 'fulfilled') {
                    setRestrictions(restRes.value.data || []);
                }
                if (emRes.status === 'fulfilled') {
                    setContacts(emRes.value.data || []);
                }
            } catch (err) {
                console.error("Safety Data Load Error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans p-8 animate-fade-in">
            {/* Header */}
            <header className="h-24 flex items-center justify-between mb-8 border-b border-white/10 px-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <ArrowLeft className="w-8 h-8 text-white" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
                            Safety & Advisory
                        </h1>
                        <p className="text-slate-400 mt-1">Real-time alerts and assistance</p>
                    </div>
                </div>

                {/* Clock placeholder or status */}
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 font-bold uppercase text-sm tracking-widest">Live Monitoring</span>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 animate-pulse">Fetching security data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">

                    {/* LEFT COLUMN: Crowd & Status (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Crowd Index */}
                        <section className="bg-slate-800/50 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <Users className="w-8 h-8 text-blue-400" />
                                <h2 className="text-2xl font-bold text-white">Crowd Level</h2>
                            </div>

                            <div className="flex flex-col items-center justify-center py-6">
                                <span className={`text-6xl font-black mb-2 ${crowd?.density_state === 'HIGH' ? 'text-red-500' :
                                        crowd?.density_state === 'MEDIUM' ? 'text-yellow-400' : 'text-green-500'
                                    }`}>
                                    {crowd?.density_state || "LOW"}
                                </span>
                                <span className="text-sm text-slate-400 uppercase tracking-widest border-t border-white/10 pt-4 w-full text-center">
                                    Current Zone Density
                                </span>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/5">
                                    <span className="text-slate-300">MG Marg (Hub)</span>
                                    <span className="text-yellow-400 font-bold">Moderate</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/5">
                                    <span className="text-slate-300">Lall Bazaar</span>
                                    <span className="text-red-400 font-bold">High</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Restrictions & Contacts (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Active Restrictions */}
                        <section className="bg-slate-800/50 rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldAlert className="w-8 h-8 text-amber-500" />
                                <h2 className="text-2xl font-bold text-white">Active Advisories</h2>
                            </div>

                            {restrictions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500">
                                    <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-lg">No active travel restrictions.</p>
                                    <p className="text-sm">Safe travels across Sikkim.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {restrictions.map(res => (
                                        <div key={res.id} className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8" />
                                            <h3 className="font-bold text-red-400 text-lg">{res.restriction_type}</h3>
                                            <p className="text-slate-200 leading-relaxed">{res.message}</p>
                                            <span className="mt-auto pt-4 text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                High Severity
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Emergency Contacts */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {contacts.length > 0 ? contacts.map(contact => (
                                <div key={contact.id} className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{contact.label}</p>
                                        <p className="text-2xl font-bold text-white font-mono">{contact.phone}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                </div>
                            )) : (
                                <>
                                    <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Police</p>
                                            <p className="text-2xl font-bold text-white font-mono">100</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500/20 transition-all">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Ambulance</p>
                                            <p className="text-2xl font-bold text-white font-mono">102</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500/20 transition-all">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Tourist Help</p>
                                            <p className="text-2xl font-bold text-white font-mono">1363</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-all">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SafetyPanel;
