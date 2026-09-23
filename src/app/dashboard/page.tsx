import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, ArrowUpRight, Clock, CheckCircle2, Loader2, AlertCircle, Cpu, Smartphone, Lightbulb, ListChecks, Flag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyProfile, getDashboardStats, listIdeas } from '../../lib/api';

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const DashboardHome = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyProfile(), getDashboardStats(), listIdeas()])
      .then(([loadedProfile, loadedStats, ideasList]) => {
        setProfile(loadedProfile);
        setStats(loadedStats);
        setIdeas(ideasList ?? []);
      })
      .catch((e) => setError(e.message || 'Unable to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  const dashboardStats = stats ?? {
    activeProjects: 0,
    tasksDone: 0,
    tasksTotal: 0,
    upcomingMilestones: 0,
    recentActivity: [],
  };
  const overallProgress = ideas.length > 0
    ? Math.round(ideas.reduce((total, idea) => total + Math.max(0, Math.min(100, idea.progress || 0)), 0) / ideas.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/70 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row justify-between sm:items-center gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 mb-2">Founder workspace</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {profile?.name || 'Founder'}
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">Your ideas, milestones, and next moves in one place.</p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live workspace
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              {overallProgress}% average MVP progress
            </span>
          </div>
        </div>
        <Link
          to="/dashboard/idea-upload"
          className="relative flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg shadow-primary-600/20"
        >
          <Plus className="w-4 h-4" /> New Idea
        </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-primary-600"><Lightbulb className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-slate-500">Active Projects</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 mt-4">{dashboardStats.activeProjects}</p>
          <p className="text-xs text-slate-400 mt-1">Total ideas tracked</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-2.5 text-green-600"><ListChecks className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-slate-500">Completed Tasks</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 mt-4">{dashboardStats.tasksDone}</p>
          <p className="text-xs text-slate-400 mt-1">of {dashboardStats.tasksTotal} total</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600"><Flag className="w-5 h-5" /></div>
              <p className="text-sm font-medium text-slate-500">Upcoming Milestones</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 mt-4">{dashboardStats.upcomingMilestones}</p>
          <p className="text-xs text-slate-400 mt-1">Tasks still open</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-bold text-slate-900">MVP Development Progress</h3>
              <p className="text-xs text-slate-400 mt-1">Progress based on completed roadmap tasks.</p>
            </div>
            <Sparkles className="w-5 h-5 text-primary-500" />
          </div>

          {ideas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-center py-10">
              <Lightbulb className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No ideas yet</p>
              <Link to="/dashboard/idea-upload" className="text-xs font-semibold text-primary-600 hover:underline mt-1 inline-block">Add your first idea</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea: any) => {
                const Icon = idea.category === 'hardware' ? Cpu : Smartphone;
                const barColor = idea.category === 'hardware' ? 'bg-orange-500' : 'bg-primary-600';
                const progress = Math.max(0, Math.min(100, idea.progress || 0));
                return (
                  <Link key={idea.id} to="/dashboard/roadmap" className="block rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`rounded-lg p-2 ${idea.category === 'hardware' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-primary-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{idea.title}</p>
                          <p className="text-[11px] text-slate-400 capitalize">{idea.category || 'software'} idea</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">{progress === 0 ? 'No roadmap generated yet' : 'Open roadmap'}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          {dashboardStats.recentActivity.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No activity yet - add an idea to get started.</p>
          ) : (
            <div className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              {dashboardStats.recentActivity.map((activity: any, index: number) => (
                <div key={`${activity.label}-${activity.time}-${index}`} className="relative flex items-start gap-3 pl-1">
                  <div className={`relative z-10 mt-0.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full ring-4 ring-white ${activity.label.startsWith('Completed') ? 'bg-green-500' : 'bg-primary-500'}`}>
                    {activity.label.startsWith('Completed') && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-5">{activity.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(activity.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
