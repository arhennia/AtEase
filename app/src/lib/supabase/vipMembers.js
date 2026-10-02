import { supabase, isSupabaseConfigured } from './client';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fetchVipMembersByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return [];
  const { data, error } = await supabase
    .from('vip_members')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchVipMembersByOwnerId', error);
    return [];
  }
  return data || [];
}

export async function upsertVipMemberRecord(ownerId, member) {
  if (!isSupabaseConfigured || !ownerId) return { ok: false, error: 'Supabase not configured' };
  const payload = {
    owner_id: ownerId,
    package_id: UUID_RE.test(String(member.packageId || '')) ? member.packageId : null,
    client_name: member.clientName,
    client_phone: member.clientPhone,
    package_name: member.packageName,
    day_of_month: member.dayOfMonth,
  };
  const { data, error } = await supabase
    .from('vip_members')
    .upsert(payload, { onConflict: 'owner_id,client_phone' })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function deleteVipMemberRecord(id) {
  if (!isSupabaseConfigured || !id) return { ok: false, error: 'Missing membership' };
  const { error } = await supabase.from('vip_members').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function subscribeVipAsGuest({ ownerId, packageId, clientName, clientPhone, dayOfMonth }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const { error } = await supabase.rpc('subscribe_vip', {
    p_owner_id: ownerId,
    p_package_id: packageId,
    p_client_name: clientName,
    p_client_phone: clientPhone,
    p_day_of_month: dayOfMonth,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
