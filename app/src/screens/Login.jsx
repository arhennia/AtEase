import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { User, Store, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const showToast = useAppStore((state) => state.showToast);

  const [role, setRole] = useState('client'); // 'client' | 'provider'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(role);
      showToast(
        role === 'provider' 
          ? 'Welcome to AtEase Provider Dashboard' 
          : 'Welcome back! You are logged in.'
      );
      if (role === 'provider') {
        navigate('/provider');
      } else {
        navigate('/');
      }
    }, 280);
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen w-full relative font-sans text-[#111111] antialiased flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between border-b border-stone-200">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-stone-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Marketplace</span>
        </button>
        <span className="font-serif text-lg tracking-[0.18em] font-normal uppercase text-[#111111]">
          AtEase
        </span>
        <div className="w-16" />
      </header>

      {/* Center Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-[#FFFFFF] w-full max-w-md border border-stone-200 p-8 sm:p-10 space-y-6 shadow-lg">
          
          <div className="text-center space-y-1.5 border-b border-stone-200 pb-5">
            <span className="font-serif text-2xl tracking-[0.18em] font-normal uppercase text-[#111111] block">
              AtEase
            </span>
            <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Direct Access Portal
            </p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#F9F9F9] border border-stone-200 rounded-sm text-[11px] tracking-wider uppercase font-semibold">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2.5 text-center transition-all flex items-center justify-center gap-1.5 ${
                role === 'client'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#111111]'
              }`}
            >
              <User size={13} />
              <span>Client</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`py-2.5 text-center transition-all flex items-center justify-center gap-1.5 ${
                role === 'provider'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#111111]'
              }`}
            >
              <Store size={13} />
              <span>Provider</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600">
                Mobile Number
              </label>
              <div className="flex border border-stone-200 focus-within:border-[#111111] transition-colors bg-[#F9F9F9]">
                <span className="px-3 py-2.5 text-xs text-stone-500 border-r border-stone-200 font-mono bg-stone-100">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210 (Demo Mode)"
                  className="w-full bg-transparent px-3 py-2 text-xs tracking-wider focus:outline-none text-[#111111]"
                />
              </div>
              <p className="text-[10px] text-stone-400 font-light">
                {role === 'provider'
                  ? 'Log in to manage catalog pricing, working radius, and direct bookings.'
                  : 'Instant mock sign-in. Explore and book directly with beauty specialists.'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Enter as {role === 'provider' ? 'Provider' : 'Client'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogin}
                className="w-full border border-stone-200 text-[#111111] py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[#111111] bg-[#F9F9F9] transition-colors"
              >
                1-Click Quick Guest Login
              </button>
            </div>
          </form>

          {/* Trust Notice */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-light">
            <ShieldCheck size={14} className="text-stone-400 shrink-0" />
            <span>AtEase connects clients &amp; independent providers directly.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-400">
        AtEase • Editorial Discovery &amp; Turnkey Provider SaaS
      </footer>

    </div>
  );
}
