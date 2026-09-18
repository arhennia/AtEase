import React from 'react';
import { ArrowRight } from 'lucide-react';

export const EASE = 'ease-[cubic-bezier(0.25,0.1,0.25,1)]';

/**
 * Vertical "roll up" text reveal used on hover — the label slides up to
 * reveal a duplicate copy underneath, à la Hirael's button micro-interaction.
 * The parent element must have the `group` class.
 */
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

/**
 * Pill button with a roll-up label and a circular arrow that un-rotates on
 * hover. `tone` picks the fill: 'dark' (near-black, used in nav / secondary
 * spots) or 'purple' (brand accent, used for primary CTAs).
 */
export function PillButton({ label, tone = 'purple', className = '', onClick, type = 'button' }) {
  const fill = tone === 'dark' ? 'bg-[#111111] hover:bg-[#111111]' : 'bg-[#7C3AED] hover:bg-[#8B5CF6]';
  const iconColor = tone === 'dark' ? 'text-[#111111]' : 'text-[#7C3AED]';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group h-auto inline-flex items-center rounded-full py-2 ps-5 pe-2 text-[13px] sm:text-[14px] font-medium text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:scale-[1.02] font-heroSans ${fill} ${className}`}
    >
      <RollText>{label}</RollText>
      <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white ml-2">
        <ArrowRight
          size={15}
          className={`transition-transform duration-500 group-hover:-rotate-45 ${iconColor} ${EASE}`}
        />
      </span>
    </button>
  );
}

/**
 * Small numbered circle + outline badge, used to introduce each major
 * section — adapted from Hirael's "1 / Introducing Hirael" pattern.
 */
export function SectionBadge({ index, label, tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[11px] sm:text-[12px] font-semibold font-heroSans ${
          dark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'
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
