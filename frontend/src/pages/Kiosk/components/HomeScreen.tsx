import { useNavigate } from 'react-router-dom';
import { Compass, Map } from 'lucide-react';

const KioskHomeScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto py-12 animate-fade-in text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-12">What would you like to do?</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {/* Discovery Mode Tile (New) */}
                <button
                    onClick={() => navigate('/kiosk/discover')}
                    className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95 text-left bg-gradient-to-br from-teal-500 to-blue-600 border-4 border-transparent hover:border-white/20"
                >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-8 right-8 bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <Compass className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/60 to-transparent">
                        <h2 className="text-3xl font-bold text-white mb-2">Discovery Mode</h2>
                        <p className="text-white/90 text-lg">Find activities nearby based on your time & interests.</p>
                        <span className="inline-block mt-4 px-4 py-2 bg-white text-teal-600 font-bold rounded-lg text-sm uppercase tracking-wide">Popular</span>
                    </div>
                </button>

                {/* Safety & Advisory Tile */}
                <button
                    onClick={() => navigate('/kiosk/safety')}
                    className="group relative h-80 rounded-3xl overflow-hidden shadow-xl transition-all hover:scale-105 active:scale-95 text-left bg-gradient-to-br from-red-500 to-amber-600 border-4 border-transparent hover:border-white/20"
                >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-8 right-8 bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <Map className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/60 to-transparent">
                        <h2 className="text-3xl font-bold text-white mb-2">Safety Advisory</h2>
                        <p className="text-white/90 text-lg">Check crowd status & alerts.</p>
                        <span className="inline-block mt-4 px-4 py-2 bg-white text-red-600 font-bold rounded-lg text-sm uppercase tracking-wide">Important</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default KioskHomeScreen;
