import React from 'react';
import { Users, Info } from 'lucide-react';

export const CrowdPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Live Feed Placeholder */}
            <div className="aspect-video bg-black rounded-2xl relative overflow-hidden group border border-white/10">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <div className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm flex items-center gap-1 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        LIVE
                    </div>
                    <div className="bg-black/50 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm backdrop-blur-md">
                        MG MARG CAM-01
                    </div>
                </div>

                {/* Simulated Feed Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50" />
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-sm">
                    [SECURE CAMERA FEED CONNECTED]
                </div>
            </div>

            {/* Density Meter */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white">Crowd Density</h3>
                    </div>
                    <span className="text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full text-sm">
                        MODERATE
                    </span>
                </div>

                <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex gap-0.5">
                    <div className="h-full w-[20%] bg-green-500 opacity-50" />
                    <div className="h-full w-[20%] bg-green-500 opacity-50" />
                    <div className="h-full w-[20%] bg-yellow-500" />
                    <div className="h-full w-[20%] bg-slate-600 opacity-30" />
                    <div className="h-full w-[20%] bg-slate-600 opacity-30" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-wider">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 leading-relaxed">
                    Peak hours at MG Marg are usually between <b>5 PM - 8 PM</b>. Current movement is fluid with no major congestion points reported.
                </p>
            </div>
        </div>
    );
};
