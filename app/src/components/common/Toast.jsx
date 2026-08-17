import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function Toast() {
  const toastMessage = useAppStore((state) => state.toastMessage);
  const hideToast = useAppStore((state) => state.hideToast);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-[#111111] text-white px-5 py-3.5 border border-black shadow-2xl flex items-center gap-3 text-xs tracking-wider uppercase font-medium"
        >
          <Info size={16} className="text-white/80 shrink-0" />
          <span className="flex-1 font-sans">{toastMessage}</span>
          <button
            onClick={hideToast}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
