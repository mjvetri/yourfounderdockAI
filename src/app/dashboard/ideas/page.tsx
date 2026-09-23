import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Lightbulb, Plus, MoreVertical, ArrowRight, Loader2, AlertCircle, Cpu, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listIdeas } from '../../../lib/api';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: 'software' | 'hardware';
  status: 'draft' | 'validating' | 'building' | 'launched';
  progress: number;
}

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  draft: { color: 'bg-slate-400', label: 'Draft' },
  validating: { color: 'bg-amber-500', label: 'Validating' },
  building: { color: 'bg-blue-500', label: 'Building' },
  launched: { color: 'bg-green-500', label: 'Launched' },
};

const IdeasPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listIdeas()
      .then((data: any) => setIdeas(data ?? []))
      .catch((e) => setError(e.message || 'Unable to load ideas.'))
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

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Ideas</h1>
          <p className="text-slate-500 mt-1">Manage and track your startup concepts.</p>
        </div>
        <Link
          to="/dashboard/idea-upload"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Idea
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {ideas.length === 0 && !error && (
        <div className="mb-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No ideas yet. Add your first startup idea to get started.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => {
          const status = STATUS_STYLES[idea.status] || STATUS_STYLES.draft;
          const CategoryIcon = idea.category === 'hardware' ? Cpu : Smartphone;
          return (
            <div key={idea.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${idea.category === 'hardware' ? 'bg-orange-50' : 'bg-green-50'}`}>
                  <Lightbulb className={`w-5 h-5 ${idea.category === 'hardware' ? 'text-orange-500' : 'text-green-500'}`} />
                </div>
                <button type="button" aria-label={`Actions for ${idea.title}`} className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">{idea.title}</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">{idea.description}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  <CategoryIcon className="w-3 h-3" /> {idea.category === 'hardware' ? 'Hardware' : 'Software'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${status.color}`} /> {status.label}
                </span>
                <Link to="/dashboard/roadmap" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
                  View Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}

        <Link
          to="/dashboard/idea-upload"
          className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-8 hover:border-primary-300 transition-colors min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Add New Idea</h3>
          <p className="text-sm text-slate-500">Validate a new concept with our AI engine.</p>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default IdeasPage;
