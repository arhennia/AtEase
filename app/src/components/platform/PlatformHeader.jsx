import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, LogOut } from 'lucide-react';
import { AtEaseLogo } from './AtEaseLogo';

export function PlatformHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userRole = useAppStore((s) => s.userRole);
  const logout = useAppStore((s) => s.logout);
  const onHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <button type="button" onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
          <AtEaseLogo />
        </button>
        <nav className="flex items-center gap-4 sm:gap-6">
          {onHome && (
            <a href="#how-it-works" className="hidden sm:inline text-sm text-stone-600 hover:text-black">
              How it works
            </a>
          )}
          {isAuthenticated && userRole === 'partner' ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-sm text-stone-700 hover:text-black"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-black"
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
                className="text-sm text-stone-600 hover:text-black"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="bg-[#111111] text-white px-4 py-2 text-sm font-medium hover:bg-black flex items-center gap-1.5"
              >
                Get started
                <ArrowRight size={13} />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
