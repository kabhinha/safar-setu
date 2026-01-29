import React, { ReactNode } from 'react';
import GovtNavbar from './GovtNavbar';
import BottomNav from './BottomNav';

interface MissionAppLayoutProps {
    children: ReactNode;
}

export const MissionAppLayout: React.FC<MissionAppLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-[80px]">
            {/* Official App Header */}
            <GovtNavbar />

            {/* Main Content */}
            <main className="w-full mx-auto max-w-lg">
                {children}
            </main>

            {/* Bottom Nav */}
            <BottomNav />
        </div>
    );
};
