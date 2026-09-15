import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { getPlanStatus } from '../../lib/tenancy';
import { ShieldAlert } from 'lucide-react';

export function RequireActivePlan({ children }) {
  const partners = useAppStore((s) => s.partners);
  const currentPartnerId = useAppStore((s) => s.currentPartnerId);
  const activateSubscription = useAppStore((s) => s.activateSubscription);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const plan = getPlanStatus(partner);
  const navigate = useNavigate();

  if (plan.active) return children;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-stone-200 p-8 space-y-5 bg-white">
        <div className="flex items-center gap-2 text-[#111111]">
          <ShieldAlert size={20} />
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold">Trial ended</span>
        </div>
        <h1 className="font-serif text-2xl tracking-tight">Add payment to keep your brand site live</h1>
        <p className="text-sm text-stone-600 font-light leading-relaxed">
          Your 14-day trial has expired. Dashboard tools and your client-facing website stay paused until a subscription is active.
        </p>
        <button
          type="button"
          onClick={() => activateSubscription(currentPartnerId)}
          className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black"
        >
          Activate subscription (demo)
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full text-[11px] tracking-[0.15em] uppercase text-stone-500 hover:text-black"
        >
          Back to AtEase
        </button>
      </div>
    </div>
  );
}
