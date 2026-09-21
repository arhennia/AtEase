import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { getPlanStatus } from '../../lib/tenancy';
import { ShieldAlert } from 'lucide-react';
import { SoftButton, SoftCard, mutedClass, titleClass } from '../platform/ui';

export function RequireActivePlan({ children }) {
  const partners = useAppStore((s) => s.partners);
  const currentPartnerId = useAppStore((s) => s.currentPartnerId);
  const activateSubscription = useAppStore((s) => s.activateSubscription);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const plan = getPlanStatus(partner);
  const navigate = useNavigate();

  if (plan.active) return children;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <SoftCard className="max-w-md w-full p-8 space-y-5">
        <div className="flex items-center gap-2 text-[#6D5A8D]">
          <ShieldAlert size={20} />
          <span className="text-[11px] tracking-[0.16em] uppercase">Trial ended</span>
        </div>
        <h1 className={`${titleClass} text-2xl`}>Add payment to keep your brand site live</h1>
        <p className={mutedClass}>
          Your trial has expired. Dashboard tools and your client-facing website stay paused until a subscription is active.
        </p>
        <SoftButton className="w-full" onClick={() => activateSubscription(currentPartnerId)}>
          Activate subscription (demo)
        </SoftButton>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full text-[13px] text-stone-400 hover:text-[#1C1917]"
        >
          Back to AtEase
        </button>
      </SoftCard>
    </div>
  );
}
