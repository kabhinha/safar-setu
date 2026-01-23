import React from 'react';
import { useKiosk } from './context';
import Logo from '@/assets/safarsetu_logo.png';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
    const { language, setLanguage, step, resetSession } = useKiosk();

    // Don't show header on Welcome screen if we want it immersive, 
    // but requirements say branding should always be there.
    // We'll keep a minimal header.

    if (step === 'welcome') {
        return <div className="min-h-screen bg-slate-50 relative overflow-hidden">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-4" onClick={resetSession}>
                    <img src={Logo} alt="SafarSetu" className="h-12 w-auto object-contain" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">SAFARSETU</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">Government of India</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all text-sm font-medium"
                    >
                        <span className="text-lg">🌐</span>
                        {language === 'en' ? 'हिन्दी' : 'English'}
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200"></div>
                    <button
                        onClick={resetSession}
                        className="text-sm text-red-500 font-medium hover:text-red-700 px-2"
                    >
                        {language === 'en' ? 'Reset' : 'रीसेट'}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* Footer / Status Bar (optional) */}
            <footer className="py-2 px-6 text-center text-xs text-slate-400">
                Session Protected • No Personal Data Stored
            </footer>
        </div>
    );
};

export default KioskLayout;
