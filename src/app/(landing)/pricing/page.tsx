import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Check, ArrowRight } from 'lucide-react';

const PricingPage = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for validating your first idea.',
      features: ['1 Project', 'Basic MVP Roadmap', 'Community Support', '5 AI Chat Credits'],
      cta: 'Start for Free',
      highlight: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For founders serious about shipping.',
      features: ['Unlimited Projects', 'Detailed Hardware/Software Roadmaps', 'Priority Support', 'Unlimited AI Chat', 'File Storage (10GB)', 'Stripe Integration Guide'],
      cta: 'Get Started',
      highlight: true
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/month',
      description: 'Manage multiple startups or clients.',
      features: ['Everything in Pro', 'Team Collaboration', 'White-label Reports', 'Dedicated Success Manager', 'API Access'],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
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

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your stage of growth. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {tiers.map((tier) => (
            <div key={tier.name} className={`relative bg-white rounded-2xl p-8 ${tier.highlight ? 'border-2 border-primary-600 shadow-xl' : 'border border-slate-200 shadow-sm'}`}>
              {tier.highlight && (
                <div className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
              <p className="text-slate-500 mt-2 text-sm h-10">{tier.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                {tier.period && <span className="text-slate-500 ml-1">{tier.period}</span>}
              </div>

              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className={`mt-8 w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center transition-colors ${tier.highlight ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                {tier.cta} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;