import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { LogOut } from 'lucide-react';
import { AtEaseLogo } from './AtEaseLogo';
import { SoftButton } from './ui';

export function PlatformHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userRole = useAppStore((s) => s.userRole);
  const logout = useAppStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/70">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <button type="button" onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
          <AtEaseLogo className="text-[1.2rem] sm:text-[1.35rem] text-[#1C1917]" />
        </button>
        <nav className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && userRole === 'partner' ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="font-heroSans text-[13px] text-stone-500 hover:text-[#1C1917] px-3 py-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="font-heroSans text-[13px] text-stone-400 hover:text-[#1C1917] px-3 py-2 rounded-full inline-flex items-center gap-1.5"
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
                className="font-heroSans text-[13px] text-stone-500 hover:text-[#1C1917] px-3 py-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                Log in
              </button>
              <SoftButton onClick={() => navigate('/signup')}>Get started</SoftButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
