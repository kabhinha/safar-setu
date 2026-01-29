import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Suspense, lazy } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { UserRole } from '../contracts/enums';

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
const KioskApp = lazy(() => import('../pages/kiosk'));
const KioskDiscovery = lazy(() => import('../pages/kiosk/Discovery').then(module => ({ default: module.KioskDiscovery })));
const KioskDiscoveryResults = lazy(() => import('../pages/kiosk/DiscoveryResults').then(module => ({ default: module.KioskDiscoveryResults })));
const KioskSights = lazy(() => import('../pages/kiosk/Sights').then(module => ({ default: module.KioskSights })));
const KioskMart = lazy(() => import('../pages/kiosk/Mart').then(module => ({ default: module.KioskMart })));
const VendorScan = lazy(() => import('../pages/Vendor/Scan'));

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
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

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-white">Loading...</div>}>
            <Routes>
                <Route path="/kiosk/*" element={<KioskApp />} />
                <Route path="/kiosk/discover" element={<KioskDiscovery />} />
                <Route path="/kiosk/discover/results" element={<KioskDiscoveryResults />} />
                <Route path="/kiosk/sights" element={<KioskSights />} />
                <Route path="/kiosk/mart" element={<KioskMart />} />
                <Route path="/vendor/scan" element={<VendorScan />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Traveler Routes */}
                    <Route path="/feed" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <TravelerHome />
                        </ProtectedRoute>
                    } />

                    {/* Public Discovery */}
                    <Route path="/hotspot/:id" element={<HotspotDetail />} />
                    <Route path="/commerce/demo" element={<CommerceDemo />} />

                    <Route path="/chat" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Chat />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Settings />
                        </ProtectedRoute>
                    } />

                    <Route path="/authenticator" element={
                        <ProtectedRoute roles={[UserRole.TRAVELER]}>
                            <Authenticator />
                        </ProtectedRoute>
                    } />

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
