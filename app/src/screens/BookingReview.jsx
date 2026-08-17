import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { createAppointmentRecord, isSupabaseConfigured } from '../lib/supabase';

export function BookingReview() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const state = locationState.state || {};

  const addAppointment = useAppStore((state) => state.addAppointment);
  const [isProcessing, setIsProcessing] = useState(false);

  const clientName = state.clientName || 'Priya Menon';
  const clientPhone = state.clientPhone || '+91 98765 43210';
  const serviceName = state.serviceName || 'Keratin Smoothing Treatment';
  const date = state.date || 'Today';
  const time = state.time || '11:30 AM';
  const address = state.location || 'Plot No. 42, Unit-III, Kharabela Nagar, Bhubaneswar, Odisha';
  const amount = Number(state.amount) || 2500;
  const providerName = state.providerName || 'Rajkumari Beauty & Aesthetics';

  const handleConfirm = async () => {
    setIsProcessing(true);

    const bookingPayload = {
      clientName,
      clientPhone,
      serviceName,
      date,
      time,
      location: address,
      amount,
      providerName,
      status: 'confirmed'
    };

    if (isSupabaseConfigured) {
      try {
        await createAppointmentRecord(bookingPayload);
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    }

    const created = addAppointment(bookingPayload);
    setIsProcessing(false);

    navigate('/success', {
      state: {
        ...state,
        bookingId: created.id,
        amount
      }
    });
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans text-[#111111] antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 border-b border-stone-200 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-stone-600 hover:text-black"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <span className="font-serif text-lg tracking-[0.18em] font-normal uppercase text-[#111111]">
          AtEase
        </span>
        <div className="w-16" />
      </header>

      {/* Main Review Card */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 sm:p-8 space-y-6 flex flex-col justify-center">
        <div className="border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm bg-[#FFFFFF]">
          
          <div className="border-b border-stone-200 pb-4 space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
              Direct Booking Review
            </span>
            <h1 className="font-serif text-2xl tracking-wide uppercase font-normal text-[#111111]">
              Appointment Summary
            </h1>
          </div>

          <div className="space-y-3 text-xs divide-y divide-stone-100">
            <div className="flex justify-between pt-2">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Provider</span>
              <span className="font-bold text-[#111111]">{providerName}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Service</span>
              <span className="font-medium text-[#111111] text-right max-w-[220px] truncate">{serviceName}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Date &amp; Time</span>
              <span className="font-bold text-[#111111]">{date} • {time}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Service Location</span>
              <span className="text-[#111111] text-right max-w-[220px] truncate">{address}</span>
            </div>
            <div className="flex justify-between pt-3 text-sm">
              <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold">Payable to Provider</span>
              <span className="font-mono font-bold text-base text-[#111111]">₹{amount.toLocaleString()}</span>
            </div>
          </div>

          {/* EXACT PAYMENT DISCLOSURE BADGE */}
          <div className="border border-stone-300 bg-stone-50 p-3 rounded-sm text-[11px] text-[#111111] leading-relaxed flex items-start gap-2.5 font-medium shadow-sm">
            <ShieldCheck size={16} className="text-[#111111] shrink-0 mt-0.5" />
            <span>
              Pay directly to the service provider at the time of service via Cash, UPI, or Card.
            </span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <span>{isProcessing ? 'Confirming...' : 'Confirm Appointment'}</span>
            <Check size={14} />
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-400">
        AtEase • Discovery &amp; Direct Booking
      </footer>
    </div>
  );
}
