import { adminClient, webhookJson } from '../_shared/http.ts';
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
  if (req.method === 'OPTIONS') return new Response('ok', { headers: webhookJson(200, {}, req).headers });
  if (req.method !== 'POST') return webhookJson(405, { ok: false, error: 'Method not allowed.' }, req);

  const keys = razorpayKeys();
  if (!keys.webhookSecret) return webhookJson(503, { ok: false, error: 'Webhook secret is not configured.' }, req);
  if (!keys.allowLive && keys.keyId && !keys.keyId.startsWith('rzp_test_')) {
    return webhookJson(503, { ok: false, error: 'Test mode keys are required.' }, req);
  }

  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const eventId = req.headers.get('x-razorpay-event-id') ?? '';
  if (!eventId || !signature) return webhookJson(400, { ok: false, error: 'Missing webhook signature.' }, req);

  const expected = await hmacHex(keys.webhookSecret, raw);
  if (!safeEqual(expected, signature.toLowerCase())) {
    return webhookJson(400, { ok: false, error: 'Invalid webhook signature.' }, req);
  }

  let event: { event?: string; payload?: Record<string, { entity?: PaymentEntity & { payment_id?: string } }> };
  try {
    event = JSON.parse(raw);
  } catch {
    return webhookJson(400, { ok: false, error: 'Invalid webhook body.' }, req);
  }

  const admin = adminClient();
  const { data: seen } = await admin
    .from('razorpay_webhook_events')
    .select('event_id')
    .eq('event_id', eventId)
    .maybeSingle();
  if (seen) return webhookJson(200, { ok: true, duplicate: true }, req);

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
      if (!row) return webhookJson(500, { ok: false, error: 'Order not recorded yet.' }, req);
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
        if (error) return webhookJson(500, { ok: false, error: 'Could not apply the payment.' }, req);
        outcome = data?.outcome || 'paid';
        if (outcome === 'unknown') return webhookJson(500, { ok: false, error: 'Order not recorded yet.' }, req);
      }
    }
  } else if (name === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return webhookJson(200, { ok: true, ignored: true }, req);
    const { data, error } = await admin.rpc('mark_razorpay_payment_failed', {
      p_order_id: payment.order_id,
      p_payment_id: payment.id || '',
      p_reason: payment.error_description || payment.error_code || 'payment failed',
    });
    if (error) return webhookJson(500, { ok: false, error: 'Could not record the failure.' }, req);
    outcome = data?.outcome || 'failed';
    if (outcome === 'unknown') return webhookJson(200, { ok: true, ignored: true }, req);
  } else if (name === 'refund.processed') {
    const refund = event.payload?.refund?.entity;
    const paymentId = refund?.payment_id || '';
    if (!paymentId) return webhookJson(200, { ok: true, ignored: true }, req);
    const refundAmount = refund && 'amount' in refund ? Number(refund.amount) : null;
    const { data, error } = await admin.rpc('mark_razorpay_payment_refunded', {
      p_payment_id: paymentId,
      p_refund_paise: Number.isFinite(refundAmount) ? refundAmount : null,
    });
    if (error) return webhookJson(500, { ok: false, error: 'Could not record the refund.' }, req);
    outcome = data?.outcome || 'refunded';
    if (outcome === 'unknown') return webhookJson(200, { ok: true, ignored: true }, req);
  }

  await admin.rpc('expire_elapsed_subscriptions');

  const { error: logError } = await admin.from('razorpay_webhook_events').insert({
    event_id: eventId,
    event_type: name || 'unknown',
    outcome,
  });
  if (logError && logError.code !== '23505') {
    return webhookJson(500, { ok: false, error: 'Could not record the webhook.' }, req);
  }

  return webhookJson(200, { ok: true, outcome, duplicate: logError?.code === '23505' }, req);
});
