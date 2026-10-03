import { adminClient, corsHeaders, json, ownerIdForUser, requireUser } from '../_shared/http.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' });

  const { user, error: authError } = await requireUser(req);
  if (!user) return json(401, { ok: false, error: authError });

  const admin = adminClient();
  const ownerId = await ownerIdForUser(admin, user.id);
  if (!ownerId) return json(403, { ok: false, error: 'No studio on this account.' });

  const { data, error } = await admin.rpc('cancel_owner_subscription', { p_owner_id: ownerId });
  if (error) return json(500, { ok: false, error: 'Could not cancel the plan.' });
  if (data?.outcome !== 'cancelled') return json(409, { ok: false, error: 'There is no active paid plan to cancel.' });

  return json(200, { ok: true });
});
