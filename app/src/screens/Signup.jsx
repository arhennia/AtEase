import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { AuthMethods } from '../components/auth/AuthMethods';
import { isSupabaseConfigured } from '../lib/supabase';

export function Signup() {
  const navigate = useNavigate();
  const signupPartner = useAppStore((s) => s.signupPartner);
  const applyAuthenticatedUser = useAppStore((s) => s.applyAuthenticatedUser);
  const showToast = useAppStore((s) => s.showToast);

  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleVerified = async () => {
    const result = await applyAuthenticatedUser({ intendedRole: 'brand_owner' });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast('Account ready. Set up your brand next.');
    navigate(result.redirectTo || '/onboarding');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@') || password.length < 6) {
      setError('Use a valid email and a password of at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await signupPartner({ email, password, ownerName });
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Failed to create account.');
      return;
    }
    showToast('Account started. Set up your brand next.');
    navigate('/onboarding');
  };

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      <PlatformHeader />
      <main className="max-w-md mx-auto px-4 py-16">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-stone-500 mb-8"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <h1 className="font-serif text-3xl uppercase tracking-wide mb-2">Start your trial</h1>
        <p className="text-sm text-stone-600 font-light mb-8">
          Brand owners sign in with Google or phone. End-clients never sign up here — they log in on your private site to book.
        </p>

        {isSupabaseConfigured ? (
          <div className="border border-stone-200 p-6 mb-6">
            <AuthMethods role="brand_owner" nextPath="/onboarding" onVerified={handleVerified} />
          </div>
        ) : (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 mb-6">
            Connect Supabase to use Google and phone signup.
          </p>
        )}

        <button type="button" onClick={() => setShowEmail((v) => !v)} className="text-[10px] tracking-[0.15em] uppercase text-stone-500 mb-4">
          {showEmail ? 'Hide email signup' : 'Or create an email account'}
        </button>

        {showEmail && (
          <form onSubmit={handleSubmit} className="space-y-4 border border-stone-200 p-6">
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="Your name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="you@studio.com"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="Password (min 6 characters)"
              required
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <>Continue to brand setup <ArrowRight size={14} /></>}
            </button>
          </form>
        )}

        {error && !showEmail && <p className="text-xs text-red-600 mt-3">{error}</p>}
        <p className="text-xs text-stone-500 mt-4">
          Already a partner? <Link to="/login" className="underline text-[#111111]">Log in</Link>
        </p>
      </main>
    </div>
  );
}
