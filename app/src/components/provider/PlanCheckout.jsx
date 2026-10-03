import React, { useState } from 'react';
import { paidPlans } from '../../lib/plans';
import { cancelPaidPlan, checkoutPlan } from '../../lib/billing';

export function PlanCheckout({ active = false, onChanged }) {
  const [pending, setPending] = useState('');
  const [message, setMessage] = useState('');

  const pay = async (planId) => {
    setPending(planId);
    setMessage('');
    const result = await checkoutPlan(planId);
    setPending('');
    if (result.cancelled) {
      setMessage('Checkout closed. The plan was not changed.');
      return;
    }
    if (!result.ok) {
      setMessage(result.error || 'Payment could not be confirmed.');
      return;
    }
    setMessage('');
    onChanged?.();
  };

  const cancel = async () => {
    if (!window.confirm('Cancel the paid plan? The dashboard stays paused until a new payment is confirmed.')) return;
    setPending('cancel');
    setMessage('');
    const result = await cancelPaidPlan();
    setPending('');
    if (!result.ok) {
      setMessage(result.error || 'Could not cancel the plan.');
      return;
    }
    onChanged?.();
  };

  return (
    <div className="space-y-2">
      {paidPlans().map((plan) => (
        <button
          key={plan.id}
          type="button"
          disabled={Boolean(pending)}
          onClick={() => pay(plan.id)}
          className="w-full rounded-xl bg-[#6D5A8D] px-4 py-3 font-heroSans text-[13px] font-medium text-white hover:bg-[#5C4B78] disabled:opacity-40"
        >
          {pending === plan.id ? 'Opening checkout…' : `${plan.eyebrow} · ${plan.price} ${plan.cadence}`}
        </button>
      ))}
      {active && (
        <button
          type="button"
          disabled={Boolean(pending)}
          onClick={cancel}
          className="w-full font-heroSans text-[13px] text-stone-400 hover:text-[#1C1917] disabled:opacity-40"
        >
          {pending === 'cancel' ? 'Cancelling…' : 'Cancel paid plan'}
        </button>
      )}
      {message && <p className="font-heroSans text-xs text-stone-500">{message}</p>}
    </div>
  );
}
