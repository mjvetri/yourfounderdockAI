import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Rocket, Anchor, Cpu, Users, Layers, Wrench, PlayCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Anchor className="w-8 h-8 text-primary-600" />
            <span>YourFounderDock</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/features" className="text-slate-600 hover:text-primary-600 font-medium">Features</Link>
            <Link to="/how-it-works" className="text-slate-600 hover:text-primary-600 font-medium">How It Works</Link>
            <Link to="/pricing" className="text-slate-600 hover:text-primary-600 font-medium">Pricing</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium">About Founder</Link>
          </nav>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Now supporting Hardware & Software MVPs
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            Your Dock for Building <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">World-Class Products</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Whether you're coding an app or prototyping a device, YourFounderDock provides the structured roadmaps, blueprints, and AI guidance to get from zero to one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup" className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-transform hover:-translate-y-1 flex items-center gap-2 justify-center shadow-lg shadow-primary-500/20">
              Launch Your Product <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/how-it-works" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-slate-400" /> See How It Works
            </Link>
          </div>
        </div>
        
        <div className="mt-16 max-w-6xl mx-auto rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-slate-900 relative">
           <div className="p-4 bg-slate-800 flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden group">
             {/* Updated Image: Futuristic Hardware/Product Design Clean Look */}
             <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2601&auto=format&fit=crop" 
                alt="Hardware and Software Product Development" 
                className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end justify-center pb-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-2xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-bold">From Idea to Prototype</span>
                    </div>
                    <p className="text-slate-200 text-sm">
                        "YourFounderDock bridged the gap between our hardware constraints and our software requirements. It's like having a CTO in your pocket."
                    </p>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">From Sketch to Scale</h2>
            <p className="text-slate-600 mt-4">A complete ecosystem for product builders.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Layers, title: "Dual Roadmaps", desc: "Specialized workflows for Software (Agile) and Hardware (Waterfall/Manufacturing)." },
              { icon: Cpu, title: "Tech & Supply Chain", desc: "AI recommendations for tech stacks and component sourcing strategies." },
              { icon: Wrench, title: "Builder Tools", desc: "Integrated file storage for CAD files, code snippets, and PRDs." },
              { icon: Users, title: "Expert Guidance", desc: "AI chatbot trained on lean startup and manufacturing methodologies." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
             <Link to="/features" className="text-primary-600 font-bold hover:text-primary-700 flex items-center justify-center gap-2">
                View All Features <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Anchor className="w-6 h-6 text-primary-600" />
            <span>YourFounderDock</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 YourFounderDock Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-slate-500 hover:text-primary-600 text-sm">About Founder</Link>
            <Link to="/terms" className="text-slate-500 hover:text-primary-600 text-sm">Terms</Link>
            <Link to="/privacy" className="text-slate-500 hover:text-primary-600 text-sm">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;