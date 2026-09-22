import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CheckCircle, Zap, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getMyProfile, listFiles } from '../../../lib/api';

const PLANS: Record<string, { label: string; price: string; features: string[] }> = {
  free: {
    label: 'Free Plan',
    price: '₹0',
    features: ['3 active ideas', 'Basic AI validation', 'Community support'],
  },
  pro: {
    label: 'Pro Membership',
    price: '₹1,499',
    features: ['Unlimited Projects', 'Advanced AI Advisor', 'Priority Support'],
  },
};

const STORAGE_LIMIT_BYTES = 10 * 1024 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 MB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const BillingPage = () => {
  const [plan, setPlan] = useState('free');
  const [storageUsed, setStorageUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyProfile(), listFiles()])
      .then(([profile, files]: [any, any]) => {
        setPlan(profile?.plan || 'free');
        const total = (files || []).reduce((sum: number, file: any) => sum + (file.size_bytes || 0), 0);
        setStorageUsed(total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const currentPlan = PLANS[plan] || PLANS.free;
  const storagePct = Math.min(100, (storageUsed / STORAGE_LIMIT_BYTES) * 100);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing &amp; Subscription</h1>
        <p className="text-slate-500 mt-1">Manage your plan, payment methods, and view invoices.</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Current Plan</h2>
                <p className="text-slate-300 text-sm">{currentPlan.label}</p>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase backdrop-blur-sm">Active</div>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">{currentPlan.price}</span>
                {plan === 'pro' && <span className="text-slate-500 mb-1">/ month</span>}
              </div>
              <div className="space-y-3 mb-8">
                {currentPlan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                {plan === 'pro' ? (
                  <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                    Cancel Subscription
                  </button>
                ) : (
                  <button type="button" disabled title="Online payments aren't live yet - coming soon" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
                    Upgrade Plan - Coming Soon
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Payment Method</h3>
              <button type="button" disabled title="Coming soon" className="text-sm text-slate-400 cursor-not-allowed">+ Add New</button>
            </div>
            <div className="flex items-center justify-center p-6 border border-dashed border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500">
              No payment method on file yet. This will be available once online payments launch.
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Usage
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Storage</span>
                  <span className="font-bold text-slate-900">{formatBytes(storageUsed)} / 10 GB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${storagePct}%` }}></div>
                </div>
              </div>
              <p className="text-xs text-slate-400">AI usage tracking isn't wired up yet - coming with the Pro plan launch.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> Billing History
            </h3>
            <div className="text-center py-6 text-sm text-slate-400">
              No invoices yet - this will populate once billing goes live.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;
