import React from 'react';
import { ShaderBackground } from '../ui/hero-shader';

export function HolographicHero({ children, className = '' }) {
  return (
    <ShaderBackground className={`relative isolate w-full min-h-screen ${className}`}>
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </ShaderBackground>
  );
}

export default HolographicHero;
