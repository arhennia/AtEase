import React from 'react';

export function GlassAmbient({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[#F6F3FB]" />
      <div
        className="ambient-blob top-[-16%] left-[-10%] h-[50vw] w-[50vw] max-h-[560px] max-w-[560px] opacity-80"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.55) 0%, transparent 70%)' }}
      />
      <div
        className="ambient-blob bottom-[-18%] right-[-12%] h-[52vw] w-[52vw] max-h-[640px] max-w-[640px] opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(237,233,254,0.9) 0%, rgba(253, 224, 237, 0.45) 40%, transparent 70%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="ambient-blob top-[36%] left-[38%] h-[34vw] w-[34vw] max-h-[400px] max-w-[400px] opacity-55"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.28) 0%, transparent 70%)',
          animationDelay: '-11s',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.7),transparent_58%)]" />
    </div>
  );
}
