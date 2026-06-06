import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Navigate
} from '@tanstack/react-router';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardLayout } from './components/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CarriersPage } from './pages/CarriersPage';
import { MessagesPage } from './pages/MessagesPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ITMonitorPage } from './pages/ITMonitorPage';
import { LoadingOverlay } from '@blinkdotnew/ui';

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ),
});

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0F172A]">
        <LoadingOverlay />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const carriersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carriers',
  component: () => (
    <ProtectedRoute>
      <CarriersPage />
    </ProtectedRoute>
  ),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: () => (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  ),
});

const complaintsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/complaints',
  component: () => (
    <ProtectedRoute>
      <ComplaintsPage />
    </ProtectedRoute>
  ),
});

const itMonitorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/it-monitor',
  component: () => (
    <ProtectedRoute>
      <ITMonitorPage />
    </ProtectedRoute>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Router Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  carriersRoute,
  messagesRoute,
  complaintsRoute,
  itMonitorRoute,
  loginRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}