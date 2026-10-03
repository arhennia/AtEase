import React from 'react';
import { Link } from 'react-router-dom';
import { PlatformHeader } from './PlatformHeader';
import { PlatformFooter } from './PlatformFooter';
import { eyebrowClass, pageClass, titleClass } from './ui';

export function LegalLayout({ title, lede, children }) {
  return (
    <div className={`${pageClass} flex min-h-screen flex-col`}>
      <PlatformHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-16">
        <p className={eyebrowClass}>AtEase</p>
        <h1 className={`${titleClass} mt-3 text-3xl sm:text-4xl`}>{title}</h1>
        <p className="mt-4 font-heroSans text-sm leading-relaxed text-stone-600 sm:text-[15px]">{lede}</p>
        <p className="mt-3 font-heroSans text-[12px] text-stone-400">Last updated 2 October 2026</p>
        <div className="mt-8 space-y-8">{children}</div>
        <p className="mt-12 font-heroSans text-sm text-stone-500">
          <Link to="/privacy" className="text-[#6D5A8D] hover:text-[#5C4B78]">
            Privacy
          </Link>
          <span className="px-2 text-stone-300">·</span>
          <Link to="/terms" className="text-[#6D5A8D] hover:text-[#5C4B78]">
            Terms
          </Link>
        </p>
      </main>
      <PlatformFooter />
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className={`${titleClass} text-xl`}>{title}</h2>
      <div className="space-y-3 font-heroSans text-sm leading-relaxed text-stone-600">{children}</div>
    </section>
  );
}

export function ReviewNote({ children }) {
  return (
    <div className="rounded-2xl border border-[#E4D9F0] bg-[#F7F4FB] px-4 py-3 sm:px-5 sm:py-4">
      <p className="font-heroSans text-[11px] uppercase tracking-[0.16em] text-[#6D5A8D]">Needs review</p>
      <p className="mt-2 font-heroSans text-sm leading-relaxed text-[#4A3F5C]">{children}</p>
    </div>
  );
}
