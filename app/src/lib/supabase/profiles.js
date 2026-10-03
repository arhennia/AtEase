import { resolveStoredRole } from '../authRole';
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
  const storedRole = resolveStoredRole(existing?.role);
  // #region agent log
  fetch('http://127.0.0.1:7399/ingest/41cf725c-f170-4baa-a011-9618af22c576',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'804de4'},body:JSON.stringify({sessionId:'804de4',hypothesisId:'B',location:'profiles.js:ensureProfile',message:'profile role write',data:{storedRole,requestedRole:intendedRole==='brand_owner'||intendedRole==='partner'?'brand_owner':'client',payloadIncludesRole:false,upgradesRole:false},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

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
  return data;
}
