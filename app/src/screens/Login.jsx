import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AuthMethods } from '../components/auth/AuthMethods';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';
import { ShaderBackground } from '../components/ui/hero-shader';
import { isSupabaseConfigured } from '../lib/supabase';

const fieldClass =
  'w-full rounded-xl border border-[#E7E3EE] bg-white px-3.5 py-3 text-sm font-heroSans text-[#1C1917] outline-none placeholder:text-stone-400 focus:border-[#C4B5D4] focus:ring-2 focus:ring-[#EDE9FE]';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginPartner = useAppStore((state) => state.loginPartner);
  const applyAuthenticatedUser = useAppStore((state) => state.applyAuthenticatedUser);
  const showToast = useAppStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const handleVerified = async () => {
    const result = await applyAuthenticatedUser({ nextPath: '/dashboard' });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.role !== 'partner') {
      setError('This account is not a studio owner.');
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
    <div className="relative z-10 flex min-h-screen items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-[1040px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-36px_rgba(76,29,149,0.35)] md:grid-cols-2">
        <div className="h-full p-3 sm:p-4">
          <div className="relative h-full min-h-[260px] overflow-hidden rounded-[22px]">
            <ShaderBackground className="absolute inset-0 h-full !min-h-0">
              <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-between p-7 text-white sm:p-9">
                <button type="button" onClick={() => navigate('/')} className="w-fit text-left hover:opacity-80">
                  <AtEaseLogo className="text-[1.7rem] text-white" />
                </button>
                <div className="max-w-[16rem]">
                  <p className="font-heroSans text-sm text-white/70">You can easily</p>
                  <h2 className="mt-2 font-heroSans text-[1.85rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.15rem]">
                    Run your beauty business from one calm home.
                  </h2>
                </div>
              </div>
            </ShaderBackground>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
          <AtEaseLogo className="text-[1.55rem] text-[#6D5A8D]" />
          <h1 className="mt-6 font-heroSans text-[1.85rem] font-semibold tracking-tight text-[#1C1917]">Log in</h1>
          <p className="mt-2 max-w-sm font-heroSans text-sm leading-relaxed text-stone-500">
            Bookings, clients, and your schedule — back in one place.
          </p>

          <div className="mt-8 space-y-4">
            {isSupabaseConfigured ? (
              <AuthMethods
                variant="panel"
                role="brand_owner"
                nextPath="/dashboard"
                onVerified={handleVerified}
              />
            ) : (
              <p className="rounded-xl border border-amber-100 bg-amber-50/80 p-3 text-xs text-amber-800/80">
                Add Supabase keys to enable Google, phone, and email login.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowEmail((v) => !v)}
              className="w-full font-heroSans text-[13px] text-stone-400 hover:text-[#1C1917]"
            >
              {showEmail ? 'Hide email login' : 'Use email & password'}
            </button>

            {showEmail && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="font-heroSans text-sm font-medium text-[#1C1917]">Your email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    className={fieldClass}
                    required
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="font-heroSans text-sm font-medium text-[#1C1917]">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className={`${fieldClass} pr-11`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#1C1917]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D5A8D] py-3 font-heroSans text-[13px] font-medium text-white hover:bg-[#5C4B78] disabled:opacity-40"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <>Open dashboard <ArrowRight size={14} /></>}
                </button>
              </form>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <p className="mt-8 text-center font-heroSans text-sm text-stone-500">
            New studio?{' '}
            <Link to="/signup" className="font-medium text-[#6D5A8D] hover:text-[#5C4B78]">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
