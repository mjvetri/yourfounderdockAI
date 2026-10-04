import { useState } from 'react';
import { Anchor, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const links = [
  ['Features', '/features'],
  ['How It Works', '/how-it-works'],
  ['Pricing', '/pricing'],
  ['About Founder', '/about'],
] as const;

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex min-w-0 items-center gap-2 font-bold text-slate-900 sm:text-xl">
        <Anchor className="h-7 w-7 shrink-0 text-primary-600 sm:h-8 sm:w-8" />
        <span className="truncate">YourFounderDock</span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
        {links.map(([label, to]) => <Link key={to} to={to} className="hover:text-primary-600">{label}</Link>)}
      </nav>
      <div className="hidden items-center gap-2 sm:flex">
        <Link to="/login" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
        <Link to="/signup" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">Get Started</Link>
      </div>
      <button type="button" onClick={() => setIsOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:hidden"><Menu className="h-6 w-6" /></button>
    </div>
    {isOpen && <div className="fixed inset-0 z-[60] flex flex-col bg-white sm:hidden">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
        <span className="font-bold text-slate-900">YourFounderDock</span>
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"><X className="h-6 w-6" /></button>
      </div>
      <nav className="flex flex-col px-5 py-4">
        {links.map(([label, to]) => <Link key={to} to={to} onClick={() => setIsOpen(false)} className="border-b border-slate-100 py-4 text-lg font-medium text-slate-800">{label}</Link>)}
        <Link to="/login" onClick={() => setIsOpen(false)} className="py-4 text-lg font-medium text-slate-800">Login</Link>
        <Link to="/signup" onClick={() => setIsOpen(false)} className="mt-3 rounded-xl bg-primary-600 py-3.5 text-center font-semibold text-white">Get Started</Link>
      </nav>
    </div>}
  </header>;
}
