import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, Clock, ArrowRight, Sparkles, Verified, AlertCircle } from 'lucide-react';
import { createAppointmentRecord, isSupabaseConfigured } from '../lib/supabase';

export function BookingReview() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const state = locationState.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clientName = state.clientName || 'Priya Menon';
  const clientPhone = state.clientPhone || '+91 98765 43210';
  const serviceName = state.serviceName || 'Hair Spa & Scalp Massage';
  const serviceId = state.serviceId || 's2';
  
  const now = new Date();
  const defaultDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const date = state.date || defaultDateStr;
  const time = state.time || '11:30 AM';
  const address = state.location || 'Plot No. 42, Unit-III, Kharabela Nagar, Bhubaneswar, Odisha';
  const amount = Number(state.amount) || 1350;

  // Build proper ISO timestamp for Supabase DB
  let bookingTimeIso = state.bookingTime;
  if (!bookingTimeIso) {
    try {
      const parsed = new Date(`${date} ${time}`);
      if (!isNaN(parsed.getTime())) {
        bookingTimeIso = parsed.toISOString();
      } else {
        bookingTimeIso = now.toISOString();
      }
    } catch(e) {
      bookingTimeIso = now.toISOString();
    }
  }

  const handleRequest = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    const bookingPayload = {
      clientName,
      clientPhone,
      serviceName,
      serviceId,
      date,
      time,
      bookingTime: bookingTimeIso,
      location: address,
      status: 'confirmed',  
      amount
    };

    if (isSupabaseConfigured) {
      const result = await createAppointmentRecord(bookingPayload);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to submit appointment to database');
        setIsProcessing(false);
        return;
      }
    } else {
      console.warn('Supabase not configured in .env.local, proceeding with local flow');
      await new Promise(res => setTimeout(res, 800));
    }

    setIsProcessing(false);
    navigate('/success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[480px] bg-background min-h-screen flex flex-col relative shadow-sm border-x border-outline-variant/30 mx-auto"
    >
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-50 bg-white border-b border-outline-variant transition-colors duration-200 flex items-center justify-between px-container-margin h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="text-primary" size={24} />
          </button>
          <h1 className="text-[20px] font-semibold text-primary">Booking Review</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
          <img alt="Professional Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCslFZBF6PkMdpo9PFjqJojXbcbDolwUl-4TOvx2TdS6w4gp2TtctBobjMNN_Ii1v4LMmuk370iF1c3lUGhKjBXs4pkG37XUC5BoIrC7b5gcdO_8K4CkYe5hnWhXEyljDZgOG1ngv6xoHFUcz3LScelPUjyqIB4K3w87dy44pmWSHbpguXqbumMtAWlzaD9hj8aUDckBqXAABreOaVe1IRLwnqp5NsNw4OLf04KmUs8VgHJar_Ms6G6NYoTC-L-YemKwP13AW8m7g" />
        </div>
      </header>

      <main className="flex-1 px-container-margin py-6 space-y-6 pb-32">
        {/* Summary Header */}
        <section className="text-center space-y-1">
          <span className="text-[11px] font-semibold text-accent-orange uppercase tracking-[2px]">Kumari & Co.</span>
          <h2 className="text-[30px] font-bold text-on-surface">Confirm Details</h2>
        </section>

        {/* Unified "Boutique Receipt" Card */}
        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          {/* Service Header Section */}
          <div className="p-4 flex gap-4 items-center bg-surface-container-low border-b border-outline-variant">
            <img alt="Service Image" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV15xjZxG2DQ7iYDIz7upkMuM3UlOlVF4tGn7JdBlxhgITZWFEVvGwWQzUQCJA4iHyqpr0SgLxn7V8eoA32rj6t17WOVQeTj56PQA1x9xHer22VID9DghttvpNeedfkwGXLKnL_yzgLKMYYsg58IqNCl1krzvneYXrYSpYSdumtYjSJAcnSWsU1Z74NJpQGxGELcPvA7Ld8z5cYw0YIK--HCyFOv2jSNEhfq6F0y3KYI60pSADGC_nuIijgei7G_UMzYef6bmB6g" />
            <div>
              <h3 className="text-[18px] font-semibold text-primary leading-tight">{serviceName}</h3>
              <p className="text-[14px] text-on-surface-variant mt-1">60 min • Professional Care</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Date</p>
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-accent-moss" />
                  <span className="text-[16px] text-on-surface font-semibold">{date}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Time</p>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-accent-moss" />
                  <span className="text-[16px] text-on-surface font-semibold">{time}</span>
                </div>
              </div>
            </div>

            {/* Address & Small Map */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Service Location</p>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <p className="text-[15px] text-on-surface font-semibold leading-tight">{address}</p>
                </div>
                <div className="w-16 h-16 rounded-lg overflow-hidden grayscale border border-outline-variant shrink-0">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdVgGfXCUqTwq1F703dGrR77M6YDBoERdqmrE5srjSt8aLLUU-CYeWzywu0tSoJ1lMOfIrBCGydDAWuoeE2qdvwdw0F0eOee9V3d1fZw1in8neGcI1YrCrYmWwOyhIx0ZLZ4hIFfimwMQ7fBkhTQdFGGRSQdGO-CCAKtMLEXT8CP-ezIGh2RknzH5X-CCCrkHLn5Fwk9kC7R4gkQcakBXhG6qZ6gL5SrBdspTCgKsbAcq_m5Cv7C91Vnp9qhicKCC2TJQ1dFdgwg')" }}></div>
                </div>
              </div>
            </div>

            {/* Billing Breakdown */}
            <div className="pt-4 mt-4 border-t border-dashed border-outline-variant space-y-2">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-on-surface-variant">Service Total</span>
                <span className="text-on-surface font-medium">₹{amount.toLocaleString()}</span>
              </div>
              
              <div className="pt-4 mt-3 flex justify-between items-center bg-[image:linear-gradient(to_right,#c1c9be_50%,transparent_50%)] bg-[length:8px_1px] bg-repeat-x bg-top">
                <span className="text-[18px] font-semibold text-on-surface">Amount Due</span>
                <span className="text-[18px] font-bold text-primary">₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-medium">
            <AlertCircle className="shrink-0 text-red-500 mt-0.5" size={18} />
            <div className="flex-1">
              <span className="font-bold">Booking Request Failed: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Professional Policy Note */}
        <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border-l-4 border-accent-orange/50">
          <Sparkles className="text-accent-orange shrink-0 mt-0.5" size={20} />
          <p className="text-[14px] text-on-surface-variant leading-relaxed italic">
            Cancellation is free up to 2 hours prior. Our professional will arrive within 15 minutes of your slot.
          </p>
        </div>
      </main>

      {/* Prominent Sticky Footer */}
      <div className="fixed bottom-0 w-full z-50 max-w-[480px] bg-white border-t border-outline-variant p-container-margin shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe md:left-1/2 md:-translate-x-1/2">
        <button 
          onClick={handleRequest}
          disabled={isProcessing}
          className={`w-full text-white text-[18px] font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg ${
            isProcessing ? 'bg-primary/90 opacity-90 cursor-wait' : 'bg-primary active:scale-[0.98] hover:bg-primary/95 shadow-primary/20'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            <>
              <span>Request Booking</span>
              <ArrowRight size={24} />
            </>
          )}
        </button>
        <p className="text-center mt-3 text-[11px] font-semibold text-on-surface-variant">
          Pay ₹1,350 after service completion
        </p>
      </div>
    </motion.div>
  );
}
