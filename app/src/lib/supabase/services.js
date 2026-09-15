import { supabase, isSupabaseConfigured } from './client';

export async function fetchServicesByOwnerId(ownerId, { activeOnly = true } = {}) {
  if (!isSupabaseConfigured || !ownerId) return [];
  let query = supabase.from('services').select('*').eq('owner_id', ownerId).order('sort_order', { ascending: true });
  if (activeOnly) query = query.eq('is_active', true);
  const { data, error } = await query;
  if (error) {
    console.error('fetchServicesByOwnerId', error);
    return [];
  }
  return data || [];
}

export async function createServicesRecords(servicesList) {
  if (!isSupabaseConfigured || !servicesList?.length) return { ok: true, data: [] };
  const { data, error } = await supabase.from('services').insert(servicesList).select();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function updateServiceRecord(id, patch) {
  if (!isSupabaseConfigured || !id) return { ok: false, error: 'Missing service' };
  const { data, error } = await supabase.from('services').update(patch).eq('id', id).select().maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function deleteServiceRecord(id) {
  if (!isSupabaseConfigured || !id) return { ok: false, error: 'Missing service' };
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
