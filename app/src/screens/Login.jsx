import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowRight, Loader2, ArrowLeft, Store } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { PlatformFooter } from '../components/platform/PlatformFooter';
import { AuthMethods } from '../components/auth/AuthMethods';
import { isSupabaseConfigured } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginPartner = useAppStore((state) => state.loginPartner);
  const applyAuthenticatedUser = useAppStore((state) => state.applyAuthenticatedUser);
  const showToast = useAppStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const handleVerified = async () => {
    const result = await applyAuthenticatedUser({ intendedRole: 'brand_owner', nextPath: '/dashboard' });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast(result.needsOnboarding ? 'Finish setting up your brand.' : 'Welcome back.');
    navigate(result.redirectTo || '/dashboard');
  };

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await loginPartner({ email, password });
      setIsLoading(false);
      if (!result.ok) {
        setError(result.error || 'Failed to sign in.');
        return;
      }
      if (result.needsOnboarding) {
        showToast('Welcome back. Complete setting up your brand.');
        navigate('/onboarding');
        return;
      }
      showToast('Welcome back. Opening your dashboard.');
      navigate(result.redirectTo || location.state?.from || '/dashboard');
    } catch (err) {
      setIsLoading(false);
      setError(err?.message || 'Login error occurred.');
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen w-full font-sans text-[#111111] antialiased flex flex-col">
      <PlatformHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-[#FFFFFF] w-full max-w-md border border-stone-200 p-8 sm:p-10 space-y-6 shadow-lg">
          <div className="text-center space-y-1.5 border-b border-stone-200 pb-5">
            <Store size={18} className="mx-auto" />
            <span className="font-serif text-2xl tracking-tight font-normal text-[#111111] block">
              Partner login
            </span>
            <p className="text-sm text-stone-500 font-light">
              Google or phone OTP
            </p>
          </div>

          {isSupabaseConfigured ? (
            <AuthMethods role="brand_owner" nextPath="/dashboard" onVerified={handleVerified} />
          ) : (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3">
              Add Supabase keys to enable Google and phone login. Email demo still works below.
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowEmail((v) => !v)}
            className="w-full text-[10px] tracking-[0.15em] uppercase text-stone-500"
          >
            {showEmail ? 'Hide email login' : 'Use email & password'}
          </button>

          {showEmail && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="w-full bg-[#F9F9F9] border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#F9F9F9] border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <>Open dashboard <ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          {error && !showEmail && <p className="text-xs text-red-600">{error}</p>}

          <p className="text-xs text-stone-500">
            New studio? <Link to="/signup" className="underline text-[#111111]">Start a 14-day trial</Link>
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-stone-500"
          >
            <ArrowLeft size={13} /> Platform home
          </button>
        </div>
      </main>
      <PlatformFooter />
    </div>
  );
}
