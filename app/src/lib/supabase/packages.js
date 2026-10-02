import { supabase, isSupabaseConfigured } from './client';

export async function fetchPackagesByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return [];
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('owner_id', ownerId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) {
    console.error('fetchPackagesByOwnerId', error);
    return [];
  }
  return data || [];
}

export async function createPackageRecord(payload) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const { data, error } = await supabase.from('packages').insert([payload]).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function updatePackageRecord(id, patch) {
  if (!isSupabaseConfigured || !id) return { ok: false, error: 'Missing package' };
  const { data, error } = await supabase.from('packages').update(patch).eq('id', id).select().maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Package was not saved.' };
  return { ok: true, data };
}

export async function deletePackageRecord(id) {
  if (!isSupabaseConfigured || !id) return { ok: false, error: 'Missing package' };
  const { error } = await supabase.from('packages').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
