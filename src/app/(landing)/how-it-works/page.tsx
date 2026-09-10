import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Lightbulb, Bot, Map, Rocket, ArrowRight } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: Lightbulb,
      title: "1. Describe Your Idea",
      desc: "Input your startup concept—whether it's an app, a SaaS platform, or a hardware gadget. Our system accepts both text and basic parameters."
    },
    {
      icon: Bot,
      title: "2. AI Analysis",
      desc: "Our trained Gemini AI analyzes your idea against market trends and technical feasibility, generating a viability score and risk assessment instantly."
    },
    {
      icon: Map,
      title: "3. Interactive Roadmap",
      desc: "Get a tailored step-by-step roadmap. For hardware, we include prototyping and manufacturing phases. For software, we focus on Agile MVP development."
    },
    {
      icon: Rocket,
      title: "4. Build & Track",
      desc: "Use the built-in Kanban board, file storage for assets, and chat with the AI advisor to solve blockers as you build."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
        {/* Navbar */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Anchor className="w-8 h-8 text-primary-600" />
            <span>YourFounderDock</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">How YourFounderDock Works</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We've simplified the complex journey of product development into four actionable stages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
             {/* Connecting Line (Desktop) */}
             <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10 transform scale-x-90"></div>

             {steps.map((step, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg relative group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto ring-8 ring-white">
                        <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-center text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-slate-600 text-center leading-relaxed">
                        {step.desc}
                    </p>
                </div>
             ))}
          </div>

          <div className="mt-20 bg-primary-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to bring your idea to life?</h2>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                Start Building Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorksPage;