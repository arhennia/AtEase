import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AtEaseLogo } from './AtEaseLogo';

export function PlatformFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 mt-auto border-t border-white/60">
      <div
        aria-hidden="true"
        className="absolute -top-16 left-1/3 h-32 w-1/2 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.45), transparent 70%)' }}
      />
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:py-16 grid sm:grid-cols-2 gap-10">
        <div className="space-y-3 max-w-xs">
          <AtEaseLogo className="text-[1.4rem] text-[#1C1917]" />
          <p className="font-heroSans text-sm text-stone-600 leading-relaxed">
            A booking website and dashboard for independent beauty studios.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2.5 justify-center">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-heroSans text-sm text-stone-600 hover:text-[#1C1917] text-left transition-colors"
          >
            Get started
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-heroSans text-sm text-stone-600 hover:text-[#1C1917] text-left transition-colors"
          >
            Owner login
          </button>
        </div>
      </div>
      <div className="border-t border-white/60">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-5 text-[11px] text-stone-400 font-heroSans">
          © {new Date().getFullYear()} AtEase
        </div>
      </div>
    </footer>
  );
}
