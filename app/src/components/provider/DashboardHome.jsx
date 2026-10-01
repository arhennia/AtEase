import React from 'react';
import { formatInr } from '../../lib/salonMenu';

function initials(name) {
  return String(name || 'G')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Sparkline({ values }) {
  const width = 140;
  const height = 46;
  const series = values.length > 1 ? values : [0, values[0] || 0];
  const max = Math.max(...series, 1);
  const points = series.map((value, index) => {
    const x = (index / (series.length - 1)) * width;
    const y = height - 6 - (value / max) * (height - 14);
    return [x, y];
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-12 w-full" aria-hidden="true">
      <polygon points={area} fill="rgba(139,92,246,0.16)" />
      <polyline points={line} fill="none" stroke="#7C6A9A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points.at(-1)[0]} cy={points.at(-1)[1]} r="3" fill="#6D5A8D" />
    </svg>
  );
}

function MonthCalendar({ marked }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const lead = (first + 6) % 7;
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const label = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div>
      <p className="font-heroSans text-sm font-semibold text-[#1C1917]">{label}</p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <span key={day} className="font-heroSans text-[10px] text-stone-400">
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          const isToday = day === now.getDate();
          const hasBooking = day && marked.has(day);
          return (
            <span
              key={`${day}-${index}`}
              className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full font-heroSans text-[11px] ${
                isToday ? 'bg-[#6D5A8D] text-white' : 'text-stone-600'
              }`}
            >
              {day || ''}
              {hasBooking && !isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#B8A9D4]" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardHome({ partner, plan, appointments, clientCount, vipCount, serviceCount, onOpenBookings }) {
  const visitValue = appointments.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const amounts = appointments.map((row) => Number(row.amount) || 0);
  const bars = appointments.map((row) => ({
    name: String(row.serviceName || 'Visit').split(',')[0].trim(),
    amount: Number(row.amount) || 0,
    client: row.clientName,
  }));
  const maxBar = Math.max(...bars.map((bar) => bar.amount), 1);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const marked = new Set([new Date().getDate()]);
  if (appointments.some((row) => String(row.date).toLowerCase().includes('tomorrow'))) {
    marked.add(tomorrow.getDate());
  }

  const stats = [
    { label: 'Clients', value: clientCount, series: [0, clientCount || 0] },
    { label: 'Bookings', value: appointments.length, series: [0, appointments.length] },
    { label: 'Visit value', value: formatInr(visitValue), series: amounts.length ? amounts : [0, 0] },
    { label: 'VIP members', value: vipCount, series: [0, vipCount || 0] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heroSans text-[11px] uppercase tracking-[0.16em] text-stone-400">
            {plan.status === 'active' ? 'Paid plan' : `Trial · ${plan.daysLeft}d left`}
          </p>
          <h1 className="mt-1 font-heroSans text-2xl font-semibold tracking-tight text-[#1C1917] sm:text-3xl">
            {partner.brandName}
          </h1>
        </div>
        <p className="font-heroSans text-sm text-stone-500">
          {[partner.professionalTitle, partner.location].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-[#EDE9FE] bg-white/80 p-4 shadow-[0_12px_30px_-24px_rgba(88,28,135,0.45)]">
            <p className="font-heroSans text-[12px] text-stone-500">{stat.label}</p>
            <p className="mt-1 font-heroSans text-2xl font-semibold tracking-tight text-[#1C1917]">{stat.value}</p>
            <Sparkline values={stat.series} />
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#EDE9FE] bg-white/80 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heroSans text-base font-semibold text-[#1C1917]">Upcoming appointments</h2>
            <button type="button" onClick={onOpenBookings} className="font-heroSans text-[12px] text-[#6D5A8D]">
              View all
            </button>
          </div>
          {appointments.length === 0 ? (
            <p className="font-heroSans text-sm text-stone-500">No bookings yet. They will show up here.</p>
          ) : (
            <ul className="space-y-2">
              {appointments.map((row) => (
                <li key={row.id} className="flex items-center gap-3 rounded-2xl bg-[#F7F4FB] px-3 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] font-heroSans text-[12px] font-semibold text-[#5C4E78]">
                    {initials(row.clientName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heroSans text-sm font-medium text-[#1C1917]">{row.clientName}</span>
                    <span className="block truncate font-heroSans text-[12px] text-stone-500">
                      {String(row.serviceName || 'Visit').split(',')[0]} · {row.time}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-heroSans text-[11px] uppercase tracking-wide text-[#6D5A8D]">{row.date}</span>
                    <span className="block font-heroSans text-sm font-semibold text-[#1C1917]">{formatInr(row.amount)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-4">
          <section className="rounded-2xl border border-[#EDE9FE] bg-white/80 p-4 sm:p-5">
            <h2 className="font-heroSans text-base font-semibold text-[#1C1917]">Visit value</h2>
            <p className="mt-1 font-heroSans text-[12px] text-stone-500">{serviceCount} menu items on the booking page</p>
            <div className="mt-4 space-y-3">
              {bars.length === 0 ? (
                <p className="font-heroSans text-sm text-stone-500">Nothing recorded yet.</p>
              ) : (
                bars.map((bar) => (
                  <div key={`${bar.client}-${bar.name}`}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="truncate font-heroSans text-[12px] text-stone-600">{bar.name}</span>
                      <span className="font-heroSans text-[12px] font-medium text-[#1C1917]">{formatInr(bar.amount)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F3EEF8]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C4B5FD] to-[#6D5A8D]"
                        style={{ width: `${Math.max(8, (bar.amount / maxBar) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#EDE9FE] bg-white/80 p-4 sm:p-5">
            <MonthCalendar marked={marked} />
          </section>
        </div>
      </div>
    </div>
  );
}
