import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AtEaseLogo } from './AtEaseLogo';

export const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:arhennia@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/arhennia', external: true },
  { label: 'Instagram', href: 'https://instagram.com/arhyatelier', external: true },
  { label: 'X', href: 'https://x.com/arhennia', external: true },
];

export function LandingFooter() {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Studio', href: '#studio' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'How it works', href: '#studio' },
        { label: 'Log in', action: () => navigate('/login') },
        { label: 'Get started', action: () => navigate('/signup') },
      ],
    },
    {
      title: 'Connect',
      links: CONTACT_LINKS,
    },
  ];

  return (
    <footer className="bg-[#0B0B14] text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
        <div className="space-y-3 max-w-xs">
          <AtEaseLogo className="text-[1.5rem] text-white" />
          <p className="font-heroSans text-sm text-white/50 leading-relaxed">
            The effortless way for beauty professionals to run bookings, clients, and schedules — on their own
            brand.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <p className="font-heroSans text-[11px] tracking-[0.16em] uppercase text-white/35">{col.title}</p>
            <div className="flex flex-col gap-2.5">
              {col.links.map((link) =>
                link.action ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={link.action}
                    className="group inline-flex items-center gap-1 font-heroSans text-left text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group inline-flex items-center gap-1 font-heroSans text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8 flex items-center justify-between text-[11px] text-white/35 font-heroSans">
          <span>© {new Date().getFullYear()} AtEase. All rights reserved.</span>
          <span className="hidden sm:inline">Privacy · Terms</span>
        </div>
        <p
          aria-hidden="true"
          className="font-heroSans select-none pointer-events-none text-center leading-none text-[24vw] sm:text-[13vw] font-bold text-white/[0.045] -mt-3 sm:-mt-6 tracking-tight"
        >
          AtEase
        </p>
      </div>
    </footer>
  );
}
