import React from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SLOTS = [
  { day: 0, time: '10:00', name: 'Maya · Facial', tone: 'purple', offset: 'mt-2' },
  { day: 1, time: '10:00', name: 'Aria · Hair', tone: 'lilac', offset: 'mt-8' },
  { day: 1, time: '14:30', name: 'Priya · Glow', tone: 'purple', offset: 'mt-6' },
  { day: 2, time: '09:30', name: 'Buffer', tone: 'ghost', offset: 'mt-4' },
  { day: 2, time: '13:00', name: 'Rhea · Bridal', tone: 'lilac', offset: 'mt-10' },
  { day: 3, time: '11:00', name: 'Nisha · Nails', tone: 'purple', offset: 'mt-6' },
  { day: 4, time: '12:00', name: 'Walk-in', tone: 'ghost', offset: 'mt-12' },
  { day: 5, time: '15:00', name: 'Anika · Lash', tone: 'purple', offset: 'mt-8' },
];

function SlotChip({ name, tone }) {
  const styles = {
    purple: 'bg-[#7C3AED] text-white',
    lilac: 'bg-[#EDE4FF] text-[#5B21B6]',
    ghost: 'bg-white/70 text-stone-500 border border-white/80',
  };
  return (
    <div className={`rounded-md px-2 py-1.5 text-[10px] font-heroSans leading-tight ${styles[tone]}`}>
      {name}
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-8 sm:-inset-12 rounded-[40px] bg-gradient-to-br from-[#EDE4FF] via-[#F5F0FF] to-white blur-2xl opacity-80 pointer-events-none"
      />
      <figure className="relative rounded-[22px] overflow-hidden border border-white/70 bg-white shadow-[0_40px_80px_-24px_rgba(88,28,135,0.28)]">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-stone-100">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
          </span>
          <div className="flex-1 mx-4">
            <div className="mx-auto max-w-sm rounded-full bg-white border border-stone-100 px-3 py-1 text-center font-heroSans text-[11px] text-stone-400 tracking-wide">
              app.atease.studio / dashboard
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[148px_1fr] min-h-[340px] sm:min-h-[420px]">
          <aside className="bg-[#F8F6FC] border-r border-stone-100 p-3 sm:p-4 flex flex-col gap-3">
            <p className="font-heroSans text-[11px] sm:text-[13px] font-semibold text-[#111111]">AtEase</p>
            <nav className="flex flex-col gap-1">
              {['Today', 'Calendar', 'Clients', 'Page'].map((item, i) => (
                <span
                  key={item}
                  className={`rounded-lg px-2 py-1.5 font-heroSans text-[10px] sm:text-[12px] ${
                    i === 1 ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-stone-400'
                  }`}
                >
                  {item}
                </span>
              ))}
            </nav>
            <div className="mt-auto hidden sm:block rounded-xl bg-white p-3 border border-stone-100">
              <p className="font-heroSans text-[10px] uppercase tracking-[0.14em] text-stone-400 mb-1">This week</p>
              <p className="font-heroSans text-lg font-semibold text-[#111111]">18</p>
              <p className="font-heroSans text-[11px] text-stone-400">bookings</p>
            </div>
          </aside>

          <div className="p-3 sm:p-5 bg-gradient-to-b from-white to-[#FBF9FF]">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="font-heroSans text-[11px] uppercase tracking-[0.16em] text-[#7C3AED] mb-1">Schedule</p>
                <p className="font-heroSans text-sm sm:text-base font-semibold text-[#111111]">This week</p>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-[#F3E8FF] text-[#7C3AED] px-3 py-1 font-heroSans text-[11px]">
                3 openings
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center font-heroSans text-[9px] sm:text-[11px] text-stone-400 pb-1">
                  {day}
                </div>
              ))}
              {DAYS.map((day, dayIndex) => (
                <div key={`${day}-col`} className="flex flex-col gap-1.5 min-h-[180px] sm:min-h-[240px]">
                  {SLOTS.filter((s) => s.day === dayIndex).map((s) => (
                    <div key={`${s.day}-${s.time}`} className={s.offset}>
                      <SlotChip name={s.name} tone={s.tone} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
