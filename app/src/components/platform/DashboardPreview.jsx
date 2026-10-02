import React from 'react';

export function DashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-8 sm:-inset-12 rounded-[40px] bg-gradient-to-br from-[#EDE4FF] via-[#F5F0FF] to-white blur-2xl opacity-80 pointer-events-none"
      />
      <figure className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_40px_80px_-24px_rgba(88,28,135,0.28)]">
        <img
          src="/dashboard-preview.png"
          alt="The AtEase dashboard, with today's bookings, visit value, and the month at a glance"
          className="block h-auto w-full"
        />
      </figure>
    </div>
  );
}
