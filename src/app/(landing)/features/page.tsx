import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Layers, Cpu, MessageSquare, BarChart, FileText, Shield, Target } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: Target,
      title: "Market Validation System",
      desc: "Validate before you build. Run AI customer interviews, generate landing pages, create surveys, test assumptions, and analyze competitors automatically.",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Layers,
      title: "Hardware + Software Roadmaps",
      desc: "Unlike other tools that focus only on software, we provide specialized roadmaps for Hardware (EVT/DVT/PVT cycles) and Software (Agile/Scrum).",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Cpu,
      title: "AI Tech Advisor",
      desc: "Get AI recommendations for the best software tech stack (e.g., React vs Vue) or hardware components (e.g., ESP32 vs STM32) based on your requirements.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: MessageSquare,
      title: "24/7 AI FounderBot",
      desc: "A fine-tuned AI assistant that understands startup methodology. Ask it about market validation, user testing scripts, or debugging code.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: BarChart,
      title: "Progress Tracking",
      desc: "Visual Kanban boards and progress bars to keep you motivated. Track your MVP journey from idea → prototype → launch.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: FileText,
      title: "Document Management",
      desc: "Securely store your Pitch Decks, CAD files, PRDs, and financial models in one place associated with your project.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Shield,
      title: "Private & Secure",
      desc: "Your ideas are your intellectual property. We use enterprise-grade encryption and never share your data with third parties.",
      color: "bg-slate-100 text-slate-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to ship</h1>
                <p className="text-xl text-slate-600">Powerful features designed for modern founders.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;