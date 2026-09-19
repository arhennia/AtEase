import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AtEaseLogo } from './AtEaseLogo';
import { PillButton, GooeyPillButton } from './primitives';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Studio', href: '#studio' },
  { label: 'Connect', href: '#connect' },
];

export function LandingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="relative z-20 mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 sm:px-8 pt-6 sm:pt-8 pointer-events-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
        >
          <AtEaseLogo className="text-[1.15rem] sm:text-[1.25rem] text-white" />
        </button>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-heroSans text-[13px] font-light text-white/70 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <GooeyPillButton
            label="Book a demo"
            onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
        <div
          className={`absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-heroSans text-[26px] font-medium leading-[36px] text-[#111111]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <PillButton
            label="Book a demo"
            tone="purple"
            className="mt-6 w-full justify-center"
            onClick={() => {
              setOpen(false);
              document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>
    </>
  );
}
