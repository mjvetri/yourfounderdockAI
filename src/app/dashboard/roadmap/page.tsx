import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Loader2, RefreshCw, Sparkles, Target } from 'lucide-react';
import { createNotification, generateRoadmap, getRoadmap, listIdeas, recalculateIdeaProgress, toggleRoadmapTask } from '../../../lib/api';

type Idea = {
  id: string;
  title: string;
  description: string;
  category: 'software' | 'hardware';
  status?: string;
};

type RoadmapTask = { title: string; desc: string; done: boolean };
type RoadmapPhase = {
  id?: string;
  title: string;
  status: string;
  items: RoadmapTask[];
};

const RoadmapPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { ideaId } = useParams<{ ideaId?: string }>();

  const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId) ?? null;

  const loadIdeas = async () => {
    try {
      const data = await listIdeas();
      setIdeas(data ?? []);
      if ((data ?? []).length > 0) {
        const requestedIdea = data.find((idea) => idea.id === ideaId);
        const nextIdeaId = requestedIdea?.id ?? data[0].id;
        setSelectedIdeaId(nextIdeaId);
        setSelectedRoadmapId(requestedIdea ? nextIdeaId : null);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load ideas.');
    } finally {
      setLoadingIdeas(false);
    }
  };

  const loadRoadmap = async (ideaId: string) => {
    setLoadingRoadmap(true);
    try {
      const rows = await getRoadmap(ideaId);
      const mapped: RoadmapPhase[] = (rows ?? []).map((row: any) => ({
        id: row.id,
        title: row.phase,
        status: row.phase.toLowerCase().includes('phase 1') ? 'active' : 'pending',
        items: Array.isArray(row.tasks) ? row.tasks : [],
      }));
      setPhases(mapped);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Unable to load roadmap.');
      setPhases([]);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, [ideaId]);

  useEffect(() => {
    if (!selectedIdeaId) return;
    loadRoadmap(selectedIdeaId);
  }, [selectedIdeaId]);

  const handleGenerateRoadmap = async () => {
    if (!selectedIdeaId || !selectedIdea) return;
    setGenerating(true);
    try {
      await generateRoadmap(selectedIdea.id, selectedIdea.description, selectedIdea.category);
      await createNotification('roadmap', 'Roadmap Generated', `Your MVP roadmap for "${selectedIdea.title}" is ready.`);
      await loadRoadmap(selectedIdea.id);
    } catch (err: any) {
      setError(err?.message || 'Unable to generate the roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenIdea = (ideaId: string) => {
    navigate(`/dashboard/roadmap/${ideaId}`);
  };

  const handleToggleTask = async (phase: RoadmapPhase, taskIndex: number) => {
    if (!phase.id) return;

    const updatedTasks = phase.items.map((item, idx) =>
      idx === taskIndex ? { ...item, done: !item.done } : item
    );

    try {
      await toggleRoadmapTask(phase.id, phase.items, taskIndex);
      await recalculateIdeaProgress(selectedIdeaId);
      setPhases((current) =>
        current.map((p) =>
          p.id === phase.id ? { ...p, items: updatedTasks } : p
        )
      );
    } catch (err: any) {
      setError(err?.message || 'Unable to update task.');
    }
  };

  const totalTasks = phases.reduce((sum, phase) => sum + phase.items.length, 0);
  const completedTasks = phases.reduce(
    (sum, phase) => sum + phase.items.filter((task) => task.done).length,
    0
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/roadmap')}
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI-generated roadmap
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Startup roadmap</h1>
            <p className="mt-1 text-slate-500">Build a plan based on the real idea and category in your workspace.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateRoadmap}
          disabled={generating || !selectedIdea || loadingIdeas}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {phases.length > 0 ? 'Regenerate Roadmap' : 'Generate AI Roadmap'}
        </button>
      </div>

      {!selectedRoadmapId && ideas.length > 0 && (
        <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ideas.map((idea) => {
            const isSelected = selectedIdeaId === idea.id;
            const isSoftware = idea.category === 'software';

            return (
              <button
                key={idea.id}
                type="button"
                onClick={() => handleOpenIdea(idea.id)}
                className={`group rounded-xl border p-5 text-left shadow-sm transition ${
                  isSelected
                    ? 'border-primary-200 bg-primary-50/40 shadow-md'
                    : 'border-slate-200 bg-white hover:border-primary-200 hover:shadow-md'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isSoftware ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    <span className="text-lg font-bold">✦</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {isSoftware ? 'Software' : 'Hardware'}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900 line-clamp-2">{idea.title}</h3>
                <p className="mb-5 min-h-[48px] text-sm text-slate-500">{idea.description || 'No description yet.'}</p>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    {isSelected ? 'Selected' : 'Draft'}
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    {isSelected ? 'Open' : 'View Roadmap'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {selectedRoadmapId && selectedIdea && (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Selected idea</p>
                  <p className="text-lg font-bold text-slate-900">{selectedIdea.title}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Completed tasks</p>
                  <p className="text-lg font-bold text-slate-900">{completedTasks} / {totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="text-lg font-bold text-slate-900 capitalize">{selectedIdea.category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/dashboard/roadmap')}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" /> Back to MVP roadmap
            </button>
          </div>
        </>
      )}

      {loadingIdeas || loadingRoadmap ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading roadmap...
        </div>
      ) : !selectedIdea ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Create an idea first to generate a roadmap.
        </div>
      ) : selectedRoadmapId && phases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-800">No roadmap generated yet</p>
          <p className="mt-2 text-slate-500">Generate an AI roadmap for this idea to get a realistic phase-by-phase plan.</p>
          <button
            type="button"
            onClick={handleGenerateRoadmap}
            disabled={generating}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Generate Roadmap
          </button>
        </div>
      ) : selectedRoadmapId ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {phases.map((phase, phaseIndex) => (
            <div key={`${phase.title}-${phaseIndex}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${phase.status === 'active' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'}`}>
                    {phase.status === 'active' ? 'Active' : 'Upcoming'}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-slate-900">{phase.title}</h2>
                </div>

                <p className="text-sm text-slate-500">
                  {phase.items.filter((item) => item.done).length}/{phase.items.length} complete
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {phase.items.map((item, itemIndex) => (
                  <button
                    type="button"
                    key={`${phase.title}-${item.title}`}
                    onClick={() => handleToggleTask(phase, itemIndex)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      item.done
                        ? 'border-green-200 bg-green-50/60'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                    )}

                    <div>
                      <p className={`font-semibold ${item.done ? 'text-slate-900 line-through decoration-slate-400' : 'text-slate-800'}`}>
                        {item.title}
                      </p>
                      <p className={`mt-1 text-sm ${item.done ? 'text-slate-500' : 'text-slate-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default RoadmapPage;