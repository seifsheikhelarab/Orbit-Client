import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { ForgotPassword } from './features/auth/pages/ForgotPassword';
import { LandingPage } from './pages/LandingPage';
import { TooltipProvider } from './components/ui/tooltip';
import { useGlobalKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Lazy-loaded pages for code splitting
const DashboardOverview = lazy(() => import('./features/dashboard/pages/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const ApplicationsPage = lazy(() => import('./features/applications/pages/ApplicationsPage'));
const NewApplicationPage = lazy(() => import('./features/applications/pages/NewApplicationPage'));
const ViewApplicationPage = lazy(() => import('./features/applications/pages/ViewApplicationPage'));
const ApplicationDetailPage = lazy(() => import('./features/applications/pages/ApplicationDetailPage'));
const AttachResumePage = lazy(() => import('./features/applications/pages/AttachResumePage'));
const ResumesPage = lazy(() => import('./features/cv-builder/pages/ResumesPage').then(m => ({ default: m.ResumesPage })));
const BuilderPage = lazy(() => import('./features/cv-builder/pages/BuilderPage').then(m => ({ default: m.BuilderPage })));
const SettingsPage = lazy(() => import('./features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const InterviewsPage = lazy(() => import('./features/applications/pages/InterviewsPage').then(m => ({ default: m.InterviewsPage })));
const NotificationsPage = lazy(() => import('./features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));
const AutoCVPage = lazy(() => import('./features/profile/pages/AutoCVPage'));

const queryClient = new QueryClient();

function KeyboardShortcuts() {
  useGlobalKeyboardShortcuts();
  return null;
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full animate-in fade-in duration-300">
      <div className="size-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-6" />
      <p className="font-headline font-semibold text-sm text-primary/60">Loading Orbit...</p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <KeyboardShortcuts />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
          {/* Public Routes without AppLayout wrapper */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Redirects */}
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/applications" element={<Navigate to="/app/applications" replace />} />
          <Route path="/applications/:id" element={<Navigate to="/app/applications/:id" replace />} />
          <Route path="/applications/:id/edit" element={<Navigate to="/app/applications/:id/edit" replace />} />
          <Route path="/applications/:id/attach" element={<Navigate to="/app/applications/:id/attach" replace />} />
          <Route path="/applications/new" element={<Navigate to="/app/applications/new" replace />} />
          <Route path="/resumes" element={<Navigate to="/app/resumes" replace />} />
          <Route path="/resumes/:id" element={<Navigate to="/app/resumes/:id" replace />} />
          <Route path="/notifications" element={<Navigate to="/app/notifications" replace />} />

          {/* Protected Routes wrapped in AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="applications/new" element={<NewApplicationPage />} />
              <Route path="applications/:id" element={<ViewApplicationPage />} />
              <Route path="applications/:id/edit" element={<ApplicationDetailPage />} />
              <Route path="applications/:id/attach" element={<AttachResumePage />} />
              <Route path="resumes" element={<ResumesPage />} />
              <Route path="resumes/:id" element={<BuilderPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="autocv" element={<AutoCVPage />} />
            </Route>
           </Route>
         </Routes>
         </Suspense>
         </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
