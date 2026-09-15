import { supabase, isSupabaseConfigured } from './client';

export async function fetchClientsByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return [];
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('owner_id', ownerId)
    .order('last_visited', { ascending: false });
  if (error) {
    console.error('fetchClientsByOwnerId', error);
    return [];
  }
  return data || [];
}

export async function fetchAnalyticsByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return [];
  const { data, error } = await supabase
    .from('business_analytics')
    .select('*')
    .eq('owner_id', ownerId)
    .order('period_start', { ascending: false });
  if (error) {
    console.error('fetchAnalyticsByOwnerId', error);
    return [];
  }
  return data || [];
}
