import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RAJKUMARI_PROVIDER_DATA } from '../data/providerData';
import { createAppointmentRecord, isSupabaseConfigured } from '../lib/supabase';

const DATES = [
  { day: 'SUN', date: '23', available: true },
  { day: 'MON', date: '24', available: true },
  { day: 'TUE', date: '25', available: true },
  { day: 'WED', date: '26', available: true },
  { day: 'THU', date: '27', available: true },
  { day: 'FRI', date: '28', available: true },
  { day: 'SAT', date: '29', available: false },
];

const TIME_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '01:30 PM', available: false },
  { time: '03:00 PM', available: true },
  { time: '04:30 PM', available: true },
];

export function Home() {
  const navigate = useNavigate();
  const provider = RAJKUMARI_PROVIDER_DATA.provider;
  const categories = RAJKUMARI_PROVIDER_DATA.serviceCategories;

  const [pricingMode, setPricingMode] = useState('HOME_VISIT'); // 'IN_SALON' | 'HOME_VISIT'
  const [selectedServices, setSelectedServices] = useState(['s1', 's10']);
  const [expandedServices, setExpandedServices] = useState(['s1']);
  const [selectedDate, setSelectedDate] = useState('24');
  const [selectedTime, setSelectedTime] = useState('03:00 PM');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [bookingNotice, setBookingNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Track active scroll category
  useEffect(() => {
    const handleScroll = () => {
      const categoryElements = categories.map(cat => document.getElementById(`cat-sec-${cat.id}`));
      const scrollPosition = window.scrollY + 160;

      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const el = categoryElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    const element = document.getElementById(`cat-sec-${catId}`);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleExpand = (id) => {
    if (expandedServices.includes(id)) {
      setExpandedServices(expandedServices.filter(e => e !== id));
    } else {
      setExpandedServices([...expandedServices, id]);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    categories.forEach(cat => {
      cat.services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          total += pricingMode === 'HOME_VISIT' ? service.homePrice : service.inSalonPrice;
        }
      });
    });
    return total;
  };

  const getSelectedServiceItems = () => {
    const allServices = categories.flatMap(c => c.services);
    return selectedServices.map(id => allServices.find(s => s.id === id)).filter(Boolean);
  };

  const handleWhatsAppBooking = async () => {
    const selectedItems = getSelectedServiceItems();
    const selectedNames = selectedItems.map(s => s.name).join(', ');
    const total = calculateTotal();
    const modeText = pricingMode === 'HOME_VISIT' ? 'Home Visit' : 'In-Salon / Studio';

    setIsSubmitting(true);
    setErrorMessage('');

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
      setIsSubmitting(false);
      return;
    }

    const bookingPayload = {
      clientName: 'Priya Menon',
      clientPhone: '+91 98765 43210',
      serviceName: selectedNames || 'Beauty Treatment',
      date: `${selectedDate} Aug 2026`,
      time: selectedTime,
      location: `${modeText} (${provider.locationTag || 'Bhubaneswar, Odisha'})`,
      status: 'confirmed',
      amount: total
    };

    const result = await createAppointmentRecord(bookingPayload);
    if (!result || !result.success) {
      setErrorMessage(result?.error || 'Failed to create appointment in database');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsBagOpen(false);
    navigate('/success');
  };

  return (
    <div className="bg-white text-black font-sans antialiased min-h-screen selection:bg-black selection:text-white">
      
      {/* ZARA Minimal Top Header Bar */}
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          
          {/* Left Brand Title & Mode */}
          <div className="flex items-center gap-6">
            <h1 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-serif text-xl tracking-[0.15em] uppercase font-bold cursor-pointer"
            >
              AT EASE
            </h1>
            <button 
              onClick={() => navigate('/provider')}
              className="text-[10px] tracking-[0.2em] uppercase font-semibold text-black/50 hover:text-black transition-colors hidden md:block"
            >
              [ PROVIDER PORTAL ]
            </button>
          </div>

          {/* Center Minimal Underlined Search */}
          <div className="hidden md:flex items-center relative w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH SERVICES..."
              className="w-full bg-transparent border-b border-black/30 focus:border-black text-[10px] tracking-[0.2em] uppercase py-1 pr-6 focus:outline-none placeholder:text-black/40 text-black font-medium"
            />
            <span className="material-symbols-outlined text-xs absolute right-0 text-black/60 pointer-events-none">search</span>
          </div>

          {/* Right ZARA Navigation Links */}
          <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase font-medium">
            <button 
              onClick={() => navigate('/login')}
              className="hover:opacity-60 transition-opacity hidden sm:block"
            >
              ACCOUNT
            </button>
            <button 
              onClick={() => setIsBagOpen(true)}
              className="hover:opacity-60 transition-opacity flex items-center gap-1 border-b border-black pb-0.5 font-bold"
            >
              BAG [ {selectedServices.length} ]
            </button>
          </div>

        </div>
      </header>

      {/* Main Editorial Canvas */}
      <main className="max-w-[1300px] mx-auto px-6 md:px-10 pt-8 pb-32">

        {bookingNotice && (
          <div className="mb-8 p-3 border border-black text-center text-[10px] tracking-[0.2em] uppercase font-semibold bg-black text-white flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            {bookingNotice}
          </div>
        )}

        {/* Compact Hero Banner Section (Clean, Proportionate & Above the Fold) */}
        <section className="mb-10 border-b border-black/10 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 border border-black/20">
              <img 
                src={provider.avatarUrl} 
                alt={provider.displayName} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-black/60 font-semibold">
                <span>01 | ARTIST PROFILE</span>
                <span>•</span>
                <span>{provider.rating} ★ ({provider.reviewCount})</span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl tracking-[0.05em] uppercase font-bold text-black">
                {provider.displayName}
              </h2>
              <p className="text-[11px] tracking-[0.15em] uppercase font-medium text-black/70">
                {provider.professionalTitle} — {provider.yearsOfExperience}
              </p>
              <p className="text-xs text-black/70 font-light italic">
                "{provider.tagline}"
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] tracking-[0.2em] uppercase font-medium text-black/60 shrink-0 border-t md:border-t-0 md:border-l border-black/10 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-1 justify-end">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {provider.locationTag}
            </div>
          </div>
        </section>

        {/* Pricing Mode Toggle - Compact Minimal Line */}
        <section className="mb-10 flex justify-center">
          <div className="flex items-center gap-6 text-xs tracking-[0.2em] uppercase font-medium border-b border-black/20 pb-2">
            <button 
              onClick={() => setPricingMode('IN_SALON')}
              className={`transition-all ${pricingMode === 'IN_SALON' ? 'font-bold border-b-2 border-black pb-2 -mb-2.5 text-black' : 'text-black/40 hover:text-black'}`}
            >
              IN-SALON / STUDIO
            </button>
            <span className="text-black/30 font-light">|</span>
            <button 
              onClick={() => setPricingMode('HOME_VISIT')}
              className={`transition-all ${pricingMode === 'HOME_VISIT' ? 'font-bold border-b-2 border-black pb-2 -mb-2.5 text-black' : 'text-black/40 hover:text-black'}`}
            >
              HOME VISIT (INCLUDES SETUP)
            </button>
          </div>
        </section>

        {/* Layout: Main Catalog (Left) + Right-Side Minimalist Category Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Service List Column (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-16">
            {categories.map((category, index) => {
              const catIndex = (index + 1).toString().padStart(2, '0');
              const filteredServices = category.services.filter(s => 
                !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredServices.length === 0) return null;

              return (
                <section key={category.id} id={`cat-sec-${category.id}`} className="scroll-mt-24">
                  
                  {/* Category Header */}
                  <div className="border-b border-black pb-3 mb-6 flex justify-between items-end">
                    <h3 className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-black flex items-center gap-2">
                      <span>| {catIndex} |</span>
                      <span>{category.categoryName}</span>
                    </h3>
                    <span className="text-[10px] tracking-[0.2em] text-black/50 font-semibold">
                      {filteredServices.length} SERVICES
                    </span>
                  </div>

                  {/* Service Items List */}
                  <div className="space-y-6">
                    {filteredServices.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      const isExpanded = expandedServices.includes(service.id);
                      const currentPrice = pricingMode === 'HOME_VISIT' ? service.homePrice : service.inSalonPrice;

                      return (
                        <div key={service.id} className="border-b border-black/10 pb-6 space-y-3">
                          
                          {/* Service Header Row */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h4 
                                onClick={() => toggleExpand(service.id)}
                                className="text-sm md:text-base tracking-[0.05em] font-bold text-black cursor-pointer hover:opacity-60 transition-opacity"
                              >
                                {service.name}
                              </h4>
                              <p className="text-[10px] tracking-[0.2em] uppercase text-black/50 font-medium">
                                {service.duration}
                              </p>
                            </div>

                            <div className="text-right space-y-1">
                              <div className="text-sm md:text-base tracking-[0.05em] font-bold text-black">
                                ₹{currentPrice.toLocaleString('en-IN')}
                              </div>
                              <button 
                                onClick={() => toggleService(service.id)}
                                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all border-b ${
                                  isSelected 
                                    ? 'border-black text-black font-extrabold' 
                                    : 'border-transparent text-black/60 hover:text-black hover:border-black'
                                }`}
                              >
                                {isSelected ? '[ REMOVE ]' : '[ + ADD TO BAG ]'}
                              </button>
                            </div>
                          </div>

                          {/* Expandable Image & Description */}
                          {isExpanded && (
                            <div className="pt-1 space-y-3">
                              <p className="text-xs leading-relaxed text-black/70 font-light">
                                {service.description}
                              </p>
                              {service.imageUrl && (
                                <div className="max-w-xs h-40 overflow-hidden rounded">
                                  <img 
                                    src={service.imageUrl} 
                                    alt={service.name} 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                  />
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                </section>
              );
            })}

            {/* Date & Time Selection Section */}
            <section className="pt-8 border-t border-black space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-black">
                  | SCHEDULE | SELECT DATE & TIME
                </h3>
              </div>

              {/* Minimal Date Strip */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 border-b border-black/10">
                {DATES.map((item, idx) => {
                  const isSelected = selectedDate === item.date;
                  if (!item.available) {
                    return (
                      <button 
                        key={idx}
                        disabled
                        className="min-w-[56px] py-3 text-center text-black/30 cursor-not-allowed text-xs tracking-widest"
                      >
                        <div className="text-[10px] mb-1">{item.day}</div>
                        <div className="text-base line-through">{item.date}</div>
                      </button>
                    );
                  }
                  return (
                    <button 
                      key={idx}
                      onClick={() => setSelectedDate(item.date)}
                      className={`min-w-[56px] py-3 text-center text-xs tracking-widest transition-all ${
                        isSelected 
                          ? 'border-b-2 border-black font-bold text-black' 
                          : 'text-black/60 hover:text-black'
                      }`}
                    >
                      <div className="text-[10px] mb-1">{item.day}</div>
                      <div className="text-base font-semibold">{item.date}</div>
                    </button>
                  );
                })}
              </div>

              {/* Minimal Time Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {TIME_SLOTS.map((slot, idx) => {
                  const isSelected = selectedTime === slot.time;
                  if (!slot.available) {
                    return (
                      <button 
                        key={idx} 
                        disabled 
                        className="py-2.5 text-[10px] tracking-widest text-black/30 text-center cursor-not-allowed line-through border-b border-black/10"
                      >
                        {slot.time}
                      </button>
                    );
                  }
                  return (
                    <button 
                      key={idx}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2.5 text-[10px] tracking-widest text-center transition-all border-b ${
                        isSelected 
                          ? 'border-black font-bold text-black' 
                          : 'border-black/10 text-black/60 hover:text-black hover:border-black'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right-Side ZARA Minimalist Category Index Menu (lg:col-span-4) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6 pl-6 border-l border-black/10">
            <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-black pb-2 border-b border-black">
              INDEX / CATEGORIES
            </div>

            <nav className="space-y-3">
              {categories.map((cat, idx) => {
                const isActive = activeCategory === cat.id;
                const catNum = (idx + 1).toString().padStart(2, '0');
                return (
                  <button 
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={`w-full text-left text-[11px] tracking-[0.15em] uppercase transition-all flex items-center justify-between group ${
                      isActive 
                        ? 'font-bold text-black border-l-2 border-black pl-3 -ml-3' 
                        : 'text-black/50 hover:text-black'
                    }`}
                  >
                    <span className="truncate pr-2">| {catNum} | {cat.categoryName}</span>
                    <span className="text-[9px] text-black/40 font-mono">
                      [{cat.services.length}]
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-black space-y-3">
              <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase font-bold">
                <span>ESTIMATE</span>
                <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={() => setIsBagOpen(true)}
                className="w-full bg-black text-white py-3 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
              >
                VIEW SHOPPING BAG [ {selectedServices.length} ]
              </button>
            </div>
          </aside>

        </div>

      </main>

      {/* ZARA Slide-Out Shopping Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="bg-white w-full max-w-md h-full flex flex-col justify-between p-8 border-l border-black shadow-2xl"
            >
              {/* Bag Header */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-black pb-4">
                  <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-black">
                    SHOPPING BAG [ {selectedServices.length} ]
                  </h3>
                  <button 
                    onClick={() => setIsBagOpen(false)}
                    className="text-xs tracking-widest uppercase font-bold hover:opacity-50"
                  >
                    CLOSE [ X ]
                  </button>
                </div>

                {/* Selected Items List */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar">
                  {getSelectedServiceItems().length === 0 ? (
                    <p className="text-xs tracking-[0.2em] uppercase text-black/50 text-center py-10">
                      YOUR BAG IS CURRENTLY EMPTY
                    </p>
                  ) : (
                    getSelectedServiceItems().map((item) => {
                      const price = pricingMode === 'HOME_VISIT' ? item.homePrice : item.inSalonPrice;
                      return (
                        <div key={item.id} className="flex justify-between items-start border-b border-black/10 pb-4">
                          <div>
                            <h4 className="text-xs tracking-widest uppercase font-bold">{item.name}</h4>
                            <p className="text-[10px] text-black/50 tracking-wider uppercase mt-0.5">{item.duration}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold">₹{price.toLocaleString('en-IN')}</div>
                            <button 
                              onClick={() => toggleService(item.id)}
                              className="text-[9px] tracking-widest uppercase text-black/40 hover:text-black underline mt-1"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bag Checkout Summary */}
              <div className="border-t border-black pt-6 space-y-4">
                <div className="flex justify-between text-xs tracking-[0.2em] uppercase font-semibold">
                  <span>LOCATION MODE</span>
                  <span>{pricingMode === 'HOME_VISIT' ? 'HOME VISIT' : 'IN-SALON'}</span>
                </div>
                <div className="flex justify-between text-xs tracking-[0.2em] uppercase font-semibold">
                  <span>DATE & TIME</span>
                  <span>{selectedDate} AUG | {selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm tracking-[0.25em] uppercase font-bold border-t border-black/20 pt-4">
                  <span>TOTAL ESTIMATE</span>
                  <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs font-semibold uppercase tracking-wider space-y-1">
                    <div className="font-bold text-red-900">⚠ BOOKING ERROR</div>
                    <div className="normal-case font-normal">{errorMessage}</div>
                  </div>
                )}

                <button 
                  onClick={handleWhatsAppBooking}
                  disabled={selectedServices.length === 0 || isSubmitting}
                  className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-black/80 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>CREATING APPOINTMENT IN SUPABASE...</span>
                    </>
                  ) : (
                    <span>CONFIRM & CREATE BOOKING →</span>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
