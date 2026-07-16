import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Star, Droplets, Wind, Sparkles, ArrowRight } from 'lucide-react';

export function ServiceDetails() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      {/* Hero Section */}
      <section className="relative w-full h-[340px] md:h-[440px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKvnWWMT6sraCqFE8R-osFGv8nIXIHhlF-ydUlezt76gL4FPjmprvc1yPtk8TS9adgW3L0ZhZD_3-rymjcFfLbzD2-ZxlqO8mNADIqVcUftBBcZQ-3ChDFEqSvA6nXDL9DosYK5cHkbSLEbhmDVptft8hCMActJm9KlzHwI75cc3C88rpZ4KEzQ1uLUexuZ1XtYWX9-1AiGGDGNWekOOM3ToIUiAK4YFXNCvKfbA_ZLXW3yc2x9tjmsYph_1-4OzxrPzurIYHDzw')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-container-margin w-full">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-accent-moss text-white text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
              Treatment
            </span>
            <h2 className="text-3xl font-serif text-white font-bold mb-2">Premium Hair Spa</h2>
            
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span className="text-sm font-medium">60 mins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="fill-current" />
                <span className="text-sm font-medium">4.9 (120 Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="px-container-margin py-6 space-y-8">
        {/* Description */}
        <section>
          <h3 className="text-xl font-serif font-bold text-primary mb-3">Description</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Indulge in our signature Premium Hair Spa, a restorative ritual designed to revive dull, damaged tresses and promote long-term scalp health. This treatment combines high-performance botanical extracts with traditional therapeutic techniques to create a holistic sensory experience that transcends standard salon care.
          </p>
        </section>

        {/* What's Included */}
        <section>
          <h3 className="text-xl font-serif font-bold text-primary mb-3">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Droplets size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-0.5">Deep Conditioning</h4>
                <p className="text-xs text-on-surface-variant">Penetrating moisture mask for intense hydration.</p>
              </div>
            </div>
            
            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-orange/10 text-accent-orange flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-0.5">Scalp Massage</h4>
                <p className="text-xs text-on-surface-variant">15-minute rhythmic pressure point therapy.</p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3 md:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-accent-moss/10 text-accent-moss flex items-center justify-center shrink-0">
                <Wind size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-0.5">Steam Treatment</h4>
                <p className="text-xs text-on-surface-variant">Ozone steam to open cuticles for maximum nutrient absorption.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section>
          <h3 className="text-xl font-serif font-bold text-primary mb-3">Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {['Intense Hydration', 'Scalp Health', 'Stress Relief', 'Frizz Control'].map((benefit, i) => (
              <div key={i} className="px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-primary" />
                <span className="text-xs font-semibold text-on-surface">{benefit}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full max-w-[480px] md:left-1/2 md:-translate-x-1/2 bg-white/90 backdrop-blur-xl border-t border-outline-variant/50 px-container-margin py-4 flex items-center justify-between shadow-2xl z-40">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Price</span>
          <span className="text-2xl font-bold text-primary">₹1,200</span>
        </div>
        <button 
          onClick={() => navigate('/date-time')}
          className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          Book Now
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
