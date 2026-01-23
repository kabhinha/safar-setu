import { useState, useEffect } from 'react';
import { MapPin, ShoppingBag, Camera, Car, Star, Megaphone, Info, Ticket } from 'lucide-react';
import { cn } from '../../utils/cn';

const SLIDES = [
    // FEATURES (4)
    {
        id: 'feat-1',
        type: 'FEATURE',
        title: "Discover Hidden Gems",
        subtitle: "Find untouched beauty nearby",
        icon: MapPin,
        color: "bg-blue-600",
        image: "https://images.unsplash.com/photo-1589136777351-9432852d6213?auto=format&fit=crop&q=80" // Sikkim Landscape Placeholder
    },
    {
        id: 'feat-2',
        type: 'FEATURE',
        title: "Authentic Local Crafts",
        subtitle: "Support Sikkim's artisans",
        icon: ShoppingBag,
        color: "bg-emerald-600",
        image: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80" // Tea/Crafts
    },
    {
        id: 'feat-3',
        type: 'FEATURE',
        title: "Sacred Monasteries",
        subtitle: "Experience spiritual peace",
        icon: Camera,
        color: "bg-purple-600",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80" // Monastery
    },
    {
        id: 'feat-4',
        type: 'FEATURE',
        title: "Trusted Local Guides",
        subtitle: "Travel with safety & comfort",
        icon: Car,
        color: "bg-orange-600",
        image: "https://images.unsplash.com/photo-1596711718228-56df82522778?auto=format&fit=crop&q=80" // Travel
    },
    // ADS (4)
    {
        id: 'ad-1',
        type: 'AD',
        title: "Red Panda Festival",
        subtitle: "Jan 28th - 30th | Gangtok",
        icon: Ticket,
        color: "bg-red-600",
        tag: "UPCOMING EVENT",
        image: "https://images.unsplash.com/photo-1533514114760-438466c4c5b3?auto=format&fit=crop&q=80" // Festive
    },
    {
        id: 'ad-2',
        type: 'AD',
        title: "Stay Homestay Scheme",
        subtitle: "Get 50% Subsidy for Hosts",
        icon: Star,
        color: "bg-yellow-600",
        tag: "GOVT SCHEME",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" // Homestay
    },
    {
        id: 'ad-3',
        type: 'AD',
        title: "Plastic Free Sikkim",
        subtitle: "Join the Green Mission Today",
        icon: Info,
        color: "bg-green-600",
        tag: "PUBLIC INTEREST",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" // Nature
    },
    {
        id: 'ad-4',
        type: 'AD',
        title: "Organic Market Sale",
        subtitle: "Every Sunday @ MG Marg",
        icon: Megaphone,
        color: "bg-pink-600",
        tag: "SHOPPING ALERT",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80" // Market
    }
];

interface AttractScreenProps {
    onDismiss: () => void;
}

const AttractScreen = ({ onDismiss }: AttractScreenProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        }, 5000); // Shuffle every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const slide = SLIDES[currentIndex];
    const Icon = slide.icon;

    return (
        <div
            onClick={onDismiss}
            className="fixed inset-0 z-50 bg-black cursor-pointer animate-in fade-in duration-500"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-60 transition-all duration-1000 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">

                {/* Ad Tag or Feature Icon */}
                <div className={cn(
                    "px-6 py-2 rounded-full text-white font-bold tracking-widest uppercase text-sm animate-bounce flex items-center gap-2",
                    slide.color
                )}>
                    <Icon className="h-4 w-4" />
                    {slide.type === 'AD' ? slide.tag : 'FEATURED EXPERIENCE'}
                </div>

                <div className="space-y-4 max-w-4xl">
                    <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-2xl">
                        {slide.title}
                    </h1>
                    <p className="text-2xl md:text-4xl text-gray-200 font-light">
                        {slide.subtitle}
                    </p>
                </div>

                {/* Call to Action */}
                <div className="mt-12 animate-pulse">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-12 py-6 flex items-center gap-4">
                        <div className="h-4 w-4 rounded-full bg-white animate-ping" />
                        <span className="text-2xl font-bold text-white uppercase tracking-widest">
                            Touch Screen to Explore
                        </span>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-12 flex gap-3">
                    {SLIDES.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-2 rounded-full transition-all duration-500",
                                idx === currentIndex ? "w-12 bg-white" : "w-2 bg-white/30"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttractScreen;
