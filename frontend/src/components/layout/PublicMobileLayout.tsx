import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import GovtNavbar from './GovtNavbar';

interface PublicMobileLayoutProps {
    children: ReactNode;
}

export const PublicMobileLayout: React.FC<PublicMobileLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
            <GovtNavbar showUserBadge={false} />

            <main className="w-full mx-auto max-w-lg">
                {children}
            </main>

            <footer className="mt-12 py-8 px-6 text-center border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500 font-medium mb-2">
                    This is a pilot digital platform supported by local authorities.
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
                    <Link to="/m/policy" className="hover:text-slate-700">Policy</Link>
                    <Link to="/m/safety" className="hover:text-slate-700">Safety</Link>
                    <Link to="/m/login" className="hover:text-slate-700">Login</Link>
                </div>
            </footer>

            <BottomNav />
        </div>
    );
};
