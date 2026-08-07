import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ProviderDashboard() {
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('TODAY'); // 'TODAY' | 'TOMORROW' | 'THIS_WEEK'
  const [showSubModal, setShowSubModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('11:30 AM');
  const [delayedCount, setDelayedCount] = useState(0);

  // Catalog item state
  const [inSalonPrice, setInSalonPrice] = useState('₹4,500');
  const [homeVisitPrice, setHomeVisitPrice] = useState('₹5,200');
  const [enableHomeVisit, setEnableHomeVisit] = useState(true);
  const [requireConsultation, setRequireConsultation] = useState(false);
  const [serviceDuration, setServiceDuration] = useState('90 min');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://atease.beauty/luxe-studio-aisha');
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

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-0 font-body-md antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">info</span>
          {toastMessage}
        </div>
      )}

      {/* Top Banner for Persona Switcher & Subscription Notice */}
      <div className="bg-primary text-on-primary px-4 py-2 text-xs flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-[10px] bg-white text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Provider Persona
          </span>
          <span className="hidden sm:inline opacity-80">SaaS Business & Catalog Manager</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSubModal(true)}
            className="bg-surface-container-high text-primary px-2.5 py-0.5 rounded font-label-caps text-[10px] uppercase font-bold hover:bg-white transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">verified</span>
            PRO Tier Active (₹999/mo)
          </button>
          <button 
            onClick={() => navigate('/home')}
            className="hover:underline opacity-90 text-[11px] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Switch to Client Booking View
          </button>
        </div>
      </div>

      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-surface border-b border-surface-variant z-40 shadow-xs">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <button className="text-primary hover:opacity-70 transition-opacity hidden md:block">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-primary uppercase tracking-widest text-center flex-1 md:flex-none font-bold">
            LUXE STUDIO
          </h1>
          <nav className="hidden md:flex gap-8 items-center flex-1 justify-center">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`font-bold hover:opacity-70 transition-opacity ${activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`hover:opacity-70 transition-opacity ${activeTab === 'calendar' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary'}`}
            >
              Calendar
            </button>
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`hover:opacity-70 transition-opacity ${activeTab === 'catalog' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary'}`}
            >
              Catalog
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`hover:opacity-70 transition-opacity ${activeTab === 'marketing' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary'}`}
            >
              Marketing
            </button>
          </nav>
          <button 
            onClick={() => showToast('No new notifications')}
            className="text-primary hover:opacity-70 transition-opacity relative p-1"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md flex flex-col gap-stack-xl">
        
        {/* Section 1: Operational Header & SaaS Subscription Badge */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-headline-md text-headline-md text-primary font-medium">Good Morning, Aisha</h2>
            <div className="bg-surface-container py-3 px-6 border border-surface-variant inline-flex items-center gap-2 flex-wrap">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">3</span>
              <span className="font-body-md text-body-md text-secondary">Bookings Today •</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">₹5,400</span>
              <span className="font-body-md text-body-md text-secondary">Estimated Revenue</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border solid-border p-4 flex flex-col gap-2 max-w-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-[10px] text-secondary uppercase font-bold tracking-wider">SUBSCRIPTION PLAN</span>
              <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded font-bold">PRO SaaS</span>
            </div>
            <p className="text-xs font-semibold text-primary">₹999 / month (Billed Monthly)</p>
            <p className="text-[11px] text-secondary">Next Renewal: 28 Aug 2026</p>
            <button 
              onClick={() => setShowSubModal(true)}
              className="text-xs text-primary underline underline-offset-2 hover:opacity-70 text-left font-medium"
            >
              Manage Subscription Benefits →
            </button>
          </div>
        </section>

        {/* Section 2: Fast-Action Grid */}
        <section className="grid grid-cols-2 gap-3 md:gap-gutter max-w-3xl">
          
          {/* Card 1: Add / Edit Service */}
          <button 
            onClick={() => setShowServiceModal(true)}
            className="bg-primary text-on-primary p-6 border border-primary flex flex-col items-center justify-center gap-4 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl font-light">add</span>
            <span className="font-headline-sm text-headline-sm text-[15px] font-medium">Add / Edit Service</span>
          </button>

          {/* Card 2: Festival Marketing Graphic */}
          <button 
            onClick={() => setShowMarketingModal(true)}
            className="bg-surface text-on-surface p-6 border border-surface-variant flex flex-col items-start gap-2 hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mb-1">auto_awesome</span>
            <span className="font-body-md text-body-md text-left text-[13px] font-semibold">Generate Festival Marketing Graphic</span>
            <span className="font-label-caps text-label-caps text-secondary text-[10px]">FOR WHATSAPP STATUS</span>
          </button>

          {/* Card 3: Share Booking Link */}
          <button 
            onClick={handleCopyLink}
            className="bg-surface text-on-surface p-6 border border-surface-variant flex flex-col items-start gap-4 hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
          >
            <div className="flex flex-col items-start gap-2">
              <span className="material-symbols-outlined text-primary mb-1">link</span>
              <span className="font-body-md text-body-md text-left text-[13px] font-semibold">Share Public Booking Link</span>
            </div>
            <div className="border border-primary px-3 py-1 text-primary font-label-caps text-label-caps mt-auto text-[11px] font-bold">
              COPY LINK
            </div>
          </button>

          {/* Card 4: Quick Block Slot */}
          <button 
            onClick={() => setShowBlockModal(true)}
            className="bg-surface text-on-surface p-6 border border-surface-variant flex flex-col items-start gap-2 hover:bg-surface-container-low transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mb-1">block</span>
            <span className="font-body-md text-body-md text-left text-[13px] font-semibold">Quick Block Slot</span>
            <span className="font-label-caps text-label-caps text-secondary text-[10px]">FOR WALK-INS / OFFLINE</span>
          </button>
        </section>

        {/* Section 3: Live Service Catalog Manager */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-surface-variant pb-4">
            <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">Service Catalog & Pricing</h3>
            <button 
              onClick={() => showToast('Navigating to full catalog manager')}
              className="font-label-caps text-label-caps text-primary hover:text-secondary transition-colors text-[11px] font-bold tracking-wider"
            >
              MANAGE ALL →
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Catalog Item 1 */}
            <div className="bg-surface border border-surface-variant p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              
              <div className="flex flex-col gap-2 md:w-1/3">
                <span className="font-label-caps text-label-caps text-secondary text-[11px] font-semibold">HAIR TREATMENTS</span>
                <h4 className="font-headline-sm text-headline-sm text-primary font-medium text-[16px]">Signature Balayage & Gloss</h4>
              </div>

              <div className="flex flex-row gap-6 items-center md:w-1/3">
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-label-caps text-label-caps text-secondary text-[10px]">IN-SALON PRICE</label>
                  <input 
                    type="text"
                    value={inSalonPrice}
                    onChange={(e) => setInSalonPrice(e.target.value)}
                    className="border-0 border-b border-primary bg-transparent p-0 pb-1 font-headline-sm text-headline-sm text-primary focus:ring-0 focus:border-primary w-full max-w-[120px] font-bold text-[18px]" 
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-label-caps text-label-caps text-secondary text-[10px]">HOME VISIT PRICE</label>
                  <input 
                    type="text"
                    value={homeVisitPrice}
                    onChange={(e) => setHomeVisitPrice(e.target.value)}
                    className="border-0 border-b border-primary bg-transparent p-0 pb-1 font-headline-sm text-headline-sm text-primary focus:ring-0 focus:border-primary w-full max-w-[120px] font-bold text-[18px]" 
                  />
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3 md:w-1/3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={enableHomeVisit}
                    onChange={(e) => setEnableHomeVisit(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4" 
                  />
                  <span className="font-body-md text-body-md text-secondary text-sm group-hover:text-primary transition-colors">
                    Enable Home Visits
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={requireConsultation}
                    onChange={(e) => setRequireConsultation(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4" 
                  />
                  <span className="font-body-md text-body-md text-secondary text-sm group-hover:text-primary transition-colors">
                    Require Consultation
                  </span>
                </label>

                <button 
                  onClick={() => {
                    const newDur = prompt('Enter service duration:', serviceDuration);
                    if (newDur) setServiceDuration(newDur);
                  }}
                  className="font-body-md text-body-md text-secondary text-sm flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Edit Duration ({serviceDuration}) <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: Live Schedule */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-surface-variant pb-4 gap-4">
            <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">Today's Appointments</h3>

            {/* Segment Control */}
            <div className="flex bg-surface-container p-1 rounded-full text-xs">
              <button 
                onClick={() => setTimeFilter('TODAY')}
                className={`font-button-text text-button-text px-6 py-2 rounded-full transition-colors ${timeFilter === 'TODAY' ? 'bg-primary text-on-primary font-bold' : 'text-secondary hover:text-primary'}`}
              >
                TODAY
              </button>
              <button 
                onClick={() => setTimeFilter('TOMORROW')}
                className={`font-button-text text-button-text px-6 py-2 rounded-full transition-colors ${timeFilter === 'TOMORROW' ? 'bg-primary text-on-primary font-bold' : 'text-secondary hover:text-primary'}`}
              >
                TOMORROW
              </button>
              <button 
                onClick={() => setTimeFilter('THIS_WEEK')}
                className={`font-button-text text-button-text px-6 py-2 rounded-full transition-colors ${timeFilter === 'THIS_WEEK' ? 'bg-primary text-on-primary font-bold' : 'text-secondary hover:text-primary'}`}
              >
                THIS WEEK
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-0">
            {/* Appointment Card */}
            <div className="bg-surface border-b border-surface-variant p-6 flex flex-col md:flex-row gap-6 md:items-center hover:bg-surface-container-lowest transition-colors shadow-xs">
              {/* Col 1 */}
              <div className="flex flex-col items-start gap-2 md:w-1/4">
                <span className="font-headline-md text-headline-md text-primary font-bold">{appointmentTime}</span>
                <span className="bg-surface border border-primary text-primary font-label-caps text-label-caps px-2 py-1 text-[10px] font-bold tracking-wider">
                  HOME VISIT
                </span>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col gap-1 md:w-1/2">
                <span className="font-headline-sm text-headline-sm text-primary font-medium text-[18px]">Priya Menon</span>
                <span className="font-body-md text-body-md text-secondary text-xs">+91 98765 43210</span>
                <span className="font-body-md text-body-md text-primary mt-2 font-medium">Balayage, Deep Conditioning</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold mt-1 text-[16px]">₹5,200</span>
              </div>
              {/* Col 3 */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:w-1/4 mt-4 md:mt-0">
                <button 
                  onClick={handleDelayAppointment}
                  className="border border-primary px-4 py-2 text-primary font-button-text text-button-text hover:bg-surface-container-low transition-colors rounded-full text-xs font-semibold"
                >
                  Delay 15m
                </button>
                <a 
                  className="font-body-md text-body-md text-primary flex items-center gap-1 hover:text-secondary transition-colors underline underline-offset-4 text-xs" 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span> Directions / Map
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-margin-mobile pb-4 bg-surface border-t border-surface-variant z-50 pt-2 shadow-lg">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center pt-2 w-1/4 ${activeTab === 'dashboard' ? 'text-primary border-t-2 border-primary font-bold' : 'text-secondary'}`}
        >
          <span className="material-symbols-outlined mb-1 icon-fill">dashboard</span>
          <span className="font-label-caps text-label-caps text-[10px]">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center pt-2 w-1/4 ${activeTab === 'calendar' ? 'text-primary border-t-2 border-primary font-bold' : 'text-secondary'}`}
        >
          <span className="material-symbols-outlined mb-1">calendar_today</span>
          <span className="font-label-caps text-label-caps text-[10px]">Calendar</span>
        </button>
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center pt-2 w-1/4 ${activeTab === 'catalog' ? 'text-primary border-t-2 border-primary font-bold' : 'text-secondary'}`}
        >
          <span className="material-symbols-outlined mb-1">inventory_2</span>
          <span className="font-label-caps text-label-caps text-[10px]">Catalog</span>
        </button>
        <button 
          onClick={() => setActiveTab('marketing')}
          className={`flex flex-col items-center justify-center pt-2 w-1/4 ${activeTab === 'marketing' ? 'text-primary border-t-2 border-primary font-bold' : 'text-secondary'}`}
        >
          <span className="material-symbols-outlined mb-1">campaign</span>
          <span className="font-label-caps text-label-caps text-[10px]">Marketing</span>
        </button>
      </nav>

      {/* MODAL 1: SaaS Subscription Modal */}
      <AnimatePresence>
        {showSubModal && (
          <div className="fixed inset-0 scrim-bg z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-lg w-full p-6 solid-border shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSubModal(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-70 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">PRO SaaS Subscription</h3>
              </div>
              <p className="text-xs text-secondary mb-4">
                Your monthly subscription empowers your independent beauty business with automated tools.
              </p>

              <div className="bg-surface-container p-4 border border-surface-variant mb-4 space-y-2">
                <div className="flex justify-between text-xs font-bold text-primary">
                  <span>Current Plan: PRO Tier</span>
                  <span>₹999 / month</span>
                </div>
                <div className="text-[11px] text-secondary">
                  Billing cycle: Monthly auto-renew • Next billing: 28 Aug 2026
                </div>
              </div>

              <h4 className="font-label-caps text-[11px] text-primary uppercase font-bold mb-2">ACTIVE PRO FEATURES:</h4>
              <ul className="text-xs text-secondary space-y-1.5 mb-6 list-disc list-inside">
                <li>Unlimited Client WhatsApp & Web Appointments</li>
                <li>AI Festival Marketing Graphic Generator for WhatsApp status</li>
                <li>Multi-Tier Pricing (In-Salon vs Home Visits)</li>
                <li>Custom Public Booking Link (`atease.beauty/luxe-studio-aisha`)</li>
                <li>Direct Directions Integration & Schedule Delay Manager</li>
              </ul>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowSubModal(false);
                    showToast('Annual Subscription plan option selected! Saved 20%.');
                  }}
                  className="flex-1 bg-primary text-on-primary py-3 font-button-text text-xs uppercase tracking-wider font-bold hover:bg-surface-tint transition-colors"
                >
                  Upgrade to Annual (₹9,588/yr)
                </button>
                <button 
                  onClick={() => setShowSubModal(false)}
                  className="px-4 py-3 solid-border font-button-text text-xs uppercase tracking-wider font-bold hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Festival Marketing Graphic Generator */}
      <AnimatePresence>
        {showMarketingModal && (
          <div className="fixed inset-0 scrim-bg z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-md w-full p-6 solid-border shadow-2xl relative"
            >
              <button 
                onClick={() => setShowMarketingModal(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-70 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">Festival Marketing Graphic</h3>
              <p className="text-xs text-secondary mb-4">Generate instant WhatsApp status graphics for your clients!</p>

              {/* Graphic Banner Preview */}
              <div className="bg-black text-white p-6 rounded-lg text-center relative overflow-hidden mb-4 shadow-md">
                <div className="font-label-caps text-[10px] tracking-widest text-amber-300 uppercase font-bold mb-2">FESTIVAL SPECIAL OFFER</div>
                <h4 className="font-headline-sm text-2xl text-white font-serif italic mb-1">LUXE STUDIO</h4>
                <p className="text-xs opacity-90 mb-3">Signature Balayage + Hydraglow Facial Combo</p>
                <div className="inline-block bg-amber-400 text-black px-3 py-1 font-bold text-xs rounded-full uppercase tracking-wider">
                  FLAT 20% OFF THIS WEEK
                </div>
                <p className="text-[10px] opacity-70 mt-3">Book on WhatsApp: atease.beauty/luxe-studio-aisha</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowMarketingModal(false);
                    showToast('Marketing graphic downloaded & ready for WhatsApp Status!');
                  }}
                  className="flex-1 bg-primary text-on-primary py-3 font-button-text text-xs uppercase font-bold tracking-wider hover:bg-surface-tint"
                >
                  Download Graphic
                </button>
                <button 
                  onClick={() => {
                    setShowMarketingModal(false);
                    showToast('Opening WhatsApp with promotional text!');
                  }}
                  className="flex-1 solid-border text-primary py-3 font-button-text text-xs uppercase font-bold tracking-wider hover:bg-surface-container"
                >
                  Share to WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Quick Block Slot */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 scrim-bg z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-sm w-full p-6 solid-border shadow-2xl relative"
            >
              <button 
                onClick={() => setShowBlockModal(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-70 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">Quick Block Slot</h3>
              <p className="text-xs text-secondary mb-4">Block time for walk-in clients or personal offline break.</p>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Time Slot</label>
                  <select className="w-full border solid-border p-2 text-xs bg-surface font-medium">
                    <option>02:00 PM - 03:00 PM (Today)</option>
                    <option>03:30 PM - 04:30 PM (Today)</option>
                    <option>05:00 PM - 06:00 PM (Today)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Reason</label>
                  <input 
                    type="text" 
                    placeholder="Walk-in client / Studio maintenance"
                    className="w-full border solid-border p-2 text-xs bg-surface" 
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowBlockModal(false);
                  showToast('Slot 02:00 PM - 03:00 PM blocked successfully!');
                }}
                className="w-full bg-primary text-on-primary py-3 font-button-text text-xs font-bold uppercase tracking-wider hover:bg-surface-tint"
              >
                Confirm Block Slot
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Add / Edit Service */}
      <AnimatePresence>
        {showServiceModal && (
          <div className="fixed inset-0 scrim-bg z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-md w-full p-6 solid-border shadow-2xl relative"
            >
              <button 
                onClick={() => setShowServiceModal(false)}
                className="absolute top-4 right-4 text-primary hover:opacity-70 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-1">Add New Service</h3>
              <p className="text-xs text-secondary mb-4">Add a new treatment to your client-facing catalog.</p>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Service Title</label>
                  <input type="text" placeholder="e.g. Organic Botoplex Therapy" className="w-full border solid-border p-2 text-xs bg-surface" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">In-Salon Price (₹)</label>
                    <input type="text" placeholder="5000" className="w-full border solid-border p-2 text-xs bg-surface" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Home Visit Price (₹)</label>
                    <input type="text" placeholder="5800" className="w-full border solid-border p-2 text-xs bg-surface" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowServiceModal(false);
                  showToast('New service published to your catalog!');
                }}
                className="w-full bg-primary text-on-primary py-3 font-button-text text-xs font-bold uppercase tracking-wider hover:bg-surface-tint"
              >
                Publish Service
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
