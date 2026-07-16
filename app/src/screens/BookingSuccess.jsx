import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CalendarIcon, Navigation, Home as HomeIcon, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BookingSuccess() {
  const navigate = useNavigate();

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
        <p className="text-[16px] text-on-surface-variant max-w-sm mb-10">
          Your appointment has been successfully scheduled. We've sent a confirmation email to your registered address.
        </p>

        {/* Bento Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
          
          {/* Booking ID & Status */}
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">Booking ID</span>
              <span className="text-[15px] font-bold text-primary tracking-wide">KUM-88291</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[12px] font-medium text-on-surface-variant">Scheduled</span>
            </div>
          </div>

          {/* Technician */}
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-outline-variant/50">
              <img className="w-full h-full object-cover" alt="Technician" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiC0zQR5U___KdHB_Y8j7i0_YlH5qjnnX26_Sj6XOXRyAR9DcY0hYJIo1GapgG_7M145LIrSsaJSrQa8lBIs2lLiVFlcsYDjAq7tBTRc5ZA5fZPNIOpQ1Ee-cyEm9SOhRHV-CIWCbQF1ARbJC6RKYOVsuu0MOZxe4ftgZByUCib1c89IZudxngKJALcjDs0aS1bE_qkPwfvmRLiHviizO9bcKlTGxZxR2wnBIuA6bmjPgf54PHx8k2zJ9sJ3b02j8L88A6luLQ-g" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">Technician</span>
              <span className="text-[15px] font-bold text-on-surface">Kumari</span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="md:col-span-2 p-4 bg-surface-container-low border border-outline-variant/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                <CalendarIcon size={20} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">Date & Time</span>
                <span className="text-[15px] font-bold text-on-surface">Thu, 24 Oct at 11:30 AM</span>
              </div>
            </div>
          </div>

          {/* Arrival Note */}
          <div className="md:col-span-2 p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
            <Info size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[13px] text-on-surface-variant italic leading-relaxed">
              <strong className="text-primary not-italic font-semibold">Estimated Arrival:</strong> Your professional will arrive between 11:15 AM and 11:45 AM to ensure a prompt start.
            </p>
          </div>
        </div>

        {/* Action Cluster */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-10">
          <button className="flex-1 bg-primary text-white text-[14px] font-semibold py-4 px-6 rounded-xl hover:bg-primary/95 transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <Navigation size={18} />
            Track Booking
          </button>
          
          <button 
            onClick={() => navigate('/home')}
            className="flex-1 border border-primary text-primary text-[14px] font-semibold py-4 px-6 rounded-xl hover:bg-primary/5 transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <HomeIcon size={18} />
            Back to Home
          </button>
        </div>

      </div>
    </motion.main>
  );
}
