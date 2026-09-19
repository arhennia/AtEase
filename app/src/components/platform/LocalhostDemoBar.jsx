import React from 'react';
import { Link } from 'react-router-dom';

export function LocalhostDemoBar() {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') return null;

  return (
    <div className="bg-[#1C1917] text-white text-[12px] sm:text-[13px] font-heroSans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="text-white/55">Local demo</span>
        <Link to="/demo" className="underline underline-offset-2 hover:text-[#EDE9FE]">
          Open dashboard
        </Link>
        <Link to="/s/rajkumari-beauty" className="underline underline-offset-2 hover:text-[#EDE9FE]">
          Open published website
        </Link>
      </div>
    </div>
  );
}
