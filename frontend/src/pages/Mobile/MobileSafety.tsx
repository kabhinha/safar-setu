import { useEffect, useState } from 'react';
import { ShieldAlert, Phone, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { PublicMobileLayout } from '../../components/layout/PublicMobileLayout';

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
        <PublicMobileLayout>
            <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            </div>
        </PublicMobileLayout>
    );

    return (
        <PublicMobileLayout>
            <div className="p-4 space-y-6">
                <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Safety & Advisory</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Official Updates</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <Users className="w-5 h-5 text-blue-500" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Crowd Density</p>
                                <p className="text-xl font-bold text-slate-900">{crowd?.density_state || "Unknown"}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full border-4 border-blue-500/30 border-t-blue-500 flex items-center justify-center">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <ShieldAlert className="w-5 h-5 text-amber-500" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Advisory Status</p>
                                <p className="text-sm text-slate-700">Live restrictions and emergency lines below</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Restricted Areas</h2>
                    </div>
                    {restrictions.length === 0 ? (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-sm text-slate-500 shadow-sm">
                            No Active Restrictions
                        </div>
                    ) : (
                        restrictions.map(res => (
                            <div key={res.id} className="p-4 bg-white rounded-xl border border-red-200 shadow-sm">
                                <h3 className="font-bold text-red-700 text-sm mb-1">{res.restriction_type}</h3>
                                <p className="text-xs text-slate-700 leading-relaxed">{res.message}</p>
                            </div>
                        ))
                    )}
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Phone className="w-4 h-4 text-green-600" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Emergency Lines</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {contacts.map(contact => (
                            <a href={`tel:${contact.phone}`} key={contact.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm active:bg-slate-50 transition-colors">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">{contact.label}</p>
                                    <p className="text-xl font-bold text-slate-900 font-mono">{contact.phone}</p>
                                </div>
                                <div className="h-10 w-10 bg-green-50 border border-green-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                            </a>
                        ))}
                        {contacts.length === 0 && (
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Police Control</p>
                                    <p className="text-xl font-bold text-slate-900 font-mono">100</p>
                                </div>
                                <div className="h-10 w-10 bg-green-50 border border-green-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="text-center py-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sikkim Tourism Safety Network</p>
                </div>
            </div>
        </PublicMobileLayout>
    );
};

export default MobileSafety;
