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

/**
 * Upsert the profile row for the given auth user.
 *
 * Role is set once by the handle_new_user trigger (migration 012) and cannot be
 * changed from the client. If the stored role does not match the intended role,
 * callers should treat the profile as authoritative and show a recovery message.
 *
 * Returns the profile row with an extra `_roleMismatch` flag when the stored
 * role differs from the intended role.
 */
export async function ensureProfile(user, intendedRole = 'client') {
  if (!isSupabaseConfigured || !user?.id) return null;

  const existing = await fetchProfile(user.id);
  const intended = intendedRole === 'brand_owner' || intendedRole === 'partner' ? 'brand_owner' : 'client';
  const payload = {
    id: user.id,
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

  const profile = data || existing;
  const storedRole = profile?.role || 'client';
  if (storedRole !== intended) {
    console.warn(
      `ensureProfile: stored role "${storedRole}" does not match intended role "${intended}" for user ${user.id}. ` +
      'Role is locked after signup — reset it from the Supabase dashboard (SQL) if this is wrong.'
    );
    return { ...profile, _roleMismatch: true };
  }
  return profile;
}
