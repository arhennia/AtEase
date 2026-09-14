import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';

export function Signup() {
  const navigate = useNavigate();
  const signupPartner = useAppStore((s) => s.signupPartner);
  const showToast = useAppStore((s) => s.showToast);

  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@') || password.length < 4) {
      setError('Use a valid email and a password of at least 4 characters.');
      return;
    }
    setLoading(true);
    const result = signupPartner({ email, password, ownerName });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
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
          For brand owners only. End-clients book on your private site after setup — they never sign up here.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 border border-stone-200 p-6">
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Your name</span>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="Aisha"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Work email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="you@studio.com"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              required
            />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <>Continue to brand setup <ArrowRight size={14} /></>}
          </button>
        </form>
        <p className="text-xs text-stone-500 mt-4">
          Already a partner? <Link to="/login" className="underline text-[#111111]">Log in</Link>
        </p>
      </main>
    </div>
  );
}
