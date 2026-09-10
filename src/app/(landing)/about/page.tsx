import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Linkedin, ArrowUpRight, BookOpen, MapPin, Phone, Instagram, Facebook } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-200/40 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <header className="fixed w-full bg-white/60 backdrop-blur-xl border-b border-white/20 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 group">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg group-hover:bg-primary-600 transition-colors">
                <Anchor className="w-5 h-5" />
            </div>
            <span className="tracking-tight">YourFounderDock</span>
          </Link>
          <div className="flex gap-4">
             <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors px-4 py-2 rounded-full hover:bg-white/50">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Left Side: Sticky Profile Info */}
          <div className="lg:w-[32%] w-full lg:sticky lg:top-32 flex flex-col gap-8 animate-fade-in-up">
            <div className="relative group mx-auto lg:mx-0 w-64 lg:w-full max-w-sm">
                {/* Glowing border effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-rose-400 via-violet-500 to-indigo-500 rounded-[2.5rem] opacity-60 blur-lg transition duration-500 group-hover:opacity-100"></div>
                
                {/* Image container */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl bg-white">
                    <img 
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" 
                        alt="Vetrivel" 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Floating Status Pill */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                             <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Online</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">Usually replies in 5m</span>
                    </div>
                </div>
            </div>

            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Vetrivel</h1>
                <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400 mb-6">
                    Founder • YourFounderDock
                </p>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                     <p className="text-slate-600 leading-relaxed font-medium">
                        "I intend to spread clarity like confetti 🎉. Passionate about helping young founders turn napkin sketches into shipped products."
                    </p>
                </div>

                 <div className="mt-6 flex justify-center lg:justify-start gap-3">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span>Puducherry, India</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Side: Bento Grid */}
          <div className="lg:w-[68%] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(180px,auto)]">
            
            {/* Book a Call - Large Card (Blue) */}
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="col-span-1 sm:col-span-2 row-span-2 bg-[#0055FF] rounded-[2.5rem] p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-500 flex flex-col justify-between min-h-[320px]">
                {/* Abstract shapes */}
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[60px] group-hover:bg-white/20 transition-colors"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-indigo-600/50 rounded-full blur-[40px]"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>

                <div className="relative z-10">
                    <h3 className="text-4xl font-bold mb-2 tracking-tight">Book a Call</h3>
                    <p className="text-blue-100 text-lg font-medium opacity-90">Let's build your MVP strategy together.</p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Available Today
                    </div>
                </div>
            </a>

            {/* Brand Card (Dark/Teal) */}
            <div className="col-span-1 sm:col-span-2 bg-[#1A1A1A] rounded-[2.5rem] p-8 relative overflow-hidden group text-center flex flex-col items-center justify-center min-h-[240px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-transparent opacity-50"></div>
                <div className="absolute -bottom-12 -right-12 text-slate-800 opacity-20 transform rotate-[-15deg]">
                    <Anchor className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                     <h2 className="text-4xl font-black text-white tracking-tighter mb-1">FOUNDER<span className="text-teal-400 font-light">DOCK</span></h2>
                     <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Design Meets Code</p>
                </div>
            </div>

            {/* LinkedIn (Corporate Blue) */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="col-span-1 bg-[#0A66C2] rounded-[2.5rem] p-6 text-white relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300 shadow-xl shadow-blue-500/20">
                <div className="flex justify-between items-start mb-16">
                    <Linkedin className="w-8 h-8" />
                    <ArrowUpRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">LinkedIn</h3>
                    <p className="text-xs text-blue-100/80 mt-1">Connect professionally</p>
                </div>
            </a>

            {/* Instagram (Gradient) */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="col-span-1 bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-orange-500 rounded-[2.5rem] p-6 text-white relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300 shadow-xl shadow-rose-500/20">
                <div className="flex justify-between items-start mb-16">
                    <Instagram className="w-8 h-8" />
                    <ArrowUpRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Instagram</h3>
                    <p className="text-xs text-rose-100/80 mt-1">Daily life & designs</p>
                </div>
            </a>

            {/* Mission Statement (Long Card) */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transform rotate-12 scale-150">
                    <Anchor className="w-64 h-64 text-slate-900" />
                </div>
                
                <div className="relative z-10 max-w-3xl">
                     <span className="text-7xl text-primary-200 font-serif leading-none absolute -top-4 -left-2 select-none">“</span>
                     <h3 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed pt-6">
                        Hey Founder, I built this tool because <span className="text-primary-600 font-bold">I want to help young founders like you</span>. 
                        I spent 2 years languishing, trying to build my MVP. Consultants wanted 
                        <span className="inline-block bg-slate-100 px-2 rounded mx-1 font-bold text-slate-900 border border-slate-200">$20k-$50k</span> 
                        just for guidance. So I built this to democratize innovation.
                     </h3>
                     
                     <div className="mt-8 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">V</div>
                        <div>
                            <p className="font-bold text-slate-900">Vetrivel</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Founder</p>
                        </div>
                     </div>
                </div>
            </div>

            {/* Current Read */}
            <div className="col-span-1 sm:col-span-2 bg-[#F2EFE9] rounded-[2.5rem] p-6 flex items-center gap-6 relative overflow-hidden group">
                 <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                 
                 <div className="w-24 h-32 bg-white shadow-xl rounded-lg flex items-center justify-center border-l-4 border-l-slate-200 flex-shrink-0 transform group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                    <div className="text-center">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Book</span>
                        <span className="font-serif font-bold text-slate-800 leading-tight">Zero<br/>to<br/>One</span>
                    </div>
                 </div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Reading Now</span>
                    </div>
                    <h3 className="font-bold text-2xl text-slate-900 mb-1">Zero to One</h3>
                    <p className="text-sm font-medium text-slate-500">Peter Thiel</p>
                    <div className="mt-3 h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[65%]"></div>
                    </div>
                 </div>
            </div>

            {/* Location Map */}
            <div className="col-span-1 sm:col-span-2 h-full min-h-[200px] bg-slate-100 rounded-[2.5rem] relative overflow-hidden group">
                 <img 
                    src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop" 
                    alt="Puducherry" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                    <div className="flex justify-between items-end w-full">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-5 h-5 text-rose-500 fill-rose-500" />
                                <span className="font-bold text-lg tracking-wide">Puducherry</span>
                            </div>
                            <p className="text-xs text-slate-300 font-mono">11.9416° N, 79.8083° E</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer text-white">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                 </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;