import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { accessFromSubscription, getPlanStatus } from '../../lib/tenancy';
import { fetchSubscriptionByOwnerId, isSupabaseConfigured } from '../../lib/supabase';
import { PlanCheckout } from '../provider/PlanCheckout';
import { SoftCard, mutedClass, titleClass } from '../platform/ui';

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

export function RequireActivePlan({ children }) {
  const partners = useAppStore((s) => s.partners);
  const currentPartnerId = useAppStore((s) => s.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const navigate = useNavigate();
  const [gate, setGate] = useState({ loading: true, plan: null, unverified: false });

  useEffect(() => {
    let active = true;

    async function load() {
      if (isSupabaseConfigured) {
        if (!isUuid(currentPartnerId)) {
          if (active) setGate({ loading: false, plan: { status: 'none', active: false, daysLeft: 0 }, unverified: true });
          return;
        }
        const result = await fetchSubscriptionByOwnerId(currentPartnerId);
        if (!active) return;
        if (!result.ok || !result.data) {
          setGate({ loading: false, plan: { status: 'none', active: false, daysLeft: 0 }, unverified: true });
          return;
        }
        setGate({ loading: false, plan: accessFromSubscription(result.data), unverified: false });
        return;
      }

      const localStatus = partner?.subscriptionStatus === 'active' ? 'trial' : partner?.subscriptionStatus;
      if (active) {
        setGate({
          loading: false,
          unverified: false,
          plan: getPlanStatus({ ...partner, subscription: null, subscriptionStatus: localStatus }),
        });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [currentPartnerId, partner]);

  if (gate.loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <p className="font-heroSans text-sm text-stone-400">Checking your plan…</p>
      </div>
    );
  }

  if (gate.plan?.active) return children;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <SoftCard className="max-w-md w-full p-8 space-y-5">
        <div className="flex items-center gap-2 text-[#6D5A8D]">
          <ShieldAlert size={20} />
          <span className="text-[11px] tracking-[0.16em] uppercase">
            {gate.unverified ? 'Plan unavailable' : 'Trial ended'}
          </span>
        </div>
        <h1 className={`${titleClass} text-2xl`}>
          {gate.unverified ? 'Your plan could not be verified' : 'Add payment to keep your brand site live'}
        </h1>
        <p className={mutedClass}>
          {gate.unverified
            ? 'The dashboard stays locked until the subscription record can be read. Refresh after the subscription setup is applied.'
            : 'Your trial has expired. Dashboard tools and your client-facing website stay paused until a subscription is active.'}
        </p>
        {gate.unverified ? null : <PlanCheckout />}
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
