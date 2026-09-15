import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { slugify, TRIAL_DAYS } from '../lib/tenancy';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PlatformHeader } from '../components/platform/PlatformHeader';

export function Onboarding() {
  const navigate = useNavigate();
  const pendingSignup = useAppStore((s) => s.pendingSignup);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const showToast = useAppStore((s) => s.showToast);

  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [theme, setTheme] = useState('#111111');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!pendingSignup) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <p className="text-sm text-stone-600">Start with an account first.</p>
          <button type="button" onClick={() => navigate('/signup')} className="underline text-sm">
            Go to signup
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await completeOnboarding({
        brandName,
        logoUrl,
        theme,
        location,
        description,
        servicesText,
        whatsappNumber,
      });
      setLoading(false);
      if (!res.ok) {
        setError(res.error || 'Could not complete brand setup.');
        return;
      }
      showToast(`${TRIAL_DAYS}-day trial started for ${res.partner?.brandName || brandName}.`);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Setup error. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      <PlatformHeader />
      <main className="max-w-lg mx-auto px-4 py-12">
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 mb-2">Brand setup</p>
        <h1 className="font-serif text-3xl uppercase tracking-wide mb-2">Your client website</h1>
        <p className="text-sm text-stone-600 font-light mb-8">
          Preview URL: <span className="font-mono text-xs">/p/{slugify(brandName) || 'your-brand'}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 border border-stone-200 p-6">
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Brand name</span>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="Luxe Studio Aisha"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Logo URL (optional)</span>
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="https://…"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Theme accent</span>
            <input type="color" value={theme} onChange={(e) => setTheme(e.target.value)} className="h-10 w-20 border border-stone-200" />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">WhatsApp number</span>
            <input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="+91 98765 43210"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Service area</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder="Bhubaneswar"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Brand line</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500">Services (one per line)</span>
            <textarea
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              rows={4}
              className="w-full border border-stone-200 bg-[#F9F9F9] px-3 py-2.5 text-sm outline-none focus:border-black"
              placeholder={'Keratin smoothing\nBridal trial'}
            />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Launching your studio...</span>
              </>
            ) : (
              <>
                <span>Launch trial dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
