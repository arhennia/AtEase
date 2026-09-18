import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, CalendarClock, Globe, MessageCircle, Users } from 'lucide-react';
import { LandingNav } from '../components/platform/LandingNav';
import { LandingFooter } from '../components/platform/LandingFooter';
import { HolographicHero } from '../components/platform/HolographicHero';
import { PillButton, SectionBadge } from '../components/platform/primitives';
import { TRIAL_DAYS } from '../lib/tenancy';

const FEATURES = [
  {
    title: 'Smart scheduling',
    body: 'Slots, buffers, and no-show rules that match how your day actually runs — not a generic calendar grid.',
    icon: CalendarClock,
    bg: 'bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    title: 'Client management',
    body: 'Every client, their history, and how long they’ve trusted you — one place to see it all and follow up.',
    icon: Users,
    bg: 'bg-gradient-to-br from-[#0B0B14] to-[#312244]',
    iconColor: 'text-[#C084FC]',
  },
  {
    title: 'Custom booking page',
    body: 'A private site with your name on it. Clients book directly with you — never redirected to anyone else.',
    icon: Globe,
    bg: 'bg-gradient-to-br from-[#111111] to-[#3B2A5C]',
    iconColor: 'text-[#A855F7]',
  },
  {
    title: 'WhatsApp reminders',
    body: 'Confirmations and reminders land where your clients already are, so fewer seats sit empty.',
    icon: MessageCircle,
    bg: 'bg-gradient-to-br from-[#F3E8FF] to-[#D8B4FE]',
    iconColor: 'text-[#7C3AED]',
  },
];

export function PlatformLanding() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-[#111111] flex flex-col">
      <main className="flex-1">
        {/* ---------------- Hero (nav floats on top of the shader) ---------------- */}
        <HolographicHero>
          <LandingNav />

          <section className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-24 sm:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-2xl pointer-events-none"
            >
              <p className="font-heroSans text-[13px] tracking-[0.18em] uppercase text-[#7C3AED] font-semibold mb-5">
                AtEase
              </p>
              <h1 className="font-heroSans text-[2.5rem] sm:text-6xl lg:text-[4rem] font-bold leading-[1.12] tracking-tight text-[#111111]">
                The effortless way to run your beauty business.
              </h1>
              <p className="font-heroSans text-base sm:text-lg text-stone-500 leading-[1.75] mt-6 max-w-xl">
                AtEase gives studios and independent specialists one branded home for bookings, clients, and
                schedules — so you spend less time managing software and more time in the chair.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mt-9 pointer-events-auto">
                <PillButton
                  label={`Start ${TRIAL_DAYS}-day free trial`}
                  tone="purple"
                  onClick={() => navigate('/signup')}
                />

                <div className="inline-flex items-center gap-2 h-12 pl-3.5 pr-2 rounded-full border border-stone-200 bg-white/70 backdrop-blur-sm">
                  <BadgeCheck size={16} className="text-[#7C3AED]" />
                  <span className="font-heroSans text-[13px] text-stone-600">Trusted by 500+ professionals</span>
                  <span className="font-heroSans text-[10px] tracking-[0.06em] uppercase bg-[#111111] text-white px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              </div>
            </motion.div>
          </section>
        </HolographicHero>

        {/* ---------------- Intro / value ---------------- */}
        <section id="studio" className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
            <SectionBadge index={1} label="Introducing AtEase" />
            <h2 className="font-heroSans text-3xl sm:text-[2.4rem] font-bold tracking-tight text-[#111111] max-w-xl mb-12 leading-[1.18]">
              Built for how beauty professionals actually work
            </h2>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="space-y-5 order-2 md:order-1">
                <p className="font-heroSans text-[15px] sm:text-base text-stone-600 leading-[1.85]">
                  No spreadsheets, no missed DMs, no double-booked chairs. AtEase gives every studio and
                  independent specialist one clean, branded home for bookings, client history, and schedules —
                  built around how appointments really happen, not how software wants them to.
                </p>
                <a
                  href="#features"
                  className="font-heroSans inline-flex items-center gap-1.5 text-[14px] text-[#7C3AED] font-semibold group"
                >
                  See how it works
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
                <div className="rounded-2xl aspect-[4/5] bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] shadow-lg shadow-purple-100 flex items-center justify-center">
                  <CalendarClock size={40} strokeWidth={1.3} className="text-[#7C3AED]" />
                </div>
                <div className="rounded-2xl aspect-[4/5] mt-8 bg-gradient-to-br from-[#111111] to-[#312244] shadow-lg shadow-purple-200/50 flex items-center justify-center">
                  <Users size={40} strokeWidth={1.3} className="text-[#C084FC]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Features showcase ---------------- */}
        <section id="features" className="bg-[#F9F8FC] border-y border-stone-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
            <SectionBadge index={2} label="See it in action" />
            <h2 className="font-heroSans text-3xl sm:text-[2.4rem] font-bold tracking-tight text-[#111111] mb-12">
              See AtEase in action
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-white border border-stone-100 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out"
                >
                  <div className={`rounded-xl h-44 sm:h-48 mb-5 flex items-center justify-center ${f.bg}`}>
                    <f.icon size={38} strokeWidth={1.3} className={f.iconColor} />
                  </div>
                  <h3 className="font-heroSans text-[17px] font-semibold text-[#111111] mb-1.5">{f.title}</h3>
                  <p className="font-heroSans text-[14px] text-stone-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Pricing ---------------- */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
          <SectionBadge index={3} label="Try it, then keep it" />
          <h2 className="font-heroSans text-3xl sm:text-[2.4rem] font-bold tracking-tight text-[#111111] mb-12">
            Simple, honest pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-stone-200 p-8 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-3">
                <p className="font-heroSans text-[11px] tracking-[0.16em] uppercase text-stone-400">Start</p>
                <h3 className="font-heroSans text-2xl font-bold tracking-tight">14 days free</h3>
                <p className="font-heroSans text-sm text-stone-600 leading-relaxed">
                  Your booking page and dashboard, no card needed.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#7C3AED] bg-[#111111] text-white p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(420px circle at 85% 10%, rgba(139,92,246,0.45), transparent 60%)',
                }}
              />
              <div className="space-y-3 relative">
                <p className="font-heroSans text-[11px] tracking-[0.16em] uppercase text-[#C084FC]">Then</p>
                <h3 className="font-heroSans text-2xl font-bold tracking-tight">₹999 / month</h3>
                <p className="font-heroSans text-sm text-white/70 leading-relaxed">
                  Keeps your website and dashboard online.
                </p>
              </div>
              <PillButton
                label="Get started"
                tone="purple"
                className="mt-8 w-full justify-between relative"
                onClick={() => navigate('/signup')}
              />
            </div>
          </div>
        </section>

        {/* ---------------- Closing CTA ---------------- */}
        <section id="connect" className="bg-[#0B0B14]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <SectionBadge index={4} label="Let's talk" tone="dark" />
              <h2 className="font-heroSans text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-md">
                Ready to simplify your business?
              </h2>
            </div>
            <PillButton
              label={`Start ${TRIAL_DAYS}-day free trial`}
              tone="purple"
              className="w-fit"
              onClick={() => navigate('/signup')}
            />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
