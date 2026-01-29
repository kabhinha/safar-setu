import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

interface GovtNavbarProps {
    showUserBadge?: boolean;
}

const GovtNavbar: React.FC<GovtNavbarProps> = ({ showUserBadge = true }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center justify-between px-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
                {/* Official Seal of Sikkim */}
                <img
                    src="../assets/safarsetu_logo.png"
                    alt="Government of Sikkim"
                    className="h-10 w-10 object-contain drop-shadow-sm"
                />

                <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-serif font-bold text-slate-500 uppercase tracking-widest leading-tight">
                        Government of Sikkim
                    </span>
                    <span className="text-base font-bold text-slate-900 tracking-tight leading-none font-sans">
                        SAFARSETU
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* G20 / India75 Placeholder (Textual for now to keep it clean) */}
                <div className="hidden sm:flex flex-col items-end opacity-50">
                    <span className="text-[8px] font-bold uppercase tracking-wider">Incredible India</span>
                </div>

                {showUserBadge ? (
                    <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-bold text-slate-900 leading-none">{user?.first_name || 'Citizen'}</span>
                            <span className="text-[9px] text-green-700 font-medium bg-green-50 px-1.5 rounded-full border border-green-100 leading-none mt-0.5">
                                {user?.full_name ? 'Verified ID' : 'Unverified ID'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                        <Menu className="h-5 w-5" />
                    </button>
                )}
            </div>
        </header>
    );
};

export default GovtNavbar;
