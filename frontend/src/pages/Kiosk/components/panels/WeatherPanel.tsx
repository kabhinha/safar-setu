import React from 'react';
import { CloudRain, Wind, Droplets, Sun } from 'lucide-react';

export const WeatherPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Main Weather Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <CloudRain className="w-24 h-24 mb-4 text-blue-200" />
                    <h2 className="text-6xl font-bold mb-2">12°C</h2>
                    <p className="text-xl font-medium text-blue-100">Light Rain & Mist</p>
                    <p className="text-sm text-blue-200 mt-1">Gangtok, Sikkim</p>
                </div>

                {/* Decor */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl opacity-30" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                    <Wind className="w-6 h-6 text-slate-400" />
                    <p className="font-bold text-white">8 km/h</p>
                    <p className="text-[10px] text-slate-500 uppercase">Wind</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                    <Droplets className="w-6 h-6 text-blue-400" />
                    <p className="font-bold text-white">82%</p>
                    <p className="text-[10px] text-slate-500 uppercase">Humidity</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                    <Sun className="w-6 h-6 text-yellow-500" />
                    <p className="font-bold text-white">4:00 PM</p>
                    <p className="text-[10px] text-slate-500 uppercase">Sunset</p>
                </div>
            </div>

            {/* Forecast */}
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/5">
                    <h4 className="font-bold text-white">3-Day Forecast</h4>
                </div>
                <div className="divide-y divide-white/5">
                    {[
                        { day: 'Tomorrow', temp: '14°C', icon: <Sun className="w-4 h-4 text-yellow-500" />, status: 'Sunny' },
                        { day: 'Wednesday', temp: '11°C', icon: <CloudRain className="w-4 h-4 text-blue-400" />, status: 'Rain' },
                        { day: 'Thursday', temp: '13°C', icon: <CloudRain className="w-4 h-4 text-blue-400" />, status: 'Showers' },
                    ].map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <span className="text-slate-300 w-24">{f.day}</span>
                            <div className="flex items-center gap-2 text-slate-400">
                                {f.icon}
                                <span className="text-sm">{f.status}</span>
                            </div>
                            <span className="text-white font-bold">{f.temp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
