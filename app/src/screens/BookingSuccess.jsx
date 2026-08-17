import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight, Home, Calendar, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const bookingId = state.bookingId || 'ATEASE-' + Math.floor(10000 + Math.random() * 90000);
  const providerName = state.providerName || 'Rajkumari Beauty & Aesthetics';
  const serviceName = state.serviceName || 'Keratin Smoothing Treatment';
  const dateStr = state.date || 'Today';
  const timeStr = state.time || '11:30 AM';
  const totalAmount = Number(state.amount) || 2500;

  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#111111', '#555555', '#999999']
      });
    } catch (e) {}
  }, []);

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans text-[#111111] antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 border-b border-stone-200 flex items-center justify-between">
        <span className="font-serif text-lg tracking-[0.18em] font-normal uppercase text-[#111111]">
          AtEase
        </span>
        <button
          onClick={() => navigate('/')}
          className="text-[10px] tracking-[0.15em] uppercase font-bold text-stone-600 hover:text-black"
        >
          Marketplace →
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 sm:p-8 space-y-6 flex flex-col justify-center text-center">
        <div className="border border-stone-200 p-8 sm:p-10 space-y-6 shadow-sm bg-[#FFFFFF]">
          
          <div className="w-14 h-14 bg-[#111111] text-white rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
              Direct Reservation Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl tracking-wide uppercase font-normal text-[#111111]">
              Booking Registered
            </h1>
            <p className="text-xs font-mono text-stone-600 pt-1">
              Booking Ref: <strong>{bookingId}</strong>
            </p>
          </div>

          {/* Details Box */}
          <div className="border border-stone-200 p-4 bg-[#F9F9F9] text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">Provider:</span>
              <span className="font-bold text-[#111111]">{providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Service:</span>
              <span className="font-medium text-[#111111] text-right max-w-[200px] truncate">{serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Schedule:</span>
              <span className="font-bold text-[#111111]">{dateStr} • {timeStr}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200">
              <span className="text-stone-500">Payable Directly:</span>
              <span className="font-mono font-bold text-sm text-[#111111]">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* EXACT PAYMENT DISCLOSURE NOTICE */}
          <div className="border border-stone-300 bg-stone-50 p-3 text-[11px] text-[#111111] leading-relaxed text-left flex items-start gap-2.5 font-medium">
            <ShieldCheck size={16} className="text-[#111111] shrink-0 mt-0.5" />
            <span>
              Pay directly to the service provider at the time of service via Cash, UPI, or Card.
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors"
          >
            Done &amp; Return to Home
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-400">
        AtEase • Editorial Discovery &amp; Direct Booking
      </footer>
    </div>
  );
}
