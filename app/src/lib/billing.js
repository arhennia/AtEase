import { supabase, isSupabaseConfigured } from './supabase/client';
import { accessFromSubscription } from './tenancy';
import { useAppStore } from '../store/useAppStore';

function loadCheckoutScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Checkout is only available in the browser.'));
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

async function invoke(name, body) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured.' };
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (!error) {
    if (data?.ok === false) return { ok: false, error: data.error || 'Request failed.' };
    return { ok: true, ...(data || {}) };
  }
  let message = error.message || 'Request failed.';
  try {
    const payload = await error.context?.json?.();
    if (payload?.error) message = payload.error;
  } catch {
    /* The function did not return JSON. */
  }
  return { ok: false, error: message };
}

async function confirmedByServer() {
  const partner = await useAppStore.getState().refreshOwner();
  return accessFromSubscription(partner?.subscription).active;
}

export async function checkoutPlan(planId) {
  const created = await invoke('create-subscription-order', { planId });
  if (!created.ok) return created;

  try {
    await loadCheckoutScript();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not load checkout.' };
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const checkout = new window.Razorpay({
      key: created.keyId,
      order_id: created.orderId,
      amount: created.amount,
      currency: created.currency,
      name: 'AtEase',
      description: created.planName,
      theme: { color: '#6D5A8D' },
      handler: async (response) => {
        const verified = await invoke('verify-subscription-payment', response);
        if (!verified.ok) {
          finish(verified);
          return;
        }
        const active = await confirmedByServer();
        finish(
          active
            ? { ok: true }
            : { ok: false, error: 'Payment was received. Refresh in a moment if the plan does not open.' },
        );
      },
      modal: {
        ondismiss: () => {
          if (settled) return;
          invoke('cancel-subscription-checkout', { orderId: created.orderId }).finally(() => {
            finish({ ok: false, cancelled: true, error: 'Checkout closed.' });
          });
        },
      },
    });

    checkout.on('payment.failed', (response) => {
      const payment = response?.error?.metadata || {};
      invoke('report-payment-failure', {
        orderId: payment.order_id || created.orderId,
        paymentId: payment.payment_id || '',
      }).finally(() => {
        finish({ ok: false, error: response?.error?.description || 'Payment failed.' });
      });
    });

    checkout.open();
  });
}

export async function cancelPaidPlan() {
  const result = await invoke('cancel-subscription', {});
  if (!result.ok) return result;
  await useAppStore.getState().refreshOwner();
  return { ok: true };
}
