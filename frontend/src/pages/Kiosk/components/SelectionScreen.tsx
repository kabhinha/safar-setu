import { useKiosk } from '../context';

const TIME_OPTIONS = [
    { value: 15, label: { en: '15 min', hi: '15 मिनट' } },
    { value: 30, label: { en: '30 min', hi: '30 मिनट' } },
    { value: 60, label: { en: '1 Hour', hi: '1 घंटा' } },
    { value: 120, label: { en: '2 Hours', hi: '2 घंटे' } },
    { value: 180, label: { en: '3+ Hours', hi: '3+ घंटे' } },
];

const INTEREST_OPTIONS = [
    { id: 'tea', icon: '☕', label: { en: 'Tea', hi: 'चाय' } },
    { id: 'crafts', icon: '🎨', label: { en: 'Crafts', hi: 'हस्तशिल्प' } },
    { id: 'nature', icon: '🌳', label: { en: 'Nature', hi: 'प्रकृति' } },
    { id: 'quiet', icon: '🤫', label: { en: 'Quiet', hi: 'शांत' } },
    { id: 'shopping', icon: '🛍', label: { en: 'Shopping', hi: 'खरीदारी' } },
    { id: 'wetlands', icon: '🏞', label: { en: 'Wetlands', hi: 'आर्द्रभूमि' } },
    { id: 'food', icon: '🍲', label: { en: 'Food', hi: 'भोजन' } },
    { id: 'history', icon: '🏰', label: { en: 'History', hi: 'इतिहास' } },
];

const SelectionScreen = () => {
    const {
        language,
        selectedTime,
        setSelectedTime,
        selectedInterests,
        toggleInterest,
        setStep
    } = useKiosk();

    const handleSearch = () => {
        // In a real app, this might trigger an API load state check
        // For now we just go to results
        setStep('results');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8 animate-fade-in">

            {/* Time Selection */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-2xl">⏰</span>
                    {language === 'en' ? 'How much time do you have?' : 'आपके पास कितना समय है?'}
                </h2>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {TIME_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSelectedTime(opt.value)}
                            className={`
                h-16 rounded-xl font-bold text-lg transition-all
                ${selectedTime === opt.value
                                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200 scale-105'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
              `}
                        >
                            {opt.label[language]}
                        </button>
                    ))}
                </div>
            </section>

            {/* Interest Selection */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="bg-green-100 text-green-600 p-2 rounded-lg text-2xl">❤️</span>
                    {language === 'en' ? 'Select your interests:' : 'अपनी रुचियां चुनें:'}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {INTEREST_OPTIONS.map((opt) => {
                        const isSelected = selectedInterests.includes(opt.id);
                        return (
                            <button
                                key={opt.id}
                                onClick={() => toggleInterest(opt.id)}
                                className={`
                  h-24 rounded-xl flex flex-col items-center justify-center gap-2 transition-all p-4
                  ${isSelected
                                        ? 'bg-green-600 text-white shadow-lg ring-4 ring-green-200 scale-105'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-green-400 hover:bg-slate-50'}
                `}
                            >
                                <span className="text-3xl">{opt.icon}</span>
                                <span className="font-semibold">{opt.label[language]}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Action Area */}
            <div className="pt-8 flex justify-end">
                <button
                    onClick={handleSearch}
                    disabled={!selectedTime}
                    className={`
            px-12 py-5 rounded-full text-2xl font-bold flex items-center gap-4 shadow-xl transition-all
            ${selectedTime
                            ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
                >
                    {language === 'en' ? 'Find Experiences' : 'अनुभव खोजें'}
                    <span>🚀</span>
                </button>
            </div>

        </div>
    );
};

export default SelectionScreen;
