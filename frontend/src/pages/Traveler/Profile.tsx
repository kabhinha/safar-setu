import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Settings, LogOut, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const [myBookings, setMyBookings] = useState<any[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my-inquiries');
                const payload = res.data?.data || res.data?.results || res.data;
                setMyBookings(Array.isArray(payload) ? payload : []);
            } catch (err) {
                console.error("Failed to fetch activity log", err);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header Profile Section */}
            <div className="pt-20 pb-6 px-6 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
                            alt="Profile"
                            className="h-full w-full object-cover grayscale"
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-none mb-1">{user?.first_name + ' ' + user?.last_name || 'Citizen'}</h1>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded border border-slate-200">
                                {user?.role || 'Guest'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-10 border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wide" onClick={() => window.location.href = '/m/settings'}>
                        <Settings className="h-3 w-3 mr-2" /> Settings
                    </Button>
                    <Button variant="outline" className="h-10 border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wide" onClick={() => window.location.href = '/m/authenticator'}>
                        <Smartphone className="h-3 w-3 mr-2" /> Link Kiosk
                    </Button>
                    <Button variant="outline" className="col-span-2 h-10 border-slate-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wide" onClick={logout}>
                        <LogOut className="h-3 w-3 mr-2" /> End Session
                    </Button>
                </div>
            </div>

            {/* Mission Log */}
            <div className="px-6">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Official Activity Ledger</h2>
                <div className="space-y-0 border border-slate-200 rounded-lg overflow-hidden bg-white">
                    {myBookings.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-slate-400 text-xs">No activity recorded.</p>
                        </div>
                    ) : (
                        myBookings.map((booking, i) => (
                            <div key={booking.id} className={`p-4 flex items-center justify-between ${i !== myBookings.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">{booking.spot?.title || 'System Entry'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-500 font-mono text-xs">{booking.start_date}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{booking.spot?.district}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${booking.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'REQUESTED' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
