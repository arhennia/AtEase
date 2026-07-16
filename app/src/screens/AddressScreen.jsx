import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Briefcase, Info, CheckCircle2, ChevronRight } from 'lucide-react';

export function AddressScreen() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState('home');

  const handleReview = () => {
    navigate('/review');
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 w-full max-w-[480px] mx-auto bg-background flex flex-col min-h-screen relative shadow-sm border-x border-outline-variant/30"
    >
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-50 bg-white border-b border-surface-variant transition-colors duration-200">
        <div className="flex items-center justify-between px-container-margin h-14">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-start text-primary"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] text-primary flex-1 text-center font-bold tracking-tight">Service Address</h1>
          <div className="w-8 h-8"></div>
        </div>
      </header>

      <div className="px-container-margin py-6 space-y-8 pb-32">
        {/* Saved Addresses Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[11px] font-bold text-on-surface uppercase tracking-wider opacity-60">Saved Locations</h2>
          </div>
          <div className="space-y-2">
            {/* Home Address */}
            <div 
              onClick={() => setSelectedAddress('home')}
              className={`p-3 rounded-lg flex items-center gap-4 transition-all duration-150 cursor-pointer border ${
                selectedAddress === 'home' 
                  ? 'bg-surface-container-low border-primary' 
                  : 'bg-white border-outline-variant hover:border-primary/50'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                selectedAddress === 'home' ? 'bg-primary/10 text-primary' : 'bg-surface-variant/50 text-on-surface-variant'
              }`}>
                <Home size={18} className={selectedAddress === 'home' ? 'fill-current' : ''} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-on-surface">Home</p>
                <p className="text-on-surface-variant text-[13px] truncate opacity-80">Plot No. 42, Unit-III, Kharabela Nagar...</p>
              </div>
              {selectedAddress === 'home' && (
                <div className="text-primary flex items-center">
                  <CheckCircle2 size={20} className="fill-current" />
                </div>
              )}
            </div>

            {/* Work Address */}
            <div 
              onClick={() => setSelectedAddress('work')}
              className={`p-3 rounded-lg flex items-center gap-4 transition-all duration-150 cursor-pointer border ${
                selectedAddress === 'work' 
                  ? 'bg-surface-container-low border-primary' 
                  : 'bg-white border-outline-variant hover:border-primary/50'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                selectedAddress === 'work' ? 'bg-primary/10 text-primary' : 'bg-surface-variant/50 text-on-surface-variant'
              }`}>
                <Briefcase size={18} className={selectedAddress === 'work' ? 'fill-current' : ''} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-on-surface">Work</p>
                <p className="text-on-surface-variant text-[13px] truncate opacity-80">DLF Cyber City, Tower B, 4th Floor...</p>
              </div>
              {selectedAddress === 'work' && (
                <div className="text-primary flex items-center">
                  <CheckCircle2 size={20} className="fill-current" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Note */}
        <div className="px-1">
          <div className="bg-primary/5 border border-primary/10 p-3 rounded flex items-center gap-2">
            <Info size={16} className="text-primary" />
            <p className="text-primary text-[11px] uppercase tracking-wide font-semibold">Available in Bhubaneswar only</p>
          </div>
        </div>

        {/* Add New Address Form */}
        <section className="space-y-6">
          <h2 className="text-[11px] font-bold text-on-surface uppercase tracking-wider opacity-60">Add New Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="col-span-1 space-y-1.5 relative">
              <label className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-widest px-0.5">House / Flat</label>
              <input type="text" placeholder="e.g. 101" className="w-full h-10 bg-transparent border-b border-outline-variant px-0 text-[15px] focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/40 outline-none" />
            </div>
            <div className="col-span-1 space-y-1.5 relative">
              <label className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-widest px-0.5">Pincode</label>
              <input type="number" placeholder="751001" className="w-full h-10 bg-transparent border-b border-outline-variant px-0 text-[15px] focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/40 outline-none" />
            </div>
            <div className="col-span-2 space-y-1.5 relative">
              <label className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-widest px-0.5">Apartment / Street</label>
              <input type="text" placeholder="e.g. Green Valley Residency" className="w-full h-10 bg-transparent border-b border-outline-variant px-0 text-[15px] focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/40 outline-none" />
            </div>
            <div className="col-span-2 space-y-1.5 relative">
              <label className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-widest px-0.5">Area / Locality</label>
              <input type="text" placeholder="e.g. Nayapalli" className="w-full h-10 bg-transparent border-b border-outline-variant px-0 text-[15px] focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/40 outline-none" />
            </div>
            <div className="col-span-2 space-y-1.5 relative">
              <label className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-widest px-0.5">Landmark</label>
              <input type="text" placeholder="e.g. Near Big Bazaar" className="w-full h-10 bg-transparent border-b border-outline-variant px-0 text-[15px] focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/40 outline-none" />
            </div>
          </div>
        </section>

        {/* Special Instructions */}
        <section className="space-y-6">
          <h2 className="text-[11px] font-bold text-on-surface uppercase tracking-wider opacity-60">Entry Instructions</h2>
          <textarea 
            placeholder="e.g. Door bell is broken, please call on arrival..." 
            rows={2} 
            className="w-full bg-surface-variant border border-outline-variant/30 p-4 text-[13px] focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/50 resize-none italic rounded-xl outline-none"
          ></textarea>
        </section>
      </div>

      {/* Fixed Bottom Action Bar */}
      <footer className="fixed bottom-0 md:left-1/2 md:-translate-x-1/2 w-full max-w-[480px] z-50 bg-white/90 backdrop-blur-md px-container-margin py-4 flex justify-center shadow-[0_-4px_12px_rgba(0,0,0,0.03)] border-t border-outline-variant/30">
        <button 
          onClick={handleReview}
          className="w-full bg-primary text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          <span className="uppercase tracking-widest text-[13px]">Confirm & Review</span>
          <ChevronRight size={20} />
        </button>
      </footer>
    </motion.main>
  );
}
