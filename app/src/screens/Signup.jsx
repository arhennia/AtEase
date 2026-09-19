import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { PlatformFooter } from '../components/platform/PlatformFooter';
import { AuthMethods } from '../components/auth/AuthMethods';
import { isSupabaseConfigured } from '../lib/supabase';
import { SoftButton, SoftCard, inputClass, mutedClass, pageClass, titleClass } from '../components/platform/ui';

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
    <div className={`${pageClass} flex flex-col`}>
      <PlatformHeader />
      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24">
        <SoftCard className="w-full max-w-md p-8 sm:p-10 space-y-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[12px] text-stone-400 hover:text-[#1C1917]"
          >
            <ArrowLeft size={13} /> Home
          </button>
          <div className="space-y-2">
            <h1 className={`${titleClass} text-2xl sm:text-3xl`}>Create your studio</h1>
            <p className={mutedClass}>After this, a short quiz builds your website and dashboard.</p>
          </div>

          {isSupabaseConfigured ? (
            <AuthMethods role="brand_owner" nextPath="/onboarding" onVerified={handleVerified} />
          ) : (
            <p className="text-xs text-amber-800/80 bg-amber-50/80 border border-amber-100 rounded-2xl p-3">
              Connect Supabase to use Google and phone signup.
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowEmail((v) => !v)}
            className="text-[12px] text-stone-400 hover:text-[#1C1917]"
          >
            {showEmail ? 'Hide email signup' : 'Or create an email account'}
          </button>

          {showEmail && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@studio.com"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Password (min 6 characters)"
                required
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <SoftButton type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <>Continue to brand setup <ArrowRight size={14} /></>}
              </SoftButton>
            </form>
          )}

          {error && !showEmail && <p className="text-xs text-red-500">{error}</p>}
          <p className="text-xs text-stone-500">
            Already a partner?{' '}
            <Link to="/login" className="underline underline-offset-2 text-[#1C1917]">
              Log in
            </Link>
          </p>
        </SoftCard>
      </main>
      <PlatformFooter />
    </div>
  );
}
