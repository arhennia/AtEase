import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { PlatformFooter } from '../components/platform/PlatformFooter';
import { AuthMethods } from '../components/auth/AuthMethods';
import { isSupabaseConfigured } from '../lib/supabase';
import { SoftButton, SoftCard, inputClass, mutedClass, pageClass, titleClass } from '../components/platform/ui';

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
    <div className={`${pageClass} flex flex-col`}>
      <PlatformHeader />

      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24">
        <SoftCard className="w-full max-w-md p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h1 className={`${titleClass} text-2xl sm:text-3xl`}>Partner login</h1>
            <p className={mutedClass}>Google or phone OTP — then your dashboard.</p>
          </div>

          {isSupabaseConfigured ? (
            <AuthMethods role="brand_owner" nextPath="/dashboard" onVerified={handleVerified} />
          ) : (
            <p className="text-xs text-amber-800/80 bg-amber-50/80 border border-amber-100 rounded-2xl p-3">
              Add Supabase keys to enable Google and phone login. Email demo still works below.
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowEmail((v) => !v)}
            className="w-full text-[12px] text-stone-400 hover:text-[#1C1917] font-heroSans"
          >
            {showEmail ? 'Hide email login' : 'Use email & password'}
          </button>

          {showEmail && (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className={inputClass}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={inputClass}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <SoftButton type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <>Open dashboard <ArrowRight size={14} /></>}
              </SoftButton>
            </form>
          )}

          {error && !showEmail && <p className="text-xs text-red-500">{error}</p>}

          <p className="text-xs text-stone-500">
            New studio?{' '}
            <Link to="/signup" className="underline underline-offset-2 text-[#1C1917]">
              Get started
            </Link>
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[12px] text-stone-400 hover:text-[#1C1917]"
          >
            <ArrowLeft size={13} /> Home
          </button>
        </SoftCard>
      </main>
      <PlatformFooter />
    </div>
  );
}
