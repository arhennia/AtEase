import React from 'react';
import { UnicornBackground } from '../UnicornBackground';

export function HolographicHero({ children, className = '' }) {
  return (
    <section className={`relative isolate w-full min-h-screen overflow-hidden bg-[#F3F4F6] ${className}`}>
      <UnicornBackground />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default HolographicHero;
