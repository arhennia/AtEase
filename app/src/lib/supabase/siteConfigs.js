import { supabase, isSupabaseConfigured } from './client';
import { normalizeSiteConfig } from '../siteConfig';

function rowToConfig(row) {
  if (!row) return null;
  const payload = row.payload && typeof row.payload === 'object' ? row.payload : {};
  return normalizeSiteConfig({
    slug: row.slug,
    businessName: row.business_name,
    subtitle: row.subtitle,
    services: row.services,
    contactPhone: row.contact_phone,
    whatsappMessage: row.whatsapp_message,
    galleryUrls: row.gallery_urls,
    published: row.published,
    publishedAt: row.published_at,
    bannerUrl: payload.bannerUrl || '',
    about: payload.about || {},
  });
}

function configToRow(ownerId, config) {
  return {
    owner_id: ownerId,
    slug: config.slug,
    business_name: config.businessName,
    subtitle: config.subtitle || '',
    services: config.services || [],
    contact_phone: config.contactPhone || '',
    whatsapp_message: config.whatsappMessage || '',
    gallery_urls: config.galleryUrls || [],
    published: Boolean(config.published),
    published_at: config.published ? config.publishedAt || new Date().toISOString() : null,
    payload: {
      bannerUrl: config.bannerUrl || '',
      about: config.about || {},
    },
  };
}

export async function fetchPublishedSiteBySlug(slug) {
  if (!isSupabaseConfigured || !slug) return null;
  const { data, error } = await supabase
    .from('site_configs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) {
    console.error('fetchPublishedSiteBySlug', error);
    return null;
  }
  return rowToConfig(data);
}

export async function fetchSiteConfigByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return null;
  const { data, error } = await supabase.from('site_configs').select('*').eq('owner_id', ownerId).maybeSingle();
  if (error) {
    console.error('fetchSiteConfigByOwnerId', error);
    return null;
  }
  return rowToConfig(data);
}

export async function upsertSiteConfigRecord(ownerId, config) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const payload = configToRow(ownerId, config);
  const { data, error } = await supabase
    .from('site_configs')
    .upsert(payload, { onConflict: 'owner_id' })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: rowToConfig(data) };
}
