import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Camera,
    ShoppingBag,
    Car,
    Phone,
    Users,
    Info,
    Globe,
    Star
} from 'lucide-react';

import AttractScreen from '../components/layout/AttractScreen';
import KioskLoginModal from '../components/auth/KioskLoginModal';
import BroadcastTicker from './kiosk/components/BroadcastTicker';
import { SplitPanel } from './kiosk/components/SplitPanel';
import safarsetu from '@/assets/safarsetu_logo.png';

const Landing = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    // Split View State
    const [activeTile, setActiveTile] = useState<string | null>(null);

    // Attract Mode Logic
    const [isIdle, setIsIdle] = useState(true); // Start in Attract Mode
    const IDLE_TIMEOUT = 30000; // 30 seconds

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            if (isIdle) setIsIdle(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
        };

        // Listen for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('keydown', resetTimer);

        // Initial timer
        timeout = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [isIdle]);

    // Clock Logic
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleTileClick = (route: string) => {
        console.log(`Interacting with ${route}`);

        if (route === '/discovery') setActiveTile('discovery');
        else if (route === '/kiosk/sights') setActiveTile('sights');
        else if (route === '/kiosk/mart') setActiveTile('mart');
        else if (route === '/transport') setActiveTile('taxi');
        else if (route === '/kiosk/emergency') setActiveTile('emergency');
        else if (route === '/kiosk/crowd') setActiveTile('crowd');
        else if (route === '/kiosk/weather') setActiveTile('weather');
        else if (route === '/kiosk/cm_message') setActiveTile('cm_message');
        else {
            // Fallback for other routes or links
            navigate(route);
        }
    };

    return (
        <div className="h-screen w-full flex bg-[#0f172a] text-white overflow-hidden font-sans select-none relative">
            {/* Attract Screen Overlay */}
            {isIdle && <AttractScreen onDismiss={() => setIsIdle(false)} />}

            {/* Split Panel - Fixed Right */}
            <SplitPanel
                activeTile={activeTile}
                onClose={() => setActiveTile(null)}
            />

            {/* Main Content Wrapper - Shrinks to 50% */}
            <div
                className={`relative flex flex-col h-full transition-all duration-500 will-change-[width] ${activeTile ? 'w-1/2' : 'w-full'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* Interaction Lock Overlay - prevents clicking tiles while panel is open */}
                {activeTile && (
                    <div
                        className="absolute inset-0 z-50 bg-black/5 cursor-pointer backdrop-blur-[1px]"
                        onClick={() => setActiveTile(null)}
                    />
                )}

                {/* --------------------------------------------------------------------------------
                   1) TOP AUTHORITY BAR
                   -------------------------------------------------------------------------------- */}
                <header className="bg-[#1e293b] border-b border-white/10 flex flex-col shrink-0">
                    <div className="h-[10vh] flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            {/* Gov Logo Placeholder */}
                            <img src={safarsetu} alt="Safarsetu" className="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black border-2 border-white/20 shadow-lg shadow-yellow-500/20" />
                            <div className={`${activeTile ? 'hidden xl:block' : 'block'}`}>
                                <h1 className="text-xl font-bold tracking-wider uppercase text-yellow-500 whitespace-nowrap">
                                    SIKKIM TOURISM
                                </h1>
                                <p className="text-xs text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    Government of Sikkim
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right hidden md:block">
                                <p className="text-2xl font-mono font-bold text-blue-400 leading-none">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-gray-500 uppercase">
                                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                            </div>

                            {/* Language Selector */}
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 active:bg-white/10">
                                <Globe className="h-5 w-5 text-gray-300" />
                                <span className={`text-sm font-semibold text-gray-200 ${activeTile ? 'hidden' : 'inline'}`}>English</span>
                            </button>
                        </div>
                    </div>

                    {/* Ticker */}
                    <BroadcastTicker />
                </header>

                {/* --------------------------------------------------------------------------------
                   MAIN CONTENT AREA (3-Column Cockpit Layout)
                   -------------------------------------------------------------------------------- */}
                <div className="flex-1 flex overflow-hidden p-6 gap-6 min-h-0">

                    {/* 1) LEFT COLUMN: STATUS & ALERTS */}
                    <aside className={`flex flex-col gap-4 transition-all duration-500 ${activeTile ? 'w-[180px]' : 'w-[240px]'}`}>
                        {/* Emergency Card */}
                        <button
                            onClick={() => handleTileClick('/kiosk/emergency')}
                            className="w-full bg-red-900/10 border border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-red-900/20 active:scale-95 transition-all"
                        >
                            <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/20">
                                <Phone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Emergency</p>
                                <p className="text-xl font-bold text-white">100 / 112</p>
                            </div>
                        </button>

                        {/* Crowd Monitor */}
                        <button
                            onClick={() => handleTileClick('/kiosk/crowd')}
                            className="w-full bg-[#1e293b] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 flex-1 hover:border-yellow-400/30 transition-all text-left"
                        >
                            <div className="flex items-center gap-2 border-b border-white/5 pb-2 w-full">
                                <Users className="h-4 w-4 text-yellow-400" />
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider truncate">Cam Feed</p>
                            </div>
                            <div className="flex-1 flex flex-col justify-end gap-1 w-full">
                                <div className="w-full bg-white/5 flex-1 rounded-t-sm relative overflow-hidden">
                                    {/* <div className="absolute bottom-0 w-full h-[30%] bg-yellow-400/20" /> */}
                                </div>
                                <div className="w-full bg-white/5 flex-1 relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full h-[60%] bg-yellow-400/50" />
                                </div>
                                <div className="w-full bg-white/5 flex-1 rounded-b-sm relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full h-[100%] bg-yellow-400" />
                                </div>
                            </div>
                            <p className="text-center text-sm font-bold text-yellow-400 w-full">Moderate</p>
                            <p className="text-[10px] text-center text-gray-500 opacity-60">Tap for details</p>
                        </button>

                        {/* Weather / System */}
                        <div
                            onClick={() => handleTileClick('/kiosk/weather')}
                            className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Weather</p>
                                    <p className="text-xs font-bold text-white whitespace-nowrap">12°C Mist</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 2) MIDDLE COLUMN: FUNCTIONAL GRID */}
                    <main className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">

                        {/* Tile 1: Discovery */}
                        <button
                            onClick={() => handleTileClick('/discovery')}
                            className={`group relative bg-[#1e293b] rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-4 active:scale-[0.98] ${activeTile === 'discovery'
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-white/5 hover:border-blue-500/50 hover:bg-[#253045]'
                                }`}
                        >
                            <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shadow-inner">
                                <MapPin className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Discover</h2>
                                <p className="text-xs text-gray-400">Find Places & Activities</p>
                            </div>
                        </button>

                        {/* Tile 2: Experiences */}
                        <button
                            onClick={() => handleTileClick('/kiosk/sights')}
                            className={`group relative bg-[#1e293b] rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-4 active:scale-[0.98] ${activeTile === 'sights'
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-white/5 hover:border-purple-500/50 hover:bg-[#253045]'
                                }`}
                        >
                            <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors shadow-inner">
                                <Camera className="h-8 w-8 text-purple-400" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Sights</h2>
                                <p className="text-xs text-gray-400">Monasteries & Views</p>
                            </div>
                        </button>

                        {/* Tile 3: Products */}
                        <button
                            onClick={() => handleTileClick('/kiosk/mart')}
                            className={`group relative bg-[#1e293b] rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-4 active:scale-[0.98] ${activeTile === 'mart'
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : 'border-white/5 hover:border-emerald-500/50 hover:bg-[#253045]'
                                }`}
                        >
                            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors shadow-inner">
                                <ShoppingBag className="h-8 w-8 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Mart</h2>
                                <p className="text-xs text-gray-400">Sikkim Crafts & Tea</p>
                            </div>
                        </button>

                        {/* Tile 4: Transport/More */}
                        <button
                            onClick={() => handleTileClick('/transport')}
                            className={`group relative bg-[#1e293b] rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-4 active:scale-[0.98] ${activeTile === 'taxi'
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-white/5 hover:border-orange-500/50 hover:bg-[#253045]'
                                }`}
                        >
                            <div className="h-16 w-16 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors shadow-inner">
                                <Car className="h-8 w-8 text-orange-400" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">Taxi</h2>
                                <p className="text-xs text-gray-400">Local Transport Info</p>
                            </div>
                        </button>

                    </main>

                    {/* 3) RIGHT COLUMN: PROMOTIONAL & ADS (30%) - Hide when split */}
                    <aside className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ${activeTile ? 'w-0 opacity-0 p-0' : 'w-[30%] opacity-100'}`}>

                        {/* Video Widget */}
                        <div
                            onClick={() => handleTileClick('/kiosk/cm_message')}
                            className="flex-[2] bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border border-white/10 overflow-hidden flex flex-col group relative cursor-pointer hover:border-white/30 transition-all active:scale-95"
                        >
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded-sm shadow-md">
                                CM's Message
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1590442387532-a59021285075?auto=format&fit=crop&q=80"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            <div className="mt-auto p-6 relative">
                                <h3 className="text-xl font-bold text-white leading-tight mb-2">
                                    "Sikkim: A Model for Eco-Tourism"
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="h-0.5 w-8 bg-yellow-500" />
                                    <span className="text-xs text-gray-300 uppercase tracking-wider">Watch Video</span>
                                </div>
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                    <div className="ml-1 w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent" />
                                </div>
                            </div>
                        </div>

                        {/* Secondary Ad / Scheme */}
                        <div className="flex-1 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 p-6 flex flex-col items-start justify-center relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Star className="h-24 w-24 text-yellow-500" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1">New Scheme</p>
                                <h3 className="text-lg font-bold text-white mb-2">Homestay Registration Open 2026</h3>
                                <button className="text-xs bg-yellow-500 text-black px-3 py-1.5 rounded-sm font-bold uppercase hover:bg-yellow-400 transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </aside>

                </div>

                {/* 4) LOWER ACTION STRIP */}
                <div className="h-16 bg-[#1e293b] border-t border-white/10 px-6 flex items-center justify-between shrink-0">
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 font-medium transition-colors flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span className={`${activeTile ? 'hidden' : 'inline'}`}>Report Issue</span>
                        </button>
                        <button onClick={() => setLoginModalOpen(true)} className="px-4 py-2 bg-transparent opacity-50 hover:opacity-100 rounded-lg text-sm text-gray-500 hover:text-white font-medium transition-all">
                            Login to use core features
                        </button>
                    </div>

                    <KioskLoginModal
                        isOpen={isLoginModalOpen}
                        onClose={() => setLoginModalOpen(false)}
                        onLogin={(token, user) => {
                            console.log("Kiosk Login Success:", user, token);
                        }}
                    />

                    {/* <div className="flex gap-2">
                        {/* Placeholder interaction dots 
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <div className="h-2 w-2 rounded-full bg-gray-600" />
                        <div className="h-2 w-2 rounded-full bg-gray-600" />
                    </div> */}
                </div>

                {/* 5) FOOTER (COMPLIANCE) */}
                <footer className="h-8 bg-black flex items-center justify-between px-6 text-[10px] text-gray-500 uppercase tracking-wider shrink-0">
                    <p>© 2026 Government of Sikkim. All Rights Reserved.</p>
                    <div className={`flex gap-6 ${activeTile ? 'hidden' : 'flex'}`}>
                        <span>Privacy Policy</span>
                        <span>Terms of Use</span>
                        <span>Disclaimer</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
