import { useEffect, useState } from 'react';
import { useKiosk } from '../context';

import { getRecommendations } from '../../../services/reco';

const ResultsScreen = () => {
    const { language, selectedTime, selectedInterests, setStep, setSelectedExperience } = useKiosk();
    const [loading, setLoading] = useState(true);
    const [filteredResults, setFilteredResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            setLoading(true);
            try {
                const data = await getRecommendations({
                    available_time: selectedTime || 0,
                    interest_tags: selectedInterests,
                    district: 'Guwahati' // Hardcoded context for now, or get from Kiosk settings
                });
                setFilteredResults(data.data);
            } catch (error) {
                console.error("Failed to fetch kiosk experiences:", error);
                // In a real kiosk, maybe show a "retry" button or cached offline data
                setFilteredResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, [selectedTime, selectedInterests]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-xl text-slate-500">
                    {language === 'en' ? 'Finding best experiences...' : 'सर्वोत्तम अनुभव खोजे जा रहे हैं...'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-700">
                    {language === 'en' ? `Found ${filteredResults.length} experiences for you` : `आपके लिए ${filteredResults.length} अनुभव मिले`}
                </h2>
                <button
                    onClick={() => setStep('selection')}
                    className="text-blue-600 hover:underline font-medium"
                >
                    {language === 'en' ? 'Change Filters' : 'फिल्टर बदलें'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map(exp => (
                    <div
                        key={exp.hotspot_id}
                        onClick={() => {
                            setSelectedExperience(exp);
                            setStep('detail');
                        }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-slate-100 cursor-pointer group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={'https://images.unsplash.com/photo-1544983059-00f7e41c4de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} // Default image as Reco engine currently mocks media
                                alt={exp.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                                {exp.duration_minutes || '?'} min
                            </div>
                            {/* Score Badge */}
                            {exp.score && (
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {Math.round(exp.score * 100)}% Match
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-3">
                            <div className="flex gap-2 mb-2">
                                {exp.tags && exp.tags.slice(0, 3).map((t: string) => (
                                    <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase tracking-wider rounded-md">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 leading-tight">
                                {exp.name || "Experience Name"}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2">
                                {exp.description || "No description available."}
                            </p>
                            {/* Explanation */}
                            {exp.explanation && (
                                <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 p-2 rounded">
                                    💡 {exp.explanation}
                                </p>
                            )}

                            <div className="pt-4 mt-2 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400">
                                <span className="flex items-center gap-1">📍 {exp.district || 'Nearby'}</span>
                                <span className="text-orange-500 font-semibold group-hover:underline">
                                    {language === 'en' ? 'View Details →' : 'विवरण देखें →'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredResults.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-lg mb-4">
                            {language === 'en' ? 'No matches found.' : 'कोई मेल नहीं मिला।'}
                        </p>
                        <button
                            onClick={() => setStep('selection')}
                            className="px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700"
                        >
                            {language === 'en' ? 'Try different filters' : 'अन्य विकल्प आज़माएं'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsScreen;
