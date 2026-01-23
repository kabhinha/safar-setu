import { useKiosk } from '../context';

const WelcomeScreen = () => {
    const { setStep } = useKiosk();

    const handleStart = () => {
        // Go to language selection
        setStep('language');
    };

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-cover bg-center"
            style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1571536802807-30451e3955d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // Placeholder scenic image
            }}
            onClick={handleStart}
        >
            <div className="animate-pulse absolute inset-0 z-0 bg-black/10 pointer-events-none"></div>

            <div className="z-10 text-white max-w-3xl space-y-8 animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                        <span className="text-4xl">🌿</span>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight drop-shadow-lg">
                    SAFARSETU
                </h1>
                <p className="text-xl md:text-3xl font-light text-white/90 drop-shadow-md">
                    Discover Authentic Experiences Around You
                </p>

                <div className="pt-12">
                    <button
                        className="px-12 py-6 bg-orange-600 hover:bg-orange-500 text-white text-2xl font-bold rounded-full shadow-xl transform transition hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto border-4 border-orange-400/30"
                    >
                        <span>Touch to Start</span>
                        <span>👆</span>
                    </button>
                </div>

                <div className="absolute bottom-12 left-0 right-0 text-center text-white/60 text-sm">
                    Private • Anonymous • Secure
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
