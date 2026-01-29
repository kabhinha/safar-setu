import React from 'react';
import { X, MapPin, Camera, ShoppingBag, Car, Ticket, Phone, Users, CloudRain, Play } from 'lucide-react';
import { DiscoveryPanel } from './panels/DiscoveryPanel';
import { SightsPanel } from './panels/SightsPanel';
import { MartPanel } from './panels/MartPanel';
import { TaxiPanel } from './panels/TaxiPanel';
import { EmergencyPanel } from './panels/EmergencyPanel';
import { CrowdPanel } from './panels/CrowdPanel';
import { WeatherPanel } from './panels/WeatherPanel';
import { VideoPanel } from './panels/VideoPanel';

interface SplitPanelProps {
    activeTile: string | null;
    onClose: () => void;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({ activeTile, onClose }) => {
    const isOpen = !!activeTile;

    const renderContent = () => {
        switch (activeTile) {
            case 'discovery': return <DiscoveryPanel />;
            case 'sights': return <SightsPanel />;
            case 'mart': return <MartPanel />;
            case 'taxi': return <TaxiPanel />;
            case 'emergency': return <EmergencyPanel />;
            case 'crowd': return <CrowdPanel />;
            case 'weather': return <WeatherPanel />;
            case 'cm_message': return <VideoPanel />;
            default: return null;
        }
    };

    const getHeaderInfo = () => {
        switch (activeTile) {
            case 'discovery': return { title: 'Discover', icon: <MapPin className="w-6 h-6 text-blue-400" /> };
            case 'sights': return { title: 'Sights', icon: <Camera className="w-6 h-6 text-purple-400" /> };
            case 'mart': return { title: 'Mart', icon: <ShoppingBag className="w-6 h-6 text-emerald-400" /> };
            case 'taxi': return { title: 'Taxi & Safe Transport', icon: <Car className="w-6 h-6 text-orange-400" /> };
            case 'emergency': return { title: 'Emergency', icon: <Phone className="w-6 h-6 text-red-500" /> };
            case 'crowd': return { title: 'Live Cam & Crowd', icon: <Users className="w-6 h-6 text-yellow-400" /> };
            case 'weather': return { title: 'Local Weather', icon: <CloudRain className="w-6 h-6 text-blue-400" /> };
            case 'cm_message': return { title: "CM's Message", icon: <Play className="w-6 h-6 text-white" /> };
            default: return { title: 'Details', icon: <Ticket className="w-6 h-6 text-slate-400" /> };
        }
    };

    const { title, icon } = getHeaderInfo();

    return (
        <div
            className={`fixed top-0 right-0 h-full w-[50vw] bg-slate-900 border-l border-white/10 z-[60] shadow-2xl transition-transform duration-500 ease-spring ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} // Smooth spring-like easing
        >
            {/* Header */}
            <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/95 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg border border-white/5">
                        {icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>

                <button
                    onClick={onClose}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/5 hover:border-white/20 transition-all text-slate-400 hover:text-white"
                >
                    <span className="text-sm font-bold uppercase tracking-wide">Back to Home</span>
                    <div className="bg-slate-700 group-hover:bg-slate-600 rounded-full p-1">
                        <X className="w-4 h-4" />
                    </div>
                </button>
            </div>

            {/* Content Area */}
            <div className="h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden p-8 scrollbar-hide">
                {activeTile && renderContent()}
            </div>
        </div>
    );
};
