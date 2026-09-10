
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './src/app/(landing)/page';
import PricingPage from './src/app/(landing)/pricing/page';
import AboutPage from './src/app/(landing)/about/page';
import FeaturesPage from './src/app/(landing)/features/page';
import HowItWorksPage from './src/app/(landing)/how-it-works/page';

// Auth Pages
import LoginPage from './src/app/(auth)/login/page';
import SignupPage from './src/app/(auth)/signup/page';

// Dashboard Pages
import DashboardHome from './src/app/dashboard/page';
import IdeaUploadPage from './src/app/dashboard/idea-upload/page';
import ChatPage from './src/app/dashboard/chat/page';
import RoadmapPage from './src/app/dashboard/roadmap/page';
import SettingsPage from './src/app/dashboard/settings/page';
import BillingPage from './src/app/dashboard/billing/page';
import NotificationsPage from './src/app/dashboard/notifications/page';
import FilesPage from './src/app/dashboard/files/page';
import ProgressPage from './src/app/dashboard/progress/page';
import IdeasPage from './src/app/dashboard/ideas/page';
import ValidationPage from './src/app/dashboard/validation/page';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
