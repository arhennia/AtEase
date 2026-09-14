import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Globe, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { TRIAL_DAYS } from '../lib/tenancy';

const features = [
  {
    icon: Globe,
    title: 'Your brand, your URL',
    body: 'Clients book on a private site that carries your name — never a public directory of other studios.',
  },
  {
    icon: LayoutDashboard,
    title: 'Owner-only dashboard',
    body: 'Manage catalog, hours, and bookings in a portal only you can open.',
  },
  {
    icon: ShieldCheck,
    title: 'Tenant isolation',
    body: 'Partner A’s clients cannot browse Partner B. Each booking page is a closed brand.',
  },
];

export function PlatformLanding() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      <PlatformHeader />

      <main>
        <section className="max-w-[1120px] mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-20 space-y-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-5">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500">
              White-label booking for brand owners
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl tracking-wide uppercase font-normal leading-[1.1]">
              A dedicated client portal that enhances your brand
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl">
              AtEase is not a marketplace. We give independent beauty entrepreneurs a private storefront and
              operations dashboard — so your clients stay with your brand, not a ranking of everyone else.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="bg-[#111111] text-white px-6 py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black flex items-center justify-center gap-2"
              >
                Start {TRIAL_DAYS}-day free trial
                <ArrowRight size={14} />
              </button>
              <a
                href="#pricing"
                className="border border-stone-300 px-6 py-3.5 text-xs tracking-[0.2em] uppercase font-bold text-center hover:border-black"
              >
                See pricing
              </a>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-stone-200 bg-[#F9F9F9]">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-16 grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="space-y-3">
                <f.icon size={18} />
                <h2 className="font-serif text-xl uppercase tracking-wide">{f.title}</h2>
                <p className="text-sm text-stone-600 font-light leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="max-w-[1120px] mx-auto px-4 sm:px-8 py-20 space-y-10">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">Pricing</p>
            <h2 className="font-serif text-3xl uppercase tracking-wide">Simple trial, then a studio plan</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <div className="border border-stone-200 p-8 space-y-4 bg-white">
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">Start</p>
              <h3 className="font-serif text-2xl uppercase">14-day free trial</h3>
              <p className="text-sm text-stone-600 font-light">
                Full dashboard and live client site. No card required in this demo.
              </p>
              <ul className="space-y-2 text-sm text-stone-700">
                {['Private /p/your-brand URL', 'Bookings scoped to your studio only', 'Catalog & hours editor'].map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <Check size={15} className="mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#111111] p-8 space-y-4 bg-[#111111] text-white">
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/70">After trial</p>
              <h3 className="font-serif text-2xl uppercase">₹999 / month</h3>
              <p className="text-sm text-white/80 font-light">
                Required to keep the custom site and owner dashboard online. Your clients never see other partners.
              </p>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full bg-white text-[#111111] py-3 text-xs tracking-[0.2em] uppercase font-bold"
              >
                Get started
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-[10px] tracking-[0.2em] uppercase text-stone-400">
        AtEase • Brand enhancer for independent studios
      </footer>
    </div>
  );
}
