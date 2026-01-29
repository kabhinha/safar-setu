import { useEffect, useState } from 'react';
import axios from 'axios';
import { useKiosk } from '../context';
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
    const { setStep } = useKiosk();
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
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => window.location.href = '/'} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeft className="w-8 h-8 text-gray-300" />
                </button>
                <h1 className="text-3xl font-bold text-white">Safety & Advisory</h1>
            </div>

            {loading && (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Section 1: Crowd Index */}
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">Live Crowd Index</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Gauge (Simplified Visual) */}
                            <div className="col-span-1 flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-5xl font-black text-white mb-2">{crowd?.density_state || "LOW"}</span>
                                <span className="text-sm text-gray-400 uppercase tracking-widest">Density Level</span>
                            </div>

                            <div className="col-span-2 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-gray-300">MG Marg</span>
                                    <span className="font-bold text-green-400">Moderate</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-gray-300">Lall Bazaar</span>
                                    <span className="font-bold text-yellow-400">High Traffic</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-gray-300">Taxi Stand</span>
                                    <span className="font-bold text-blue-400">Normal</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Active Restrictions */}
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="w-6 h-6 text-amber-500" />
                            <h2 className="text-xl font-bold text-white">Active Restrictions</h2>
                        </div>

                        {restrictions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5">
                                <p>No active restrictions at this time.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {restrictions.map(res => (
                                    <div key={res.id} className="p-4 bg-red-900/10 border-l-4 border-red-500 rounded-r-lg">
                                        <h3 className="font-bold text-red-300 mb-1">{res.restriction_type}</h3>
                                        <p className="text-gray-300">{res.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section 3: Emergency Contacts */}
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Phone className="w-6 h-6 text-red-500" />
                            <h2 className="text-xl font-bold text-white">Emergency Contacts</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contacts.map(contact => (
                                <div key={contact.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase font-bold">{contact.label || "Help Line"}</p>
                                        <p className="text-2xl font-bold text-white mt-1">{contact.phone}</p>
                                        {contact.notes && <p className="text-xs text-gray-500 mt-1">{contact.notes}</p>}
                                    </div>
                                    <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5 text-green-400" />
                                    </div>
                                </div>
                            ))}
                            {/* Static Fallbacks if no data */}
                            {contacts.length === 0 && (
                                <>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400 uppercase font-bold">Police Control</p>
                                            <p className="text-2xl font-bold text-white mt-1">100</p>
                                        </div>
                                        <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-400" />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400 uppercase font-bold">Ambulance</p>
                                            <p className="text-2xl font-bold text-white mt-1">102</p>
                                        </div>
                                        <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-400" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default SafetyPanel;
