import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ScanLine, Link2 } from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import GovtNavbar from '../../components/layout/GovtNavbar';

const MobileLanding: React.FC = () => {
    const navigate = useNavigate();
    const [reference, setReference] = useState('');
    const [validation, setValidation] = useState('');

    const knownStaticPaths = useMemo(() => [
        '/m',
        '/m/login',
        '/m/signup',
        '/m/feed',
        '/m/chat',
        '/m/profile',
        '/m/settings',
        '/m/authenticator',
        '/m/safety',
        '/m/broadcasts',
        '/m/policy',
    ], []);

    const dynamicMatchers = useMemo(() => [
        /^\/m\/hotspot\/[^\s/]+/i,
        /^\/m\/sight\/[^\s/]+/i,
        /^\/m\/deal\/[^\s/]+/i,
    ], []);

    const normalizeInput = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return null;

        try {
            const parsed = new URL(trimmed);
            return { pathname: parsed.pathname, search: parsed.search };
        } catch {
            const prefixed = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
            const [path, search] = prefixed.split('?');
            return { pathname: path, search: search ? `?${search}` : '' };
        }
    };

    const handleOpen = (event?: React.FormEvent) => {
        event?.preventDefault();
        const normalized = normalizeInput(reference);
        if (!normalized) {
            setValidation('Enter a valid /m link or reference.');
            return;
        }

        const trimmedPath = normalized.pathname.endsWith('/')
            ? normalized.pathname.slice(0, -1) || '/'
            : normalized.pathname;

        const matchesKnown = knownStaticPaths.includes(trimmedPath);
        const matchesDynamic = dynamicMatchers.some(pattern => pattern.test(trimmedPath));
        const target = `${trimmedPath}${normalized.search}`;

        if (matchesKnown || matchesDynamic) {
            setValidation('');
            navigate(target);
        } else {
            setValidation('Link is not a recognized /m route.');
        }
    };

    const handleScan = () => {
        setValidation('');
        navigate('/m/authenticator');
    };

    const quickLinks = [
        { title: 'Safety Briefings', subtitle: 'Crowd + emergency status', path: '/m/safety' },
        { title: 'District Broadcasts', subtitle: 'Official notices', path: '/m/broadcasts' },
        { title: 'Your Missions', subtitle: 'Profile & documents', path: '/m/profile' },
        { title: 'Updates', subtitle: 'Operational feed', path: '/m/feed' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <GovtNavbar showUserBadge={false} />
            <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Continue from kiosk</p>
                            <p className="text-sm text-slate-700">Pick up where you left off using the secure QR reference.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleScan}
                            className="w-full inline-flex items-center justify-between px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold hover:bg-slate-100 active:scale-[0.99] transition"
                        >
                            <span className="flex items-center gap-2">
                                <ScanLine className="h-4 w-4 text-slate-600" />
                                Scan Kiosk QR
                            </span>
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                        </button>

                        <form onSubmit={handleOpen} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="Paste QR link / reference"
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
                                />
                                <Link2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.99] transition"
                                >
                                    Open
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                            {validation && (
                                <p className="text-xs text-red-600 font-semibold">{validation}</p>
                            )}
                        </form>
                    </div>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-slate-700" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Explore (Pilot Navigation)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {quickLinks.map(link => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="w-full text-left border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-[0.99] transition p-3"
                            >
                                <p className="text-sm font-semibold text-slate-900">{link.title}</p>
                                <p className="text-[11px] text-slate-500">{link.subtitle}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <footer className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-600 font-medium">
                        Pilot deployment for secure rural tourism mobility. Follow local advisories and safety instructions.
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm font-semibold text-slate-800">
                        <button onClick={() => navigate('/m/policy')} className="underline decoration-slate-300 decoration-2 underline-offset-4 hover:text-slate-900">
                            /m/policy
                        </button>
                        <button onClick={() => navigate('/m/safety')} className="underline decoration-slate-300 decoration-2 underline-offset-4 hover:text-slate-900">
                            /m/safety
                        </button>
                    </div>
                </footer>
            </div>
            <BottomNav />
        </div>
    );
};

export default MobileLanding;
