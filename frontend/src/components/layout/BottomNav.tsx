import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm h-16 glass rounded-full flex justify-around items-center z-50 px-6 shadow-2xl shadow-black/50">
            <Link to="/feed" className={cn("flex flex-col items-center justify-center transition-all duration-300", isActive('/feed') ? "text-blue-400 scale-110" : "text-gray-500 hover:text-gray-300")}>
                <Home className="h-6 w-6" strokeWidth={isActive('/feed') ? 2.5 : 2} />
            </Link>
            <Link to="/chat" className={cn("flex flex-col items-center justify-center transition-all duration-300", isActive('/chat') ? "text-blue-400 scale-110" : "text-gray-500 hover:text-gray-300")}>
                <MessageCircle className="h-6 w-6" strokeWidth={isActive('/chat') ? 2.5 : 2} />
            </Link>
            <Link to="/profile" className={cn("flex flex-col items-center justify-center transition-all duration-300", isActive('/profile') ? "text-blue-400 scale-110" : "text-gray-500 hover:text-gray-300")}>
                <User className="h-6 w-6" strokeWidth={isActive('/profile') ? 2.5 : 2} />
            </Link>
        </div>
    );
};

export default BottomNav;
