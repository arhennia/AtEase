import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const INITIAL_SERVICES = [
  {
    id: 's1',
    category: 'HAIR TREATMENTS',
    name: 'Signature Balayage & Gloss',
    duration: '90 MINS',
    inSalonPrice: 4500,
    homeVisitPrice: 5200,
    description: 'A personalized multi-dimensional color service using hand-painted techniques, finished with a high-shine gloss treatment for maximum luminosity and health.',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvwFf-4wqp5dnesfVFOZjcA_uAQ62FTA-ok-r12b63I0FBAXReCWkyHAzijt7E8inMeI1Mp4r_gz1KKV-GhgkkpmAIw8Q0nW-9bUNzrtVGkM3chCSrYo_i6r28XwstOTipPvodKpszvSxzC6rVjX_puTwOaA86QKzeZZGt24WRKUXd9Mw5osoaAoDF9m4neE4pamW-yCNfxmUjw5VpeC4FYvEXiw6Pt-THkgZlsAXepmXOL0TNi6h2G5_w',
    products: [
      "Olaplex Bond Building Technology",
      "L'Oréal Professionnel Majirel",
      "Kerastase Elixir Ultime"
    ]
  },
  {
    id: 's2',
    category: 'HAIR TREATMENTS',
    name: 'Keratin Smoothing Therapy',
    duration: '120 MINS',
    inSalonPrice: 6000,
    homeVisitPrice: 6800,
    description: 'Deep restorative keratin treatment eliminating frizz, enhancing shine, and sealing hair structure for up to 12 weeks.',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
    products: ["Brazilian Blowout Solution", "Argan Oil Moisture Lock"]
  },
  {
    id: 's3',
    category: 'FACIAL CARE',
    name: 'HydraGlow Oxygen Facial',
    duration: '60 MINS',
    inSalonPrice: 3500,
    homeVisitPrice: 4000,
    description: 'Infuses hyperbaric oxygen and hyaluronics deep into dermis layer to instantly plump, brighten, and hydrate fatigued skin.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    products: ["Dermafirm Oxygen Serum", "Hyaluronic Acid Complex"]
  },
  {
    id: 's4',
    category: 'FACIAL CARE',
    name: 'Advanced Peel & Sculpt',
    duration: '75 MINS',
    inSalonPrice: 4200,
    homeVisitPrice: 4800,
    description: 'Medical-grade botanical AHA peel paired with micro-current lifting massage for smooth texture and refined jawline definition.',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvU9409W-pvXxdmFmA-JVHtqNLLJr_zvz44sNCbQEcUfxTXtnIXt63pZYto7osxVC0KJ4bZ-kesIz-iqEMDRjzMv-N2KH__6PpGZSMl4tk_R4fywxbojnBv8Skys177Q5a4ZcIedyEyqrl77psY_VdyAe41KoiT0bPz9EWRQOzVJQxWmu5H4mXwm1eCPOvXukZ2lRzdzECfDMe4G6fioHq4muIyQ98Sa2y4F9Rk2qd41TWZMCIHDVkbcg',
    products: ["Skinceuticals Glycolic 20%", "Gua Sha Quartz Roller"]
  }
];

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
  const [pricingMode, setPricingMode] = useState('HOME_VISIT'); // 'IN_SALON' | 'HOME_VISIT'
  const [selectedServices, setSelectedServices] = useState(['s1', 's3']);
  const [expandedServices, setExpandedServices] = useState(['s1']);
  const [selectedDate, setSelectedDate] = useState('24');
  const [selectedTime, setSelectedTime] = useState('03:00 PM');
  const [bookingNotice, setBookingNotice] = useState(null);

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
    return selectedServices.reduce((sum, id) => {
      const item = INITIAL_SERVICES.find(s => s.id === id);
      if (!item) return sum;
      return sum + (pricingMode === 'HOME_VISIT' ? item.homeVisitPrice : item.inSalonPrice);
    }, 0);
  };

  const handleWhatsAppBooking = () => {
    const selectedNames = selectedServices
      .map(id => INITIAL_SERVICES.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const total = calculateTotal();
    const modeText = pricingMode === 'HOME_VISIT' ? 'Home Visit' : 'In-Salon / Studio';
    
    const message = encodeURIComponent(
      `Hello Ananya, I would like to book a ${modeText} appointment!\n\n` +
      `Services: ${selectedNames || 'None selected'}\n` +
      `Date: ${selectedDate} Aug | Time: ${selectedTime}\n` +
      `Total: ₹${total.toLocaleString('en-IN')}\n\n` +
      `Please confirm my booking slot.`
    );

    setBookingNotice(`Opening WhatsApp with your booking details for ₹${total.toLocaleString('en-IN')}!`);
    setTimeout(() => {
      window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
    }, 800);
  };

  const hairServices = INITIAL_SERVICES.filter(s => s.category === 'HAIR TREATMENTS');
  const facialServices = INITIAL_SERVICES.filter(s => s.category === 'FACIAL CARE');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-32"
    >
      {/* Top Banner Switcher for Persona Demo */}
      <div className="bg-primary text-on-primary px-4 py-2 text-xs flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase font-semibold tracking-wider">Client Persona</span>
          <span className="hidden sm:inline opacity-80">Bespoke Beauty Booking Experience</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="hover:underline opacity-90 text-[11px] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Sign In / Register
          </button>
          <button 
            onClick={() => navigate('/provider')}
            className="bg-white text-primary px-2.5 py-1 rounded font-button-text text-[11px] font-medium hover:bg-surface-container transition-colors shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">storefront</span>
            Switch to Provider Portal →
          </button>
        </div>
      </div>

      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-40 bg-surface/95 backdrop-blur border-b border-surface-variant flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 shadow-sm">
        <button 
          onClick={() => navigate('/login')} 
          className="text-primary hover:opacity-70 transition-opacity flex items-center justify-center p-1"
          title="Back / Auth"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-bold">AT EASE</h1>
        <button 
          onClick={() => navigate('/provider')} 
          className="text-primary hover:opacity-70 transition-opacity flex items-center justify-center p-1"
          title="Provider Dashboard"
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-8 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {bookingNotice && (
          <div className="mb-6 p-4 bg-primary text-on-primary rounded-lg text-center text-sm font-medium animate-pulse flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            {bookingNotice}
          </div>
        )}

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-stack-xl">
          <div className="w-24 h-24 rounded-full solid-border mb-6 overflow-hidden flex-shrink-0 shadow-md">
            <img 
              alt="Ananya Sharma" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsMFicLKdh8cH0OYBoEkklHnkwALaiGyaFGID2YdBcqarnKz6yFygK2OpmWLrFAYa1iEOWmOQsV0ghRozd-_h-2I38lWFvvApjQATbhfRJQiJGOvKE6YxNSyLFbtwK4OEo40t1gmGoYkLLrOnQjEY_W7nGQ-rBExgT10pGIN5x1RzSmmhTwDt7_Or3QGGSXCPTm0Veb2e4kkjxlUxzyBDtdnm-Mn-jzPynCuyFzK8FCNYea435eCwA2HHA"
            />
          </div>
          <h2 className="font-headline-md text-headline-md text-primary mb-2 tracking-wide font-medium">ANANYA SHARMA</h2>
          <div className="flex items-center gap-2 mb-4 justify-center flex-wrap">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest text-[11px]">15+ YRS EXPERIENCE</span>
            <span className="text-secondary opacity-50">|</span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest text-[11px]">BESPOKE HAIR & SKIN SPECIALIST</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ghost-border bg-surface-container-low mb-6 shadow-xs">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            <span className="font-label-caps text-[10px] uppercase text-primary tracking-wide">Home Visits: Patia & Surrounding Areas | Boutique Studio Available</span>
          </div>
          <p className="font-body-lg text-body-lg max-w-2xl text-on-surface-variant mb-6 leading-relaxed">
            Crafting bespoke beauty rituals with a decade of refined technique and an unwavering eye for detail.
          </p>
          <div className="flex items-center gap-1 justify-center">
            <span className="material-symbols-outlined text-primary text-sm icon-fill">star</span>
            <span className="font-button-text text-button-text text-primary font-bold">4.9</span>
            <span className="font-body-md text-body-md text-secondary ml-1">(128 reviews)</span>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="mb-stack-xl flex flex-col items-center">
          <div className="inline-flex rounded-full inset-bg p-1 relative mb-2 shadow-inner">
            <button 
              onClick={() => setPricingMode('IN_SALON')}
              className={`px-6 py-3 rounded-full font-label-caps text-label-caps transition-all duration-200 ${
                pricingMode === 'IN_SALON' 
                  ? 'bg-primary text-on-primary shadow-sm font-semibold' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              IN-SALON / STUDIO
            </button>
            <button 
              onClick={() => setPricingMode('HOME_VISIT')}
              className={`px-6 py-3 rounded-full font-label-caps text-label-caps transition-all duration-200 ${
                pricingMode === 'HOME_VISIT' 
                  ? 'bg-primary text-on-primary shadow-sm font-semibold' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              HOME VISIT
            </button>
          </div>
          <p className="font-body-md text-[13px] text-secondary italic flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Home Visit prices include travel & customized equipment setup.
          </p>
        </section>

        {/* Service Catalog */}
        <section className="mb-stack-xl">
          <div className="flex flex-col md:flex-row gap-gutter">
            
            {/* Category 1: Hair Treatments */}
            <div className="flex-1">
              <h3 className="font-label-caps text-label-caps text-secondary mb-stack-sm border-b border-surface-variant pb-2 tracking-widest uppercase font-semibold">
                HAIR TREATMENTS
              </h3>
              <div className="flex flex-col gap-4">
                {hairServices.map(service => {
                  const isSelected = selectedServices.includes(service.id);
                  const isExpanded = expandedServices.includes(service.id);
                  const currentPrice = pricingMode === 'HOME_VISIT' ? service.homeVisitPrice : service.inSalonPrice;

                  return (
                    <div key={service.id} className="ghost-border bg-surface-container-lowest p-6 flex flex-col gap-4 shadow-xs hover:shadow-sm transition-shadow">
                      <div 
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleExpand(service.id)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-headline-sm text-headline-sm text-primary mb-1">{service.name}</h4>
                            <span className="material-symbols-outlined text-sm text-secondary">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </div>
                          <span className="font-label-caps text-label-caps text-secondary">{service.duration}</span>
                        </div>
                        <span className="font-headline-sm text-headline-sm text-primary font-medium">₹{currentPrice.toLocaleString('en-IN')}</span>
                      </div>

                      {isExpanded ? (
                        <>
                          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            {service.description}
                          </p>
                          {service.image && (
                            <div className="h-48 w-full ghost-border overflow-hidden bg-surface-variant rounded">
                              <img alt={service.name} className="w-full h-full object-cover" src={service.image} />
                            </div>
                          )}
                          <div>
                            <h5 className="font-label-caps text-label-caps text-primary mb-2 uppercase font-semibold tracking-wider text-[11px]">PRODUCTS USED</h5>
                            <ul className="list-disc list-inside font-body-md text-sm text-secondary space-y-1">
                              {service.products.map((prod, idx) => (
                                <li key={idx}>{prod}</li>
                              ))}
                            </ul>
                          </div>
                          <button 
                            onClick={() => toggleService(service.id)}
                            className={`w-full py-3 mt-2 font-button-text text-button-text transition-colors border uppercase tracking-wider font-medium ${
                              isSelected 
                                ? 'bg-primary text-on-primary border-primary' 
                                : 'solid-border hover:bg-surface-container-low text-primary'
                            }`}
                          >
                            {isSelected ? 'SELECTED (CLICK TO REMOVE)' : '+ ADD SERVICE'}
                          </button>
                        </>
                      ) : (
                        <div className="flex justify-between items-center pt-2">
                          <button 
                            onClick={() => toggleExpand(service.id)}
                            className="text-xs text-secondary hover:text-primary underline underline-offset-2"
                          >
                            View details & products
                          </button>
                          <button 
                            onClick={() => toggleService(service.id)}
                            className={`px-4 py-1.5 rounded-full font-label-caps text-xs border transition-colors ${
                              isSelected 
                                ? 'bg-primary text-on-primary border-primary' 
                                : 'border-primary text-primary hover:bg-surface-container-low'
                            }`}
                          >
                            {isSelected ? 'ADDED ✓' : '+ ADD'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category 2: Facial Care */}
            <div className="flex-1 mt-stack-md md:mt-0">
              <h3 className="font-label-caps text-label-caps text-secondary mb-stack-sm border-b border-surface-variant pb-2 tracking-widest uppercase font-semibold">
                FACIAL CARE
              </h3>
              <div className="flex flex-col gap-4">
                {facialServices.map(service => {
                  const isSelected = selectedServices.includes(service.id);
                  const isExpanded = expandedServices.includes(service.id);
                  const currentPrice = pricingMode === 'HOME_VISIT' ? service.homeVisitPrice : service.inSalonPrice;

                  return (
                    <div key={service.id} className="ghost-border bg-surface-container-lowest p-6 flex flex-col gap-4 shadow-xs hover:shadow-sm transition-shadow">
                      <div 
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleExpand(service.id)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-headline-sm text-headline-sm text-primary mb-1">{service.name}</h4>
                            <span className="material-symbols-outlined text-sm text-secondary">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </div>
                          <span className="font-label-caps text-label-caps text-secondary">{service.duration}</span>
                        </div>
                        <span className="font-headline-sm text-headline-sm text-primary font-medium">₹{currentPrice.toLocaleString('en-IN')}</span>
                      </div>

                      {isExpanded ? (
                        <>
                          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            {service.description}
                          </p>
                          {service.image && (
                            <div className="h-48 w-full ghost-border overflow-hidden bg-surface-variant rounded">
                              <img alt={service.name} className="w-full h-full object-cover" src={service.image} />
                            </div>
                          )}
                          <div>
                            <h5 className="font-label-caps text-label-caps text-primary mb-2 uppercase font-semibold tracking-wider text-[11px]">PRODUCTS USED</h5>
                            <ul className="list-disc list-inside font-body-md text-sm text-secondary space-y-1">
                              {service.products.map((prod, idx) => (
                                <li key={idx}>{prod}</li>
                              ))}
                            </ul>
                          </div>
                          <button 
                            onClick={() => toggleService(service.id)}
                            className={`w-full py-3 mt-2 font-button-text text-button-text transition-colors border uppercase tracking-wider font-medium ${
                              isSelected 
                                ? 'bg-primary text-on-primary border-primary' 
                                : 'solid-border hover:bg-surface-container-low text-primary'
                            }`}
                          >
                            {isSelected ? 'SELECTED (CLICK TO REMOVE)' : '+ ADD SERVICE'}
                          </button>
                        </>
                      ) : (
                        <div className="flex justify-between items-center pt-2">
                          <button 
                            onClick={() => toggleExpand(service.id)}
                            className="text-xs text-secondary hover:text-primary underline underline-offset-2"
                          >
                            View details & products
                          </button>
                          <button 
                            onClick={() => toggleService(service.id)}
                            className={`px-4 py-1.5 rounded-full font-label-caps text-xs border transition-colors ${
                              isSelected 
                                ? 'bg-primary text-on-primary border-primary' 
                                : 'border-primary text-primary hover:bg-surface-container-low'
                            }`}
                          >
                            {isSelected ? 'ADDED ✓' : '+ ADD'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Booking Module: Select Date & Time */}
        <section className="mb-stack-xl max-w-2xl mx-auto">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-sm text-center font-medium tracking-wide uppercase">SELECT DATE & TIME</h3>
          
          {/* Date Strip */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-surface-variant justify-start md:justify-center">
            {DATES.map((item, idx) => {
              const isSelected = selectedDate === item.date;
              if (!item.available) {
                return (
                  <button 
                    key={idx}
                    disabled
                    className="flex flex-col items-center justify-center min-w-[72px] h-[84px] ghost-border bg-surface-container-lowest opacity-40 cursor-not-allowed"
                  >
                    <span className="font-label-caps text-[10px] text-secondary mb-1">{item.day}</span>
                    <span className="font-headline-sm text-[20px] text-primary">{item.date}</span>
                  </button>
                );
              }
              return (
                <button 
                  key={idx}
                  onClick={() => setSelectedDate(item.date)}
                  className={`flex flex-col items-center justify-center min-w-[72px] h-[84px] transition-colors ${
                    isSelected 
                      ? 'solid-border bg-primary text-on-primary shadow-sm' 
                      : 'ghost-border bg-surface-container-lowest hover:bg-surface-container-low text-primary'
                  }`}
                >
                  <span className={`font-label-caps text-[10px] mb-1 ${isSelected ? 'text-on-primary opacity-90' : 'text-secondary'}`}>{item.day}</span>
                  <span className={`font-headline-sm text-[20px] ${isSelected ? 'text-on-primary' : 'text-primary'}`}>{item.date}</span>
                </button>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-3 gap-4">
            {TIME_SLOTS.map((slot, idx) => {
              const isSelected = selectedTime === slot.time;
              if (!slot.available) {
                return (
                  <button 
                    key={idx} 
                    disabled 
                    className="py-4 ghost-border font-body-md text-secondary text-center opacity-40 cursor-not-allowed strikethrough-diagonal"
                  >
                    {slot.time}
                  </button>
                );
              }
              return (
                <button 
                  key={idx}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-4 font-body-md text-center transition-colors ${
                    isSelected 
                      ? 'solid-border font-medium text-on-primary bg-primary shadow-sm' 
                      : 'ghost-border text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-bright border-t ghost-border p-4 md:p-6 z-40 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto text-center md:text-left">
          <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
            {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Selected
          </span>
          <span className="hidden md:inline text-secondary opacity-40">|</span>
          <span className="font-headline-sm text-headline-sm text-primary font-bold">
            Total: ₹{calculateTotal().toLocaleString('en-IN')}
          </span>
        </div>
        <button 
          onClick={handleWhatsAppBooking}
          className="w-full md:w-auto bg-primary text-on-primary px-8 py-4 font-button-text text-button-text uppercase tracking-widest hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-2 shadow-md active:scale-98"
        >
          CONFIRM & BOOK VIA WHATSAPP
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
}
