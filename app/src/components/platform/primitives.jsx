import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const EASE = 'ease-[cubic-bezier(0.25,0.1,0.25,1)]';

export function RollText({ children }) {
  return (
    <span className="block h-[20px] overflow-hidden">
      <span className={`flex flex-col transition-transform duration-500 group-hover:-translate-y-1/2 ${EASE}`}>
        <span className="block h-[20px] leading-[20px]">{children}</span>
        <span className="block h-[20px] leading-[20px]" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}

export function PillButton({ label, tone = 'purple', className = '', onClick, type = 'button', href }) {
  const isGlass = tone === 'glass' || tone === 'dark';
  const isOutline = tone === 'outline';
  const isMuted = tone === 'muted';
  const fill = isOutline
    ? 'bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50'
    : isMuted
      ? 'bg-transparent border border-stone-200 text-[#1C1917] hover:border-[#D4C8E8] hover:text-[#6D5A8D]'
      : isGlass
        ? 'bg-white text-[#1C1917] hover:bg-white/90'
        : 'bg-[#B8A9D4] text-white hover:bg-[#A898C8]';

  const sharedClassName = `group inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[13px] sm:text-[14px] font-medium transition-all duration-300 hover:scale-[1.02] font-heroSans ${fill} ${className}`;

  if (href) {
    return (
      <a href={href} onClick={onClick} className={sharedClassName}>
        <RollText>{label}</RollText>
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={sharedClassName}>
      <RollText>{label}</RollText>
    </button>
  );
}

export function GooeyPillButton({ label, onClick, type = 'button' }) {
  return (
    <div className="relative flex items-center group" style={{ filter: 'url(#gooey-filter)' }}>
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute right-0 z-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111111] -translate-x-9 transition-transform duration-300 group-hover:-translate-x-[calc(100%+8px)]"
      >
        <ArrowUpRight size={15} />
      </button>
      <button
        type={type}
        onClick={onClick}
        className="relative z-10 h-9 flex items-center rounded-full bg-white px-5 text-[13px] font-medium text-[#111111] font-heroSans transition-colors duration-300 hover:bg-white"
      >
        {label}
      </button>
    </div>
  );
}

export function SectionBadge({ index, label, tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[11px] sm:text-[12px] font-semibold font-heroSans ${
          dark ? 'bg-white text-[#6D5A8D]' : 'bg-[#EDE9FE] text-[#6D5A8D]'
        }`}
      >
        {index}
      </span>
      <span
        className={`font-heroSans rounded-full border px-3 py-1 text-[12px] sm:text-[13px] ${
          dark ? 'border-white/15 text-white' : 'border-stone-200 text-[#111111]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
