
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Lightbulb, Map, TrendingUp, MessageSquare, Bell, FileText, Settings, CreditCard, Anchor, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getMyProfile } from '../../lib/api';

const Sidebar = () => {
  const location = useLocation();
  const [profile, setProfile] = useState<{ name: string; plan: string; avatar_url?: string | null } | null>(null);

  useEffect(() => {
    getMyProfile().then(setProfile).catch((error) => {
      console.error('Failed to load profile', error);
    });
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Lightbulb, label: 'My Ideas', path: '/dashboard/ideas' },
    { icon: Target, label: 'Validation', path: '/dashboard/validation' },
    { icon: Map, label: 'MVP Roadmap', path: '/dashboard/roadmap' },
    { icon: TrendingUp, label: 'Progress', path: '/dashboard/progress' },
    { icon: MessageSquare, label: 'AI Advisor', path: '/dashboard/chat' },
    { icon: FileText, label: 'Files', path: '/dashboard/files' },
  ];

  const bottomItems = [
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-40">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg text-primary-400">
          <Anchor className="w-8 h-8" />
          <span>YourFounderDock</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">Core Platform</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path) 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="mt-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">Account</p>
            {bottomItems.map((item) => (
            <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                    ? 'bg-primary-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
            </Link>
            ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Founder')}&background=2563eb&color=fff&size=40`}
            alt="Profile"
            className="w-10 h-10 rounded-full ring-2 ring-primary-500 object-cover"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{profile?.name || 'Founder'}</p>
            <p className="text-xs text-slate-400 truncate">{profile?.plan || 'Free'} Plan</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
