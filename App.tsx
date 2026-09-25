
import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './src/RequireAuth';

// Pages
const LandingPage = lazy(() => import('./src/app/(landing)/page'));
const PricingPage = lazy(() => import('./src/app/(landing)/pricing/page'));
const AboutPage = lazy(() => import('./src/app/(landing)/about/page'));
const FeaturesPage = lazy(() => import('./src/app/(landing)/features/page'));
const HowItWorksPage = lazy(() => import('./src/app/(landing)/how-it-works/page'));

// Auth Pages
const LoginPage = lazy(() => import('./src/app/(auth)/login/page'));
const SignupPage = lazy(() => import('./src/app/(auth)/signup/page'));

// Dashboard Pages
const DashboardHome = lazy(() => import('./src/app/dashboard/page'));
const IdeaUploadPage = lazy(() => import('./src/app/dashboard/idea-upload/page'));
const ChatPage = lazy(() => import('./src/app/dashboard/chat/page'));
const RoadmapPage = lazy(() => import('./src/app/dashboard/roadmap/page'));
const SettingsPage = lazy(() => import('./src/app/dashboard/settings/page'));
const BillingPage = lazy(() => import('./src/app/dashboard/billing/page'));
const NotificationsPage = lazy(() => import('./src/app/dashboard/notifications/page'));
const FilesPage = lazy(() => import('./src/app/dashboard/files/page'));
const ProgressPage = lazy(() => import('./src/app/dashboard/progress/page'));
const IdeasPage = lazy(() => import('./src/app/dashboard/ideas/page'));
const ValidationPage = lazy(() => import('./src/app/dashboard/validation/page'));
const LeanCanvasPage = lazy(() => import('./src/app/dashboard/lean-canvas/page'));
const VisionBoardPage = lazy(() => import('./src/app/dashboard/vision-board/page'));
const TeamCanvasPage = lazy(() => import('./src/app/dashboard/team-canvas/page'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<RequireAuth><DashboardHome /></RequireAuth>} />
          <Route path="/dashboard/idea-upload" element={<RequireAuth><IdeaUploadPage /></RequireAuth>} />
          <Route path="/dashboard/ideas" element={<RequireAuth><IdeasPage /></RequireAuth>} />
          <Route path="/dashboard/validation" element={<RequireAuth><ValidationPage /></RequireAuth>} />
          <Route path="/dashboard/chat" element={<RequireAuth><ChatPage /></RequireAuth>} />
          <Route path="/dashboard/roadmap" element={<RequireAuth><RoadmapPage /></RequireAuth>} />
          <Route path="/dashboard/roadmap/:ideaId" element={<RequireAuth><RoadmapPage /></RequireAuth>} />
          <Route path="/dashboard/progress" element={<RequireAuth><ProgressPage /></RequireAuth>} />
          <Route path="/dashboard/files" element={<RequireAuth><FilesPage /></RequireAuth>} />
          <Route path="/dashboard/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
          <Route path="/dashboard/billing" element={<RequireAuth><BillingPage /></RequireAuth>} />
          <Route path="/dashboard/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/dashboard/lean-canvas" element={<RequireAuth><LeanCanvasPage /></RequireAuth>} />
          <Route path="/dashboard/vision-board" element={<RequireAuth><VisionBoardPage /></RequireAuth>} />
          <Route path="/dashboard/team-canvas" element={<RequireAuth><TeamCanvasPage /></RequireAuth>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
