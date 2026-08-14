import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CalendarIcon, Navigation, Home as HomeIcon, Info, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [isTracked, setIsTracked] = useState(false);

  const bookingId = state.bookingId || state.appointmentData?.id || 'ATEASE-' + Math.floor(10000 + Math.random() * 90000);
  const providerName = state.providerName || 'Rajkumari Beauty & Aesthetics';
  const serviceName = state.serviceName || 'Hair Spa & Scalp Massage';
  const dateStr = state.date || 'Today';
  const timeStr = state.time || '11:30 AM';
  const addressStr = state.location || 'Plot No. 42, Unit-III, Bhubaneswar, Odisha';
  const totalAmount = Number(state.amount) || 1350;

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1d4626', '#924a28', '#ffa278', '#d9eaa3']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1d4626', '#924a28', '#ffa278', '#d9eaa3']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center px-container-margin py-12 relative overflow-hidden max-w-[480px] mx-auto border-x border-outline-variant/30"
    >
      {/* Success Animation Container */}
      <div className="w-full max-w-lg flex flex-col items-center text-center">
        
        {/* Icon Hero */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 z-10 relative">
            <Check size={48} strokeWidth={3} />
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-orange/30 rounded-full blur-sm"></div>
          <div className="absolute -bottom-2 -left-6 w-12 h-12 bg-accent-moss/30 rounded-full blur-md"></div>
        </motion.div>

        {/* Confirmation Text */}
        <h1 className="text-[32px] font-bold text-on-surface mb-2">Booking Confirmed</h1>
        <p className="text-[15px] text-on-surface-variant max-w-sm mb-8">
          Your appointment with <strong className="text-primary font-semibold">{providerName}</strong> has been successfully scheduled.
        </p>

        {/* Bento Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
          
          {/* Booking ID & Status */}
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">Booking Reference</span>
              <span className="text-[14px] font-bold text-primary font-mono tracking-wide">{bookingId}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[12px] font-medium text-on-surface-variant">Confirmed in Database</span>
            </div>
          </div>

          {/* Provider / Technician */}
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant/50">
              <img className="w-full h-full object-cover" alt="Provider" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-0.5 uppercase tracking-wider">Provider</span>
              <span className="text-[13px] font-bold text-on-surface truncate block">{providerName}</span>
            </div>
          </div>

          {/* Service & Total */}
          <div className="md:col-span-2 p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
              <span>SERVICE TREATMENT</span>
              <span>TOTAL PAID / DUE</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-on-surface">
              <span className="truncate pr-4">{serviceName}</span>
              <span className="text-primary whitespace-nowrap">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="md:col-span-2 p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                <CalendarIcon size={20} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant block mb-0.5 uppercase tracking-wider">Scheduled Time</span>
                <span className="text-[15px] font-bold text-on-surface">{dateStr} at {timeStr}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2 p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-start gap-3">
            <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-0.5 uppercase tracking-wider">Service Address</span>
              <span className="text-xs font-semibold text-on-surface leading-tight block">{addressStr}</span>
            </div>
          </div>

          {/* Arrival Note */}
          <div className="md:col-span-2 p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
            <Info size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[12px] text-on-surface-variant italic leading-relaxed">
              <strong className="text-primary not-italic font-semibold">Arrival Window:</strong> Your specialist will arrive within 15 mins of your slot at {timeStr}.
            </p>
          </div>
        </div>

        {/* Action Cluster */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
          <button 
            onClick={() => setIsTracked(!isTracked)}
            className="flex-1 bg-primary text-white text-[13px] font-semibold py-4 px-6 rounded-xl hover:bg-primary/95 transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Navigation size={18} />
            {isTracked ? 'Tracking Active (On Time)' : 'Track Booking'}
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="flex-1 border border-primary text-primary text-[13px] font-semibold py-4 px-6 rounded-xl hover:bg-primary/5 transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <HomeIcon size={18} />
            Back to Discovery
          </button>
        </div>

      </div>
    </motion.main>
  );
}
