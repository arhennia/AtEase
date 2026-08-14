import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sun, Sunrise, Moon } from 'lucide-react';

export function DateTimeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedDate, setSelectedDate] = useState(0); // index 0 is today
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate next 14 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: days[d.getDay()],
      dateNum: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      full: d
    };
  });

  const timeSlots = {
    morning: ['09:00 AM', '10:30 AM', '11:45 AM', '12:15 PM'],
    afternoon: ['01:00 PM', '02:30 PM', '04:00 PM', '05:15 PM'],
    evening: ['06:30 PM', '07:45 PM', '08:30 PM (Full)', '09:00 PM (Full)']
  };

  const activeDateObj = dates[selectedDate];

  const handleConfirm = () => {
    if (!selectedTime) return;
    const cleanTime = selectedTime.replace(' (Full)', '');
    const formattedDate = `${activeDateObj.month} ${activeDateObj.dateNum}, ${activeDateObj.full.getFullYear()}`;

    let isoTime = activeDateObj.full.toISOString();
    try {
      const parts = cleanTime.split(' ');
      const [hoursStr, minsStr] = parts[0].split(':');
      let hours = parseInt(hoursStr, 10);
      const mins = parseInt(minsStr, 10);
      if (parts[1] === 'PM' && hours < 12) hours += 12;
      if (parts[1] === 'AM' && hours === 12) hours = 0;
      const d = new Date(activeDateObj.full);
      d.setHours(hours, mins, 0, 0);
      isoTime = d.toISOString();
    } catch (e) {}

    navigate('/address', {
      state: {
        ...(location.state || {}),
        date: formattedDate,
        time: cleanTime,
        bookingTime: isoTime,
        serviceName: location.state?.serviceName || 'Hair Spa & Scalp Massage',
        amount: location.state?.amount || 1350,
        serviceId: location.state?.serviceId || 's2'
      }
    });
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full bg-surface flex flex-col relative pb-40"
    >
      {/* Header */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-between px-container-margin h-16">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
          >
            <ArrowLeft className="text-on-surface" size={20} />
          </button>
          <h1 className="text-[18px] font-semibold text-on-surface">Choose Slot</h1>
        </div>
      </header>

      {/* Date Picker */}
      <section className="mt-4 px-container-margin">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-on-surface tracking-tight uppercase">Select Date</h2>
          <span className="text-[12px] text-on-surface-variant font-medium">
            {activeDateObj.month} {activeDateObj.full.getFullYear()}
          </span>
        </div>
        
        <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2">
          {dates.map((date, i) => {
            const isSelected = selectedDate === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(i)}
                className={`flex-shrink-0 w-12 h-16 flex flex-col items-center justify-center rounded-full border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-primary text-white border-primary shadow-[0_2px_8px_-2px_rgba(29,70,38,0.5)]' 
                    : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-primary/40'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white/80' : 'text-on-surface-variant/60'}`}>
                  {date.dayName}
                </span>
                <span className="text-[16px] font-bold mt-0.5">{date.dateNum}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Time Selection */}
      <section className="mt-8 px-container-margin flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[14px] font-semibold text-on-surface tracking-tight uppercase">Select Time</h2>
          <span className="text-[11px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full border border-outline-variant">
            IST (UTC+5:30)
          </span>
        </div>
        
        <div className="space-y-8">
          {/* Morning */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Sunrise size={16} />
              <h3 className="text-[11px] font-bold uppercase tracking-widest">Morning</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.morning.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`h-10 border rounded-lg text-[13px] font-medium transition-all ${
                    selectedTime === time 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'border-outline-variant hover:border-primary/50 text-on-surface'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-orange">
              <Sun size={16} />
              <h3 className="text-[11px] font-bold uppercase tracking-widest">Afternoon</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.afternoon.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`h-10 border rounded-lg text-[13px] font-medium transition-all ${
                    selectedTime === time 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'border-outline-variant hover:border-primary/50 text-on-surface'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Evening */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-moss">
              <Moon size={16} />
              <h3 className="text-[11px] font-bold uppercase tracking-widest">Evening</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.evening.map(time => {
                const isFull = time.includes('Full');
                const timeStr = time.split(' ')[0];
                return (
                  <button
                    key={time}
                    disabled={isFull}
                    onClick={() => setSelectedTime(timeStr)}
                    className={`h-10 border rounded-lg text-[13px] font-medium transition-all ${
                      isFull 
                        ? 'bg-surface-container-low text-on-surface-variant/40 border-transparent cursor-not-allowed' 
                        : selectedTime === timeStr
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'border-outline-variant hover:border-primary/50 text-on-surface'
                    }`}
                  >
                    {timeStr}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Section */}
      <footer className="fixed bottom-0 w-full max-w-[480px] md:left-1/2 md:-translate-x-1/2 bg-white border-t border-outline-variant/50 p-container-margin z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-surface-container-low border border-outline-variant/50">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img className="w-full h-full object-cover" alt="Service" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOuOoDhsFNGn7nt3oXryul1fFxyxlxHG-CCTXfB5HdLTo7OxANF-m6cmcpGV4eWLpbzxFxeBa_rkwc9GzOmq14GkXb4wKkM-vWBIrVAwrF9FfERWSXG5U7jsqu8tES5XSco0Meb0D68svNTkdRWnxq7psQHFfWeiRY5YVRhfwTRcTZl7JLzda4UkRBl7WVRj-2emA33VwZl1zIdhWOEHhLQMnlK3k5uviSe9Afub4Ep8n-jI87GS-tVfUdmIYDv3SxLQji6xZy_Q" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-bold text-on-surface truncate">Signature Ayurvedic Spa</h4>
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
              <span>90 mins</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-semibold text-primary">₹2,400</span>
            </div>
          </div>
          <div className="text-right pr-2">
            <p className="text-[10px] text-primary uppercase font-bold tracking-tighter">
              {selectedTime ? `${activeDateObj.dayName}, ${activeDateObj.dateNum} ${activeDateObj.month} @ ${selectedTime}` : 'Select Time'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!selectedTime}
          className={`w-full h-14 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg ${
            selectedTime 
              ? 'bg-primary text-white active:scale-95 hover:bg-primary/90' 
              : 'bg-primary/50 text-white/70 cursor-not-allowed shadow-none'
          }`}
        >
          <span className="text-[16px]">Confirm & Add Address</span>
          <ArrowRight size={20} />
        </button>
      </footer>
    </motion.main>
  );
}
