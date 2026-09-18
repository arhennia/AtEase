import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AtEaseLogo } from './AtEaseLogo';
import { PillButton } from './primitives';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Studio', href: '#studio' },
  { label: 'Journal', href: '#features' },
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
      <header className="relative z-20 mx-auto w-full max-w-[1200px] p-2 sm:p-3 pointer-events-auto">
        <nav className="flex items-center justify-between rounded-full bg-white/95 backdrop-blur-sm p-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 pl-2.5 hover:opacity-80 transition-opacity duration-200"
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-white text-[13px] font-heroSans font-semibold flex items-center justify-center shrink-0">
              A
            </span>
            <AtEaseLogo className="text-[1.2rem] sm:text-[1.3rem]" />
          </button>

          <div className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-heroSans text-[14px] text-stone-700 hover:text-[#7C3AED] transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 pr-1">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-heroSans text-[13px] text-stone-500 hover:text-[#111111] transition-colors duration-200"
            >
              Log in
            </button>
            <span className="hidden lg:block font-heroSans text-[13px] text-stone-400">
              Now onboarding new studios
            </span>
            <PillButton label="Book a demo" tone="dark" onClick={() => navigate('/signup')} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* mobile bottom-sheet menu */}
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
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/login');
              }}
              className="font-heroSans text-[15px] text-stone-500"
            >
              Log in
            </button>
          </div>
          <PillButton
            label="Book a demo"
            tone="dark"
            className="mt-5 w-full justify-between"
            onClick={() => {
              setOpen(false);
              navigate('/signup');
            }}
          />
        </div>
      </div>
    </>
  );
}
