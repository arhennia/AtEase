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
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-4 pb-3">
        <div className="glass-nav h-[60px] sm:h-[64px] rounded-full px-4 sm:px-5 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
            <AtEaseLogo className="text-[1.2rem] sm:text-[1.35rem] text-[#1C1917]" />
          </button>
          <nav className="flex items-center gap-1 sm:gap-3">
            {isAuthenticated && userRole === 'partner' ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="font-heroSans text-[13px] text-stone-500 hover:text-[#1C1917] px-3 py-2 rounded-full hover:bg-white/60 transition-all duration-200"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="font-heroSans text-[13px] text-stone-400 hover:text-[#1C1917] px-3 py-2 rounded-full inline-flex items-center gap-1.5 hover:bg-white/60 transition-all duration-200"
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
                  className="font-heroSans text-[13px] text-stone-500 hover:text-[#1C1917] px-3 py-2 rounded-full hover:bg-white/60 transition-all duration-200"
                >
                  Log in
                </button>
                <SoftButton onClick={() => navigate('/signup')}>Get started</SoftButton>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
