import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Cpu, Smartphone, Sparkles, Loader2, AlertCircle, AlertTriangle, Code2 } from 'lucide-react';
import { listIdeas, generateMvpBuild, getMvpBuild } from '../../../lib/api';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: 'software' | 'hardware';
}

interface Connection { from: string; to: string; label: string; }

function CircuitDiagram({ connections }: { connections: Connection[] }) {
  if (!connections || connections.length === 0) return null;
  return (
    <div className="space-y-3">
      {connections.map((c, i) => (
        <div key={i} className="flex items-center gap-2 text-sm flex-wrap">
          <span className="px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium">{c.from}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="h-px w-4 bg-slate-300" />
            <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{c.label}</span>
            <span className="h-px w-4 bg-slate-300" />
            <span>→</span>
          </div>
          <span className="px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium">{c.to}</span>
        </div>
      ))}
    </div>
  );
}

const MvpBuilderPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState('');
  const [build, setBuild] = useState<any>(null);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const selectedIdea = ideas.find((i) => i.id === selectedIdeaId);

  useEffect(() => {
    listIdeas()
      .then((data: any) => {
        setIdeas(data);
        if (data.length > 0) setSelectedIdeaId(data[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingIdeas(false));
  }, []);

  useEffect(() => {
    if (!selectedIdeaId) return;
    setError('');
    setBuild(null);
    getMvpBuild(selectedIdeaId)
      .then((row: any) => setBuild(row))
      .catch((e) => setError(e.message));
  }, [selectedIdeaId]);

  const handleGenerate = async () => {
    if (!selectedIdea) return;
    setGenerating(true);
    setError('');
    try {
      const data = await generateMvpBuild(selectedIdea.id, selectedIdea.description, selectedIdea.category);
      setBuild({ category: data.category, result: data.result });
    } catch (e: any) {
      setError(e.message || 'Could not generate this. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingIdeas) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (ideas.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-24">
          <h2 className="text-xl font-bold text-slate-900">No ideas yet</h2>
          <p className="text-slate-500 mt-2">Add an idea first, then come back here to build its MVP.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">MVP Builder</h1>
          <p className="text-slate-500 mt-1">
            {selectedIdea ? `Starting point for "${selectedIdea.title}"` : 'Select an idea to get started.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedIdeaId}
            onChange={(e) => setSelectedIdeaId(e.target.value)}
            className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white"
          >
            {ideas.map((idea) => (
              <option key={idea.id} value={idea.id}>{idea.title}</option>
            ))}
          </select>
          {selectedIdea && (
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-slate-100 text-slate-600">
              {selectedIdea.category === 'hardware' ? <Cpu className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              {selectedIdea.category}
            </span>
          )}
        </div>
      </div>

      {selectedIdea?.category === 'hardware' && (
        <div className="mb-6 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-md p-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            This is a logical wiring reference to help you plan, not a certified schematic. Have a real
            engineer verify voltages, current draw, and part compatibility before building or powering anything.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!build && !generating && (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
          <p className="text-slate-500 mb-4">No MVP starting point generated yet for this idea.</p>
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate {selectedIdea?.category === 'hardware' ? 'Wiring Diagram' : 'Software Scaffold'}
          </button>
        </div>
      )}

      {generating && (
        <div className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Building a starting point for your {selectedIdea?.category} idea…</p>
        </div>
      )}

      {build && !generating && build.category === 'hardware' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3">Components</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {build.result.components?.map((c: any, i: number) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-medium text-slate-800 text-sm">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3">Wiring Diagram</h3>
            <CircuitDiagram connections={build.result.wiringDiagram} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3">Verify before building</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              {build.result.notes?.map((n: string, i: number) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        </div>
      )}

      {build && !generating && build.category === 'software' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3">Recommended Tech Stack</h3>
            <div className="space-y-2">
              {build.result.techStack?.map((t: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded flex-shrink-0">{t.layer}</span>
                  <div>
                    <div className="font-medium text-sm text-slate-800">{t.choice}</div>
                    <div className="text-xs text-slate-500">{t.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Starter Folder Structure
            </h3>
            <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto">
              {build.result.folderStructure?.join('\n')}
            </pre>
          </div>

          <div className="bg-primary-50 rounded-xl border border-primary-100 p-5">
            <h3 className="font-bold text-primary-900 mb-1">First milestone</h3>
            <p className="text-sm text-primary-800">{build.result.firstMilestone}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3">Known gaps in this scaffold</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              {build.result.notes?.map((n: string, i: number) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        </div>
      )}

      {build && !generating && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Regenerate
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MvpBuilderPage;
