import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MapPin, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a]">
            {/* Background Gradient Spotlights */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-xl w-full text-center relative z-10 space-y-12">
                <div className="space-y-6">
                    <div className="mx-auto h-20 w-20 glass rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <MapPin className="h-8 w-8 text-blue-400" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                        SAFAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SETU</span>
                    </h1>

                    <p className="text-lg text-gray-600 font-light tracking-wide max-w-sm mx-auto">
                        The future of authenticated, high-trust rural exploration. Access the pilot program below.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                    <Button
                        size="lg"
                        variant="primary"
                        className="h-14 text-base group relative hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        onClick={() => navigate('/login?role=traveler')}
                    >
                        Enter as Traveler
                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                        size="lg"
                        variant="secondary"
                        className="h-14 text-base"
                        onClick={() => navigate('/login?role=host')}
                    >
                        Host Access
                    </Button>
                </div>

                <div className="pt-12 border-t border-white/5">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                        Restricted Pilot Environment v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
