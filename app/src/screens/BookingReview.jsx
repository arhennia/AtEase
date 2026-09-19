import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatUptoPrice } from '../data/onboardingQuiz';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';
import { createAppointmentRecord, isSupabaseConfigured } from '../lib/supabase';
import { buildWhatsAppBookingUrl, openWhatsApp } from '../lib/whatsapp';

export function BookingReview() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { partnerSlug } = useParams();
  const state = locationState.state || {};

  const addAppointment = useAppStore((state) => state.addAppointment);
  const showToast = useAppStore((state) => state.showToast);
  const partners = useAppStore((state) => state.partners);
  const [isProcessing, setIsProcessing] = useState(false);

  const clientName = state.clientName || '';
  const clientPhone = state.clientPhone || '';
  const serviceName = state.serviceName || '';
  const date = state.date || '';
  const time = state.time || '';
  const address = state.location || '';
  const amount = Number(state.amount) || 0;
  const providerName = state.providerName || 'Studio';
  const ownerId = state.partnerId;
  const partner = partners.find((p) => p.id === ownerId || p.slug === (partnerSlug || state.partnerSlug));

  const handleConfirm = async () => {
    if (!String(clientName).trim()) {
      showToast('Enter your name on the previous step.');
      return;
    }
    if (String(clientPhone).replace(/\D/g, '').length < 10) {
      showToast('Enter a valid phone number on the previous step.');
      return;
    }
    if (!serviceName || !date || !time) {
      showToast('Pick a service, date, and time before sending.');
      return;
    }

    const waUrl = buildWhatsAppBookingUrl({
      phone: state.whatsappNumber || partner?.whatsappNumber || partner?.ownerPhone,
      clientName: String(clientName).trim(),
      services: serviceName,
      date,
      time,
      total: amount,
      studioName: providerName,
    });

    if (!waUrl) {
      showToast('This studio has not set a WhatsApp number yet.');
      return;
    }

    setIsProcessing(true);

    const bookingPayload = {
      clientName: String(clientName).trim(),
      clientPhone: String(clientPhone).trim(),
      serviceName,
      date,
      time,
      location: address,
      amount,
      providerName,
      partnerId: ownerId || partner?.id,
      ownerId: ownerId || partner?.id,
      partnerSlug: partnerSlug || state.partnerSlug,
      status: 'pending',
      bookingSource: 'whatsapp',
    };

    if (isSupabaseConfigured && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingPayload.ownerId || '')) {
      const result = await createAppointmentRecord(bookingPayload);
      if (!result.success) {
        setIsProcessing(false);
        showToast(result.error || 'Could not save booking.');
        return;
      }
      bookingPayload.id = result.data?.id;
    }

    const created = addAppointment(bookingPayload);
    setIsProcessing(false);
    openWhatsApp(waUrl);

    const slug = partnerSlug || state.partnerSlug;
    navigate(slug ? `/p/${slug}/success` : '/', {
      state: {
        ...state,
        bookingId: created.id,
        amount,
        whatsappUrl: waUrl,
      },
    });
  };

  return (
    <div className="bg-[#FAFAFB] min-h-screen font-heroSans text-[#1C1917] antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="px-5 sm:px-8 py-5 border-b border-stone-200/70 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-stone-500 hover:text-[#1C1917]"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <AtEaseLogo className="text-xl" />
        <div className="w-16" />
      </header>

      {/* Main Review Card */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 sm:p-8 space-y-6 flex flex-col justify-center">
        <div className="rounded-[22px] border border-stone-200/70 p-6 sm:p-8 space-y-6 bg-white">
          
          <div className="space-y-1">
            <span className="text-[11px] tracking-[0.16em] uppercase text-stone-400">
              Review
            </span>
            <h1 className="font-heroSans text-2xl font-semibold tracking-tight text-[#1C1917]">
              Appointment summary
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
              <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold">Upto</span>
              <span className="font-mono font-bold text-base text-[#111111]">{formatUptoPrice(amount)}</span>
            </div>
          </div>

          {/* EXACT PAYMENT DISCLOSURE BADGE */}
          <div className="border border-[#E4D9F0] bg-[#F3EEF8] p-3 rounded-2xl text-[11px] text-[#4A3F5C] leading-relaxed flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#111111] shrink-0 mt-0.5" />
            <span>
              Pay directly to the service provider at the time of service via Cash, UPI, or Card.
            </span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full rounded-full bg-[#1C1917] text-white py-3.5 text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>{isProcessing ? 'Saving…' : 'Send on WhatsApp'}</span>
            <MessageCircle size={14} />
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200/70 text-[11px] text-stone-400 font-heroSans">
        AtEase • Discovery &amp; Direct Booking
      </footer>
    </div>
  );
}
