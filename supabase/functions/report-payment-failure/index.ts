import { adminClient, corsHeaders, json, ownerIdForUser, requireUser } from '../_shared/http.ts';
import { keysAreUsable, razorpayKeys, razorpayRequest } from '../_shared/razorpay.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' });

  const keys = razorpayKeys();
  const keyError = keysAreUsable(keys);
  if (keyError) return json(503, { ok: false, error: keyError });

  const { user, error: authError } = await requireUser(req);
  if (!user) return json(401, { ok: false, error: authError });

  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  const paymentId = String(body.paymentId || '');
  if (!orderId || !paymentId) return json(400, { ok: false, error: 'Missing payment.' });

  const admin = adminClient();
  const ownerId = await ownerIdForUser(admin, user.id);
  if (!ownerId) return json(403, { ok: false, error: 'No studio on this account.' });

  const { data: pay } = await admin
    .from('subscription_payments')
    .select('owner_id')
    .eq('razorpay_order_id', orderId)
    .maybeSingle();
  if (!pay || pay.owner_id !== ownerId) return json(404, { ok: false, error: 'Unknown order.' });

  let payment: Record<string, unknown>;
  try {
    payment = await razorpayRequest(`/payments/${paymentId}`, keys.keyId, keys.keySecret);
  } catch {
    return json(502, { ok: false, error: 'Could not confirm the payment with Razorpay.' });
  }

  if (payment.order_id !== orderId || payment.status !== 'failed') {
    return json(400, { ok: false, error: 'Razorpay does not report this payment as failed.' });
  }

  const reason = String(payment.error_description || payment.error_code || 'payment failed');
  const { error } = await admin.rpc('mark_razorpay_payment_failed', {
    p_order_id: orderId,
    p_payment_id: paymentId,
    p_reason: reason,
  });
  if (error) return json(500, { ok: false, error: 'Could not record the failed payment.' });

  return json(200, { ok: true });
});
