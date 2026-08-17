import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sun, Sunrise, Moon, Calendar, Clock, ShieldCheck } from 'lucide-react';

export function DateTimeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  
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

    navigate('/address', {
      state: {
        ...(location.state || {}),
        date: activeDateObj.formatted,
        time: selectedTime,
        serviceName: location.state?.serviceName || 'Keratin Smoothing & Hair Spa',
        amount: location.state?.amount || 2500,
        providerName: location.state?.providerName || 'Rajkumari Beauty & Aesthetics'
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased flex flex-col justify-between">
      {/* Top Header */}
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

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm bg-[#FFFFFF]">
          
          <div className="border-b border-stone-200 pb-4 space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
              Schedule Step
            </span>
            <h1 className="font-serif text-2xl tracking-wide uppercase font-normal text-[#111111]">
              Select Date &amp; Time
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
                      className={`p-2 text-xs font-mono font-medium border text-center transition-all ${
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
                <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-stone-400 block mb-1">
                  Afternoon
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.afternoon.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 text-xs font-mono font-medium border text-center transition-all ${
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
                <span className="text-[9px] tracking-[0.15em] uppercase font-semibold text-stone-400 block mb-1">
                  Evening
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.evening.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 text-xs font-mono font-medium border text-center transition-all ${
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
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Address &amp; Review</span>
            <ArrowRight size={14} />
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
