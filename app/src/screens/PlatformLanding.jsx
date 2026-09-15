import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { PlatformFooter } from '../components/platform/PlatformFooter';
import { TRIAL_DAYS } from '../lib/tenancy';

const steps = [
  { n: '01', title: 'Create an account', body: 'Sign up with Google, phone, or email.' },
  { n: '02', title: 'Answer a few questions', body: 'Tell us what you offer. Tap the options — no long forms.' },
  { n: '03', title: 'Go live', body: 'Your website and dashboard are ready with your menu already on them.' },
];

export function PlatformLanding() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-[#111111] flex flex-col">
      <PlatformHeader />

      <main className="flex-1">
        <section className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-24">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-7">
            <h1 className="font-serif text-[2.6rem] sm:text-6xl font-normal leading-[1.18] tracking-tight">
              Your own booking website
            </h1>
            <p className="font-sans text-base sm:text-lg text-stone-600 font-light leading-[1.85]">
              AtEase gives beauty professionals a private site for clients to book, and a dashboard to run the studio.
              Clients stay on your brand. They never see anyone else.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="h-12 px-6 bg-[#111111] text-white text-sm font-medium hover:bg-black inline-flex items-center justify-center gap-2"
              >
                Start {TRIAL_DAYS}-day free trial
                <ArrowRight size={14} />
              </button>
              <a
                href="#how-it-works"
                className="h-12 px-6 border border-stone-300 text-sm inline-flex items-center justify-center hover:border-black"
              >
                How it works
              </a>
            </div>
          </motion.div>
        </section>

        <section id="how-it-works" className="border-y border-stone-200 bg-[#F7F6F4]">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-20">
            <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-stone-400 mb-10">How it works</p>
            <div className="grid md:grid-cols-3 gap-10 md:gap-14">
              {steps.map((step) => (
                <div key={step.n} className="space-y-3">
                  <p className="font-mono text-xs text-stone-400">{step.n}</p>
                  <h2 className="font-serif text-2xl sm:text-[1.7rem] leading-snug tracking-tight">{step.title}</h2>
                  <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="max-w-[1100px] mx-auto px-4 sm:px-8 py-24">
          <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-stone-400 mb-3">Pricing</p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight mb-12">Try it, then keep it</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-stone-200 p-8 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-3">
                <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-stone-400">Start</p>
                <h3 className="font-serif text-2xl tracking-tight">14 days free</h3>
                <p className="font-sans text-sm text-stone-600 font-light leading-relaxed">
                  Your site and dashboard, no card needed.
                </p>
              </div>
            </div>
            <div className="border border-[#111111] bg-[#111111] text-white p-8 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-3">
                <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-white/55">Then</p>
                <h3 className="font-serif text-2xl tracking-tight">₹999 / month</h3>
                <p className="font-sans text-sm text-white/75 font-light leading-relaxed">
                  Keeps your website and dashboard online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="mt-8 h-12 w-full bg-white text-[#111111] text-sm font-medium"
              >
                Get started
              </button>
            </div>
          </div>
        </section>
      </main>

      <PlatformFooter />
    </div>
  );
}
