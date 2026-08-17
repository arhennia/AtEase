import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, User, Store, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export function AuthModal() {
  const navigate = useNavigate();
  const authModalOpen = useAppStore((state) => state.authModalOpen);
  const authModalRole = useAppStore((state) => state.authModalRole);
  const closeAuthModal = useAppStore((state) => state.closeAuthModal);
  const login = useAppStore((state) => state.login);
  const showToast = useAppStore((state) => state.showToast);

  const [role, setRole] = useState(authModalRole || 'client');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync role with prop when modal opens
  React.useEffect(() => {
    if (authModalRole) setRole(authModalRole);
  }, [authModalRole, authModalOpen]);

  if (!authModalOpen) return null;

  const handleMockLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    // Realistic brief <= 300ms loading state for smooth UI feedback
    setTimeout(() => {
      setIsLoading(false);
      login(role);
      showToast(
        role === 'provider' 
          ? 'Welcome to AtEase Provider Suite' 
          : 'Welcome back! You are logged in.'
      );
      if (role === 'provider') {
        navigate('/provider');
      }
    }, 280);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#FFFFFF] w-full max-w-md border border-stone-200 shadow-2xl relative z-10 p-6 sm:p-8 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-stone-400 hover:text-[#111111] transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-stone-200 pb-5">
            <span className="font-serif text-xl tracking-[0.18em] font-normal uppercase text-[#111111] block">
              AtEase
            </span>
            <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Access &amp; Instant Verification
            </p>
          </div>

          {/* Role Switcher Tabs inside Modal */}
          <div className="grid grid-cols-2 p-1 bg-[#F9F9F9] border border-stone-200 rounded-sm text-[11px] tracking-wider uppercase font-semibold">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                role === 'client'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#111111]'
              }`}
            >
              <User size={12} />
              <span>Client</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`py-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                role === 'provider'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#111111]'
              }`}
            >
              <Store size={12} />
              <span>Provider</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleMockLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600">
                Mobile Number
              </label>
              <div className="flex border border-stone-200 focus-within:border-[#111111] transition-colors bg-[#F9F9F9]">
                <span className="px-3 py-2.5 text-xs text-stone-500 border-r border-stone-200 font-mono bg-stone-100">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210 (Optional in Demo)"
                  className="w-full bg-transparent px-3 py-2 text-xs tracking-wider focus:outline-none text-[#111111]"
                />
              </div>
              <p className="text-[10px] text-stone-400 font-light">
                {role === 'provider' 
                  ? 'Independent owners manage bookings and service catalogs directly.' 
                  : 'Instant mock sign-in. No waiting on SMS OTP.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Continue as {role === 'provider' ? 'Provider' : 'Client'}</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleMockLogin}
                className="w-full border border-stone-200 text-[#111111] py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[#111111] bg-[#F9F9F9] transition-colors"
              >
                1-Click Quick Guest Login
              </button>
            </div>
          </form>

          {/* Trust Notice */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-light">
            <ShieldCheck size={13} className="text-stone-400 shrink-0" />
            <span>AtEase is a discovery layer. You pay providers directly at service time.</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
