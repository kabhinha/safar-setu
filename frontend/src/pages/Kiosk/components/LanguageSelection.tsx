import { useKiosk } from '../context';

const LanguageSelection = () => {
    const { setLanguage, setStep } = useKiosk();

    const handleSelect = (lang: 'en' | 'hi') => {
        setLanguage(lang);
        setStep('selection');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-fade-in">
            <div className="space-y-4 text-center">
                <h2 className="text-4xl font-bold text-slate-800">Select Language</h2>
                <p className="text-xl text-slate-500">भाषा चुनें</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                <button
                    onClick={() => handleSelect('en')}
                    className="group relative h-48 rounded-2xl bg-white border-2 border-slate-100 hover:border-green-500 shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center gap-4"
                >
                    <span className="text-6xl group-hover:scale-110 transition-transform">Aa</span>
                    <span className="text-2xl font-bold text-slate-700 group-hover:text-green-600">English</span>
                </button>

                <button
                    onClick={() => handleSelect('hi')}
                    className="group relative h-48 rounded-2xl bg-white border-2 border-slate-100 hover:border-orange-500 shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col items-center justify-center gap-4"
                >
                    <span className="text-6xl group-hover:scale-110 transition-transform">अ</span>
                    <span className="text-2xl font-bold text-slate-700 group-hover:text-orange-600">हिन्दी</span>
                </button>
            </div>
        </div>
    );
};

export default LanguageSelection;
