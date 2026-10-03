import { adminClient, corsHeaders, json, ownerIdForUser, requireUser } from '../_shared/http.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' });

  const { user, error: authError } = await requireUser(req);
  if (!user) return json(401, { ok: false, error: authError });

  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  if (!orderId) return json(400, { ok: false, error: 'Missing order.' });

  const admin = adminClient();
  const ownerId = await ownerIdForUser(admin, user.id);
  if (!ownerId) return json(403, { ok: false, error: 'No studio on this account.' });

  const { error } = await admin.rpc('mark_razorpay_checkout_cancelled', {
    p_order_id: orderId,
    p_owner_id: ownerId,
  });
  if (error) return json(500, { ok: false, error: 'Could not close checkout.' });

  return json(200, { ok: true });
});
