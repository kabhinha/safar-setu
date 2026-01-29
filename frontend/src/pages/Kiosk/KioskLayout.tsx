import React from 'react';
import { useKiosk } from './context';
import Logo from '@/assets/safarsetu_logo.png';
import BroadcastTicker from './components/BroadcastTicker';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
    const { language, setLanguage, step, resetSession } = useKiosk();

    // Don't show header on Welcome screen if we want it immersive, 
    // but requirements say branding should always be there.
    // We'll keep a minimal header.

    if (step === 'welcome') {
        return <div className="min-h-screen bg-slate-50 relative overflow-hidden">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans text-white">
            {/* Authority Bar & Ticker */}
            <header className="bg-[#1e293b] border-b border-white/10 z-10 relative">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4" onClick={resetSession}>
                        <img src={Logo} alt="SafarSetu" className="h-12 w-auto object-contain" />
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">SAFARSETU</h1>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Government of India</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-sm font-medium text-gray-200"
                        >
                            <span className="text-lg">🌐</span>
                            {language === 'en' ? 'हिन्दी' : 'English'}
                        </button>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <button
                            onClick={resetSession}
                            className="text-sm text-red-400 font-medium hover:text-red-300 px-2"
                        >
                            {language === 'en' ? 'Reset' : 'रीसेट'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Rolling Ticker */}
            <BroadcastTicker />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* Footer / Status Bar (optional) */}
            <footer className="py-2 px-6 text-center text-xs text-gray-500 border-t border-white/5">
                Session Protected • No Personal Data Stored
            </footer>
        </div>
    );
};

export default KioskLayout;
