import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { sendPhoneOtp, signInWithGoogle, verifyPhoneOtp, isSupabaseConfigured } from '../../lib/supabase';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.7 7.1l6.3 5.3C37.3 38.3 44 32 44 24c0-1.3-.1-2.5-.4-3.5z" />
    </svg>
  );
}

export function AuthMethods({
  role = 'client',
  nextPath = '/',
  onVerified,
  showGoogle = true,
}) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const intendedRole = role === 'partner' ? 'brand_owner' : role;

  const handleGoogle = async () => {
    setError('');
    if (!isSupabaseConfigured) {
      setError('Connect Supabase to use Google login.');
      return;
    }
    setLoading(true);
    const res = await signInWithGoogle({ role: intendedRole, nextPath });
    setLoading(false);
    if (!res.ok) setError(res.error);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await sendPhoneOtp(phone, { role: intendedRole });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await verifyPhoneOtp(phone, otp);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (onVerified) await onVerified(res);
  };

  return (
    <div className="space-y-4">
      {showGoogle && (
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-stone-300 bg-white py-3 text-xs tracking-[0.15em] uppercase font-bold hover:border-black flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>
      )}

      <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-stone-400">
        <span className="flex-1 h-px bg-stone-200" />
        or phone OTP
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-3">
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Mobile number</span>
            <div className="flex border border-stone-200 focus-within:border-black bg-[#F9F9F9]">
              <span className="px-3 py-2.5 text-xs text-stone-500 border-r border-stone-200 font-mono bg-stone-100">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                required
              />
            </div>
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-3">
          <p className="text-xs text-stone-500">Enter the 6-digit code sent to +91 {phone}</p>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-center tracking-[0.4em] text-lg outline-none focus:border-black"
            placeholder="000000"
            required
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Verify & continue'}
          </button>
          <button type="button" onClick={() => setStep('phone')} className="w-full text-[10px] uppercase tracking-wider text-stone-500">
            Change number
          </button>
        </form>
      )}
    </div>
  );
}
