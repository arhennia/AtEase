import { supabase, isSupabaseConfigured } from './client';

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.error('fetchProfile', error);
    return null;
  }
  return data;
}

export async function ensureProfile(user, intendedRole = 'client') {
  if (!isSupabaseConfigured || !user?.id) return null;

  const existing = await fetchProfile(user.id);
  const nextRole =
    existing?.role === 'brand_owner'
      ? 'brand_owner'
      : intendedRole === 'partner' || intendedRole === 'brand_owner'
        ? 'brand_owner'
        : existing?.role || 'client';

  const payload = {
    id: user.id,
    role: nextRole,
    full_name:
      existing?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.owner_name ||
      user.email?.split('@')[0] ||
      null,
    email: user.email || existing?.email || null,
    phone: user.phone || user.user_metadata?.phone || existing?.phone || null,
    avatar_url: user.user_metadata?.avatar_url || existing?.avatar_url || null,
  };

  const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select().single();
  if (error) {
    console.error('ensureProfile', error);
    return existing || payload;
  }
  return data;
}
