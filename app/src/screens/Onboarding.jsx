import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { slugify, TRIAL_DAYS } from '../lib/tenancy';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { getAuthUser, isSupabaseConfigured, uploadOwnerImage } from '../lib/supabase';
import {
  CITIES,
  CRAFTS,
  PRICE_BANDS,
  VISIT_TYPES,
  formatUptoPrice,
  presetsForCrafts,
} from '../data/onboardingQuiz';
import { isValidWhatsAppNumber } from '../lib/whatsapp';

const STEPS = [
  { id: 'name', title: 'What should we call your studio?' },
  { id: 'craft', title: 'What kind of work do you do?' },
  { id: 'visit', title: 'Where do you see clients?' },
  { id: 'city', title: 'Which city are you in?' },
  { id: 'whatsapp', title: 'What WhatsApp number should clients message?' },
  { id: 'price', title: 'Typical price for a service?' },
  { id: 'menu', title: 'Pick the services you offer' },
];

function Option({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[52px] px-4 py-3 text-sm text-left border transition-colors ${
        selected
          ? 'bg-[#111111] text-white border-[#111111]'
          : 'bg-white text-[#111111] border-stone-200 hover:border-stone-400'
      } ${className}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{children}</span>
        {selected ? <Check size={14} className="shrink-0" /> : null}
      </span>
    </button>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function resolveImageUrl(file, userId) {
  if (isSupabaseConfigured && userId) {
    const uploaded = await uploadOwnerImage(userId, file);
    if (uploaded.ok) return uploaded.url;
  }
  return readFileAsDataUrl(file);
}

export function Onboarding() {
  const navigate = useNavigate();
  const pendingSignup = useAppStore((s) => s.pendingSignup);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const showToast = useAppStore((s) => s.showToast);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userEmail = useAppStore((s) => s.userEmail);
  const userName = useAppStore((s) => s.userName);

  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [crafts, setCrafts] = useState([]);
  const [visitType, setVisitType] = useState('');
  const [location, setLocation] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [uptoPrice, setUptoPrice] = useState(1000);
  const [selectedNames, setSelectedNames] = useState([]);
  const [serviceImages, setServiceImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(Boolean(pendingSignup));
  const [userId, setUserId] = useState(pendingSignup?.userId || '');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (pendingSignup) {
        setUserId(pendingSignup.userId || '');
        setReady(true);
        return;
      }
      const user = await getAuthUser();
      if (cancelled) return;
      if (user) {
        useAppStore.setState({
          pendingSignup: {
            email: user.email || userEmail || '',
            ownerName: user.user_metadata?.full_name || user.user_metadata?.name || userName || 'Owner',
            userId: user.id,
          },
          isAuthenticated: true,
          userRole: 'partner',
        });
        setUserId(user.id);
        setReady(true);
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [pendingSignup, userEmail, userName]);

  const presets = useMemo(() => presetsForCrafts(crafts), [crafts]);
  const canOnboard = Boolean(pendingSignup) || isAuthenticated;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const canContinue = () => {
    if (step === 0) return Boolean(brandName.trim());
    if (step === 1) return crafts.length > 0;
    if (step === 2) return Boolean(visitType);
    if (step === 3) return Boolean(location);
    if (step === 4) return isValidWhatsAppNumber(whatsappNumber);
    if (step === 5) return Boolean(uptoPrice);
    if (step === 6) return selectedNames.length > 0;
    return true;
  };

  const toggleCraft = (id) => {
    setCrafts((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      const allowed = new Set(presetsForCrafts(next).map((p) => p.name));
      setSelectedNames((names) => names.filter((n) => allowed.has(n)));
      return next;
    });
  };

  const toggleService = (name) => {
    setSelectedNames((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const handleLogo = async (file) => {
    if (!file) return;
    setUploading('logo');
    try {
      const url = await resolveImageUrl(file, userId);
      setLogoUrl(url);
    } finally {
      setUploading('');
    }
  };

  const handleServiceImage = async (name, file) => {
    if (!file) return;
    setUploading(name);
    try {
      const url = await resolveImageUrl(file, userId);
      setServiceImages((prev) => ({ ...prev, [name]: url }));
    } finally {
      setUploading('');
    }
  };

  const handleLaunch = async () => {
    if (!brandName.trim() || selectedNames.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const services = presets
        .filter((p) => selectedNames.includes(p.name))
        .map((p, idx) => ({
          id: `custom-${idx}`,
          name: p.name,
          duration: p.duration,
          description: '',
          uptoPrice,
          imageUrl: serviceImages[p.name] || '',
          categoryName: 'MENU',
        }));

      const res = await completeOnboarding({
        brandName,
        location,
        visitType,
        crafts: crafts.map((id) => CRAFTS.find((c) => c.id === id)?.label || id),
        uptoPrice,
        services,
        logoUrl,
        whatsappNumber,
      });
      setLoading(false);
      if (!res.ok) {
        setError(res.error || 'Could not finish setup.');
        return;
      }
      showToast(`${TRIAL_DAYS}-day trial started for ${res.partner?.brandName || brandName}.`);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Setup error. Please try again.');
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm text-stone-500">
        Loading…
      </div>
    );
  }

  if (!canOnboard) {
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

  return (
    <div className="bg-white min-h-screen text-[#111111] flex flex-col">
      <PlatformHeader />
      <div className="h-1 bg-stone-100">
        <div className="h-full bg-[#111111] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 w-full max-w-[640px] mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col">
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 mb-3">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight mb-2">
          {STEPS[step].title}
        </h1>
        <p className="text-sm text-stone-500 font-light mb-8 min-h-[20px]">
          {step === 0 && (
            <>
              Preview: <span className="font-mono text-xs">/p/{slugify(brandName) || 'your-brand'}</span>
            </>
          )}
          {step === 1 && 'Tap all that apply.'}
          {step === 2 && 'This decides how clients book you.'}
          {step === 3 && 'We use this on your website.'}
          {step === 4 && 'Bookings open WhatsApp with a pre-filled message to this number.'}
          {step === 5 && 'Shown on your menu as an “upto” price, not a fixed rate.'}
          {step === 6 && 'Tap to add. You can attach a photo for the menu.'}
        </p>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={STEPS[step].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {step === 0 && (
                <div className="space-y-6">
                  <input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full border border-stone-200 bg-[#F9F9F9] px-4 py-3.5 text-base outline-none focus:border-black"
                    placeholder="Luxe Studio"
                    autoFocus
                  />
                  <label className="flex items-center gap-4 cursor-pointer">
                    <span className="w-16 h-16 border border-stone-200 bg-[#F9F9F9] overflow-hidden flex items-center justify-center shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus size={18} className="text-stone-400" />
                      )}
                    </span>
                    <span className="text-sm text-stone-600">
                      {uploading === 'logo' ? 'Uploading…' : 'Add a logo (optional)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleLogo(e.target.files?.[0])}
                    />
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CRAFTS.map((craft) => (
                    <Option
                      key={craft.id}
                      selected={crafts.includes(craft.id)}
                      onClick={() => toggleCraft(craft.id)}
                    >
                      {craft.label}
                    </Option>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-3">
                  {VISIT_TYPES.map((item) => (
                    <Option key={item.id} selected={visitType === item.id} onClick={() => setVisitType(item.id)}>
                      {item.label}
                    </Option>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  {CITIES.map((city) => (
                    <Option key={city} selected={location === city} onClick={() => setLocation(city)}>
                      {city}
                    </Option>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <div className="flex border border-stone-200 focus-within:border-black bg-[#F9F9F9]">
                    <span className="px-3 py-3.5 text-sm text-stone-500 border-r border-stone-200 font-mono bg-stone-100">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full bg-transparent px-4 py-3.5 text-base outline-none"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-stone-500 font-light">
                    Use the number you already chat with clients on. 10 digits.
                  </p>
                </div>
              )}

              {step === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRICE_BANDS.map((band) => (
                    <Option key={band.value} selected={uptoPrice === band.value} onClick={() => setUptoPrice(band.value)}>
                      {band.label}
                    </Option>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="space-y-3">
                  {presets.map((item) => {
                    const selected = selectedNames.includes(item.name);
                    return (
                      <div key={item.name} className="border border-stone-200">
                        <Option selected={selected} onClick={() => toggleService(item.name)} className="w-full border-0">
                          <span className="flex flex-col">
                            <span>{item.name}</span>
                            <span className={`text-[11px] mt-0.5 ${selected ? 'text-white/70' : 'text-stone-400'}`}>
                              {item.duration} · {formatUptoPrice(uptoPrice)}
                            </span>
                          </span>
                        </Option>
                        {selected && (
                          <label className="flex items-center gap-3 px-4 py-3 border-t border-stone-200 bg-[#F9F9F9] cursor-pointer">
                            <span className="w-12 h-12 bg-white border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                              {serviceImages[item.name] ? (
                                <img src={serviceImages[item.name]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImagePlus size={16} className="text-stone-400" />
                              )}
                            </span>
                            <span className="text-xs text-stone-600">
                              {uploading === item.name ? 'Uploading…' : 'Add a photo for the menu'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleServiceImage(item.name, e.target.files?.[0])}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {error && <p className="text-xs text-red-600 mt-6">{error}</p>}

        <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="h-12 px-4 text-xs tracking-[0.18em] uppercase font-bold text-stone-500 disabled:opacity-30 flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          {isLast ? (
            <button
              type="button"
              disabled={!canContinue() || loading}
              onClick={handleLaunch}
              className="h-12 px-6 bg-[#111111] text-white text-xs tracking-[0.18em] uppercase font-bold flex items-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              {loading ? 'Building your site…' : 'Open dashboard'}
            </button>
          ) : (
            <button
              type="button"
              disabled={!canContinue()}
              onClick={() => setStep((s) => s + 1)}
              className="h-12 px-6 bg-[#111111] text-white text-xs tracking-[0.18em] uppercase font-bold flex items-center gap-2 disabled:opacity-40"
            >
              Continue
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
