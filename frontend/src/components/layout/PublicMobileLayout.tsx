import React, { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

interface PublicMobileLayoutProps {
    children: ReactNode;
}

export const PublicMobileLayout: React.FC<PublicMobileLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
            {/* Minimal Govt Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 h-14 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Seal_of_Sikkim.svg/1200px-Seal_of_Sikkim.svg.png" className="h-8 w-8 object-contain" alt="Emblem" />
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 leading-none">SIKKIM TOURISM</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Official Pilot</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full mx-auto max-w-lg">
                {children}
            </main>

            {/* Disclaimer Footer */}
            <footer className="mt-12 py-8 px-6 text-center border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500 font-medium mb-2">
                    This is a pilot digital platform supported by local authorities.
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest">
                    <span>Terms</span>
                    <span>•</span>
                    <span>Privacy</span>
                    <span>•</span>
                    <span>Help</span>
                </div>
            </footer>
        </div>
    );
};
