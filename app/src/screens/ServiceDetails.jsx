import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Star, Droplets, Wind, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export function ServiceDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateService = location.state?.service;
  const pricingMode = location.state?.pricingMode || 'HOME_VISIT';
  const providerName = location.state?.providerName || 'Rajkumari Beauty & Aesthetics';

  const serviceName = stateService?.name || 'Premium Hair Spa & Scalp Therapy';
  const duration = stateService?.duration || '60 mins';
  const description = stateService?.description || 'Indulge in our signature Hair Spa, a restorative ritual designed to revive dull, damaged tresses and promote long-term scalp health.';
  const price = stateService 
    ? (pricingMode === 'HOME_VISIT' ? stateService.homePrice : stateService.inSalonPrice)
    : 1200;
  const imageUrl = stateService?.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKvnWWMT6sraCqFE8R-osFGv8nIXIHhlF-ydUlezt76gL4FPjmprvc1yPtk8TS9adgW3L0ZhZD_3-rymjcFfLbzD2-ZxlqO8mNADIqVcUftBBcZQ-3ChDFEqSvA6nXDL9DosYK5cHkbSLEbhmDVptft8hCMActJm9KlzHwI75cc3C88rpZ4KEzQ1uLUexuZ1XtYWX9-1AiGGDGNWekOOM3ToIUiAK4YFXNCvKfbA_ZLXW3yc2x9tjmsYph_1-4OzxrPzurIYHDzw';

  const handleBookNow = () => {
    navigate('/date-time', {
      state: {
        serviceName,
        amount: price,
        serviceId: stateService?.id || 's2',
        pricingMode,
        providerName
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32 bg-white min-h-screen max-w-[480px] mx-auto border-x border-outline-variant/30 relative"
    >
      {/* Top Header Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-black hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[340px] md:h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-container-margin w-full">
          <div className="max-w-4xl mx-auto space-y-1">
            <span className="inline-block px-3 py-1 bg-accent-moss text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {providerName}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-white font-bold leading-tight">{serviceName}</h2>
            
            <div className="flex items-center gap-4 text-white/90 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock size={15} />
                <span className="text-xs font-semibold">{duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={15} className="fill-current text-amber-400" />
                <span className="text-xs font-semibold">4.9 Verified Treatment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="px-container-margin py-6 space-y-8">
        {/* Description */}
        <section className="space-y-2">
          <h3 className="text-lg font-serif font-bold text-primary">Treatment Overview</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {description}
          </p>
        </section>

        {/* What's Included */}
        <section className="space-y-3">
          <h3 className="text-lg font-serif font-bold text-primary">What's Included</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Droplets size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface mb-0.5">Deep Botanical Conditioning</h4>
                <p className="text-[11px] text-on-surface-variant">Penetrating moisture mask for instant softening and frizz control.</p>
              </div>
            </div>
            
            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-orange/10 text-accent-orange flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface mb-0.5">Therapeutic Scalp Pressure Massage</h4>
                <p className="text-[11px] text-on-surface-variant">Rhythmic head &amp; neck pressure point stimulation.</p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-moss/10 text-accent-moss flex items-center justify-center shrink-0">
                <Wind size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface mb-0.5">Professional Steam &amp; Blow Dry Styling</h4>
                <p className="text-[11px] text-on-surface-variant">Cuticle sealing steam therapy followed by signature salon blow-dry finish.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-3">
          <h3 className="text-lg font-serif font-bold text-primary">Key Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {['Deep Hydration', 'Scalp Detox', 'Stress Relief', 'Frizz Control'].map((benefit, i) => (
              <div key={i} className="px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-primary" />
                <span className="text-xs font-semibold text-on-surface">{benefit}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full max-w-[480px] md:left-1/2 md:-translate-x-1/2 bg-white/95 backdrop-blur-xl border-t border-outline-variant/50 px-container-margin py-4 flex items-center justify-between shadow-2xl z-40">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
            {pricingMode === 'HOME_VISIT' ? 'Home Visit Rate' : 'In-Salon Rate'}
          </span>
          <span className="text-xl font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>
        </div>
        <button 
          onClick={handleBookNow}
          className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <span>Select Date &amp; Time</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
