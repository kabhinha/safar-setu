import React, { useState, useEffect } from 'react';
import { api } from '../api';

export const Dashboard: React.FC = () => {
    const [district, setDistrict] = useState('D1');
    const [stats, setStats] = useState<any>(null);

    const fetchStats = async () => {
        try {
            const res = await api.getDistrictStats(district);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [district]);

    return (
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-blue-300">Live Aggregate Analytics</h2>

            <div className="flex space-x-2 mb-6">
                {['D1', 'D2', 'D3'].map(d => (
                    <button
                        key={d}
                        onClick={() => setDistrict(d)}
                        className={`px-4 py-2 rounded ${district === d ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        District {d}
                    </button>
                ))}
            </div>

            {stats ? (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900 p-4 rounded text-center">
                        <div className="text-sm text-slate-400">Crowd Density Index</div>
                        <div className={`text-3xl font-bold ${stats.crowd_density > 70 ? 'text-red-400' : 'text-green-400'}`}>
                            {stats.crowd_density}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Scale: 0-100</div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded text-center">
                        <div className="text-sm text-slate-400">Vehicle Flow</div>
                        <div className="text-3xl font-bold text-yellow-400">
                            {stats.vehicle_flow}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">per minute</div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded text-center">
                        <div className="text-sm text-slate-400">Active Sensors</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {stats.active_cameras}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-500 py-8">Loading District Data...</div>
            )}

            <div className="mt-4 text-xs text-slate-600 text-center">
                * Data aggregated anonymously. No PII retained.
            </div>
        </div>
    );
};
