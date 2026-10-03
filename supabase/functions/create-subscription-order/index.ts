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
  const planId = String(body.planId || '');
  if (!planId || planId === 'trial') return json(400, { ok: false, error: 'Choose a paid plan.' });

  const admin = adminClient();
  const ownerId = await ownerIdForUser(admin, user.id);
  if (!ownerId) return json(403, { ok: false, error: 'No studio on this account.' });

  const { data: plan, error: planError } = await admin
    .from('plans')
    .select('id, name, price_inr')
    .eq('id', planId)
    .maybeSingle();
  if (planError || !plan || Number(plan.price_inr) <= 0) {
    return json(400, { ok: false, error: 'That plan is not available.' });
  }

  const amount = Number(plan.price_inr) * 100;
  await admin.rpc('expire_elapsed_subscriptions');

  let order: { id?: string };
  try {
    order = await razorpayRequest('/orders', keys.keyId, keys.keySecret, {
      amount,
      currency: 'INR',
      receipt: `ae_${ownerId.replace(/-/g, '').slice(0, 12)}_${Date.now().toString(36)}`.slice(0, 40),
      notes: { owner_id: ownerId, plan_id: plan.id },
    });
  } catch (err) {
    return json(502, { ok: false, error: err instanceof Error ? err.message : 'Could not start checkout.' });
  }

  if (!order?.id) return json(502, { ok: false, error: 'Could not start checkout.' });

  const { error: registerError } = await admin.rpc('register_razorpay_order', {
    p_owner_id: ownerId,
    p_plan_id: plan.id,
    p_amount_paise: amount,
    p_order_id: order.id,
  });
  if (registerError) return json(500, { ok: false, error: 'Could not record the order.' });

  return json(200, {
    ok: true,
    keyId: keys.keyId,
    orderId: order.id,
    amount,
    currency: 'INR',
    planId: plan.id,
    planName: plan.name,
  });
});
