import { useKiosk } from '../context';
import { ChevronLeft } from 'lucide-react';
import QRCode from 'react-qr-code';

const KioskDetailScreen = () => {
    const { selectedExperience, setStep } = useKiosk();

    // Since HotspotDetail expects an ID from params, we might need to mock or reuse parts of it.
    // However, HotspotDetail uses `useParams()`. 
    // To reuse it without changing routing, we would need to wrap it in a memory router or 
    // modify HotspotDetail to accept props. 
    // A quicker, cleaner way for Kiosk Isolation is to render a Kiosk-specific detail view 
    // using the data we AND already have in `selectedExperience`!
    // This avoids fetching again and keeps it fast/offline-resilient.

    if (!selectedExperience) {
        setStep('results');
        return null;
    }

    const exp = selectedExperience;

    return (
        <div className="pb-24 animate-fade-in bg-white min-h-[60vh]">
            {/* Kiosk Back Button Override */}
            <div className="absolute top-6 left-6 z-30">
                <button
                    onClick={() => setStep('results')}
                    className="h-12 w-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center border border-slate-200"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-800" />
                </button>
            </div>

            <div className="relative h-72 w-full">
                <img
                    src={exp.media && exp.media.length > 0 ? exp.media[0].file : 'https://images.unsplash.com/photo-1544983059-00f7e41c4de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={exp.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-3xl font-bold leading-tight">{exp.name}</h1>
                    <p className="opacity-90 flex items-center gap-2">
                        <span>📍 {exp.district}</span>
                        <span>•</span>
                        <span>{exp.duration_minutes} min</span>
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Score & Explanation */}
                {exp.score && (
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div>
                            <h3 className="font-bold text-blue-900">Why this matches you</h3>
                            <p className="text-blue-800 text-sm mt-1">{exp.explanation}</p>
                            <div className="mt-2 text-xs font-bold bg-white px-2 py-1 rounded inline-block text-blue-600 border border-blue-200">
                                {Math.round(exp.score * 100)}% Compatibility
                            </div>
                        </div>
                    </div>
                )}

                <div className="prose prose-slate">
                    <h3 className="text-lg font-bold text-slate-800">About this experience</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {exp.description}
                    </p>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                        {exp.tags && exp.tags.map((t: string) => (
                            <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Kiosk Safety/QR Action */}
                <div className="p-6 bg-slate-900 rounded-2xl text-white text-center space-y-4 shadow-xl">
                    <div className="mx-auto h-40 w-40 bg-white rounded-xl flex items-center justify-center p-2">
                        <div className="h-full w-full flex items-center justify-center">
                            <QRCode
                                value={`https://safarsetu.com/hotspot/${exp.hotspot_id}`}
                                size={128}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Take it with you</h3>
                        <p className="text-slate-400 text-sm">Scan to unlock exact location & details on your phone.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default KioskDetailScreen;
