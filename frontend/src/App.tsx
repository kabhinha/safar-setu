import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import BottomNav from './components/layout/BottomNav';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const TravelerHome = lazy(() => import('./pages/Traveler/Home'));
const Profile = lazy(() => import('./pages/Traveler/Profile'));
const Settings = lazy(() => import('./pages/Traveler/Settings'));
const HotspotDetail = lazy(() => import('./pages/Hotspot/Detail'));
const Chat = lazy(() => import('./pages/BuddyChat/Chat'));
const HostDashboard = lazy(() => import('./pages/Host/Dashboard'));
const CreateHotspot = lazy(() => import('./pages/Host/CreateHotspot'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const CommerceDemo = lazy(() => import('./pages/Commerce/Demo'));

const Authenticator = lazy(() => import('./pages/Mobile/Authenticator'));

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; // Unauthorized
  }

  return <>{children}</>;
};

const KioskApp = lazy(() => import('./pages/Kiosk'));

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  // Don't show bottom nav on kiosk route, auth pages, or admin/host sections
  const showBottomNav = user?.role === 'TRAVELER' && !['/login', '/signup', '/', '/landing', '/kiosk'].includes(location.pathname) && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/host');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Outlet />
      {showBottomNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-white">Loading...</div>}>
          <Routes>
            <Route path="/kiosk/*" element={<KioskApp />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Traveler Routes */}
              <Route path="/feed" element={
                <ProtectedRoute roles={['TRAVELER']}>
                  <TravelerHome />
                </ProtectedRoute>
              } />

              {/* Public Discovery */}
              <Route path="/hotspot/:id" element={<HotspotDetail />} />
              <Route path="/commerce/demo" element={<CommerceDemo />} />

              <Route path="/chat" element={
                <ProtectedRoute roles={['TRAVELER']}>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute roles={['TRAVELER']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute roles={['TRAVELER']}>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/authenticator" element={
                <ProtectedRoute roles={['TRAVELER']}>
                  <Authenticator />
                </ProtectedRoute>
              } />

              {/* Host Routes */}
              <Route path="/host" element={
                <ProtectedRoute roles={['HOST']}>
                  <HostDashboard />
                </ProtectedRoute>
              } />
              <Route path="/host/create" element={
                <ProtectedRoute roles={['HOST']}>
                  <CreateHotspot />
                </ProtectedRoute>
              } />
              <Route path="/host/edit/:id" element={
                <ProtectedRoute roles={['HOST']}>
                  <CreateHotspot />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute roles={['ADMIN', 'MODERATOR']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
