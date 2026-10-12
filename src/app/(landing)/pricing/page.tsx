// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Anchor, Check, ArrowRight } from 'lucide-react';
// import LandingHeader from '../../../components/layout/LandingHeader';

// const PricingPage = () => {
//   const tiers = [
//     {
//       name: 'Starter',
//       price: '$0',
//       description: 'Perfect for validating your first idea.',
//       features: ['1 Project', 'Basic MVP Roadmap', 'Community Support', '5 AI Chat Credits'],
//       cta: 'Start for Free',
//       highlight: false
//     },
//     {
//       name: 'Pro',
//       price: '$29',
//       period: '/month',
//       description: 'For founders serious about shipping.',
//       features: ['Unlimited Projects', 'Detailed Hardware/Software Roadmaps', 'Priority Support', 'Unlimited AI Chat', 'File Storage (10GB)', 'Stripe Integration Guide'],
//       cta: 'Get Started',
//       highlight: true
//     },
//     {
//       name: 'Agency',
//       price: '$99',
//       period: '/month',
//       description: 'Manage multiple startups or clients.',
//       features: ['Everything in Pro', 'Team Collaboration', 'White-label Reports', 'Dedicated Success Manager', 'API Access'],
//       cta: 'Contact Sales',
//       highlight: false
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <LandingHeader />

//       <div className="pt-32 pb-20 px-4">
//         <div className="max-w-7xl mx-auto text-center mb-16">
//           <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
//           <p className="text-xl text-slate-600 max-w-2xl mx-auto">
//             Choose the plan that fits your stage of growth. No hidden fees. Cancel anytime.
//           </p>
//         </div>

//         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
//           {tiers.map((tier) => (
//             <div key={tier.name} className={`relative bg-white rounded-2xl p-8 ${tier.highlight ? 'border-2 border-primary-600 shadow-xl' : 'border border-slate-200 shadow-sm'}`}>
//               {tier.highlight && (
//                 <div className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase rounded-full">
//                   Most Popular
//                 </div>
//               )}
//               <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
//               <p className="text-slate-500 mt-2 text-sm h-10">{tier.description}</p>
//               <div className="mt-6 flex items-baseline">
//                 <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
//                 {tier.period && <span className="text-slate-500 ml-1">{tier.period}</span>}
//               </div>

//               <ul className="mt-8 space-y-4">
//                 {tier.features.map((feature) => (
//                   <li key={feature} className="flex items-start">
//                     <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
//                     <span className="text-slate-600 text-sm">{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               <Link to="/signup" className={`mt-8 w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center transition-colors ${tier.highlight ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
//                 {tier.cta} <ArrowRight className="w-4 h-4 ml-2" />
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import LandingHeader from '../../../components/layout/LandingHeader';

const PricingPage = () => {
  const freeFeatures = [
    'Idea validation and AI analysis',
    'Lean Canvas, Vision Board and Team Canvas',
    'Roadmaps for software and hardware MVPs',
    'MVP Builder and Go-To-Market strategy',
    'DockMind AI assistant',
    '15 AI requests per day, resetting at midnight IST',
  ];

  const proFeatures = [
    'Higher daily AI limits',
    'Priority support',
    'Early access to new features',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-3 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Free during beta
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 mb-4">
            Pricing is coming soon
          </h1>
          <p className="text-lg text-slate-600">
            YourFounderDock is free to use while we're in beta. Paid plans will be announced later,
            and we'll tell early users before anything changes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Free plan, available now */}
          <div className="relative bg-white rounded-2xl p-8 border-2 border-primary-600 shadow-xl shadow-primary-100">
            <span className="absolute -top-3 right-6 px-3 py-1 bg-primary-600 text-white text-[11px] font-bold uppercase rounded-full">
              Available now
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900">Free</h3>
            <p className="text-slate-500 mt-1 text-sm">Everything you need to validate and plan your MVP.</p>
            <p className="mt-6 text-4xl font-extrabold font-display text-slate-900">Free</p>
            <p className="text-sm text-slate-400 mt-1">during beta</p>

            <ul className="mt-8 space-y-3.5">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className="mt-8 w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Start for Free <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Pro plan, coming soon */}
          <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <span className="absolute -top-3 right-6 px-3 py-1 bg-slate-800 text-white text-[11px] font-bold uppercase rounded-full">
              Coming soon
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900">Pro</h3>
            <p className="text-slate-500 mt-1 text-sm">For founders who want more room to build.</p>
            <p className="mt-6 text-4xl font-extrabold font-display text-slate-300">Soon</p>
            <p className="text-sm text-slate-400 mt-1">Pricing to be announced</p>

            <ul className="mt-8 space-y-3.5">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-slate-300 mr-2 flex-shrink-0" />
                  <span className="text-slate-500 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="mt-8 w-full py-3 px-4 rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              Coming soon
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          Questions about pricing? We'd love to hear what you'd want from a paid plan.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
