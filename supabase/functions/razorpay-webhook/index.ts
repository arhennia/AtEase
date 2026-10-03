import { adminClient, json } from '../_shared/http.ts';
import { hmacHex, razorpayKeys, safeEqual } from '../_shared/razorpay.ts';

type PaymentEntity = {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  error_description?: string;
  error_code?: string;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' });

  const keys = razorpayKeys();
  if (!keys.webhookSecret) return json(503, { ok: false, error: 'Webhook secret is not configured.' });
  if (!keys.allowLive && keys.keyId && !keys.keyId.startsWith('rzp_test_')) {
    return json(503, { ok: false, error: 'Test mode keys are required.' });
  }

  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const eventId = req.headers.get('x-razorpay-event-id') ?? '';
  if (!eventId || !signature) return json(400, { ok: false, error: 'Missing webhook signature.' });

  const expected = await hmacHex(keys.webhookSecret, raw);
  if (!safeEqual(expected, signature.toLowerCase())) {
    return json(400, { ok: false, error: 'Invalid webhook signature.' });
  }

  let event: { event?: string; payload?: Record<string, { entity?: PaymentEntity & { payment_id?: string } }> };
  try {
    event = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'Invalid webhook body.' });
  }

  const admin = adminClient();
  const { data: seen } = await admin
    .from('razorpay_webhook_events')
    .select('event_id')
    .eq('event_id', eventId)
    .maybeSingle();
  if (seen) return json(200, { ok: true, duplicate: true });

  const name = event.event || '';
  let outcome = 'ignored';

  if (name === 'payment.captured' || name === 'order.paid') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.id || !payment.order_id) {
      outcome = 'ignored';
    } else {
      const { data: row } = await admin
        .from('subscription_payments')
        .select('amount_paise')
        .eq('razorpay_order_id', payment.order_id)
        .maybeSingle();
      if (!row) return json(500, { ok: false, error: 'Order not recorded yet.' });
      const matches = payment.status === 'captured'
        && payment.currency === 'INR'
        && Number(payment.amount) === Number(row.amount_paise);
      if (!matches) {
        outcome = 'mismatch';
      } else {
        const { data, error } = await admin.rpc('apply_verified_razorpay_payment', {
          p_order_id: payment.order_id,
          p_payment_id: payment.id,
          p_owner_id: null,
        });
        if (error) return json(500, { ok: false, error: 'Could not apply the payment.' });
        outcome = data?.outcome || 'paid';
        if (outcome === 'unknown') return json(500, { ok: false, error: 'Order not recorded yet.' });
      }
    }
  } else if (name === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return json(200, { ok: true, ignored: true });
    const { data, error } = await admin.rpc('mark_razorpay_payment_failed', {
      p_order_id: payment.order_id,
      p_payment_id: payment.id || '',
      p_reason: payment.error_description || payment.error_code || 'payment failed',
    });
    if (error) return json(500, { ok: false, error: 'Could not record the failure.' });
    outcome = data?.outcome || 'failed';
    if (outcome === 'unknown') return json(200, { ok: true, ignored: true });
  } else if (name === 'refund.processed') {
    const refund = event.payload?.refund?.entity;
    const paymentId = refund?.payment_id || '';
    if (!paymentId) return json(200, { ok: true, ignored: true });
    const refundAmount = refund && 'amount' in refund ? Number(refund.amount) : null;
    const { data, error } = await admin.rpc('mark_razorpay_payment_refunded', {
      p_payment_id: paymentId,
      p_refund_paise: Number.isFinite(refundAmount) ? refundAmount : null,
    });
    if (error) return json(500, { ok: false, error: 'Could not record the refund.' });
    outcome = data?.outcome || 'refunded';
    if (outcome === 'unknown') return json(200, { ok: true, ignored: true });
  }

  await admin.rpc('expire_elapsed_subscriptions');

  const { error: logError } = await admin.from('razorpay_webhook_events').insert({
    event_id: eventId,
    event_type: name || 'unknown',
    outcome,
  });
  if (logError && logError.code !== '23505') {
    return json(500, { ok: false, error: 'Could not record the webhook.' });
  }

  return json(200, { ok: true, outcome, duplicate: logError?.code === '23505' });
});
