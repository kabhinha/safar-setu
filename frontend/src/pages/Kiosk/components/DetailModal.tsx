import { useKiosk } from '../context';

interface DetailModalProps {
    experience: any;
    onClose: () => void;
}

const DetailModal = ({ experience, onClose }: DetailModalProps) => {
    const { language } = useKiosk();

    if (!experience) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center text-2xl backdrop-blur-md transition-all"
                >
                    ✕
                </button>

                <div className="h-64 md:h-80 shrink-0 relative">
                    <img
                        src={experience.media && experience.media.length > 0 ? experience.media[0].file : 'https://images.unsplash.com/photo-1544983059-00f7e41c4de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={experience.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{experience.name}</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="md:col-span-2 space-y-6">
                        <div className="flex gap-4 items-center text-slate-500 font-medium">
                            <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                                ⏰ {experience.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                                📍 {experience.district || 'Nearby'}
                            </span>
                        </div>

                        <p className="text-xl text-slate-700 leading-relaxed">
                            {experience.description || "Experience the authentic culture and beauty of this location."}
                        </p>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900">Highlights</h3>
                            <div className="flex flex-wrap gap-2">
                                {experience.tags && experience.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg text-sm capitalize">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 border border-slate-100">
                        <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm">
                            {/* Placeholder QR using an image API or static SVG */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://safarsetu.gov.in/hotspot/${experience.id}`}
                                alt="Scan to View"
                                className="w-full h-full"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">
                                {language === 'en' ? 'Continue on Phone' : 'फोन पर जारी रखें'}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">
                                {language === 'en' ? 'Scan to save this location' : 'लोकेशन सेव करने के लिए स्कैन करें'}
                            </p>
                        </div>
                    </div>

                </div>

                <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <p className="text-sm text-slate-400">ID: {experience.id}</p>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        {language === 'en' ? 'Close' : 'बंद करें'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DetailModal;
