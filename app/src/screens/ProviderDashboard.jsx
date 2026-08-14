import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RAJKUMARI_PROVIDER_DATA } from '../data/providerData';
import { supabase, isSupabaseConfigured, normalizeAppointment } from '../lib/supabase';

export function ProviderDashboard() {
  const navigate = useNavigate();
  const provider = RAJKUMARI_PROVIDER_DATA.provider;

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('TODAY'); // 'TODAY' | 'TOMORROW' | 'THIS_WEEK'
  const [showSubModal, setShowSubModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('11:30 AM');
  const [delayedCount, setDelayedCount] = useState(0);

  // Supabase Live Appointments state
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  // Catalog item state
  const [categoriesData, setCategoriesData] = useState(RAJKUMARI_PROVIDER_DATA.serviceCategories);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(RAJKUMARI_PROVIDER_DATA.serviceCategories[0].id);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchSupabaseAppointments = async () => {
    setIsLoadingAppointments(true);
    setAppointmentsError('');

    if (!isSupabaseConfigured) {
      // Fallback demo appointment if Supabase environment variables are missing
      setIsLoadingAppointments(false);
      setAppointments([
        {
          id: 'demo-1',
          clientName: 'Priya Menon',
          clientPhone: '+91 98765 43210',
          serviceName: 'Hair Spa & Scalp Massage, Custom Organic Glow Facial',
          date: 'Oct 24, 2023',
          time: appointmentTime,
          location: 'Plot No. 42, Unit-III, Bhubaneswar, Odisha',
          status: 'confirmed',
          amount: 4300,
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        setAppointmentsError(error.message || 'Failed to load live appointments from Supabase');
        setIsLoadingAppointments(false);
        return;
      }

      const normalized = (data || []).map(normalizeAppointment);
      setAppointments(normalized);
    } catch (err) {
      console.error('Unexpected fetch error:', err);
      setAppointmentsError(err.message || 'Connection error querying Supabase appointments');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  // Fetch on mount & set up real-time postgres subscription
  useEffect(() => {
    fetchSupabaseAppointments();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('public:appointments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'appointments' },
          (payload) => {
            console.log('Realtime postgres change received:', payload);
            setIsRealtimeActive(true);
            showToast('⚡ LIVE UPDATE: New appointment event synced from Supabase!');

            if (payload.eventType === 'INSERT' && payload.new) {
              const newAppt = normalizeAppointment(payload.new);
              setAppointments((prev) => [newAppt, ...prev.filter(a => a.id !== newAppt.id)]);
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const updatedAppt = normalizeAppointment(payload.new);
              setAppointments((prev) => prev.map(a => a.id === updatedAppt.id ? updatedAppt : a));
            } else if (payload.eventType === 'DELETE' && payload.old) {
              setAppointments((prev) => prev.filter(a => a.id !== payload.old.id));
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsRealtimeActive(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://atease.beauty/rajkumari-beauty-aesthetics');
    showToast('Public Booking Link copied to clipboard!');
  };

  const handleDelayAppointment = () => {
    if (delayedCount === 0) {
      setAppointmentTime('11:45 AM');
      setDelayedCount(1);
      showToast('Appointment delayed by 15 mins (New Time: 11:45 AM). Client notified via SMS.');
    } else {
      setAppointmentTime('12:00 PM');
      setDelayedCount(2);
      showToast('Appointment delayed to 12:00 PM. Client updated.');
    }
  };

  const activeCategory = categoriesData.find(c => c.id === selectedCategoryTab) || categoriesData[0];

  return (
    <div className="bg-white text-black font-sans antialiased min-h-screen pb-24 selection:bg-black selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 border border-black shadow-2xl text-xs tracking-[0.2em] uppercase font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">info</span>
          {toastMessage}
        </div>
      )}

      {/* Unified Single Clean Top Navigation Header */}
      <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-black">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 h-16 flex justify-between items-center">
          
          {/* Left Brand Title */}
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase font-bold text-black">
              {provider.displayName}
            </h1>
            <span className="text-[9px] tracking-[0.2em] bg-black text-white px-2 py-0.5 uppercase font-bold hidden sm:inline">
              PROVIDER PORTAL
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.2em] uppercase font-semibold">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`transition-all ${activeTab === 'dashboard' ? 'font-bold border-b-2 border-black pb-1 text-black' : 'text-black/50 hover:text-black'}`}
            >
              DASHBOARD
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`transition-all ${activeTab === 'calendar' ? 'font-bold border-b-2 border-black pb-1 text-black' : 'text-black/50 hover:text-black'}`}
            >
              CALENDAR
            </button>
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`transition-all ${activeTab === 'catalog' ? 'font-bold border-b-2 border-black pb-1 text-black' : 'text-black/50 hover:text-black'}`}
            >
              CATALOG ({categoriesData.flatMap(c => c.services).length})
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`transition-all ${activeTab === 'marketing' ? 'font-bold border-b-2 border-black pb-1 text-black' : 'text-black/50 hover:text-black'}`}
            >
              MARKETING
            </button>
          </nav>

          {/* Right Membership & Client View Buttons */}
          <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase font-bold">
            <button 
              onClick={() => setShowSubModal(true)}
              className="border-b border-black pb-0.5 hover:opacity-60 transition-opacity hidden sm:block"
            >
              PRO TIER [ ₹999/MO ]
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="bg-black text-white px-3 py-1.5 hover:bg-black/80 transition-colors font-semibold"
            >
              CLIENT VIEW →
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1300px] mx-auto px-6 md:px-10 pt-8 space-y-12">
        
        {/* Streamlined Operational Header & Revenue Metrics */}
        <section className="border-b border-black/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase text-black/50 font-semibold">
              OVERVIEW
            </span>
            <h2 className="font-serif text-2xl md:text-3xl tracking-[0.05em] uppercase font-bold">
              GOOD MORNING, {provider.displayName.split(' ')[0]}
            </h2>
            <p className="text-[11px] tracking-[0.15em] uppercase text-black/60 font-medium">
              {provider.professionalTitle} • {provider.locationTag}
            </p>
          </div>

          <div className="flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase font-semibold border-t md:border-t-0 md:border-l border-black/20 pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
            <div>
              <div className="text-black/40 text-[9px] mb-0.5 font-bold">TODAY'S BOOKINGS</div>
              <div className="text-lg font-bold">{appointments.length} {appointments.length === 1 ? 'APPOINTMENT' : 'APPOINTMENTS'}</div>
            </div>
            <div className="border-l border-black/20 pl-8">
              <div className="text-black/40 text-[9px] mb-0.5 font-bold">ESTIMATED REVENUE</div>
              <div className="text-lg font-bold">₹{appointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0).toLocaleString()}</div>
            </div>
          </div>
        </section>

        {/* Quick Management Actions Strip */}
        <section className="space-y-4">
          <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-black border-b border-black pb-2">
            QUICK ACTIONS
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowServiceModal(true)}
              className="border border-black p-4 text-left hover:bg-black hover:text-white transition-all group space-y-1"
            >
              <div className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-semibold">+ CATALOG</div>
              <div className="text-xs tracking-[0.15em] uppercase font-bold">ADD NEW SERVICE</div>
            </button>

            <button 
              onClick={() => setShowMarketingModal(true)}
              className="border border-black p-4 text-left hover:bg-black hover:text-white transition-all group space-y-1"
            >
              <div className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-semibold">★ MARKETING</div>
              <div className="text-xs tracking-[0.15em] uppercase font-bold">FESTIVAL GRAPHIC</div>
            </button>

            <button 
              onClick={handleCopyLink}
              className="border border-black p-4 text-left hover:bg-black hover:text-white transition-all group space-y-1"
            >
              <div className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-semibold">🔗 PUBLIC LINK</div>
              <div className="text-xs tracking-[0.15em] uppercase font-bold">COPY BOOKING URL</div>
            </button>

            <button 
              onClick={() => setShowBlockModal(true)}
              className="border border-black p-4 text-left hover:bg-black hover:text-white transition-all group space-y-1"
            >
              <div className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-semibold">🚫 AVAILABILITY</div>
              <div className="text-xs tracking-[0.15em] uppercase font-bold">QUICK BLOCK SLOT</div>
            </button>
          </div>
        </section>

        {/* Service Catalog & Pricing Manager */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-black pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h3 className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-black">
                SERVICE CATALOG &amp; PRICING MANAGER
              </h3>
              <p className="text-[11px] text-black/60 font-medium mt-0.5">Edit prices &amp; home visit availability for all 30 treatments.</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar text-[10px] tracking-[0.2em] uppercase font-semibold border-b border-black/10 pb-1 w-full md:w-auto">
              {categoriesData.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  className={`transition-all whitespace-nowrap ${
                    selectedCategoryTab === cat.id 
                      ? 'font-bold border-b-2 border-black text-black pb-1 -mb-1.5' 
                      : 'text-black/40 hover:text-black'
                  }`}
                >
                  {cat.categoryName.split('&')[0]} ({cat.services.length})
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {activeCategory.services.map((service) => (
              <div key={service.id} className="border-b border-black/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-0.5 md:w-1/3">
                  <span className="text-[9px] tracking-[0.2em] text-black/50 uppercase font-bold">{activeCategory.categoryName}</span>
                  <h4 className="text-sm tracking-[0.05em] font-bold text-black">{service.name}</h4>
                  <p className="text-[11px] text-black/60 font-light line-clamp-1">{service.description}</p>
                </div>

                <div className="flex flex-row gap-6 items-center md:w-1/3">
                  <div className="space-y-0.5">
                    <label className="text-[9px] tracking-[0.2em] text-black/50 font-bold uppercase">IN-SALON (₹)</label>
                    <input 
                      type="number"
                      defaultValue={service.inSalonPrice}
                      className="border-b border-black bg-transparent py-0.5 font-mono text-sm font-bold text-black focus:outline-none w-20" 
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] tracking-[0.2em] text-black/50 font-bold uppercase">HOME VISIT (₹)</label>
                    <input 
                      type="number"
                      defaultValue={service.homePrice}
                      className="border-b border-black bg-transparent py-0.5 font-mono text-sm font-bold text-black focus:outline-none w-20" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 md:w-1/3 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-wider uppercase font-semibold">
                    <input 
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded-none text-black focus:ring-black h-3.5 w-3.5" 
                    />
                    <span>HOME VISIT ENABLED</span>
                  </label>
                  <button 
                    onClick={() => showToast(`SETTINGS UPDATED FOR ${service.name.toUpperCase()}`)}
                    className="text-[9px] tracking-[0.2em] uppercase font-bold border-b border-black pb-0.5 hover:opacity-60"
                  >
                    EDIT ({service.duration})
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Live Schedule */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-black pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-black">
                LIVE APPOINTMENTS ({appointments.length})
              </h3>
              {isSupabaseConfigured ? (
                <span className="text-[9px] tracking-[0.15em] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block"></span>
                  SUPABASE REALTIME LIVE
                </span>
              ) : (
                <span className="text-[9px] tracking-[0.15em] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 uppercase font-bold">
                  LOCAL DEMO MODE
                </span>
              )}
            </div>

            <div className="flex gap-4 items-center text-[10px] tracking-[0.2em] uppercase font-semibold">
              <button 
                onClick={fetchSupabaseAppointments}
                className="text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                ↻ REFRESH
              </button>
              <div className="h-3 w-px bg-black/20"></div>
              <button 
                onClick={() => setTimeFilter('TODAY')}
                className={`transition-all ${timeFilter === 'TODAY' ? 'font-bold border-b-2 border-black text-black pb-1' : 'text-black/40 hover:text-black'}`}
              >
                TODAY
              </button>
              <button 
                onClick={() => setTimeFilter('TOMORROW')}
                className={`transition-all ${timeFilter === 'TOMORROW' ? 'font-bold border-b-2 border-black text-black pb-1' : 'text-black/40 hover:text-black'}`}
              >
                TOMORROW
              </button>
              <button 
                onClick={() => setTimeFilter('THIS_WEEK')}
                className={`transition-all ${timeFilter === 'THIS_WEEK' ? 'font-bold border-b-2 border-black text-black pb-1' : 'text-black/40 hover:text-black'}`}
              >
                THIS WEEK
              </button>
            </div>
          </div>

          {/* Loading Skeleton State */}
          {isLoadingAppointments && (
            <div className="space-y-4 py-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="border border-black/10 p-6 flex flex-col md:flex-row justify-between gap-4 bg-black/[0.02]">
                  <div className="space-y-2 md:w-1/4">
                    <div className="h-6 bg-black/10 w-24 rounded"></div>
                    <div className="h-4 bg-black/10 w-20 rounded"></div>
                  </div>
                  <div className="space-y-2 md:w-1/2">
                    <div className="h-5 bg-black/10 w-40 rounded"></div>
                    <div className="h-4 bg-black/10 w-32 rounded"></div>
                    <div className="h-4 bg-black/10 w-64 rounded"></div>
                  </div>
                  <div className="h-9 bg-black/10 w-28 rounded self-start md:self-end"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State with Retry */}
          {!isLoadingAppointments && appointmentsError && (
            <div className="border-2 border-black p-6 bg-red-50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-red-900">
                <span>⚠ SUPABASE API ERROR</span>
              </div>
              <p className="text-xs text-red-800 font-mono">{appointmentsError}</p>
              <button
                onClick={fetchSupabaseAppointments}
                className="bg-black text-white px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
              >
                RETRY FETCHING APPOINTMENTS
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingAppointments && !appointmentsError && appointments.length === 0 && (
            <div className="border border-dashed border-black/30 p-12 text-center space-y-4 my-4">
              <div className="text-2xl">📅</div>
              <div className="space-y-1">
                <h4 className="text-sm tracking-[0.2em] font-bold uppercase">NO APPOINTMENTS FOUND</h4>
                <p className="text-xs text-black/60 max-w-md mx-auto font-light">
                  No appointments are registered in the Supabase `appointments` table for this selection. Submitting a new booking from the Client View will instantly synchronize real-time entries here.
                </p>
              </div>
              <button 
                onClick={() => navigate('/home')}
                className="bg-black text-white px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
              >
                BOOK TEST APPOINTMENT →
              </button>
            </div>
          )}

          {/* Live Appointments List */}
          {!isLoadingAppointments && !appointmentsError && appointments.length > 0 && (
            <div className="space-y-4 divide-y divide-black/10">
              {appointments.map((appt) => (
                <div key={appt.id} className="pt-4 pb-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div className="space-y-1 md:w-1/4">
                    <div className="font-mono text-2xl font-bold">{appt.time || '11:30 AM'}</div>
                    <div className="text-[10px] font-semibold text-black/60 uppercase">{appt.date}</div>
                    <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-black border border-black px-2 py-0.5 inline-block">
                      {appt.status?.toUpperCase() || 'CONFIRMED'}
                    </span>
                  </div>

                  <div className="space-y-1 md:w-1/2">
                    <h4 className="text-base font-bold tracking-wider text-black">{appt.clientName}</h4>
                    <p className="text-xs text-black/60 font-mono">{appt.clientPhone}</p>
                    <p className="text-xs font-medium pt-1 text-black/90">{appt.serviceName}</p>
                    <p className="text-xs text-black/50 font-light truncate">{appt.location}</p>
                    <p className="text-sm font-mono font-bold pt-1">₹{(Number(appt.amount) || 0).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 md:w-1/4">
                    <button 
                      onClick={handleDelayAppointment}
                      className="bg-black text-white px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
                    >
                      DELAY 15M
                    </button>
                    <a 
                      className="text-[10px] tracking-[0.2em] uppercase font-semibold underline underline-offset-4 hover:opacity-60" 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      DIRECTIONS / MAP →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* MODAL 1: SaaS Subscription Modal */}
      <AnimatePresence>
        {showSubModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full p-8 border border-black shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setShowSubModal(false)}
                className="absolute top-6 right-6 text-xs tracking-widest uppercase font-bold hover:opacity-50"
              >
                CLOSE [ X ]
              </button>

              <div className="border-b border-black pb-4">
                <h3 className="text-sm tracking-[0.25em] uppercase font-bold text-black">PRO SAAS SUBSCRIPTION</h3>
                <p className="text-xs text-black/60 font-light mt-1">Monthly platform membership plan for Rajkumari Beauty.</p>
              </div>

              <div className="border border-black p-4 space-y-2">
                <div className="flex justify-between text-xs font-bold tracking-wider uppercase">
                  <span>CURRENT PLAN: PRO TIER</span>
                  <span>₹999 / MONTH</span>
                </div>
                <p className="text-[10px] tracking-wider text-black/60 uppercase">BILLING CYCLE: MONTHLY AUTO-RENEW • NEXT: 28 AUG 2026</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] tracking-[0.2em] uppercase font-bold text-black">ACTIVE PRO MEMBERSHIP BENEFITS:</h4>
                <ul className="text-xs tracking-wider space-y-1 list-disc list-inside text-black/80 font-light">
                  <li>Unlimited Client WhatsApp &amp; Web Appointments</li>
                  <li>AI Festival Marketing Graphic Generator for WhatsApp status</li>
                  <li>Multi-Tier Pricing (In-Salon vs Home Visits)</li>
                  <li>Custom Public Booking Link (`atease.beauty/rajkumari-beauty`)</li>
                  <li>Direct Directions Integration &amp; Schedule Delay Manager</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4 border-t border-black">
                <button 
                  onClick={() => {
                    setShowSubModal(false);
                    showToast('ANNUAL PLAN SELECTED (SAVED 20%)');
                  }}
                  className="flex-1 bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
                >
                  UPGRADE TO ANNUAL (₹9,588/YR)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Festival Marketing Graphic Generator */}
      <AnimatePresence>
        {showMarketingModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-8 border border-black shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setShowMarketingModal(false)}
                className="absolute top-6 right-6 text-xs tracking-widest uppercase font-bold hover:opacity-50"
              >
                CLOSE [ X ]
              </button>

              <div className="border-b border-black pb-4">
                <h3 className="text-sm tracking-[0.25em] uppercase font-bold text-black">FESTIVAL MARKETING GRAPHIC</h3>
                <p className="text-xs text-black/60 font-light mt-1">Generate WhatsApp status banners for your clients.</p>
              </div>

              <div className="bg-black text-white p-8 text-center space-y-3 relative overflow-hidden">
                <div className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-bold">FESTIVAL SPECIAL OFFER</div>
                <h4 className="font-serif text-2xl tracking-[0.1em] uppercase font-normal">RAJKUMARI BEAUTY</h4>
                <p className="text-xs opacity-80 tracking-wider">Keratin Smoothing + Custom Organic Glow Facial Combo</p>
                <div className="inline-block border border-white px-4 py-1 text-xs tracking-[0.2em] uppercase font-bold mt-2">
                  FLAT 20% OFF THIS WEEK
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowMarketingModal(false);
                    showToast('GRAPHIC DOWNLOADED FOR WHATSAPP STATUS');
                  }}
                  className="flex-1 bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
                >
                  DOWNLOAD GRAPHIC
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Quick Block Slot */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-sm w-full p-8 border border-black shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setShowBlockModal(false)}
                className="absolute top-6 right-6 text-xs tracking-widest uppercase font-bold hover:opacity-50"
              >
                CLOSE [ X ]
              </button>

              <div className="border-b border-black pb-4">
                <h3 className="text-sm tracking-[0.25em] uppercase font-bold text-black">QUICK BLOCK SLOT</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-[0.2em] font-bold text-black uppercase mb-1">TIME SLOT</label>
                  <select className="w-full border-b border-black p-2 text-xs bg-transparent font-medium tracking-wider focus:outline-none">
                    <option>02:00 PM - 03:00 PM (TODAY)</option>
                    <option>03:30 PM - 04:30 PM (TODAY)</option>
                    <option>05:00 PM - 06:00 PM (TODAY)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowBlockModal(false);
                  showToast('SLOT 02:00 PM - 03:00 PM BLOCKED');
                }}
                className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
              >
                CONFIRM BLOCK SLOT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Add / Edit Service */}
      <AnimatePresence>
        {showServiceModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-8 border border-black shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setShowServiceModal(false)}
                className="absolute top-6 right-6 text-xs tracking-widest uppercase font-bold hover:opacity-50"
              >
                CLOSE [ X ]
              </button>

              <div className="border-b border-black pb-4">
                <h3 className="text-sm tracking-[0.25em] uppercase font-bold text-black">ADD NEW SERVICE</h3>
              </div>

              <div className="space-y-5 max-h-[60vh] overflow-y-auto no-scrollbar pb-2">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase mb-1">SERVICE TITLE</label>
                  <input type="text" placeholder="E.G. ORGANIC BOTOPLEX THERAPY" className="w-full border-b border-black p-2 text-xs bg-transparent outline-none tracking-wider" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase">CATEGORY</label>
                    <button 
                      onClick={() => setIsNewCategory(!isNewCategory)}
                      className="text-[9px] tracking-widest uppercase font-bold text-black/50 hover:text-black underline"
                    >
                      {isNewCategory ? 'SELECT EXISTING' : '+ ADD NEW CATEGORY'}
                    </button>
                  </div>
                  {isNewCategory ? (
                    <input type="text" placeholder="E.G. LASER TREATMENTS" className="w-full border-b border-black p-2 text-xs bg-transparent outline-none tracking-wider" />
                  ) : (
                    <select className="w-full border-b border-black p-2 text-xs bg-transparent outline-none tracking-wider font-medium text-black/80">
                      {categoriesData.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase mb-1">DESCRIPTION</label>
                  <textarea rows="2" placeholder="Brief details about the treatment..." className="w-full border-b border-black p-2 text-xs bg-transparent outline-none tracking-wider resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase mb-1">TIME TAKEN</label>
                    <input type="text" placeholder="E.G. 45 MINS" className="w-full border-b border-black p-2 text-xs bg-transparent outline-none tracking-wider" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase mb-1">IMAGE URL (OPTIONAL)</label>
                    <input type="text" placeholder="HTTPS://..." className="w-full border-b border-black p-2 text-xs bg-transparent outline-none tracking-wider" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase mb-1">IN-SALON (₹)</label>
                    <input type="number" placeholder="5000" className="w-full border-b border-black p-2 text-xs bg-transparent outline-none font-mono font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] font-bold text-black uppercase mb-1">HOME VISIT (₹)</label>
                    <input type="number" placeholder="5800" className="w-full border-b border-black p-2 text-xs bg-transparent outline-none font-mono font-bold" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowServiceModal(false);
                  showToast('NEW SERVICE PUBLISHED TO CATALOG');
                }}
                className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black/80 transition-colors"
              >
                PUBLISH SERVICE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
