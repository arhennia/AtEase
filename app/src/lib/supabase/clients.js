import { supabase, isSupabaseConfigured } from './client';

export async function fetchClientsByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) {
    return { ok: false, error: 'Supabase is not configured.', data: [] };
  }
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('owner_id', ownerId)
    .order('last_visited', { ascending: false });
  if (error) return { ok: false, error: error.message, data: [] };
  return { ok: true, data: data || [] };
}

export async function fetchAnalyticsByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) {
    return { ok: false, error: 'Supabase is not configured.', data: [] };
  }
  const { data, error } = await supabase
    .from('business_analytics')
    .select('*')
    .eq('owner_id', ownerId)
    .order('period_start', { ascending: true });
  if (error) return { ok: false, error: error.message, data: [] };
  return { ok: true, data: data || [] };
}
