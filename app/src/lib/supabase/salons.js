import { supabase, isSupabaseConfigured } from './client';

export async function fetchPrimarySalon(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return null;
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', ownerId)
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('fetchPrimarySalon', error);
    return null;
  }
  return data;
}

export async function createSalonRecord(payload) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const { data, error } = await supabase.from('salons').insert([payload]).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}
