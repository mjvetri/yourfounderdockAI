import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 3 },
  { name: 'Wed', tasks: 7 },
  { name: 'Thu', tasks: 5 },
  { name: 'Fri', tasks: 8 },
  { name: 'Sat', tasks: 2 },
  { name: 'Sun', tasks: 4 },
];

const DashboardHome = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Alex 👋</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your startups today.</p>
        </div>
        <Link to="/dashboard/idea-upload" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
          <Plus className="w-5 h-5" />
          New Idea
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Active Projects", value: "3", sub: "+1 this month", color: "bg-blue-50 text-blue-600" },
          { label: "Completed Tasks", value: "12", sub: "85% on time", color: "bg-green-50 text-green-600" },
          { label: "Upcoming Milestones", value: "4", sub: "Next: Launch Day", color: "bg-purple-50 text-purple-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Productivity Tracker</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { title: "Updated MVP Roadmap", time: "2h ago", icon: Clock },
              { title: "Completed: Database Schema", time: "5h ago", icon: CheckCircle },
              { title: "New AI Chat Session", time: "1d ago", icon: Clock },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <item.icon className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/notifications" className="block text-center text-sm text-primary-600 font-medium hover:underline pt-2">View all</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;