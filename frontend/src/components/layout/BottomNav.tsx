import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50">
            <Link to="/m/feed" className={cn("flex flex-col items-center justify-center gap-1 w-full h-full", isActive('/feed') ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                <Home className="h-5 w-5" strokeWidth={isActive('/feed') ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Feed</span>
            </Link>
            <Link to="/m/profile" className={cn("flex flex-col items-center justify-center gap-1 w-full h-full", isActive('/profile') ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                <User className="h-5 w-5" strokeWidth={isActive('/profile') ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mission Data</span>
            </Link>
            <Link to="/m/chat" className={cn("flex flex-col items-center justify-center gap-1 w-full h-full", isActive('/chat') ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                <MessageCircle className="h-5 w-5" strokeWidth={isActive('/chat') ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Official Comms</span>
            </Link>
        </div>
    );
};

export default BottomNav;
