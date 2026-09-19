import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarClock, Check, Globe, MessageCircle, Users } from 'lucide-react';
import { LandingNav } from '../components/platform/LandingNav';
import { LandingFooter, CONTACT_LINKS } from '../components/platform/LandingFooter';
import { HolographicHero } from '../components/platform/HolographicHero';
import { DashboardPreview } from '../components/platform/DashboardPreview';
import { PillButton, SectionBadge } from '../components/platform/primitives';
import { LocalhostDemoBar } from '../components/platform/LocalhostDemoBar';

const FEATURES = [
  {
    title: 'Smart scheduling',
    body: 'Slots, buffers, and no-show rules that match how your day actually runs.',
    icon: CalendarClock,
  },
  {
    title: 'Client management',
    body: 'Every client and their history in one place — easy to follow up.',
    icon: Users,
  },
  {
    title: 'Custom booking page',
    body: 'A private site with your name on it. Clients book directly with you.',
    icon: Globe,
  },
  {
    title: 'WhatsApp reminders',
    body: 'Confirmations land where your clients already are.',
    icon: MessageCircle,
  },
];

const PLANS = [
  {
    eyebrow: 'Trial',
    name: '14 days free',
    price: '₹0',
    cadence: 'for 14 days',
    description: 'Full access to your booking page and dashboard. No card required.',
    features: ['Your branded booking page', 'Dashboard & scheduling', 'Client records', 'No card required'],
    cta: 'Start free',
    tone: 'muted',
    featured: false,
    href: '/signup',
  },
  {
    eyebrow: 'Self-Managed',
    name: 'Run it yourself',
    price: '₹549',
    cadence: '/ month',
    description: 'For professionals who want to manage and run every dashboard feature on their own.',
    features: ['Everything in the trial', 'Unlimited bookings', 'Offers & client follow-ups', 'You run the dashboard'],
    cta: 'Get Self-Managed',
    tone: 'muted',
    featured: false,
    href: '/signup',
  },
  {
    eyebrow: 'Managed & Boosted',
    name: 'We run it with you',
    price: '₹999',
    cadence: '/ month',
    description: 'For professionals who want us to fully manage, support, and boost their business.',
    features: ['Everything in Self-Managed', 'We handle the dashboard', 'Support when you need it', 'Marketing boost'],
    cta: 'Talk to us',
    tone: 'purple',
    featured: true,
    href: '#connect',
  },
];

