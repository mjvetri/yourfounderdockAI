
import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Target, Users, FileText, Loader2, Check, Copy, AlertCircle } from 'lucide-react';
import { generateMarketValidation } from '../../../lib/api';

type TabType = 'competitors' | 'interviews' | 'surveys';

const ValidationPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('competitors');
  const [ideaContext, setIdeaContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
    const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!ideaContext.trim()) return;
    setIsLoading(true);
    setResults(null);
        setError('');
    try {
            const result = await generateMarketValidation(activeTab, ideaContext);
            setResults(result);
        } catch (error: any) {
            console.error(error);
            setError(error?.message || 'Could not generate validation results.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'competitors', label: 'Competitor Analysis', icon: Target, desc: 'Find gaps in the market and analyze rivals.' },
    { id: 'interviews', label: 'Customer Interviews', icon: Users, desc: 'Generate scripts to talk to potential users.' },
    { id: 'surveys', label: 'Survey Builder', icon: FileText, desc: 'Create questions to validate assumptions at scale.' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-primary-600" />
            Market Validation System
        </h1>
        <p className="text-slate-500 mt-1">Test your idea before writing a single line of code.</p>
      </div>

            {error && (
                <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as TabType); setResults(null); }}
                        className={`w-full text-left p-4 flex items-start gap-3 transition-colors border-b border-slate-100 last:border-0 ${
                            activeTab === tab.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                        }`}
                    >
                        <div className={`mt-1 ${activeTab === tab.id ? 'text-primary-600' : 'text-slate-400'}`}>
                            <tab.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-700'}`}>{tab.label}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{tab.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <label className="block text-sm font-bold text-slate-900 mb-2">What are you validating?</label>
                <textarea 
                    value={ideaContext}
                    onChange={(e) => setIdeaContext(e.target.value)}
                    placeholder="e.g., A subscription service for organic dog food delivering to urban apartments..."
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none text-sm mb-4"
                ></textarea>
                <button 
                    onClick={handleGenerate}
                    disabled={isLoading || !ideaContext.trim()}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                    {isLoading ? 'Analyzing...' : `Generate ${tabs.find(t => t.id === activeTab)?.label.split(' ')[0]}`}
                </button>
            </div>
        </div>

        {/* Right Content: Results */}
        <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[600px] p-8">
                {!results && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Target className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Ready to validate</h3>
                        <p className="max-w-sm mt-2">Select a tool from the left, describe your idea, and let AI build your validation strategy.</p>
                    </div>
                )}

                {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                        <p className="text-slate-600 font-medium">Consulting market data...</p>
                    </div>
                )}

                {results && activeTab === 'competitors' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Competitor Landscape</h2>
                            <p className="text-slate-600">{results.marketGap}</p>
                        </div>
                        <div className="grid gap-4">
                            {results.competitors.map((comp: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-800">{comp.name}</h3>
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">Competitor</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Their Strength</span>
                                            <p className="text-sm text-slate-700">{comp.strength}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Their Weakness</span>
                                            <p className="text-sm text-slate-700">{comp.weakness}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <Users className="w-5 h-5" /> Strategy to Win
                            </h3>
                            <p className="text-blue-800 text-sm leading-relaxed">{results.differentiationStrategy}</p>
                        </div>
                    </div>
                )}

                {results && activeTab === 'interviews' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">User Interview Guide</h2>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Persona</span>
                                <p className="text-slate-800 font-medium mt-1">{results.targetPersona}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                                    Warm Up
                                </h3>
                                <ul className="space-y-2">
                                    {results.warmUpQuestions.map((q: string, i: number) => (
                                        <li key={i} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-700">{q}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                                    Problem Validation
                                </h3>
                                <ul className="space-y-2">
                                    {results.problemValidationQuestions.map((q: string, i: number) => (
                                        <li key={i} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-700">{q}</li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
                                    Solution Fit
                                </h3>
                                <ul className="space-y-2">
                                    {results.solutionQuestions.map((q: string, i: number) => (
                                        <li key={i} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-700">{q}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {results && activeTab === 'surveys' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                         <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Survey Builder</h2>
                                <p className="text-slate-500">Ready-to-use questions for Google Forms or Typeform.</p>
                            </div>
                            <button className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                <Copy className="w-4 h-4" /> Copy All
                            </button>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center border-b border-slate-200 pb-4">{results.surveyTitle}</h3>
                            <div className="space-y-6">
                                {results.questions.map((q: any, i: number) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                        <p className="font-medium text-slate-900 mb-3">{i + 1}. {q.question}</p>
                                        {q.type === 'multiple-choice' && (
                                            <div className="space-y-2 pl-2">
                                                {q.options?.map((opt: string, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 text-slate-500 text-sm">
                                                        <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {q.type === 'text' && (
                                            <div className="h-8 bg-slate-50 border-b border-slate-300 w-2/3"></div>
                                        )}
                                        {q.type === 'rating' && (
                                            <div className="flex gap-2">
                                                {[1,2,3,4,5].map(n => (
                                                    <div key={n} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 text-sm">{n}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ValidationPage;
