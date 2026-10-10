import React, { useEffect, useState } from 'react';
import { BarChart3, Bell, CreditCard, Crown, Eye, FileText, House, KanbanSquare, Lightbulb, Map, MessageSquareText, Rocket, Settings, Target, Users, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getMyProfile } from '../../lib/api';
import BrandLogo from '../ui/BrandLogo';

interface SidebarProps { mobileOpen?: boolean; onClose?: () => void; }

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const location = useLocation();
  const [profile, setProfile] = useState<{ plan: string } | null>(null);

  useEffect(() => { getMyProfile().then(setProfile).catch(() => {}); }, []);
  useEffect(() => { onClose?.(); }, [location.pathname]);

  const sections = [
    ['Workspace', [
      { icon: House, label: 'Dashboard', path: '/dashboard' },
      { icon: Lightbulb, label: 'Ideas Lab', path: '/dashboard/ideas' },
      { icon: Target, label: 'Validation', path: '/dashboard/validation' },
      { icon: Map, label: 'MVP Roadmap', path: '/dashboard/roadmap' },
      { icon: BarChart3, label: 'Progress', path: '/dashboard/progress' },
      { icon: Rocket, label: 'GTM Strategy', path: '/dashboard/gtm-strategy' },
      { icon: Users, label: 'Network Rooms', path: '/dashboard/community' },
      { icon: MessageSquareText, label: 'DockMind', path: '/dashboard/chat' },
      { icon: FileText, label: 'Files', path: '/dashboard/files' },
    ]],
    ['Strategy', [
      { icon: KanbanSquare, label: 'Lean Canvas', path: '/dashboard/lean-canvas' },
      { icon: Eye, label: 'Vision Board', path: '/dashboard/vision-board' },
      { icon: Users, label: 'Team Canvas', path: '/dashboard/team-canvas' },
    ]],
    ['Account', [
      { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
      { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ]],
  ];

  return <>{mobileOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm xl:hidden" />}<aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-auto bg-ink text-white transition-transform duration-300 ease-out xl:w-64 xl:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between px-5 py-6"><Link to="/dashboard" className="flex items-center gap-2.5"><BrandLogo className="h-9 w-9" inverse /><span className="font-display font-bold tracking-tight">YourFounderDock</span></Link><button onClick={onClose} aria-label="Close navigation" className="p-1 text-slate-400 hover:text-white xl:hidden"><X className="h-5 w-5" /></button></div><nav className="flex-1 px-3 py-2">{sections.map(([title, items]) => <div key={title} className={title === 'Workspace' ? '' : 'mt-6'}><p className="mb-2 px-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>{items.map((item) => { const active = location.pathname === item.path; const Icon = item.icon; return <Link key={item.path} to={item.path} className={`mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${active ? 'bg-white text-ink shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>{item.path === '/dashboard/community' ? <div className="flex h-[18px] w-[18px] items-center justify-center"><Users className="h-[17px] w-[17px]" /></div> : <Icon className="h-[17px] w-[17px]" />}{item.label}</Link>; })}</div>)}</nav>{profile?.plan?.toLowerCase() !== 'pro' && <div className="m-3 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-4"><Crown className="mb-2 h-5 w-5 text-primary-200" /><p className="mb-1 text-sm font-bold">Upgrade to Pro</p><p className="mb-3 text-xs text-primary-100">Unlock advanced AI insights and more features.</p><Link to="/dashboard/billing" className="block rounded-lg bg-white py-2 text-center text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50">Upgrade Now →</Link></div>}</aside></>;
};

export default Sidebar;
