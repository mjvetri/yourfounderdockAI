import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CheckCircle, Zap, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { listFiles, getMyAiUsageToday } from '../../../lib/api';
import { DAILY_AI_LIMIT } from '../../../lib/limits';

const FEATURES = [
  'Idea validation and AI analysis',
  'Lean Canvas, Vision Board and Team Canvas',
  'Roadmaps for software and hardware MVPs',
  'MVP Builder and Go-To-Market strategy',
  'DockMind AI assistant',
  `${DAILY_AI_LIMIT} AI requests per day (resets at midnight IST)`,
];

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 MB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const BillingPage = () => {
  const [storageUsed, setStorageUsed] = useState(0);
  const [usedToday, setUsedToday] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listFiles(), getMyAiUsageToday().catch(() => null)])
      .then(([files, used]: [any, number | null]) => {
        setStorageUsed((files || []).reduce((sum: number, file: any) => sum + (file.size_bytes || 0), 0));
        setUsedToday(used);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const usagePct = usedToday === null ? 0 : Math.min(100, (usedToday / DAILY_AI_LIMIT) * 100);
  const atLimit = usedToday !== null && usedToday >= DAILY_AI_LIMIT;

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Plan &amp; Usage</h1>
        <p className="text-slate-500 mt-1">See what's included in your plan and how much you've used today.</p>
      </div>

      {error && <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center"><div><h2 className="text-lg font-bold font-display">Current Plan</h2><p className="text-slate-300 text-sm">Free during beta</p></div><span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase">Beta</span></div>
            <div className="p-6">
              <div className="flex items-end gap-2 mb-6"><span className="text-4xl font-extrabold font-display text-slate-900">Free</span><span className="text-slate-500 mb-1">during beta</span></div>
              <div className="space-y-3 mb-6">{FEATURES.map((feature) => <div key={feature} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {feature}</div>)}</div>
              <div className="flex items-start gap-2 bg-primary-50 border border-primary-100 text-primary-800 text-sm rounded-xl p-3"><Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Paid plans with higher limits are coming soon. We'll tell early users before anything changes.</span></div>
            </div>
          </div>
        </div>

        <div><div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6"><h3 className="text-lg font-bold font-display text-slate-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Usage</h3><div className="space-y-5">
          {usedToday !== null && <div><div className="flex justify-between text-sm mb-1"><span className="text-slate-600">AI requests today</span><span className="font-bold text-slate-900">{usedToday} / {DAILY_AI_LIMIT}</span></div><div className="w-full bg-slate-100 rounded-full h-2"><div className={`h-2 rounded-full ${atLimit ? 'bg-red-500' : 'bg-primary-600'}`} style={{ width: `${usagePct}%` }} /></div><p className="text-xs text-slate-400 mt-1.5">{atLimit ? "You've reached today's limit. It resets at midnight IST." : "Resets at midnight IST. Re-running an analysis you haven't changed doesn't count."}</p></div>}
          <div className="flex justify-between text-sm"><span className="text-slate-600">Storage used</span><span className="font-bold text-slate-900">{formatBytes(storageUsed)}</span></div>
        </div></div></div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;
