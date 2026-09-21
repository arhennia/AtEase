import React from 'react';

export const pageClass =
  'relative z-10 min-h-screen bg-transparent text-[#1C1917] font-heroSans antialiased';
export const shellClass = 'max-w-[1100px] mx-auto px-5 sm:px-8';
export const cardClass =
  'rounded-[22px] bg-white/50 backdrop-blur-xl border border-white/70 text-[#1C1917] shadow-[0_12px_40px_-24px_rgba(28,25,23,0.1)]';
export const modalClass =
  'glass-modal relative z-10 w-full p-6 sm:p-8 space-y-6';
export const eyebrowClass =
  'font-heroSans text-[11px] tracking-[0.16em] uppercase text-stone-500';
export const titleClass = 'font-heroSans font-semibold tracking-tight text-[#1C1917]';
export const mutedClass = 'font-heroSans text-sm text-stone-600 leading-relaxed';
export const inputClass =
  'w-full rounded-2xl border border-white/70 bg-white/50 px-4 py-3 text-sm font-heroSans text-[#1C1917] outline-none placeholder:text-stone-400 focus:border-[#D4C8E8] focus:ring-2 focus:ring-[#EDE9FE] backdrop-blur-md';
export const chipOn =
  'bg-[#F3EEF8]/90 text-[#4A3F5C] border border-[#E4D9F0]';
export const chipOff =
  'bg-white/50 text-stone-600 border border-white/70 hover:border-[#D4C8E8]';

export function SoftButton({
  children,
  tone = 'ink',
  className = '',
  type = 'button',
  href,
  ...props
}) {
  const tones = {
    ink: 'bg-[#1C1917] text-white hover:bg-black',
    ghost: 'bg-white/55 border border-white/80 text-[#1C1917] hover:border-[#D4C8E8] hover:bg-white/80 backdrop-blur-md',
    lavender: 'bg-[#EDE9FE]/80 text-[#5C4E72] hover:bg-[#E4D9F8] border border-white/70',
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium font-heroSans transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 ${tones[tone] || tones.ink} ${className}`;
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}

export function SoftCard({ children, className = '' }) {
  return <div className={`${cardClass} ${className}`}>{children}</div>;
}

export function FlowHeader({ left, right }) {
  return (
    <header className="relative z-20 px-5 sm:px-8 py-4">
      <div className="max-w-[1100px] mx-auto glass-nav rounded-full px-4 sm:px-5 h-[60px] flex items-center justify-between">
        {left}
        {right}
      </div>
    </header>
  );
}
