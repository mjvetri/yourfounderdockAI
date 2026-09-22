import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Lightbulb, Target, Code2, AlertTriangle, ArrowRight, Save, Loader2 } from 'lucide-react';
import { createIdea, generateMVPAdvice, saveRoadmapNextSteps } from '../../../lib/api';

const IdeaUploadPage = () => {
  const [step, setStep] = useState(1);
  const [ideaText, setIdeaText] = useState('');
  const [ideaCategory, setIdeaCategory] = useState<'software' | 'hardware'>('software');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [savedIdea, setSavedIdea] = useState<any>(null);
  const [savingRoadmap, setSavingRoadmap] = useState(false);
  const [roadmapSaved, setRoadmapSaved] = useState(false);
  const [error, setError] = useState('');

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const title = ideaText.split(/[.!?\n]/)[0].trim().slice(0, 80) || 'Untitled startup idea';
      const idea = await createIdea(title, ideaText.trim(), ideaCategory);
      const result = await generateMVPAdvice(ideaText.trim(), idea.id);
      setSavedIdea(idea);
      setAnalysisResult(result);
      setRoadmapSaved(false);
      setStep(3); // Go to results
    } catch (error) {
      console.error("Failed to analyze", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToRoadmap = async () => {
    if (!analysisResult || !savedIdea) return;

    const rawSteps = Array.isArray(analysisResult.nextSteps)
      ? analysisResult.nextSteps
      : analysisResult.nextSteps
        ? [analysisResult.nextSteps]
        : [];
    const tasks = rawSteps.map((step: any) => ({
      title: String(step),
      desc: '',
      done: false,
    }));

    if (tasks.length === 0) {
      setRoadmapSaved(true);
      return;
    }

    setSavingRoadmap(true);
    try {
      await saveRoadmapNextSteps(savedIdea.id, tasks);
      setRoadmapSaved(true);
    } catch (e: any) {
      setError(e.message || 'Could not save to roadmap.');
    } finally {
      setSavingRoadmap(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-primary-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">What are you building?</h2>
              <p className="text-slate-500 mt-2">Describe your startup idea in detail. Whether it's a mobile app, SaaS, or hardware device.</p>
            </div>

            <textarea
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none mb-6"
              placeholder="e.g., A smart coffee mug that keeps temperature stable (Hardware) OR An AI CRM for dentists (Software)..."
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
            ></textarea>

            <div className="mb-6 text-left">
              <label htmlFor="idea-category" className="mb-2 block text-sm font-semibold text-slate-700">
                Product category
              </label>
              <select
                id="idea-category"
                value={ideaCategory}
                onChange={(e) => setIdeaCategory(e.target.value as 'software' | 'hardware')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="software">Software / SaaS</option>
                <option value="hardware">Hardware / Physical product</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={ideaText.length < 10}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Confirm Analysis</h2>
            <p className="text-slate-600 mb-8">
              We are about to send your idea to our AI engine to generate a technical roadmap, risk assessment, and MVP feature list suitable for your product type.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-lg text-left mb-8 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Idea</h4>
              <p className="text-slate-800">{ideaText}</p>
            </div>

            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Code2 className="w-5 h-5" /> Generate MVP Plan
                </>
              )}
            </button>
          </div>
        )}

        {step === 3 && analysisResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`text-4xl font-bold ${analysisResult.verdict > 7 ? 'text-green-500' : 'text-orange-500'}`}>
                  {analysisResult.verdict}/10
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Viability Score</h2>
                  <p className="text-slate-500 text-sm">Based on market density and technical complexity</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-3 text-primary-700 font-bold">
                        <Code2 className="w-5 h-5" /> Recommended Stack/Components
                    </div>
                    <p className="text-sm text-slate-700">{analysisResult.techStack}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-bold">
                        <AlertTriangle className="w-5 h-5" /> Key Risks
                    </div>
                    <p className="text-sm text-slate-700">{analysisResult.risks}</p>
                </div>
              </div>

              <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary-600" /> Immediate Next Steps
                  </h3>
                  <div className="space-y-3">
                      {/* Assuming nextSteps is an array or string, handling simply here */}
                      <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                          {Array.isArray(analysisResult.nextSteps) 
                            ? analysisResult.nextSteps.map((s: any, i: number) => <div key={i} className="mb-2 border-b last:border-0 pb-2 last:pb-0 border-slate-100">Step {i+1}: {s}</div>) 
                            : analysisResult.nextSteps}
                      </div>
                  </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveToRoadmap}
              disabled={savingRoadmap || roadmapSaved}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
                {savingRoadmap ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {savingRoadmap ? 'Saving...' : roadmapSaved ? 'Saved to Roadmap' : 'Save to Roadmap'}
            </button>
            {roadmapSaved && (
              <p className="text-center text-sm text-green-700">Your immediate next steps are now available on the Roadmap page.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdeaUploadPage;