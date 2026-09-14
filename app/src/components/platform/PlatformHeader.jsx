import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, LogOut, User } from 'lucide-react';

export function PlatformHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userRole = useAppStore((s) => s.userRole);
  const logout = useAppStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <button type="button" onClick={() => navigate('/')} className="font-serif text-xl tracking-[0.18em] uppercase">
          AtEase
        </button>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a href="#pricing" className="hidden sm:inline text-[11px] tracking-[0.15em] uppercase text-stone-600 hover:text-black">
            Pricing
          </a>
          {isAuthenticated && userRole === 'partner' ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-[11px] tracking-[0.15em] uppercase font-medium text-stone-700 hover:text-black"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-stone-500"
              >
                <LogOut size={13} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-stone-600 hover:text-black"
              >
                <User size={13} />
                Partner login
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="bg-[#111111] text-white px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-black flex items-center gap-1.5"
              >
                Start 14-day trial
                <ArrowRight size={13} />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
