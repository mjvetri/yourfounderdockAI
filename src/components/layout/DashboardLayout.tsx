import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, fullScreen = false }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className={`flex-1 ml-64 min-h-screen overflow-y-auto ${fullScreen ? '' : 'p-8'}`}>
        <div className={fullScreen ? 'min-h-screen' : 'max-w-7xl mx-auto'}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;