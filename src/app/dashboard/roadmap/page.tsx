import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CheckCircle, Circle, ArrowRight, Flag, Calendar, Cpu, Smartphone, Settings, Box, Truck } from 'lucide-react';

type RoadmapType = 'software' | 'hardware';

const RoadmapPage = () => {
  const [activeType, setActiveType] = useState<RoadmapType>('software');

  const softwarePhases = [
    {
      id: 1,
      title: "Phase 1: Validation & Discovery",
      status: "completed",
      items: [
        { title: "Define User Persona & Pain Points", done: true, desc: "Create 3 detailed user avatars." },
        { title: "Competitor Matrix Analysis", done: true, desc: "Analyze features/pricing of top 5 competitors." },
        { title: "Landing Page Pre-sales", done: true, desc: "Collect 50 emails before writing code." },
        { title: "Technical Feasibility Study", done: true, desc: "Confirm API availability and complexity." }
      ]
    },
    {
      id: 2,
      title: "Phase 2: UX/UI & Prototyping",
      status: "active",
      items: [
        { title: "User Flow Diagrams", done: true, desc: "Map out the happy path and edge cases." },
        { title: "Low-Fidelity Wireframes", done: true, desc: "Sketch layout without styling." },
        { title: "High-Fidelity Design (Figma)", done: false, desc: "Apply branding and interactions." },
        { title: "Clickable Prototype Testing", done: false, desc: "Validate flow with 5 real users." },
      ]
    },
    {
      id: 3,
      title: "Phase 3: Development (MVP)",
      status: "pending",
      items: [
        { title: "Database Schema Design", done: false, desc: "PostgreSQL/Firebase schema setup." },
        { title: "Authentication System", done: false, desc: "Login/Signup/Reset Password flows." },
        { title: "Core Feature API Development", done: false, desc: "Backend logic for main value prop." },
        { title: "Frontend Implementation", done: false, desc: "React/Next.js components integration." },
      ]
    },
    {
      id: 4,
      title: "Phase 4: Launch & Iterate",
      status: "pending",
      items: [
        { title: "Production Deployment (Vercel/AWS)", done: false, desc: "CI/CD pipelines and domain setup." },
        { title: "Analytics Integration", done: false, desc: "PostHog/Google Analytics setup." },
        { title: "Public Launch on ProductHunt", done: false, desc: "Prepare marketing assets and tagline." },
      ]
    }
  ];

  const hardwarePhases = [
    {
      id: 1,
      title: "Phase 1: Concept & Feasibility",
      status: "completed",
      items: [
        { title: "Industrial Design Sketches", done: true, desc: "Form factor exploration." },
        { title: "Bill of Materials (BOM) Estimation", done: true, desc: "Initial component cost analysis." },
        { title: "Component Sourcing Strategy", done: true, desc: "Identify key chipsets/sensors." },
      ]
    },
    {
      id: 2,
      title: "Phase 2: Proof of Concept (PoC)",
      status: "active",
      items: [
        { title: "Breadboard Electronics Prototype", done: true, desc: "Verify circuit logic." },
        { title: "3D Printed Enclosure", done: true, desc: "Fit check components." },
        { title: "Firmware Basics", done: false, desc: "Hello World and driver tests." },
        { title: "Works-Like Prototype Demo", done: false, desc: "Functional demo for investors." },
      ]
    },
    {
      id: 3,
      title: "Phase 3: EVT (Engineering Validation)",
      status: "pending",
      items: [
        { title: "Custom PCB Design (Altium/KiCad)", done: false, desc: "Schematic capture and layout." },
        { title: "Mechanical Engineering (CAD)", done: false, desc: "Injection molding ready designs." },
        { title: "Assemble 10-20 Units", done: false, desc: "Internal testing for functionality." },
        { title: "Thermal & Power Testing", done: false, desc: "Ensure safety and battery life." },
      ]
    },
    {
      id: 4,
      title: "Phase 4: DVT & PVT (Production Prep)",
      status: "pending",
      items: [
        { title: "Tooling & Mold Creation", done: false, desc: "Steel molds for mass production." },
        { title: "Regulatory Certification (FCC/CE)", done: false, desc: "Radio and safety compliance." },
        { title: "Pilot Run (100 units)", done: false, desc: "Validate assembly line process." },
        { title: "Packaging Design", done: false, desc: "Retail box and manuals." },
      ]
    }
  ];

  const phases = activeType === 'software' ? softwarePhases : hardwarePhases;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Roadmap</h1>
          <p className="text-slate-500 mt-1">Detailed step-by-step guide for your {activeType} product.</p>
        </div>
        
        <div className="bg-slate-100 p-1 rounded-lg flex items-center">
            <button 
                onClick={() => setActiveType('software')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeType === 'software' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Smartphone className="w-4 h-4" /> Software
            </button>
            <button 
                onClick={() => setActiveType('hardware')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeType === 'hardware' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Cpu className="w-4 h-4" /> Hardware
            </button>
        </div>
      </div>

      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.id} className={`bg-white rounded-xl border ${phase.status === 'active' ? 'border-primary-200 shadow-md ring-1 ring-primary-100' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all duration-300`}>
            <div className={`p-4 border-b flex flex-wrap justify-between items-center ${phase.status === 'active' ? 'bg-primary-50 border-primary-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    phase.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    phase.status === 'active' ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                    {phase.id}
                </div>
                <h3 className={`font-bold ${phase.status === 'active' ? 'text-primary-900' : 'text-slate-900'}`}>{phase.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 mt-2 sm:mt-0">
                <Calendar className="w-3 h-3" />
                <span>Est. 2-4 weeks</span>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-1">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                    {item.done ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-primary-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                        <span className={`block font-medium ${item.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{item.title}</span>
                        <span className="text-xs text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
            <Flag className="w-4 h-4" /> Update Roadmap Status
        </button>
      </div>
    </DashboardLayout>
  );
};

export default RoadmapPage;