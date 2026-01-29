import { useEffect, useState } from 'react';
import { ShieldAlert, Phone, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';

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
}

interface CrowdData {
    density_state: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: string;
}

const MobileSafety = () => {
    const [restrictions, setRestrictions] = useState<Restriction[]>([]);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [crowd, setCrowd] = useState<CrowdData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_BASE = 'http://127.0.0.1:8000/api/v1';

                const [resRest, resEm, resCrowd] = await Promise.allSettled([
                    fetch(`${API_BASE}/safety/public/restrictions`),
                    fetch(`${API_BASE}/safety/public/emergency`),
                    fetch(`${API_BASE}/safety/public/crowd`)
                ]);

                if (resRest.status === 'fulfilled') {
                    const data = await resRest.value.json();
                    setRestrictions(data);
                }

                if (resEm.status === 'fulfilled') {
                    const data = await resEm.value.json();
                    setContacts(data);
                }

                if (resCrowd.status === 'fulfilled') {
                    const data = await resCrowd.value.json();
                    if (data && data.length > 0) setCrowd(data[0]);
                }

            } catch (err) {
                console.error("Failed to load safety data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-12">
            {/* Header */}
            <div className="bg-[#1e293b]/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-20 px-4 py-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-tight">Safety & Advisory</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Official Updates</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Crowd Index */}
                <section className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">Crowd Density</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-white">{crowd?.density_state || "Unknown"}</p>
                            <p className="text-xs text-blue-400 mt-1">Live Estimate</p>
                        </div>
                        <div className="h-12 w-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 flex items-center justify-center">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                </section>

                {/* Restrictions */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Restricted Areas</h2>
                    </div>
                    {restrictions.length === 0 ? (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center text-sm text-gray-500">
                            No Active Restrictions
                        </div>
                    ) : (
                        restrictions.map(res => (
                            <div key={res.id} className="p-4 bg-red-900/10 border-l-2 border-red-500 rounded-r-xl">
                                <h3 className="font-bold text-red-300 text-sm mb-1">{res.restriction_type}</h3>
                                <p className="text-xs text-gray-300 leading-relaxed">{res.message}</p>
                            </div>
                        ))
                    )}
                </section>

                {/* Emergency Contacts */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Phone className="w-4 h-4 text-green-500" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Emergency Lines</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {contacts.map(contact => (
                            <a href={`tel:${contact.phone}`} key={contact.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 active:bg-white/10 transition-colors">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">{contact.label}</p>
                                    <p className="text-xl font-bold text-white font-mono">{contact.phone}</p>
                                </div>
                                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-400" />
                                </div>
                            </a>
                        ))}
                        {contacts.length === 0 && (
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Police Control</p>
                                    <p className="text-xl font-bold text-white font-mono">100</p>
                                </div>
                                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div className="text-center py-6">
                <p className="text-[10px] text-gray-600">Sikkim Tourism Safety Network</p>
            </div>
        </div>
    );
};

export default MobileSafety;
