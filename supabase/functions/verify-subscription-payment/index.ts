import { adminClient, corsHeaders, json, ownerIdForUser, requireUser } from '../_shared/http.ts';
import {
  hmacHex,
  keysAreUsable,
  paymentMatchesOrder,
  razorpayKeys,
  razorpayRequest,
  safeEqual,
} from '../_shared/razorpay.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' });

  const keys = razorpayKeys();
  const keyError = keysAreUsable(keys);
  if (keyError) return json(503, { ok: false, error: keyError });

  const { user, error: authError } = await requireUser(req);
  if (!user) return json(401, { ok: false, error: authError });

  const body = await req.json().catch(() => ({}));
  const orderId = String(body.razorpay_order_id || '');
  const paymentId = String(body.razorpay_payment_id || '');
  const signature = String(body.razorpay_signature || '');
  if (!orderId || !paymentId || !signature) {
    return json(400, { ok: false, error: 'Missing payment confirmation.' });
  }

  const expected = await hmacHex(keys.keySecret, `${orderId}|${paymentId}`);
  if (!safeEqual(expected, signature.toLowerCase())) {
    return json(400, { ok: false, error: 'Payment signature did not match.' });
  }

  const admin = adminClient();
  const ownerId = await ownerIdForUser(admin, user.id);
  if (!ownerId) return json(403, { ok: false, error: 'No studio on this account.' });

  const { data: pay, error: payError } = await admin
    .from('subscription_payments')
    .select('owner_id, amount_paise, status')
    .eq('razorpay_order_id', orderId)
    .maybeSingle();
  if (payError || !pay || pay.owner_id !== ownerId) {
    return json(404, { ok: false, error: 'Unknown order.' });
  }

  let payment: Record<string, unknown>;
  try {
    payment = await razorpayRequest(`/payments/${paymentId}`, keys.keyId, keys.keySecret);
  } catch {
    return json(502, { ok: false, error: 'Could not confirm the payment with Razorpay.' });
  }

  if (!paymentMatchesOrder(payment, orderId, Number(pay.amount_paise))) {
    return json(400, { ok: false, error: 'Razorpay has not captured this payment.' });
  }

  const { data, error } = await admin.rpc('apply_verified_razorpay_payment', {
    p_order_id: orderId,
    p_payment_id: paymentId,
    p_owner_id: ownerId,
  });
  if (error) return json(500, { ok: false, error: 'Could not update the subscription.' });

  const outcome = data?.outcome;
  if (outcome !== 'paid' && outcome !== 'duplicate') {
    return json(409, { ok: false, error: 'Payment was not applied.' });
  }

  return json(200, { ok: true, outcome });
});
