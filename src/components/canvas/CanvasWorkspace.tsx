import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Sparkles, Loader2, Plus, Save, CheckCircle2, HelpCircle, AlertTriangle, ListChecks, Trash2, ArrowLeft } from 'lucide-react';
import { createCanvas, updateCanvasData, listCanvases, analyzeCanvas, deleteCanvas } from '../../lib/api';

export interface CanvasSection {
  key: string;
  label: string;
  placeholder: string;
  span?: 1 | 2;
}

interface Props {
  canvasType: 'lean' | 'vision' | 'team';
  pageTitle: string;
  pageDescription: string;
  sections: CanvasSection[];
}

function normalizeCanvasData(value: any): Record<string, string> {
  if (!value) return {};

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return normalizeCanvasData(parsed);
    } catch {
      return {};
    }
  }

  if (Array.isArray(value)) {
    return value.reduce((acc, item) => {
      if (item && typeof item === 'object') {
        return { ...acc, ...normalizeCanvasData(item) };
      }
      return acc;
    }, {} as Record<string, string>);
  }

  if (typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = typeof val === 'string' ? val : val == null ? '' : String(val);
      return acc;
    }, {} as Record<string, string>);
  }

  return {};
}

export default function CanvasWorkspace({ canvasType, pageTitle, pageDescription, sections }: Props) {
  const navigate = useNavigate();
  const [canvases, setCanvases] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await listCanvases(canvasType);
      const normalized = data || [];
      setCanvases(normalized);
      setActiveId(null);
      setActiveTitle('');
      setFormData({});
      setAnalysis(null);
    } catch (e: any) {
      setError(e.message || 'Unable to load canvases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [canvasType]);

  const selectCanvas = (canvas: any) => {
    setActiveId(canvas.id);
    setActiveTitle(canvas.title || `Untitled ${pageTitle}`);
    setFormData(normalizeCanvasData(canvas.data || {}));
    setAnalysis(canvas.analysis || null);
  };

  const startNew = async () => {
    try {
      const canvas = await createCanvas(canvasType, `Untitled ${pageTitle}`, {});
      setCanvases((prev) => [canvas, ...prev]);
      selectCanvas(canvas);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Unable to create canvas.');
    }
  };

  const getCanvasPreview = (canvas: any) => {
    const entries = Object.values(normalizeCanvasData(canvas?.data || {})).filter(Boolean);
    if (!entries.length) return 'No content yet — click to start filling this canvas.';
    const first = entries[0]?.slice(0, 90) || '';
    return first.length >= 90 ? `${first}...` : first;
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!activeId) return;
    setSaving(true);
    try {
      const titleToSave = activeTitle.trim() || `Untitled ${pageTitle}`;
      await updateCanvasData(activeId, formData, titleToSave);
      setCanvases((prev) => prev.map((canvas) => canvas.id === activeId ? { ...canvas, title: titleToSave, data: formData, updated_at: new Date().toISOString() } : canvas));
      setActiveTitle(titleToSave);
    } catch (e: any) {
      setError(e.message || 'Unable to save canvas.');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!activeId) return;
    await handleSave();
    setAnalyzing(true);
    setError('');
    try {
      const result = await analyzeCanvas(activeId, canvasType, formData);
      setAnalysis(result);
      setCanvases((prev) => prev.map((canvas) => canvas.id === activeId ? { ...canvas, analysis: result } : canvas));
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteCanvas(id);
      const remaining = canvases.filter((canvas) => canvas.id !== id);
      setCanvases(remaining);
      if (activeId === id) {
        if (remaining.length) selectCanvas(remaining[0]);
        else { setActiveId(null); setFormData({}); setAnalysis(null); }
      }
    } catch (e: any) {
      setError(e.message || 'Unable to delete canvas.');
    }
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => {
              if (activeId) {
                setActiveId(null);
                setActiveTitle('');
                setFormData({});
                setAnalysis(null);
                return;
              }
              navigate('/dashboard');
            }}
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 mb-2">Strategy workspace</p>
            <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
            <p className="text-slate-500 mt-1 max-w-2xl">{pageDescription}</p>
          </div>
        </div>
        <button type="button" onClick={startNew} className="self-start flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 shadow-sm">
          <Plus className="w-4 h-4" /> New {pageTitle}
        </button>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">{error}</div>}

      {!activeId ? (
        canvases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {canvases.map((canvas) => (
              <button
                key={canvas.id}
                type="button"
                onClick={() => selectCanvas(canvas)}
                className="group text-left rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <span className="text-lg font-bold">✦</span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => handleDelete(canvas.id, event)}
                    aria-label={`Delete ${canvas.title || pageTitle}`}
                    className="rounded-md p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
                  {canvas.title || `Untitled ${pageTitle}`}
                </h3>
                <p className="text-sm text-slate-500 min-h-[44px]">{getCanvasPreview(canvas)}</p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-400">Draft</span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                    Open
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-dashed border-slate-300 rounded-xl">
            <p className="text-slate-500 mb-4">No {pageTitle.toLowerCase()} yet.</p>
            <button type="button" onClick={startNew} className="text-primary-600 font-medium hover:underline">Create your first one</button>
          </div>
        )
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-1.5">Canvas title</label>
            <input
              type="text"
              value={activeTitle}
              onChange={(event) => setActiveTitle(event.target.value)}
              onBlur={handleSave}
              className="w-full max-w-lg px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={`Untitled ${pageTitle}`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {sections.map((section) => (
              <div key={section.key} className={section.span === 2 ? 'lg:col-span-2' : ''}>
                <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor={`canvas-${section.key}`}>{section.label}</label>
                <textarea
                  id={`canvas-${section.key}`}
                  value={formData[section.key] || ''}
                  onChange={(event) => handleFieldChange(section.key, event.target.value)}
                  onBlur={handleSave}
                  placeholder={section.placeholder}
                  rows={4}
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {activeId && (
        <div className="flex gap-3 mb-8">
          <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
          <button type="button" onClick={handleAnalyze} disabled={analyzing} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-5">
            <p className="text-sm font-medium">{analysis.summary}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalysisColumn title="Validated" icon={<CheckCircle2 className="w-4 h-4" />} tone="green" items={analysis.validated} empty="Nothing confirmed yet." />
            <AnalysisColumn title="Uncertain" icon={<HelpCircle className="w-4 h-4" />} tone="amber" items={analysis.uncertain} empty="Nothing uncertain was flagged." />
            <AnalysisColumn title="Risky" icon={<AlertTriangle className="w-4 h-4" />} tone="red" items={analysis.risky} empty="No major risks were flagged." />
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-primary-900 text-sm mb-3"><ListChecks className="w-4 h-4" /> What to test next</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-primary-800">
              {(analysis.nextSteps || []).map((step: string, index: number) => <li key={index}>{step}</li>)}
            </ol>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function AnalysisColumn({ title, icon, tone, items, empty }: { title: string; icon: React.ReactNode; tone: 'green' | 'amber' | 'red'; items?: Array<{ point: string; why: string }>; empty: string }) {
  const styles = { green: 'bg-green-50 border-green-100 text-green-800', amber: 'bg-amber-50 border-amber-100 text-amber-800', red: 'bg-red-50 border-red-100 text-red-800' }[tone];
  const body = { green: 'text-green-900', amber: 'text-amber-900', red: 'text-red-900' }[tone];
  const detail = { green: 'text-green-700', amber: 'text-amber-700', red: 'text-red-700' }[tone];
  return <div className={`${styles} border rounded-xl p-4`}><h4 className="flex items-center gap-2 font-bold text-sm mb-3">{icon}{title}</h4><div className="space-y-3">{(items || []).map((item, index) => <div key={index} className="text-sm"><p className={`font-medium ${body}`}>{item.point}</p><p className={`text-xs mt-0.5 ${detail}`}>{item.why}</p></div>)}{(!items || items.length === 0) && <p className="text-xs opacity-80">{empty}</p>}</div></div>;
}
