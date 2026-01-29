import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Suspense, lazy } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { UserRole } from '../contracts/enums';
import { MissionAppLayout } from '../components/layout/MissionAppLayout';
import MobileLayout from '../components/layout/MobileLayout';

// Lazy load pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const TravelerHome = lazy(() => import('../pages/traveler/Home'));
const Profile = lazy(() => import('../pages/traveler/Profile'));
const Settings = lazy(() => import('../pages/traveler/Settings'));
const Chat = lazy(() => import('../pages/buddychat/Chat'));
const HostDashboard = lazy(() => import('../pages/host/Dashboard'));
const CreateHotspot = lazy(() => import('../pages/host/CreateHotspot'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const CommerceDemo = lazy(() => import('../pages/commerce/Demo'));
const Authenticator = lazy(() => import('../pages/mobile/Authenticator'));
const KioskSights = lazy(() => import('../pages/kiosk/Sights').then(module => ({ default: module.KioskSights })));
const KioskMart = lazy(() => import('../pages/kiosk/Mart').then(module => ({ default: module.KioskMart })));
const KioskSafety = lazy(() => import('../pages/kiosk/components/SafetyPanel'));
const VendorScan = lazy(() => import('../pages/Vendor/Scan'));

const MobileDealReceipt = lazy(() => import('../pages/mobile/MobileDealReceipt'));
const MobileSafety = lazy(() => import('../pages/mobile/MobileSafety'));
const MobileBroadcasts = lazy(() => import('@/pages/mobile/MobileBroadcasts'));
const PublicDetail = lazy(() => import('../pages/mobile/PublicDetail'));
const MobileLanding = lazy(() => import('../pages/mobile/MobileLanding'));
const MobilePolicy = lazy(() => import('../pages/mobile/MobilePolicy'));

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/m/login" replace />;
    // Ensure we check against enum or string correctly
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/" replace />; // Unauthorized
    }

    return <>{children}</>;
};

const MainLayout = () => {
    const { user } = useAuth();
    const location = useLocation();
    // Don't show bottom nav on kiosk route, auth pages, or admin/host sections
    const showBottomNav = user?.role === UserRole.TRAVELER && !['/login', '/signup', '/', '/landing', '/kiosk', '/vendor'].includes(location.pathname) && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/host');

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Outlet />
            {showBottomNav && <BottomNav />}
        </div>
    );
};

// Wrapper for Mission App (User Context)
const MissionLayoutWrapper = () => {
    return (
        <MissionAppLayout>
            <Outlet />
        </MissionAppLayout>
    );
};

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-500">Loading...</div>}>
            <Routes>
                <Route path="/kiosk/sights" element={<KioskSights />} />
                <Route path="/kiosk/mart" element={<KioskMart />} />
                <Route path="/kiosk/safety" element={<KioskSafety />} />
                <Route path="/vendor/scan" element={<VendorScan />} />

                {/* Legacy redirects to mobile namespace */}
                <Route path="/feed" element={<Navigate to="/m/feed" replace />} />
                <Route path="/chat" element={<Navigate to="/m/chat" replace />} />
                <Route path="/profile" element={<Navigate to="/m/profile" replace />} />
                <Route path="/settings" element={<Navigate to="/m/settings" replace />} />
                <Route path="/mobile/safety" element={<Navigate to="/m/safety" replace />} />
                <Route path="/mobile/broadcasts" element={<Navigate to="/m/broadcasts" replace />} />

                <Route path="/m/*" element={<MobileLayout />}>
                    <Route index element={<MobileLanding />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />

                    <Route path="safety" element={<MobileSafety />} />
                    <Route path="broadcasts" element={<MobileBroadcasts />} />
                    <Route path="policy" element={<MobilePolicy />} />

                    <Route path="hotspot/:id" element={<PublicDetail type="hotspot" />} />
                    <Route path="sight/:id" element={<PublicDetail type="sight" />} />
                    <Route path="deal/:id" element={<MobileDealReceipt />} />
                    <Route path="commerce/demo" element={<CommerceDemo />} />

                    {/* Mission App Routes (User Context) */}
                    <Route element={<MissionLayoutWrapper />}>
                        <Route path="feed" element={
                            <ProtectedRoute roles={[UserRole.TRAVELER]}>
                                <TravelerHome />
                            </ProtectedRoute>
                        } />
                        <Route path="chat" element={
                            <ProtectedRoute roles={[UserRole.TRAVELER]}>
                                <Chat />
                            </ProtectedRoute>
                        } />
                        <Route path="profile" element={
                            <ProtectedRoute roles={[UserRole.TRAVELER]}>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="settings" element={
                            <ProtectedRoute roles={[UserRole.TRAVELER]}>
                                <Settings />
                            </ProtectedRoute>
                        } />
                        <Route path="authenticator" element={
                            <ProtectedRoute roles={[UserRole.TRAVELER]}>
                                <Authenticator />
                            </ProtectedRoute>
                        } />
                    </Route>

                    <Route path="*" element={<Navigate to="/m" replace />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />

                    {/* Host Routes */}
                    <Route path="/host" element={
                        <ProtectedRoute roles={[UserRole.HOST]}>
                            <HostDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/host/create" element={
                        <ProtectedRoute roles={[UserRole.HOST]}>
                            <CreateHotspot />
                        </ProtectedRoute>
                    } />
                    <Route path="/host/edit/:id" element={
                        <ProtectedRoute roles={[UserRole.HOST]}>
                            <CreateHotspot />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.MODERATOR]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
