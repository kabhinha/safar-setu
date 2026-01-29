import React, { useState } from 'react';
import type { DiscoveryResult } from '../../../contracts/kioskDiscovery';
import { Clock, MapPin, Navigation, Smartphone } from 'lucide-react';
import { QrModal } from './QrModal';

interface Props {
    data: DiscoveryResult;
}

export const HotspotCard: React.FC<Props> = ({ data }) => {
    const [isQrOpen, setQrOpen] = useState(false);

    return (
        <>
            <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700/50 flex flex-col h-full hover:border-teal-500/50 transition-colors group">
                <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-600 p-6 flex items-end relative">
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${data.distance_band === 'NEAR' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            data.distance_band === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                            {data.distance_band || 'Sight'}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:to-teal-200">
                            {data.title}
                        </h3>
                        <p className="text-sm text-slate-300 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {data.cluster_label}
                        </p>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <p className="text-slate-400 mb-6 flex-1">{data.short_description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <span className="text-xs text-slate-500 uppercase font-semibold">Travel</span>
                            <div className="flex items-center gap-2 text-teal-400 font-bold mt-1">
                                <Navigation className="w-4 h-4" />
                                {data.approx_travel_time_min ? `~${data.approx_travel_time_min} min` : 'N/A'}
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <span className="text-xs text-slate-500 uppercase font-semibold">Stay</span>
                            <div className="flex items-center gap-2 text-blue-400 font-bold mt-1">
                                <Clock className="w-4 h-4" />
                                {data.typical_duration_min ? `~${data.typical_duration_min} min` : 'Flexible'}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-white"
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setQrOpen(true)}
                            className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-white shadow-lg shadow-teal-500/20"
                        >
                            <Smartphone className="w-4 h-4" />
                            QR to Phone
                        </button>
                    </div>
                </div>
            </div>

            <QrModal
                isOpen={isQrOpen}
                onClose={() => setQrOpen(false)}
                resourceId={data.hotspot_id}
                resourceType="HOTSPOT" // Or SIGHT, but standardizing on HOTSPOT is fine as backend handles ID
                title={data.title}
            />
        </>
    );
};
