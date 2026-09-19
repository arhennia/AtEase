import { supabase, isSupabaseConfigured } from './client';
import { mapBrandOwnerFromDb } from './mappers';
import { fetchServicesByOwnerId } from './services';
import { fetchPrimarySalon } from './salons';
import { fetchSiteConfigByOwnerId } from './siteConfigs';

export async function fetchBrandOwnerByUserId(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase.from('brand_owners').select('*').eq('user_id', userId).maybeSingle();
  if (error) {
    console.error('fetchBrandOwnerByUserId', error);
    return null;
  }
  return data;
}

export async function fetchBrandOwnerBySlug(slug) {
  if (!isSupabaseConfigured || !slug) return null;
  const { data, error } = await supabase.from('brand_owners').select('*').eq('slug', slug).maybeSingle();
  if (error) {
    console.error('fetchBrandOwnerBySlug', error);
    return null;
  }
  return data;
}

export async function hydratePartner(brandRow) {
  if (!brandRow) return null;
  const [services, salon, siteConfig] = await Promise.all([
    fetchServicesByOwnerId(brandRow.id),
    fetchPrimarySalon(brandRow.id),
    fetchSiteConfigByOwnerId(brandRow.id),
  ]);
  return mapBrandOwnerFromDb(brandRow, services, salon, siteConfig);
}

export async function createBrandOwnerRecord(payload) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const { data, error } = await supabase.from('brand_owners').insert([payload]).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function updateBrandOwnerRecord(id, patch) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const { data, error } = await supabase.from('brand_owners').update(patch).eq('id', id).select().single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}
