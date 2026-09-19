import React from 'react';

export const pageClass =
  'min-h-screen bg-[#FAFAFB] text-[#1C1917] font-heroSans antialiased';
export const shellClass = 'max-w-[1100px] mx-auto px-5 sm:px-8';
export const cardClass = 'rounded-[22px] border border-stone-200/70 bg-white';
export const eyebrowClass =
  'font-heroSans text-[11px] tracking-[0.16em] uppercase text-stone-400';
export const titleClass = 'font-heroSans font-semibold tracking-tight text-[#1C1917]';
export const mutedClass = 'font-heroSans text-sm text-stone-500 leading-relaxed';
export const inputClass =
  'w-full rounded-2xl border border-stone-200 bg-[#F7F6F8] px-4 py-3 text-sm font-heroSans text-[#1C1917] outline-none placeholder:text-stone-400 focus:border-[#D4C8E8] focus:ring-2 focus:ring-[#EDE9FE]';
export const chipOn =
  'bg-[#F3EEF8] text-[#4A3F5C] border border-[#E4D9F0]';
export const chipOff =
  'bg-white text-stone-600 border border-stone-200 hover:border-stone-300';

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
    ghost: 'bg-white border border-stone-200 text-[#1C1917] hover:border-stone-400',
    lavender: 'bg-[#EDE9FE] text-[#5C4E72] hover:bg-[#E4D9F8]',
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium font-heroSans transition-all duration-200 disabled:opacity-40 ${tones[tone] || tones.ink} ${className}`;
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
    <header className="px-5 sm:px-8 py-5 border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        {left}
        {right}
      </div>
    </header>
  );
}
