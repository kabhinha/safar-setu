import React from 'react';
import { Play } from 'lucide-react';

export const VideoPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 animate-fade-in h-full">
            {/* Video Player Container */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
                {/* Use a placeholder video that actually works for demo purposes */}
                <video
                    src="https://media.istockphoto.com/id/1154616788/video/aerial-drone-footage-of-gangtok-city-sikkim-india.mp4?s=mp4-640x640-is&k=20&c=6F-Q2yJq6Lgq0nZ8qP5g4zF5zF5zF5zF5zF5zF5zF5"
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    controls
                    loop
                />

                {/* Fallback Overlay (visible if video fails or before load, though video tag usually handles this) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                        <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Sikkim: A Model for Eco-Tourism</h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                    Honorable Chief Minister's message on sustainable tourism practices and the preservation of our natural heritage. Learn how we are building a greener future for Sikkim.
                </p>

                <div className="h-px bg-white/10 my-4" />

                <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Highlights</p>
                    <ul className="grid grid-cols-1 gap-2">
                        {['Plastic-free zones expansion', 'Organic farming integration', 'Community homestay support'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                                <span className="text-blue-500 font-bold">0{i + 1}</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
