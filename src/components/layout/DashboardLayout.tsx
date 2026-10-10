import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getMyProfile } from '../../lib/api';
interface DashboardLayoutProps { children: React.ReactNode; fullScreen?: boolean; }
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, fullScreen = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false); const [profile, setProfile] = useState<{ name: string; plan: string; avatar_url?: string | null } | null>(null); const navigate = useNavigate();
  useEffect(() => { getMyProfile().then(setProfile).catch(() => {}); }, []);
  return <div className="flex min-h-screen w-full min-w-0 bg-surface"><Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white/90 text-slate-600 shadow-card backdrop-blur hover:bg-white xl:hidden"><Menu className="h-5 w-5" /></button>
    <div className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/85 p-1.5 shadow-card backdrop-blur sm:right-6"><button onClick={() => navigate('/dashboard/notifications')} aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" /></button><button onClick={() => navigate('/dashboard/settings')} className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-slate-50"><img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Founder')}&background=4f46e5&color=fff&size=36`} alt="Profile" className="h-8 w-8 rounded-full object-cover" /><span className="hidden text-left sm:block"><span className="block text-xs font-semibold leading-tight text-slate-800">{profile?.name || 'Founder'}</span><span className="block text-[10px] leading-tight text-slate-400">{profile?.plan || 'Free'}</span></span><ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" /></button></div>
    <main className={`min-w-0 min-h-screen flex-1 xl:ml-64 ${fullScreen ? '' : 'px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-10 lg:pb-12 lg:pt-16'}`}><div className={fullScreen ? 'min-h-full' : 'mx-auto w-full max-w-6xl'}>{children}</div></main>
  </div>;
};
export default DashboardLayout;
