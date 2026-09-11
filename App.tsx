
import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/idea-upload" element={<IdeaUploadPage />} />
          <Route path="/dashboard/ideas" element={<IdeasPage />} />
          <Route path="/dashboard/validation" element={<ValidationPage />} />
          <Route path="/dashboard/chat" element={<ChatPage />} />
          <Route path="/dashboard/roadmap" element={<RoadmapPage />} />
          <Route path="/dashboard/progress" element={<ProgressPage />} />
          <Route path="/dashboard/files" element={<FilesPage />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
