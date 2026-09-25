
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Lightbulb, Map, TrendingUp, MessageSquare, Bell, FileText, Settings, CreditCard, Anchor, Target, ChevronRight, Sparkles, KanbanSquare, Eye, Users } from 'lucide-react';
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
    { icon: Lightbulb, label: 'Ideas Lab', path: '/dashboard/ideas' },
    { icon: Target, label: 'Validation', path: '/dashboard/validation' },
    { icon: Map, label: 'MVP Roadmap', path: '/dashboard/roadmap' },
    { icon: TrendingUp, label: 'Progress', path: '/dashboard/progress' },
    { icon: MessageSquare, label: 'DockMind', path: '/dashboard/chat' },
    { icon: FileText, label: 'Files', path: '/dashboard/files' },
  ];

  const bottomItems = [
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const canvasItems = [
    { icon: KanbanSquare, label: 'Lean Canvas', path: '/dashboard/lean-canvas' },
    { icon: Eye, label: 'Vision Board', path: '/dashboard/vision-board' },
    { icon: Users, label: 'Team Canvas', path: '/dashboard/team-canvas' },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-[#0b1220] text-white h-screen flex-col fixed left-0 top-0 overflow-y-auto z-40 border-r border-slate-800/80">
      <div className="px-5 py-6 border-b border-slate-800/80">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-950/50 group-hover:bg-primary-500 transition-colors">
            <Anchor className="w-5 h-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold tracking-tight text-white">YourFounderDock</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-1">Founder workspace</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 py-7 px-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-3 px-3">Workspace</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={`group relative flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl transition-all ${
              isActive(item.path) 
                ? 'bg-primary-600/15 text-white shadow-inner shadow-primary-950/20' 
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
            }`}
          >
            {isActive(item.path) && <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-primary-400" />}
            <item.icon className={`w-[18px] h-[18px] ${isActive(item.path) ? 'text-primary-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className="text-sm font-medium flex-1">{item.label}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${isActive(item.path) ? 'opacity-100 text-primary-300' : 'opacity-0 group-hover:opacity-60'}`} />
          </Link>
        ))}

        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-3 px-3">Strategy</p>
          {canvasItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive(item.path) ? 'page' : undefined}
              className={`group relative flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl transition-all ${isActive(item.path) ? 'bg-primary-600/15 text-white' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'}`}
            >
              {isActive(item.path) && <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-primary-400" />}
              <item.icon className={`w-[18px] h-[18px] ${isActive(item.path) ? 'text-primary-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${isActive(item.path) ? 'opacity-100 text-primary-300' : 'opacity-0 group-hover:opacity-60'}`} />
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-3 px-3">Account</p>
            {bottomItems.map((item) => (
            <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl transition-all ${
                isActive(item.path) 
                    ? 'bg-primary-600/15 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                }`}
            >
                {isActive(item.path) && <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-primary-400" />}
                <item.icon className={`w-[18px] h-[18px] ${isActive(item.path) ? 'text-primary-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${isActive(item.path) ? 'opacity-100 text-primary-300' : 'opacity-0 group-hover:opacity-60'}`} />
            </Link>
            ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-800/80">
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 p-3 bg-slate-800/45 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
        >
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Founder')}&background=2563eb&color=fff&size=40`}
            alt="Profile"
            className="w-10 h-10 rounded-xl ring-1 ring-primary-400/60 object-cover"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{profile?.name || 'Founder'}</p>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary-400" />{profile?.plan || 'Free'} Plan</p>
          </div>
          <Settings className="w-4 h-4 text-slate-500" />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
