import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';

const links = [
  ['Features', '/features'],
  ['How It Works', '/how-it-works'],
  ['Pricing', '/pricing'],
] as const;

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex min-w-0 items-center gap-2 font-bold text-slate-900 sm:text-lg lg:text-xl">
        <BrandLogo className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
        <span className="whitespace-nowrap">YourFounderDock</span>
      </Link>

      <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex lg:gap-8">
        {links.map(([label, to]) => <Link key={to} to={to} className="transition-colors hover:text-slate-900">{label}</Link>)}
      </nav>

      <div className="hidden items-center gap-2 sm:flex lg:gap-3">
        <Link to="/login" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 lg:px-4">Sign in</Link>
        <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-300/60 transition-colors hover:bg-slate-800 lg:px-4">Get Started Free <ArrowRight className="h-4 w-4" /></Link>
      </div>

      <button type="button" onClick={() => setIsOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:hidden"><Menu className="h-6 w-6" /></button>
    </div>

    {isOpen && <div className="fixed inset-0 z-[60] flex flex-col bg-white sm:hidden">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold text-slate-900">
          <BrandLogo className="h-9 w-9" />
          <span>YourFounderDock</span>
        </Link>
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"><X className="h-6 w-6" /></button>
      </div>
      <nav className="flex flex-col px-5 py-4">
        {links.map(([label, to]) => <Link key={to} to={to} onClick={() => setIsOpen(false)} className="border-b border-slate-100 py-4 text-lg font-medium text-slate-800">{label}</Link>)}
        <Link to="/login" onClick={() => setIsOpen(false)} className="py-4 text-lg font-medium text-slate-800">Sign in</Link>
        <Link to="/signup" onClick={() => setIsOpen(false)} className="mt-3 rounded-full bg-slate-950 py-3.5 text-center font-semibold text-white">Get Started</Link>
      </nav>
    </div>}
  </header>;
}
