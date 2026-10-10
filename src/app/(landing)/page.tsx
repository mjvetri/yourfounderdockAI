import React from 'react';
import { ArrowRight, Check, Circle, MessageSquareText, Play, Rocket, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingHeader from '../../components/layout/LandingHeader';
import BrandLogo from '../../components/ui/BrandLogo';

const floatingIdeas = [
  { icon: Sparkles, label: 'Idea Canvas', detail: 'Turn ideas into clear plans', accent: 'from-[#f9d98a] to-[#f8d8f6]' },
  { icon: TrendingUp, label: 'Validation', detail: 'Check market fit with real data', accent: 'from-[#d7dfff] to-[#d3f9e1]' },
  { icon: Users, label: 'Co-Founder Workspace', detail: 'Plan and build together', accent: 'from-[#d5dbff] to-[#dff6ff]' },
  { icon: Rocket, label: 'Go-To-Market', detail: 'Launch with proven strategies', accent: 'from-[#d0e8ff] to-[#f5d6ff]' },
  { icon: MessageSquareText, label: 'Templates', detail: 'Use ready-to-use templates', accent: 'from-[#ffd1d4] to-[#d8e6ff]' },
  { icon: TrendingUp, label: 'MVP Builder', detail: 'Plan, design and build faster', accent: 'from-[#f7debf] to-[#d1e8ff]' },
];

const logos = ['Google', 'Microsoft', 'aws', 'Notion', 'Figma', 'Vercel', 'GitHub', 'Discord'];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <LandingHeader />

      <main className="relative overflow-hidden pb-20 pt-28">
        <div className="absolute inset-x-0 top-0 h-[880px] bg-[radial-gradient(circle_at_50%_0%,rgba(194,197,255,0.22),transparent_40%)]" />
        <div className="absolute left-1/2 top-20 h-[760px] w-[760px] -translate-x-1/2 rounded-full border border-[#dde5ff]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="relative flex flex-col items-center pt-10 text-center">
            <div className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-[#dfe6ff] bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 shadow-sm sm:px-4 sm:text-xs sm:tracking-[0.2em]">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#f7c76d] shadow-[0_0_12px_rgba(247,199,109,0.9)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fff4d6]" />
              </span>
              Your all-in-one founder OS
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(2.125rem,9.8vw,3rem)] font-black tracking-[-0.07em] text-slate-900 md:text-7xl">
              <span className="block">From Idea to MVP.</span>
              <span className="block bg-gradient-to-r from-[#f8bf54] via-[#e785d7] to-[#5d7ef7] bg-clip-text text-transparent">All in One Place.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
              Plan, validate, build and launch your startup MVP with AI guidance, powerful tools and templates.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Link to="/signup" className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#0d1321] px-7 py-4 text-base font-semibold text-white shadow-[0_15px_30px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5 sm:w-auto">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto">
                <Play className="h-4 w-4 text-slate-500" />
                Watch Demo
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f4be6f]" /> Free to start</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f4be6f]" /> No credit card required</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f4be6f]" /> Built for real founders</div>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl pb-8">
            <div className="pointer-events-none absolute -left-24 top-16 hidden w-44 lg:block">
              <div className="rounded-[28px] border border-[#e7ebfb] bg-white/80 p-4 shadow-[0_20px_50px_rgba(145,160,194,0.18)] backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4d86d] text-[#fffef8] shadow-[0_12px_24px_rgba(244,194,109,0.4)]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f3b94b] bg-[#f2d27d]" />
                </div>
                <div className="text-left text-[13px] font-semibold text-slate-700">Idea Canvas</div>
                <div className="mt-1 text-left text-[11px] text-slate-500">Turn ideas into clear plans</div>
              </div>
            </div>

            <div className="pointer-events-none absolute -left-10 top-52 hidden w-44 lg:block">
              <div className="rounded-[28px] border border-[#e7ebfb] bg-white/80 p-4 shadow-[0_20px_50px_rgba(145,160,194,0.18)] backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9dfff] text-[#3d5ef2]">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f3b94b] bg-[#f2d27d]" />
                </div>
                <div className="text-left text-[13px] font-semibold text-slate-700">Validation</div>
                <div className="mt-1 text-left text-[11px] text-slate-500">Check market fit with real data</div>
              </div>
            </div>

            <div className="pointer-events-none absolute left-[-2rem] bottom-10 hidden w-44 lg:block">
              <div className="rounded-[28px] border border-[#e7ebfb] bg-white/80 p-4 shadow-[0_20px_50px_rgba(145,160,194,0.18)] backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4dcff] text-[#3266ff]">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f3b94b] bg-[#f2d27d]" />
                </div>
                <div className="text-left text-[13px] font-semibold text-slate-700">Co-Founder Workspace</div>
                <div className="mt-1 text-left text-[11px] text-slate-500">Plan and build together</div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-4 top-16 hidden w-44 lg:block">
              <div className="rounded-[28px] border border-[#e7ebfb] bg-white/80 p-4 shadow-[0_20px_50px_rgba(145,160,194,0.18)] backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d5e8ff] text-[#3a66ff]">
                    <Rocket className="h-4 w-4" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f3b94b] bg-[#f2d27d]" />
                </div>
                <div className="text-left text-[13px] font-semibold text-slate-700">MVP Builder</div>
                <div className="mt-1 text-left text-[11px] text-slate-500">Plan, design and build faster</div>
              </div>
            </div>

            <div className="pointer-events-none absolute right-[-0.5rem] top-52 hidden w-44 lg:block">
              <div className="rounded-[28px] border border-[#e7ebfb] bg-white/80 p-4 shadow-[0_20px_50px_rgba(145,160,194,0.18)] backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dccdff] text-[#5657d9]">
                    <Rocket className="h-4 w-4" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f3b94b] bg-[#f2d27d]" />
                </div>
                <div className="text-left text-[13px] font-semibold text-slate-700">Go-To-Market</div>
                <div className="mt-1 text-left text-[11px] text-slate-500">Launch with proven strategies</div>
              </div>
            </div>

            <div className="pointer-events-none absolute right-[-1rem] bottom-10 hidden w-44 lg:block">
              <div className="rounded-[28px] border border-[#e7ebfb] bg-white/80 p-4 shadow-[0_20px_50px_rgba(145,160,194,0.18)] backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd7d5] text-[#ff5f73]">
                    <MessageSquareText className="h-4 w-4" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f3b94b] bg-[#f2d27d]" />
                </div>
                <div className="text-left text-[13px] font-semibold text-slate-700">Templates</div>
                <div className="mt-1 text-left text-[11px] text-slate-500">Use ready-to-use templates</div>
              </div>
            </div>

            <div className="rounded-[36px] border border-slate-200 bg-white/75 p-4 shadow-[0_40px_90px_rgba(126,147,188,0.12)] backdrop-blur-md">
              <div className="rounded-[30px] bg-[#f6f7fb] p-4 shadow-inner">
                <div className="flex min-w-0 items-center justify-between gap-2 rounded-[22px] bg-white px-3 py-3 shadow-sm sm:px-4">
                  <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f8d96f] via-[#ffb967] to-[#f7af7a] shadow-[0_10px_30px_rgba(245,171,99,0.35)]">
                      <BrandLogo className="h-full w-full mix-blend-multiply" />
                    </div>
                      <div className="whitespace-nowrap text-sm font-semibold text-slate-700 sm:text-base">YourFounderDock</div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="hidden h-9 w-28 shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 text-left text-sm leading-9 text-slate-400 sm:block">Search...</div>
                      <div className="hidden h-9 w-9 shrink-0 rounded-full bg-[#ecf0ff] text-slate-700 sm:block" />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 rounded-[22px] bg-[#f7f8ff] p-4 md:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-800">Your Progress</div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f6ff] text-[#4d5ef4] font-bold">68%</div>
                    </div>

                    <div className="mt-3 grid gap-3">
                      {['Idea defined', 'Market validated', 'MVP in progress', 'Go-to-market plan', 'Launch'].map((item, index) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${index < 3 ? 'bg-[#d8f5e6] text-[#2cb67d]' : 'bg-[#f4f5fa] text-slate-400'}`}>
                            <Check className="h-3 w-3" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-800">AI Co-Founder</div>
                      <div className="rounded-full border border-slate-200 p-1 text-slate-400">×</div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl bg-[#f3f8ff] p-3 text-sm text-slate-700">
                        Ask, plan, validate or get suggestions at any step of your journey.
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">How do I validate my startup idea?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="pb-16 pt-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
            Trusted by founders, builders and student innovators
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <div key={logo} className="text-2xl font-black tracking-[-0.05em] text-slate-400 opacity-90">
                {logo === 'aws' ? 'aws' : logo}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
