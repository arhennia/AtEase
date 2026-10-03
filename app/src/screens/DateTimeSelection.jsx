import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sun, Sunrise, Moon, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';
import { useAppStore } from '../store/useAppStore';
import { isDayOpen, normalizeWorkingHours, omitTakenSlots, slotInstant, slotLabels, slotsForDay } from '../lib/availability';
import { fetchTakenSlotLabels } from '../lib/supabase';

export function DateTimeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { partnerSlug } = useParams();
  const partners = useAppStore((state) => state.partners);
  const fetchPartnerBySlug = useAppStore((state) => state.fetchPartnerBySlug);
  const partner = partners.find((p) => p.slug === partnerSlug);
  const hours = normalizeWorkingHours(partner?.workingHours);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [takenLabels, setTakenLabels] = useState([]);

  useEffect(() => {
    if (partnerSlug) fetchPartnerBySlug(partnerSlug);
  }, [partnerSlug, fetchPartnerBySlug]);

  // Generate next 14 days
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

  const activeDateObj = dates[selectedDate];
  const dayName = activeDateObj.dayName;
  const dayKey = `${activeDateObj.full.getFullYear()}-${activeDateObj.full.getMonth()}-${activeDateObj.full.getDate()}`;
  const hoursKey = `${hours.start}|${hours.end}|${hours.daysOpen.join(',')}`;
  const dayClosed = !isDayOpen(hours, dayName);
  const timeSlots = omitTakenSlots(slotsForDay(hours, dayName, activeDateObj.full), takenLabels);
  const openSlots = slotLabels(timeSlots);

  useEffect(() => {
    const ownerId = partner?.id;
    if (!ownerId) return undefined;
    const [year, month, date] = dayKey.split('-').map(Number);
    let active = true;
    fetchTakenSlotLabels(ownerId, new Date(year, month, date)).then((labels) => {
      if (active) setTakenLabels(labels);
    });
    return () => {
      active = false;
    };
  }, [partner?.id, dayKey]);

  useEffect(() => {
    const [start, end, days] = hoursKey.split('|');
    const [year, month, date] = dayKey.split('-').map(Number);
    const slots = slotLabels(omitTakenSlots(slotsForDay({
      start,
      end,
      daysOpen: days ? days.split(',').filter(Boolean) : [],
    }, dayName, new Date(year, month, date)), takenLabels));
    if (selectedTime && !slots.includes(selectedTime)) setSelectedTime('');
  }, [hoursKey, selectedTime, dayName, takenLabels, dayKey]);

  const handleConfirm = () => {
    if (!location.state?.serviceName || dayClosed || !openSlots.includes(selectedTime)) return;
    const when = slotInstant(activeDateObj.full, selectedTime);
    if (!when) return;

    navigate(partnerSlug ? `/p/${partnerSlug}/address` : '/', {
      state: {
        ...(location.state || {}),
        date: activeDateObj.formatted,
        time: selectedTime,
        bookingTime: when.toISOString(),
        workingHours: hours,
        serviceName: location.state?.serviceName,
        amount: location.state?.amount,
        providerName: location.state?.providerName,
        partnerSlug,
        partnerId: location.state?.partnerId
      }
    });
  };

  return (
    <div className="min-h-screen text-[#1C1917] font-heroSans antialiased flex flex-col justify-between relative z-10">
      {/* Top Header */}
      <header className="px-5 sm:px-8 py-4">
        <div className="glass-nav rounded-full px-4 sm:px-5 h-[56px] flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-stone-500 hover:text-[#1C1917]"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <AtEaseLogo className="text-xl" />
        <div className="w-16" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="glass rounded-[22px] p-6 sm:p-8 space-y-6">
          
          <div className="pb-2 space-y-1">
            <span className="text-[11px] tracking-[0.16em] uppercase text-stone-400">
              Schedule
            </span>
            <h1 className="font-heroSans text-2xl font-semibold tracking-tight text-[#1C1917]">
              Select date &amp; time
            </h1>
            <p className="text-xs text-stone-500 font-light">
              Choose an available appointment slot with your provider.
            </p>
          </div>

          {/* 14-Day Calendar Carousel */}
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-600 block">
              1. Choose Date
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-56 overflow-y-auto pr-1">
              {dates.map((dateObj, idx) => {
                const isSelected = selectedDate === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(idx)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#E4D9F0] bg-[#F3EEF8] text-[#4A3F5C]'
                        : 'border-stone-200 bg-[#F7F6F8] hover:border-stone-300 text-[#1C1917]'
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
          </div>

          {/* Time Slots */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-600 block">
              2. Choose Time Slot ({activeDateObj.formatted})
            </span>

            {dayClosed || openSlots.length === 0 ? (
              <p className="text-xs text-stone-500 font-light">
                {dayClosed
                  ? `Closed on ${activeDateObj.dayName}. No booking times that day.`
                  : 'No open times left that day.'}
              </p>
            ) : (
              <div className="space-y-3">
                {[
                  ['Morning', timeSlots.morning],
                  ['Afternoon', timeSlots.afternoon],
                  ['Evening', timeSlots.evening],
                ].map(([label, slots]) =>
                  slots.length === 0 ? null : (
                    <div key={label}>
                      <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-stone-400 block mb-1">
                        {label}
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`p-2 text-xs font-mono font-medium rounded-full border text-center transition-all ${
                              selectedTime === slot
                                ? 'border-[#E4D9F0] bg-[#F3EEF8] text-[#4A3F5C]'
                                : 'border-stone-200 bg-[#F7F6F8] hover:border-stone-300 text-[#1C1917]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!location.state?.serviceName || dayClosed || !openSlots.includes(selectedTime)}
            className="w-full rounded-full bg-[#1C1917] text-white py-3.5 text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>Continue to Address &amp; Review</span>
            <ArrowRight size={14} />
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
