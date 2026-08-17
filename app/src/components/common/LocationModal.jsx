import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check, Compass } from 'lucide-react';
import { BHUBANESWAR_LOCALITIES } from '../../data/mockProviders';

export function LocationModal() {
  const locationModalOpen = useAppStore((state) => state.locationModalOpen);
  const setLocationModalOpen = useAppStore((state) => state.setLocationModalOpen);
  const selectedLocality = useAppStore((state) => state.selectedLocality);
  const setLocation = useAppStore((state) => state.setLocation);
  const showToast = useAppStore((state) => state.showToast);

  if (!locationModalOpen) return null;

  const handleSelect = (locality) => {
    setLocation('Bhubaneswar, OD', locality.name);
    showToast(`Location set to ${locality.name}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLocationModalOpen(false)}
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
            onClick={() => setLocationModalOpen(false)}
            className="absolute top-5 right-5 text-stone-400 hover:text-[#111111] transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="space-y-1 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2 text-stone-500">
              <MapPin size={15} />
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold">
                Hyper-Local Discovery
              </span>
            </div>
            <h3 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
              Select Service Locality
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Surface mobile home-service specialists and boutique salons near you.
            </p>
          </div>

          {/* Localities List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {BHUBANESWAR_LOCALITIES.map((loc) => {
              const isSelected = selectedLocality === loc.name;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white'
                      : 'border-stone-200 bg-[#F9F9F9] hover:border-stone-400 text-[#111111]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs tracking-wider uppercase font-semibold">
                      {loc.name}
                    </div>
                    <div className={`text-[10px] tracking-widest ${isSelected ? 'text-white/70' : 'text-stone-500'}`}>
                      {loc.count}
                    </div>
                  </div>
                  {isSelected && <Check size={16} className="text-white" />}
                </div>
              );
            })}
          </div>

          {/* City Footer Notice */}
          <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[11px] text-stone-500">
            <span>City: Bhubaneswar, Odisha</span>
            <span className="text-[10px] tracking-wider uppercase text-stone-400">Coverage: 30 km</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
