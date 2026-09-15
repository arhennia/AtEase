import { supabase, isSupabaseConfigured } from './client';

export async function uploadOwnerImage(userId, file, bucket = 'service-images') {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured', url: '' };
  }
  if (!userId || !file) {
    return { ok: false, error: 'Missing file', url: '' };
  }
  const safeName = String(file.name || 'image').replace(/[^\w.\-]+/g, '-');
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return { ok: false, error: error.message, url: '' };
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
