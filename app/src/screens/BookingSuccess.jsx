import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';
import { openWhatsApp } from '../lib/whatsapp';

export function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { partnerSlug } = useParams();
  const state = location.state || {};
  const backToSite = partnerSlug ? `/p/${partnerSlug}` : '/';

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
        colors: ['#B8A9D4', '#EDE9FE', '#1C1917']
      });
    } catch (e) {}
  }, []);

  return (
    <div className="bg-[#FAFAFB] min-h-screen font-heroSans text-[#1C1917] antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="px-5 sm:px-8 py-5 border-b border-stone-200/70 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <AtEaseLogo className="text-xl" />
        <button
          onClick={() => navigate(backToSite)}
          className="text-[13px] text-stone-500 hover:text-[#1C1917]"
        >
          Studio site →
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 sm:p-8 space-y-6 flex flex-col justify-center text-center">
        <div className="rounded-[22px] border border-stone-200/70 p-8 sm:p-10 space-y-6 bg-white">
          
          <div className="w-14 h-14 bg-[#EDE9FE] text-[#6D5A8D] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
              WhatsApp booking started
            </span>
            <h1 className="font-heroSans text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917]">
              Message ready
            </h1>
            <p className="text-xs font-mono text-stone-600 pt-1">
              Booking Ref: <strong>{bookingId}</strong>
            </p>
          </div>

          {/* Details Box */}
          <div className="border border-stone-200/70 rounded-2xl p-4 bg-[#F7F6F8] text-left space-y-2 text-xs">
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
          <div className="border border-[#E4D9F0] bg-[#F3EEF8] p-3 rounded-2xl text-[11px] text-[#4A3F5C] leading-relaxed text-left flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#111111] shrink-0 mt-0.5" />
            <span>
              {state.whatsappUrl
                ? 'We saved this as pending and opened WhatsApp with the booking details.'
                : 'Pay directly to the service provider at the time of service via Cash, UPI, or Card.'}
            </span>
          </div>

          {state.whatsappUrl && (
            <button
              type="button"
              onClick={() => openWhatsApp(state.whatsappUrl)}
              className="w-full rounded-full bg-[#1C1917] text-white py-3.5 text-[13px] font-medium hover:bg-black transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              Open WhatsApp again
            </button>
          )}
          <button
            onClick={() => navigate(backToSite)}
            className={`w-full rounded-full py-3.5 text-[13px] font-medium ${
              state.whatsappUrl
                ? 'border border-stone-200 text-[#1C1917] hover:border-stone-400'
                : 'bg-[#1C1917] text-white hover:bg-black'
            }`}
          >
            Done
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200/70 text-[11px] text-stone-400 font-heroSans">
        AtEase • Editorial Discovery &amp; Direct Booking
      </footer>
    </div>
  );
}
