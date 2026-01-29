import React from 'react';
import { Phone, MapPin, Clock, AlertTriangle } from 'lucide-react';

export const TaxiPanel: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Info Card */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="bg-orange-500 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Safe Transport Hub</h3>
                        <p className="text-slate-300 text-sm">
                            Connect with verified local taxi drivers. Rates are fixed by the government.
                        </p>
                    </div>
                </div>
            </div>

            {/* Nearest Hub */}
            <div className="bg-slate-800 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm text-slate-400 uppercase font-bold tracking-wider">Nearest Hub</h4>

                <div className="flex items-center gap-4">
                    <MapPin className="w-8 h-8 text-orange-400" />
                    <div>
                        <p className="text-lg font-bold text-white">Gangtok Main Stand</p>
                        <p className="text-xs text-slate-500">Deorali, Gangtok</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-2xl font-bold text-slate-200">1.2 km</p>
                    </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-blue-400" />
                    <div>
                        <p className="text-lg font-bold text-white">~5 mins</p>
                        <p className="text-xs text-slate-500">Avg. wait time</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase mb-1">Helpline</p>
                    <p className="text-xl font-bold text-orange-400">1073</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase mb-1">Police</p>
                    <p className="text-xl font-bold text-orange-400">100</p>
                </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl flex items-start gap-3 border border-slate-700">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                    Always confirm the driver's ID card before boarding. Report any issues to the helpline instantly.
                </p>
            </div>
        </div>
    );
};
