import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MOCK_BOOKINGS, MOCK_HOTSPOTS } from '../../services/mockData';
import { MapPin, Calendar, Settings, LogOut, ShieldCheck, Smartphone } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    // Enrich bookings with hotspot data
    const myBookings = MOCK_BOOKINGS.map(booking => {
        const spot = MOCK_HOTSPOTS.find(h => h.id === booking.hotspot_id);
        return { ...booking, spot };
    });

    return (
        <div className="pb-32 min-h-screen bg-[#0a0a0a]">
            {/* Header Profile Section */}
            <div className="relative pt-12 pb-8 px-6 border-b border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-purple-600">
                        <div className="h-full w-full rounded-full overflow-hidden border-4 border-[#0a0a0a]">
                            <img
                                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{user?.first_name + ' ' + user?.last_name || 'Traveler'}</h1>
                        <p className="text-sm text-gray-400 font-mono">{user?.role}</p>
                        <p className="text-sm text-gray-400 font-mono">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20 uppercase tracking-widest font-bold">
                                Level 1
                            </span>
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20 uppercase tracking-widest font-bold">
                                <ShieldCheck className="h-3 w-3" /> Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-8">

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 text-gray-300" onClick={() => window.location.href = '/settings'}>
                        <Settings className="h-4 w-4 mr-2" /> Configure
                    </Button>
                    <Button variant="outline" className="h-12 border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40" onClick={() => window.location.href = '/authenticator'}>
                        <Smartphone className="h-4 w-4 mr-2" /> Connect Kiosk
                    </Button>
                    <Button variant="outline" className="col-span-2 h-12 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" /> Disconnect
                    </Button>
                </div>
            </div>

            {/* My Trips */}
            <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Mission Log</h2>
                <div className="space-y-4">
                    {myBookings.length === 0 ? (
                        <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                            <p className="text-gray-500 text-sm">No active missions found.</p>
                        </div>
                    ) : (
                        myBookings.map(booking => (
                            <Card key={booking.id} className="overflow-hidden flex flex-row border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-28 bg-gray-900 flex-shrink-0 relative">
                                    {booking.spot?.images[0] && (
                                        <img src={booking.spot.images[0]} className="w-full h-full object-cover opacity-80" alt="Spot" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/80" />
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">{booking.spot?.title || 'Unknown Node'}</h3>
                                        <div className="flex items-center gap-1 text-xs text-blue-400 mt-1 font-mono">
                                            <MapPin className="h-3 w-3" /> {booking.spot?.district}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end mt-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <Calendar className="h-3 w-3" />
                                            {booking.start_date}
                                        </div>
                                        <span className={`text-[10px] px-2 py-1 rounded border uppercase tracking-wider font-bold ${booking.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            booking.status === 'REQUESTED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-gray-400 border-white/10'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Saved Places */}
            <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Bookmarks</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="overflow-hidden border-white/5 bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
                        <div className="h-28 bg-gray-900 relative">
                            <img src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-white text-sm truncate">Living Root Bridges</h4>
                            <p className="text-xs text-gray-500 mt-1">Meghalaya Sector</p>
                        </div>
                    </Card>
                    <Card className="overflow-hidden border border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center h-full min-h-[160px] cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center mb-2">
                            <span className="text-xl text-gray-400">+</span>
                        </div>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Explore</span>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default Profile;
