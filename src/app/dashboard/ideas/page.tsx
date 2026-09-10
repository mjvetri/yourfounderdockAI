import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Plus, Lightbulb, MoreHorizontal, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const IdeasPage = () => {
  const ideas = [
    {
      id: 1,
      title: "PetWalker CRM",
      description: "A SaaS platform for dog walkers to manage schedules, payments, and GPS tracking.",
      status: "Validating",
      score: 8.5,
      date: "2 days ago",
      tags: ["SaaS", "B2C"]
    },
    {
      id: 2,
      title: "AI Code Reviewer",
      description: "Chrome extension that uses Gemini to review PRs on GitHub automatically.",
      status: "Building",
      score: 9.2,
      date: "1 week ago",
      tags: ["DevTools", "AI"]
    },
    {
      id: 3,
      title: "Smart Plant Pot",
      description: "Hardware IoT device that auto-waters plants based on soil moisture sensors.",
      status: "Draft",
      score: 6.0,
      date: "1 month ago",
      tags: ["Hardware", "IoT"]
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Ideas</h1>
          <p className="text-slate-500 mt-1">Manage and track your startup concepts.</p>
        </div>
        <Link to="/dashboard/idea-upload" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
          <Plus className="w-5 h-5" />
          New Idea
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${idea.score > 8 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{idea.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{idea.description}</p>
                    
                    <div className="flex gap-2 flex-wrap mb-4">
                        {idea.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            idea.status === 'Building' ? 'bg-indigo-500' : 
                            idea.status === 'Validating' ? 'bg-yellow-500' : 'bg-slate-400'
                        }`}></span>
                        <span className="text-xs font-medium text-slate-600">{idea.status}</span>
                    </div>
                    <Link to={`/dashboard/roadmap`} className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        View Roadmap <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        ))}

        {/* New Idea Placeholder Card */}
        <Link to="/dashboard/idea-upload" className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all cursor-pointer group h-full min-h-[300px]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary-600" />
            </div>
            <h3 className="font-bold text-slate-700 group-hover:text-primary-700">Add New Idea</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-[200px]">Validate a new concept with our AI engine.</p>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default IdeasPage;