export function PlatformLanding() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-[#111111] flex flex-col">
      <LocalhostDemoBar />
      <main className="flex-1">
        <HolographicHero>
          <LandingNav />

          <section className="mt-auto w-full max-w-[1200px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-lg pointer-events-none"
            >
              <p className="font-heroSans text-[11px] tracking-[0.18em] uppercase text-white/55 font-semibold mb-3">
                AtEase
              </p>
              <h1 className="font-heroSans text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-white">
                The <span className="italic font-light">effortless</span> way to run your{' '}
                <span className="font-bold">beauty business.</span>
              </h1>
              <p className="font-heroSans text-xs sm:text-sm text-white/50 leading-[1.6] mt-4 max-w-sm">
                One branded home for bookings, clients, and schedules — so you spend less time managing software
                and more time in the chair.
              </p>

              <div className="flex items-center gap-3 mt-7 pointer-events-auto">
                <PillButton label="Start for free" tone="glass" onClick={() => navigate('/signup')} />
                <PillButton label="Pricing" tone="outline" href="#pricing" />
              </div>
            </motion.div>
          </section>
        </HolographicHero>

        <section id="studio" className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-6 sm:pb-8">
            <SectionBadge index={1} label="Introducing AtEase" />
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-end">
              <h2 className="font-heroSans text-3xl sm:text-[2.6rem] font-semibold tracking-tight text-[#111111] max-w-xl leading-[1.18]">
                Built for how beauty professionals actually work
              </h2>
              <p className="font-heroSans text-[15px] sm:text-base text-stone-500 leading-[1.85] max-w-lg">
                No spreadsheets, no missed DMs, no double-booked chairs. One clean, branded home for bookings,
                client history, and schedules — built around how appointments really happen.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28">
            <SectionBadge index={2} label="See it in action" />
            <h2 className="font-heroSans text-3xl sm:text-[2.4rem] font-semibold tracking-tight text-[#111111] mb-3">
              Your studio, on one screen
            </h2>
            <p className="font-heroSans text-[15px] text-stone-500 max-w-xl mb-12 sm:mb-16 leading-relaxed">
              Four things you actually need — then a dashboard that makes them feel quiet instead of busy.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-16 sm:mb-20">
              {FEATURES.map((f) => (
                <div key={f.title} className="space-y-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EEF8] text-[#6D5A8D]">
                    <f.icon size={18} strokeWidth={1.6} />
                  </span>
                  <h3 className="font-heroSans text-[15px] font-semibold text-[#111111]">{f.title}</h3>
                  <p className="font-heroSans text-[13px] text-stone-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>

            <DashboardPreview />
          </div>
        </section>

        <section id="pricing" className="bg-[#F9F8FC] border-y border-stone-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
            <SectionBadge index={3} label="Try it, then keep it" />
            <h2 className="font-heroSans text-3xl sm:text-[2.4rem] font-semibold tracking-tight text-[#111111] mb-3">
              Simple, honest pricing
            </h2>
            <p className="font-heroSans text-[15px] text-stone-500 max-w-xl mb-12 sm:mb-16 leading-relaxed">
              Start free. Stay on your own, or let us run and boost it with you.
            </p>

            <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
              {PLANS.map((plan) => (
                <article
                  key={plan.eyebrow}
                  className={`relative flex flex-col rounded-[22px] p-7 sm:p-8 min-h-[420px] ${
                    plan.featured
                      ? 'bg-[#1C1917] text-white shadow-[0_24px_48px_-28px_rgba(28,25,23,0.35)]'
                      : 'bg-white border border-stone-200/80 text-[#111111]'
                  }`}
                >
                  {plan.featured && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden"
                      style={{
                        background:
                          'radial-gradient(420px circle at 90% 0%, rgba(184,169,212,0.22), transparent 55%)',
                      }}
                    />
                  )}
                  <div className="relative flex flex-col flex-1">
                    <p
                      className={`font-heroSans text-[11px] tracking-[0.16em] uppercase mb-4 ${
                        plan.featured ? 'text-[#D4C8E8]' : 'text-stone-400'
                      }`}
                    >
                      {plan.eyebrow}
                    </p>
                    <h3 className="font-heroSans text-xl font-semibold tracking-tight mb-5">{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="font-heroSans text-4xl font-semibold tracking-tight">{plan.price}</span>
                      <span className={`font-heroSans text-sm ${plan.featured ? 'text-white/50' : 'text-stone-400'}`}>
                        {plan.cadence}
                      </span>
                    </div>
                    <p
                      className={`font-heroSans text-sm leading-relaxed mb-8 ${
                        plan.featured ? 'text-white/65' : 'text-stone-500'
                      }`}
                    >
                      {plan.description}
                    </p>
                    <ul className="space-y-3 mb-10">
                      {plan.features.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check
                            size={15}
                            strokeWidth={2}
                            className={`mt-0.5 shrink-0 ${plan.featured ? 'text-[#D4C8E8]' : 'text-[#A898C8]'}`}
                          />
                          <span
                            className={`font-heroSans text-[13px] leading-snug ${
                              plan.featured ? 'text-white/80' : 'text-stone-600'
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <PillButton
                        label={plan.cta}
                        tone={plan.tone}
                        className="w-full"
                        href={plan.href.startsWith('#') ? plan.href : undefined}
                        onClick={plan.href.startsWith('#') ? undefined : () => navigate(plan.href)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="connect" className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
            <div>
              <SectionBadge index={4} label="Let's talk" />
              <h2 className="font-heroSans text-3xl sm:text-4xl font-semibold text-[#111111] tracking-tight max-w-md">
                Say hello.
              </h2>
              <p className="font-heroSans text-[15px] text-stone-500 leading-relaxed mt-3 max-w-sm">
                Founder-direct — email, GitHub, Instagram, or X. No form, no waitlist.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:items-end min-w-[200px]">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group inline-flex items-center gap-1.5 font-heroSans text-[15px] text-[#1C1917] hover:text-[#6D5A8D] transition-colors duration-200"
                >
                  {link.label}
                  <ArrowUpRight
                    size={14}
                    className="opacity-40 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
