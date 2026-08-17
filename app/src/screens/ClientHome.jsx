import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/common/Header';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { MOCK_PROVIDERS, CATEGORIES_LIST } from '../data/mockProviders';
import { 
  MapPin, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Scissors, 
  Home, 
  Building2, 
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Phone
} from 'lucide-react';

export function ClientHome() {
  const navigate = useNavigate();
  
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const activeFilter = useAppStore((state) => state.activeFilter);
  const setActiveFilter = useAppStore((state) => state.setActiveFilter);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const selectedLocality = useAppStore((state) => state.selectedLocality);
  const openBookingModal = useAppStore((state) => state.openBookingModal);
  const openAuthModal = useAppStore((state) => state.openAuthModal);

  // Filter provider list by search query, category, and 3-state service type filter
  const filteredProviders = MOCK_PROVIDERS.filter((provider) => {
    // 1. Search filter
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category filter
    const matchesCategory =
      selectedCategory === 'ALL' ||
      provider.categories.some((cat) => cat === selectedCategory);

    // 3. Segmented control filter (3 states)
    let matchesServiceType = true;
    if (activeFilter === 'at-home') {
      matchesServiceType = provider.type === 'at-home' || provider.type === 'both';
    } else if (activeFilter === 'in-studio') {
      matchesServiceType = provider.type === 'in-studio' || provider.type === 'both';
    }

    return matchesSearch && matchesCategory && matchesServiceType;
  });

  return (
    <div className="bg-[#FFFFFF] text-[#111111] font-sans antialiased min-h-screen selection:bg-[#111111] selection:text-white">
      
      {/* Global Header */}
      <Header />

      {/* Dual Role Switcher Banner (Above the fold) */}
      <RoleSwitcher currentView="client" />

      {/* Main Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-32 space-y-12 sm:space-y-16">
        
        {/* Editorial Hero Discovery Module */}
        <section className="border-b border-stone-200 pb-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
                  {selectedLocality || 'Bhubaneswar, Odisha'} • Direct Beauty Layer
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-[0.04em] uppercase font-normal leading-[1.15] text-[#111111]">
                Curated Beauty &amp; Wellness Directory
              </h1>
              <p className="text-xs sm:text-sm tracking-wide text-stone-600 font-light leading-relaxed">
                Discover master aestheticians, bridal makeup artists, and boutique parlors delivering luxury treatments to your doorstep or in-studio.
              </p>
            </div>

            {/* Hyper-Local Discovery Trust Tag */}
            <div className="p-4 bg-[#F9F9F9] border border-stone-200 max-w-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold text-[#111111]">
                <ShieldCheck size={14} className="text-[#111111]" />
                <span>Direct Provider Booking</span>
              </div>
              <p className="text-[11px] text-stone-500 font-light leading-snug">
                Zero commissions. Providers set their own rates and are paid directly by you.
              </p>
            </div>
          </div>

          {/* Discovery Filter Controls Bar */}
          <div className="pt-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* Category Chips (Horizontally Scrollable on Mobile) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto py-1">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all whitespace-nowrap rounded-full border ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                        : 'bg-[#FFFFFF] text-stone-700 border-stone-200 hover:border-[#111111]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* 3-State Segmented Filter Control */}
            <div className="flex items-center p-1 bg-[#F9F9F9] border border-stone-200 rounded-full text-[10px] tracking-wider uppercase font-semibold w-full sm:w-auto self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full transition-all text-center ${
                  activeFilter === 'all'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                }`}
              >
                All Services
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('at-home')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full transition-all flex items-center justify-center gap-1 text-center ${
                  activeFilter === 'at-home'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                }`}
              >
                <Home size={11} />
                <span>At-Home Services</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('in-studio')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full transition-all flex items-center justify-center gap-1 text-center ${
                  activeFilter === 'in-studio'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                }`}
              >
                <Building2 size={11} />
                <span>In-Studio / Boutiques</span>
              </button>
            </div>

          </div>
        </section>

        {/* Boutique & Artist Grid Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-stone-200 pb-3">
            <h2 className="font-serif text-lg tracking-[0.1em] uppercase font-normal text-[#111111]">
              Verified Providers ({filteredProviders.length})
            </h2>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500">
              Showing Specialists Servicing {selectedLocality ? selectedLocality.split('&')[0].trim() : 'Bhubaneswar'}
            </span>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="p-16 border border-dashed border-stone-300 text-center space-y-4 bg-[#F9F9F9]">
              <p className="font-serif text-lg tracking-wide uppercase text-stone-800">
                No Providers Match Your Criteria
              </p>
              <p className="text-xs text-stone-500 font-light max-w-md mx-auto">
                Try switching between "All Services", "At-Home Services", or adjusting your category selection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="bg-[#111111] text-white px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-black"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProviders.map((provider) => {
                const isMobile = provider.type === 'at-home' || provider.type === 'both';

                return (
                  <motion.div
                    key={provider.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="border border-stone-200 bg-[#FFFFFF] flex flex-col justify-between hover:border-stone-400 hover:shadow-lg transition-all group"
                  >
                    <div>
                      {/* Full-Color Natural High-Res Photography (Never filtered) */}
                      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                        <img
                          src={provider.imageUrl}
                          alt={provider.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Distance & Mobile Indicator Badge */}
                        <div className="absolute bottom-3 left-3 bg-[#111111] text-white px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                          <MapPin size={10} className="text-white shrink-0" />
                          <span>{provider.distance} • {provider.badgeText}</span>
                        </div>

                        {/* Rating Pill */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#111111] border border-stone-200 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1">
                          <Star size={11} className="fill-[#111111] text-[#111111]" />
                          <span>{provider.rating} ({provider.reviewCount})</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-stone-500">
                              {provider.typeLabel}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#111111]">
                              From ₹{provider.startingPrice}
                            </span>
                          </div>

                          <h3 
                            onClick={() => navigate(provider.storefrontRoute)}
                            className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111] group-hover:underline cursor-pointer line-clamp-1"
                          >
                            {provider.name}
                          </h3>

                          <p className="text-[11px] text-stone-500 font-medium tracking-wide">
                            {provider.location}
                          </p>
                        </div>

                        <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2">
                          {provider.description}
                        </p>

                        {/* Service Menu Preview Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {provider.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] tracking-wider uppercase font-medium bg-[#F9F9F9] border border-stone-200 px-2 py-0.5 text-stone-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-0 space-y-2 border-t border-stone-100 bg-[#FFFFFF]">
                      <div className="grid grid-cols-2 gap-2 pt-3">
                        <button
                          onClick={() => navigate(provider.storefrontRoute)}
                          className="w-full border border-stone-200 text-[#111111] py-2 text-[10px] tracking-[0.15em] uppercase font-semibold hover:border-[#111111] transition-colors"
                        >
                          Storefront
                        </button>
                        <button
                          onClick={() => openBookingModal({ provider, serviceName: provider.tags[0], amount: provider.startingPrice })}
                          className="w-full bg-[#111111] text-white py-2 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Popular Category Showcase Strip */}
        <section className="pt-6 border-t border-stone-200 space-y-6">
          <div className="border-b border-stone-200 pb-3 flex justify-between items-end">
            <h3 className="font-serif text-lg tracking-[0.1em] uppercase font-normal text-[#111111]">
              Explore Signature Treatments
            </h3>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500">
              Bhubaneswar Metro
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => { setSelectedCategory('HAIR'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="p-6 border border-stone-200 bg-[#F9F9F9] hover:bg-[#111111] hover:text-white transition-all cursor-pointer space-y-2 group"
            >
              <div className="p-2 w-8 h-8 rounded-full border border-stone-300 group-hover:border-white/30 flex items-center justify-center">
                <Scissors size={14} />
              </div>
              <h4 className="font-serif text-sm tracking-wider uppercase font-semibold">Hair Spa &amp; Keratin</h4>
              <p className="text-[11px] opacity-70 font-light">Keratin, Botox, Balayage &amp; Precision Cuts</p>
            </div>

            <div 
              onClick={() => { setSelectedCategory('SKINCARE'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="p-6 border border-stone-200 bg-[#F9F9F9] hover:bg-[#111111] hover:text-white transition-all cursor-pointer space-y-2 group"
            >
              <div className="p-2 w-8 h-8 rounded-full border border-stone-300 group-hover:border-white/30 flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <h4 className="font-serif text-sm tracking-wider uppercase font-semibold">Skincare &amp; Facials</h4>
              <p className="text-[11px] opacity-70 font-light">Hydrafacial, Dermal Peels &amp; Organic Glow</p>
            </div>

            <div 
              onClick={() => { setSelectedCategory('NAILS'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="p-6 border border-stone-200 bg-[#F9F9F9] hover:bg-[#111111] hover:text-white transition-all cursor-pointer space-y-2 group"
            >
              <div className="p-2 w-8 h-8 rounded-full border border-stone-300 group-hover:border-white/30 flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <h4 className="font-serif text-sm tracking-wider uppercase font-semibold">Manicure &amp; Pedicure</h4>
              <p className="text-[11px] opacity-70 font-light">Gel Overlays, Body Polish &amp; Foot Reflexology</p>
            </div>

            <div 
              onClick={() => { setSelectedCategory('MAKEUP'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="p-6 border border-stone-200 bg-[#F9F9F9] hover:bg-[#111111] hover:text-white transition-all cursor-pointer space-y-2 group"
            >
              <div className="p-2 w-8 h-8 rounded-full border border-stone-300 group-hover:border-white/30 flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <h4 className="font-serif text-sm tracking-wider uppercase font-semibold">Bridal &amp; Event Glam</h4>
              <p className="text-[11px] opacity-70 font-light">HD Airbrush Makeover &amp; Saree Draping</p>
            </div>
          </div>
        </section>

      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 bg-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-10 text-center space-y-4">
        <span className="font-serif text-xl tracking-[0.2em] font-normal uppercase text-[#111111] block">
          AtEase
        </span>
        <p className="text-[10px] tracking-[0.25em] uppercase text-stone-500 max-w-lg mx-auto font-medium">
          The Hyper-Local Discovery Layer for Mobile Specialists &amp; Boutique Parlors • Bhubaneswar, Odisha
        </p>
        <p className="text-[9px] text-stone-400 font-light">
          AtEase does not process payments or manage service staff. Providers are paid directly at appointment time.
        </p>
      </footer>

    </div>
  );
}
