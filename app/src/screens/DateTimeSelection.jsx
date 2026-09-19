import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sun, Sunrise, Moon, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';

export function DateTimeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { partnerSlug } = useParams();
  
  const [selectedDate, setSelectedDate] = useState(0); // index 0 is today
  const [selectedTime, setSelectedTime] = useState('11:30 AM');

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

  const timeSlots = {
    morning: ['09:00 AM', '10:30 AM', '11:45 AM', '12:15 PM'],
    afternoon: ['01:00 PM', '02:30 PM', '04:00 PM', '05:15 PM'],
    evening: ['06:30 PM', '07:45 PM', '08:30 PM']
  };

  const activeDateObj = dates[selectedDate];

  const handleConfirm = () => {
    if (!selectedTime) return;

    navigate(partnerSlug ? `/p/${partnerSlug}/address` : '/', {
      state: {
        ...(location.state || {}),
        date: activeDateObj.formatted,
        time: selectedTime,
        serviceName: location.state?.serviceName || 'Keratin Smoothing & Hair Spa',
        amount: location.state?.amount || 2500,
        providerName: location.state?.providerName || 'Studio',
        partnerSlug,
        partnerId: location.state?.partnerId
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#1C1917] font-heroSans antialiased flex flex-col justify-between">
      {/* Top Header */}
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

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="rounded-[22px] border border-stone-200/70 p-6 sm:p-8 space-y-6 bg-white">
          
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

            <div className="space-y-3">
              <div>
                <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-stone-400 block mb-1">
                  Morning
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.morning.map((slot) => (
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

              <div>
                <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-stone-400 block mb-1">
                  Afternoon
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.afternoon.map((slot) => (
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

              <div>
                <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-stone-400 block mb-1">
                  Evening
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.evening.map((slot) => (
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
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full rounded-full bg-[#1C1917] text-white py-3.5 text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
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
