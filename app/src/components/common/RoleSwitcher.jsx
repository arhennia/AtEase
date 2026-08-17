import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Sparkles, ArrowRight, Store, Compass } from 'lucide-react';

export function RoleSwitcher({ currentView = 'client' }) {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const setUserRole = useAppStore((state) => state.setUserRole);

  const handleProviderEntry = () => {
    if (isAuthenticated) {
      setUserRole('provider');
      navigate('/provider');
    } else {
      openAuthModal('provider');
    }
  };

  const handleClientEntry = () => {
    setUserRole('client');
    navigate('/');
  };

  return (
    <section className="w-full bg-[#FFFFFF] border-b border-stone-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Card 1: Client Discovery Entry */}
          <div
            onClick={handleClientEntry}
            className={`p-4 sm:p-5 border transition-all cursor-pointer flex items-center justify-between group ${
              currentView === 'client'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-[#F9F9F9] text-[#111111] border-stone-200 hover:border-[#111111]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Compass size={14} className={currentView === 'client' ? 'text-white' : 'text-stone-600'} />
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold opacity-70">
                  Client View
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg tracking-wide uppercase font-normal">
                Looking for services?
              </h3>
              <p className={`text-xs font-light tracking-wide leading-snug ${currentView === 'client' ? 'text-white/80' : 'text-stone-600'}`}>
                Book mobile beauty specialists &amp; boutique parlors directly.
              </p>
            </div>
            
            <div className={`p-2 rounded-full border transition-transform group-hover:translate-x-1 ${
              currentView === 'client' 
                ? 'border-white/30 text-white' 
                : 'border-stone-300 text-[#111111]'
            }`}>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: Provider / Partner Growth Entry */}
          <div
            onClick={handleProviderEntry}
            className={`p-4 sm:p-5 border transition-all cursor-pointer flex items-center justify-between group ${
              currentView === 'provider'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-[#F9F9F9] text-[#111111] border-stone-200 hover:border-[#111111]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Store size={14} className={currentView === 'provider' ? 'text-white' : 'text-stone-600'} />
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold opacity-70">
                  Provider Portal
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg tracking-wide uppercase font-normal">
                Independent owner or artist?
              </h3>
              <p className={`text-xs font-light tracking-wide leading-snug ${currentView === 'provider' ? 'text-white/80' : 'text-stone-600'}`}>
                Grow your independent business with AtEase turnkey tools.
              </p>
            </div>
            
            <div className={`p-2 rounded-full border transition-transform group-hover:translate-x-1 ${
              currentView === 'provider' 
                ? 'border-white/30 text-white' 
                : 'border-stone-300 text-[#111111]'
            }`}>
              <ArrowRight size={14} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
