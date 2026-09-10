import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CreditCard, CheckCircle, Zap, Clock, Download, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const BillingPage = () => {
  const invoices = [
    { id: 'INV-001', date: 'Oct 01, 2024', amount: '$29.00', status: 'Paid' },
    { id: 'INV-002', date: 'Sep 01, 2024', amount: '$29.00', status: 'Paid' },
    { id: 'INV-003', date: 'Aug 01, 2024', amount: '$29.00', status: 'Paid' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-slate-500 mt-1">Manage your plan, payment methods, and view invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Current Plan Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold">Current Plan</h2>
                    <p className="text-slate-300 text-sm">Pro Membership</p>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase backdrop-blur-sm">Active</div>
            </div>
            <div className="p-6">
                <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold text-slate-900">$29</span>
                    <span className="text-slate-500 mb-1">/ month</span>
                </div>
                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Projects
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Advanced AI Advisor
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Priority Support
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        Cancel Subscription
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        Upgrade Plan
                    </button>
                </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Payment Method</h3>
                <button className="text-sm text-primary-600 font-medium hover:underline">+ Add New</button>
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">Visa ending in 4242</p>
                        <p className="text-xs text-slate-500">Expires 12/25</p>
                    </div>
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>
            </div>
          </div>

        </div>

        {/* Right Column: Invoices & Usage */}
        <div className="space-y-8">
            {/* Usage Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" /> Usage
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">AI Tokens</span>
                            <span className="font-bold text-slate-900">12,450 / 50k</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Storage</span>
                            <span className="font-bold text-slate-900">2.1 GB / 10 GB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '21%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" /> Billing History
                </h3>
                <div className="space-y-2">
                    {invoices.map((inv) => (
                        <div key={inv.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                            <div>
                                <p className="text-sm font-medium text-slate-900">{inv.date}</p>
                                <p className="text-xs text-slate-500">{inv.amount}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{inv.status}</span>
                                <button className="text-slate-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;