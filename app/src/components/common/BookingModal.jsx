import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Check, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Phone, 
  Sparkles, 
  Home, 
  Building2,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { createAppointmentRecord, isSupabaseConfigured } from '../../lib/supabase';

export function BookingModal() {
  const bookingModalOpen = useAppStore((state) => state.bookingModalOpen);
  const bookingModalData = useAppStore((state) => state.bookingModalData);
  const closeBookingModal = useAppStore((state) => state.closeBookingModal);
  const addAppointment = useAppStore((state) => state.addAppointment);
  const clearCart = useAppStore((state) => state.clearCart);
  const showToast = useAppStore((state) => state.showToast);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const openAuthModal = useAppStore((state) => state.openAuthModal);

  // Scheduler Steps: 1: Service/Mode, 2: Date, 3: Time, 4: Confirm, 5: Success
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('at-home'); // 'at-home' | 'in-studio'
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  
  // Client input details
  const [clientName, setClientName] = useState('Priya Menon');
  const [clientPhone, setClientPhone] = useState('+91 98765 43210');
  const [clientAddress, setClientAddress] = useState('Plot No. 42, Unit-III, Kharabela Nagar, Bhubaneswar, Odisha');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 14 calendar dates
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: days[d.getDay()],
      dateNum: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      full: d,
      formatted: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`
    };
  });

  const timeSlots = {
    morning: ['09:30 AM', '10:45 AM', '11:30 AM', '12:15 PM'],
    afternoon: ['01:30 PM', '02:45 PM', '04:00 PM', '05:15 PM'],
    evening: ['06:30 PM', '07:30 PM', '08:15 PM']
  };

  // Pre-fill initial data when opened
  React.useEffect(() => {
    if (bookingModalData) {
      setStep(1);
      if (bookingModalData.pricingMode === 'IN_SALON') {
        setServiceType('in-studio');
      } else {
        setServiceType('at-home');
      }
    }
  }, [bookingModalData, bookingModalOpen]);

  if (!bookingModalOpen) return null;

  const activeProvider = bookingModalData?.provider || {
    name: "Rajkumari Beauty & Aesthetics",
    title: "Master Hair & Skin Specialist",
    location: "Home Services • Bhubaneswar",
    phone: "+91 90000 00000"
  };

  const serviceName = bookingModalData?.serviceName || 
    (bookingModalData?.services ? bookingModalData.services.map(s => s.name).join(', ') : 'Keratin Smoothing & Hair Spa');

  const amount = bookingModalData?.totalAmount || bookingModalData?.amount || 2500;
  const activeDate = dates[selectedDateIdx];

  const handleFinalBooking = async () => {
    setIsSubmitting(true);

    const bookingPayload = {
      clientName: clientName.trim() || 'Guest Client',
      clientPhone: clientPhone.trim() || '+91 98765 43210',
      serviceName,
      date: activeDate.formatted,
      time: selectedTime,
      location: serviceType === 'at-home' ? clientAddress : activeProvider.location,
      serviceType,
      amount,
      providerName: activeProvider.name,
      status: 'confirmed'
    };

    // 1. Sync with Supabase if live credentials exist
    if (isSupabaseConfigured) {
      try {
        await createAppointmentRecord(bookingPayload);
      } catch (err) {
        console.warn('Supabase sync notice:', err);
      }
    }

    // 2. Add to Zustand store live appointments
    const created = addAppointment(bookingPayload);
    setConfirmedBooking(created);
    clearCart();
    setIsSubmitting(false);
    setStep(5); // Success confirmation step
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBookingModal}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#FFFFFF] w-full max-w-lg border border-stone-200 shadow-2xl relative z-10 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={closeBookingModal}
            className="absolute top-5 right-5 text-stone-400 hover:text-[#111111] transition-colors p-1"
            aria-label="Close scheduler"
          >
            <X size={18} />
          </button>

          {/* Stepper Progress Bar */}
          {step <= 4 && (
            <div className="space-y-2 border-b border-stone-200 pb-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
                <span>Direct Booking Scheduler</span>
                <span>Step {step} of 4</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1 bg-stone-100">
                <div className={`h-full ${step >= 1 ? 'bg-[#111111]' : 'bg-stone-200'}`} />
                <div className={`h-full ${step >= 2 ? 'bg-[#111111]' : 'bg-stone-200'}`} />
                <div className={`h-full ${step >= 3 ? 'bg-[#111111]' : 'bg-stone-200'}`} />
                <div className={`h-full ${step >= 4 ? 'bg-[#111111]' : 'bg-stone-200'}`} />
              </div>
            </div>
          )}

          {/* ================= STEP 1: Service & Location Mode ================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
                  {activeProvider.name}
                </span>
                <h3 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
                  Select Treatment Mode
                </h3>
              </div>

              <div className="border border-stone-200 p-4 bg-[#F9F9F9] space-y-2">
                <div className="text-xs font-semibold text-[#111111] tracking-wide">
                  {serviceName}
                </div>
                <div className="flex justify-between items-center text-xs text-stone-600">
                  <span>Estimated Total:</span>
                  <span className="font-mono font-bold text-sm text-[#111111]">
                    ₹{Number(amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600">
                  Where would you like to receive the service?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType('at-home')}
                    className={`p-3.5 border text-left transition-all space-y-1 ${
                      serviceType === 'at-home'
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-stone-200 bg-[#FFFFFF] hover:border-stone-400 text-[#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                      <Home size={13} />
                      <span>At-Home Visit</span>
                    </div>
                    <p className={`text-[10px] font-light leading-snug ${serviceType === 'at-home' ? 'text-white/80' : 'text-stone-500'}`}>
                      Artist travels to your doorstep with full setup.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('in-studio')}
                    className={`p-3.5 border text-left transition-all space-y-1 ${
                      serviceType === 'in-studio'
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-stone-200 bg-[#FFFFFF] hover:border-stone-400 text-[#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                      <Building2 size={13} />
                      <span>In-Studio</span>
                    </div>
                    <p className={`text-[10px] font-light leading-snug ${serviceType === 'in-studio' ? 'text-white/80' : 'text-stone-500'}`}>
                      Visit provider's boutique suite.
                    </p>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <span>Select Appointment Date</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* ================= STEP 2: Select Date ================= */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
                  Step 2 • Date
                </span>
                <h3 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
                  Choose Preferred Date
                </h3>
              </div>

              {/* 14-day horizontal/grid calendar */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-56 overflow-y-auto pr-1">
                {dates.map((dateObj, idx) => {
                  const isSelected = selectedDateIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDateIdx(idx)}
                      className={`p-2.5 border text-center transition-all ${
                        isSelected
                          ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                          : 'border-stone-200 bg-[#F9F9F9] hover:border-stone-400 text-[#111111]'
                      }`}
                    >
                      <div className="text-[9px] tracking-wider uppercase opacity-70">
                        {dateObj.dayName}
                      </div>
                      <div className="font-mono text-base font-bold my-0.5">
                        {dateObj.dateNum}
                      </div>
                      <div className="text-[9px] tracking-wider uppercase opacity-70">
                        {dateObj.month}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-[#F9F9F9] border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
                <Calendar size={14} className="text-[#111111]" />
                <span>Selected: <strong>{activeDate.formatted}</strong></span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-stone-200 text-[#111111] py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:border-[#111111]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>Select Time Slot</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: Select Time Slot ================= */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
                  Step 3 • Time
                </span>
                <h3 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
                  Available Time Slots
                </h3>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500 block mb-1.5">
                    Morning
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.morning.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 text-xs font-mono font-medium border text-center transition-all ${
                          selectedTime === slot
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-stone-200 bg-[#F9F9F9] hover:border-stone-400 text-[#111111]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500 block mb-1.5">
                    Afternoon
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.afternoon.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 text-xs font-mono font-medium border text-center transition-all ${
                          selectedTime === slot
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-stone-200 bg-[#F9F9F9] hover:border-stone-400 text-[#111111]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500 block mb-1.5">
                    Evening
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.evening.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 text-xs font-mono font-medium border text-center transition-all ${
                          selectedTime === slot
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-stone-200 bg-[#F9F9F9] hover:border-stone-400 text-[#111111]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-stone-200 text-[#111111] py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:border-[#111111]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>Review &amp; Confirm</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: Review, Details & Mandatory Payment Disclosure ================= */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
                  Step 4 • Final Confirmation
                </span>
                <h3 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
                  Review Booking Details
                </h3>
              </div>

              {/* Summary Box */}
              <div className="border border-stone-200 p-4 bg-[#F9F9F9] space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10px]">Provider</span>
                  <span className="font-bold text-[#111111]">{activeProvider.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10px]">Service</span>
                  <span className="font-medium text-[#111111] text-right max-w-[220px] truncate">{serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[10px]">Schedule</span>
                  <span className="font-bold text-[#111111]">{activeDate.formatted} • {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase tracking-wider text-[10px]">Direct Payable Amount</span>
                  <span className="font-mono font-bold text-sm text-[#111111]">₹{Number(amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Client Contact Inputs */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#F9F9F9] border border-stone-200 focus:border-[#111111] p-2 text-xs text-[#111111] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                      Phone (for SMS &amp; Provider)
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#F9F9F9] border border-stone-200 focus:border-[#111111] p-2 text-xs font-mono text-[#111111] focus:outline-none"
                    />
                  </div>
                </div>

                {serviceType === 'at-home' && (
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                      Service Address
                    </label>
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full bg-[#F9F9F9] border border-stone-200 focus:border-[#111111] p-2 text-xs text-[#111111] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* MANDATORY PAYMENT DISCLOSURE BADGE (Exact Copy) */}
              <div className="border border-stone-300 bg-stone-50 p-3 rounded-sm text-[11px] text-[#111111] leading-relaxed flex items-start gap-2.5 font-medium shadow-sm">
                <ShieldCheck size={16} className="text-[#111111] shrink-0 mt-0.5" />
                <span>
                  Pay directly to the service provider at the time of service via Cash, UPI, or Card.
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 border border-stone-200 text-[#111111] py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:border-[#111111]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalBooking}
                  className="flex-1 bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Confirming...' : 'Confirm Appointment'}</span>
                  <Check size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: Success State ================= */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-6 text-center py-2">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
                  Appointment Confirmed
                </span>
                <h3 className="font-serif text-2xl tracking-wide uppercase font-normal text-[#111111]">
                  Booking Registered
                </h3>
                <p className="text-xs font-mono text-stone-600">
                  Reference: <strong>{confirmedBooking.id}</strong>
                </p>
              </div>

              <div className="border border-stone-200 p-4 bg-[#F9F9F9] text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Provider:</span>
                  <span className="font-semibold text-[#111111]">{activeProvider.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date &amp; Time:</span>
                  <span className="font-bold text-[#111111]">{confirmedBooking.date} • {confirmedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="text-[#111111] text-right truncate max-w-[200px]">{confirmedBooking.location}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200">
                  <span className="text-stone-500">Direct Payable:</span>
                  <span className="font-mono font-bold text-sm text-[#111111]">₹{Number(confirmedBooking.amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Exact Payment Disclosure Notice on Success */}
              <div className="border border-stone-300 bg-white p-3 text-[10px] text-stone-700 leading-relaxed text-left flex items-start gap-2">
                <ShieldCheck size={14} className="text-[#111111] shrink-0 mt-0.5" />
                <span>
                  Pay directly to the service provider at the time of service via Cash, UPI, or Card.
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeBookingModal();
                    showToast('Booking details saved. See you at your appointment!');
                  }}
                  className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors"
                >
                  Done &amp; Return to Discovery
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
