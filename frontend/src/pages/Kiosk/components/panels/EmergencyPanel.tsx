import React from 'react';
import { Phone, Shield, AlertTriangle } from 'lucide-react';

export const EmergencyPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Primary Action */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="h-20 w-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                    <Phone className="h-10 w-10 text-white" />
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-white mb-2">100 / 112</h3>
                    <p className="text-red-300 uppercase tracking-widest font-bold">Emergency Response</p>
                </div>
                <button className="w-full max-w-sm py-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white transition-colors mt-4 text-lg">
                    Tap to Call
                </button>
            </div>

            {/* Safety Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <h4 className="font-bold text-white text-lg">Tourist Police</h4>
                    <p className="text-slate-400 text-sm">Dedicated support for travelers in Gangtok.</p>
                    <p className="text-blue-400 font-mono font-bold mt-auto text-xl">1073</p>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                    <h4 className="font-bold text-white text-lg">Disaster Mgmt</h4>
                    <p className="text-slate-400 text-sm">Landslide and road blockage updates.</p>
                    <p className="text-orange-400 font-mono font-bold mt-auto text-xl">1077</p>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                <h4 className="text-slate-300 font-bold mb-4 uppercase text-sm tracking-wider">Safety Guidelines</h4>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2" />
                        Always carry a valid ID card / Inner Line Permit.
                    </li>
                    <li className="flex gap-3 text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2" />
                        Use only government-registered taxi services.
                    </li>
                    <li className="flex gap-3 text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2" />
                        In case of medical emergency, dial 102 immediately.
                    </li>
                </ul>
            </div>
        </div>
    );
};
