import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowRight, Loader2, ArrowLeft, Store } from 'lucide-react';
import { DEMO_PARTNER_EMAIL, DEMO_PARTNER_PASSWORD } from '../lib/tenancy';
import { PlatformHeader } from '../components/platform/PlatformHeader';

export function Login() {
  const navigate = useNavigate();
  const loginPartner = useAppStore((state) => state.loginPartner);
  const showToast = useAppStore((state) => state.showToast);

  const [email, setEmail] = useState(DEMO_PARTNER_EMAIL);
  const [password, setPassword] = useState(DEMO_PARTNER_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginPartner({ email, password });
      setIsLoading(false);
      if (!result.ok) {
        setError(result.error || 'Failed to sign in. Check email and password.');
        return;
      }
      if (result.needsOnboarding) {
        showToast('Welcome back. Complete setting up your brand.');
        navigate('/onboarding');
        return;
      }
      showToast('Welcome back. Opening your dashboard.');
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setError(err?.message || 'Login error occurred.');
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen w-full font-sans text-[#111111] antialiased">
      <PlatformHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-[#FFFFFF] w-full max-w-md border border-stone-200 p-8 sm:p-10 space-y-6 shadow-lg">
          <div className="text-center space-y-1.5 border-b border-stone-200 pb-5">
            <Store size={18} className="mx-auto" />
            <span className="font-serif text-2xl tracking-[0.18em] font-normal uppercase text-[#111111] block">
              Partner login
            </span>
            <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Brand owners only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F9F9F9] border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F9F9F9] border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
              <p className="text-[10px] text-stone-400 font-light">
                Demo: {DEMO_PARTNER_EMAIL} / {DEMO_PARTNER_PASSWORD}
              </p>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}

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
                  <span>Open dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

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
    </div>
  );
}
