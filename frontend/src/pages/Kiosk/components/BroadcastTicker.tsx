import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface Broadcast {
    id: string;
    category: 'FESTIVAL' | 'ROUTE_CLOSURE' | 'ADVISORY' | 'CROWD_WARNING';
    title: string;
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

const BroadcastTicker = () => {
    const [messages, setMessages] = useState<Broadcast[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Fetch public broadcasts
        const fetchBroadcasts = async () => {
            // In Kiosk/Dev, we can point to local backend
            // TODO: Use configured API_BASE_URL
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/v1/public/broadcasts');
                setMessages(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to fetch broadcasts", err);
                // Graceful fallback: Show nothing or a default safe message
                setMessages([]);
            }
        };

        fetchBroadcasts();
        const interval = setInterval(fetchBroadcasts, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (messages.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % messages.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [messages.length]);

    if (messages.length === 0) {
        return (
            <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-center text-sm font-medium">
                Welcome to SAFARSETU – Travel responsibly.
            </div>
        );
    }

    const current = messages[currentIndex];

    // Icon based on category/severity
    let Icon = Info;
    let bgColor = "bg-blue-600";

    if (current.severity === 'CRITICAL' || current.category === 'CROWD_WARNING') {
        Icon = ShieldAlert;
        bgColor = "bg-red-600 animate-pulse";
    } else if (current.severity === 'WARNING' || current.category === 'ROUTE_CLOSURE') {
        Icon = AlertTriangle;
        bgColor = "bg-amber-600";
    } else if (current.category === 'FESTIVAL') {
        Icon = Info;
        bgColor = "bg-purple-600";
    }

    return (
        <div className={`${bgColor} text-white px-6 py-2 flex items-center justify-center transition-colors duration-500`}>
            <div className="flex items-center gap-3 animate-fade-in key={current.id}">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold uppercase text-xs tracking-wider opacity-80 border-r border-white/30 pr-3 mr-1">
                    {current.category.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium truncate max-wscreen-md">
                    {current.message}
                </span>
            </div>
        </div>
    );
};

export default BroadcastTicker;
