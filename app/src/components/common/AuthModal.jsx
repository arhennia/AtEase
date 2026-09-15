import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { AuthMethods } from '../auth/AuthMethods';
import { isSupabaseConfigured } from '../../lib/supabase';

export function AuthModal() {
  const location = useLocation();
  const authModalOpen = useAppStore((state) => state.authModalOpen);
  const closeAuthModal = useAppStore((state) => state.closeAuthModal);
  const applyAuthenticatedUser = useAppStore((state) => state.applyAuthenticatedUser);
  const login = useAppStore((state) => state.login);
  const showToast = useAppStore((state) => state.showToast);

  if (!authModalOpen) return null;

  const handleVerified = async () => {
    const result = await applyAuthenticatedUser({
      intendedRole: 'client',
      nextPath: location.pathname,
    });
    if (!result.ok) {
      showToast(result.error || 'Could not sign in');
      return;
    }
    showToast('Signed in. You can complete your booking.');
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#FFFFFF] w-full max-w-md border border-stone-200 shadow-2xl relative z-10 p-6 sm:p-8 space-y-6"
        >
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-stone-400 hover:text-[#111111] transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="text-center space-y-1.5 border-b border-stone-200 pb-5">
            <span className="font-serif text-xl tracking-[0.18em] font-normal uppercase text-[#111111] block">
              Sign in to book
            </span>
            <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Google or phone OTP
            </p>
          </div>

          {isSupabaseConfigured ? (
            <AuthMethods role="client" nextPath={location.pathname} onVerified={handleVerified} />
          ) : (
            <button
              type="button"
              onClick={() => {
                login('client', { userName: 'Priya Menon' });
                showToast('Demo client session. Connect Supabase for Google / phone login.');
                closeAuthModal();
              }}
              className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold"
            >
              Demo client login
            </button>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-light">
            <ShieldCheck size={13} className="text-stone-400 shrink-0" />
            <span>Your login stays with this studio booking. It is not a public marketplace account.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
