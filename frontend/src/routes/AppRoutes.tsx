import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Suspense, lazy } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { UserRole } from '../contracts/enums';
import { MissionAppLayout } from '../components/layout/MissionAppLayout';

// Lazy load pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const TravelerHome = lazy(() => import('../pages/traveler/Home'));
const Profile = lazy(() => import('../pages/traveler/Profile'));
const Settings = lazy(() => import('../pages/traveler/Settings'));
const HotspotDetail = lazy(() => import('../pages/hotspot/Detail'));
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

                {/* Mobile Public Routes (QR Entry) */}
                <Route path="/m/hotspot/:id" element={
                    <ProtectedRoute roles={[UserRole.TRAVELER, UserRole.HOST]}>
                        <PublicDetail type="hotspot" />
                    </ProtectedRoute>
                } />
                <Route path="/m/sight/:id" element={
                    <ProtectedRoute roles={[UserRole.TRAVELER, UserRole.HOST]}>
                        <PublicDetail type="sight" />
                    </ProtectedRoute>
                } />
                <Route path="/m/deal/:token" element={<MobileDealReceipt />} />
                <Route path="/mobile/safety" element={<MobileSafety />} />
                <Route path="/mobile/broadcasts" element={<MobileBroadcasts />} />

                {/* Mission App Routes (User Context) */}
                <Route element={<MissionLayoutWrapper />}>
                    <Route path="/m/feed" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <TravelerHome />
                        </ProtectedRoute>
                    } />
                    <Route path="/m/chat" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Chat />
                        </ProtectedRoute>
                    } />
                    <Route path="/m/profile" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/m/settings" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Settings />
                        </ProtectedRoute>
                    } />
                    <Route path="/m/authenticator" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Authenticator />
                        </ProtectedRoute>
                    } />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/m/login" element={<Login />} />
                    <Route path="/m/signup" element={<Signup />} />

                    {/* Public Discovery (Web) */}
                    <Route path="/m/hotspot/:id" element={<HotspotDetail />} />
                    <Route path="/m/commerce/demo" element={<CommerceDemo />} />

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
