import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AtEaseLogo } from './AtEaseLogo';

export function PlatformFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0B0B14] text-white mt-auto">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:py-16 grid sm:grid-cols-2 gap-10">
        <div className="space-y-3 max-w-xs">
          <AtEaseLogo className="text-[1.4rem] text-white" />
          <p className="font-heroSans text-sm text-white/50 leading-relaxed">
            A booking website and dashboard for independent beauty studios.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2.5 justify-center">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-heroSans text-sm text-white/70 hover:text-white text-left"
          >
            Get started
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-heroSans text-sm text-white/70 hover:text-white text-left"
          >
            Owner login
          </button>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-5 text-[11px] text-white/35 font-heroSans">
          © {new Date().getFullYear()} AtEase
        </div>
      </div>
    </footer>
  );
}
