import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AtEaseLogo } from './AtEaseLogo';

export function PlatformFooter() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12 grid sm:grid-cols-3 gap-8">
        <div className="space-y-3">
          <AtEaseLogo className="text-[1.45rem]" />
          <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs">
            A booking website and dashboard for independent beauty studios.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.16em] uppercase text-stone-400">Product</p>
          <div className="flex flex-col gap-2 text-sm text-stone-600">
            <button type="button" onClick={() => navigate('/signup')} className="text-left hover:text-black">
              Start free trial
            </button>
            <button type="button" onClick={() => navigate('/login')} className="text-left hover:text-black">
              Owner login
            </button>
            <a href="/#how-it-works" className="hover:text-black">
              How it works
            </a>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.16em] uppercase text-stone-400">For owners</p>
          <p className="text-sm text-stone-600 font-light leading-relaxed">
            Your clients book on your site. They never see another studio.
          </p>
        </div>
      </div>
      <div className="border-t border-stone-100">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4 text-[11px] text-stone-400">
          © {new Date().getFullYear()} AtEase
        </div>
      </div>
    </footer>
  );
}
