import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Clock, Phone, MapPin, Navigation, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export function BookingsList() {
  const appointments = useAppStore((state) => state.appointments);
  const delayAppointment = useAppStore((state) => state.delayAppointment);
  const showToast = useAppStore((state) => state.showToast);

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'TOMORROW'

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === 'TODAY') return appt.date.toLowerCase().includes('today') || appt.date.toLowerCase().includes(new Date().getDate().toString());
    if (filter === 'TOMORROW') return appt.date.toLowerCase().includes('tomorrow');
    return true;
  });

  const totalRevenue = appointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111]">
              Live Client Appointments ({appointments.length})
            </h3>
            {isSupabaseConfigured && (
              <span className="text-[9px] tracking-wider uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block"></span>
                Supabase Synced
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Real-time direct bookings received from AtEase client marketplace.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          {['ALL', 'TODAY', 'TOMORROW'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] tracking-wider uppercase font-bold border transition-colors ${
                filter === f
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#F9F9F9] text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Payment Reminder Banner */}
      <div className="p-3.5 border border-stone-300 bg-[#FFFFFF] flex items-start gap-3 shadow-sm">
        <ShieldCheck size={16} className="text-[#111111] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs text-stone-700">
          <p className="font-semibold text-[#111111]">
            Direct Provider Remittance Model
          </p>
          <p className="text-[11px] text-stone-500 font-light">
            Clients pay you directly at the time of service via Cash, UPI, or Card. AtEase takes 0% commission on service fulfillment.
          </p>
        </div>
      </div>

      {/* Bookings List */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 border border-dashed border-stone-200 text-center space-y-2 bg-[#F9F9F9]">
          <p className="text-xs tracking-wider uppercase font-bold text-stone-600">
            No bookings under this filter
          </p>
          <p className="text-xs text-stone-400 font-light">
            New client reservations will automatically synchronize here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-stone-200">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="pt-4 first:pt-0 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Schedule time block */}
              <div className="space-y-1 md:w-1/4">
                <div className="font-mono text-xl font-bold text-[#111111]">
                  {appt.time}
                </div>
                <div className="text-[10px] tracking-wider uppercase font-semibold text-stone-500">
                  {appt.date}
                </div>
                <div className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-stone-100 border border-stone-300 text-stone-800">
                  Ref: {appt.id}
                </div>
              </div>

              {/* Client & Service details */}
              <div className="space-y-1 md:w-2/4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#111111] tracking-wide">
                    {appt.clientName}
                  </h4>
                  <span className="text-[9px] tracking-wider uppercase font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
                  <Phone size={12} className="text-stone-400" />
                  <span>{appt.clientPhone}</span>
                </div>

                <p className="text-xs text-stone-800 font-medium pt-0.5">
                  {appt.serviceName}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-light truncate">
                  <MapPin size={12} className="text-stone-400 shrink-0" />
                  <span className="truncate">{appt.location}</span>
                </div>

                <div className="text-xs font-mono font-bold text-[#111111] pt-1">
                  Payable Directly: ₹{Number(appt.amount).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-start md:items-end gap-2 md:w-1/4">
                <button
                  onClick={() => delayAppointment(appt.id, 15)}
                  className="bg-[#111111] text-white px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors"
                >
                  Delay 15 Mins
                </button>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(appt.location || 'Bhubaneswar')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] tracking-wider uppercase font-semibold text-stone-600 hover:text-[#111111] flex items-center gap-1 underline underline-offset-2"
                >
                  <Navigation size={11} />
                  <span>Directions &amp; Map →</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
