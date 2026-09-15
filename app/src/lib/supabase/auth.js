import { supabase, isSupabaseConfigured } from './client';

export function toE164(raw, defaultCountry = '91') {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith(defaultCountry) && digits.length >= 12) return `+${digits}`;
  if (digits.length === 10) return `+${defaultCountry}${digits}`;
  return `+${digits}`;
}

function redirectUrl(role, nextPath = '/') {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    role: role === 'brand_owner' || role === 'partner' ? 'brand_owner' : 'client',
    next: nextPath,
  });
  return `${origin}/auth/callback?${params.toString()}`;
}

export async function signInWithGoogle({ role = 'client', nextPath = '/' } = {}) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured' };
  const intended = role === 'partner' ? 'brand_owner' : role;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl(intended, nextPath),
      queryParams: { access_type: 'offline', prompt: 'consent' },
      data: { role: intended },
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendPhoneOtp(phone, { role = 'client' } = {}) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured' };
  const e164 = toE164(phone);
  if (!e164 || e164.length < 12) {
    return { ok: false, error: 'Enter a valid 10-digit mobile number' };
  }
  const intended = role === 'partner' ? 'brand_owner' : role;
  const { error } = await supabase.auth.signInWithOtp({
    phone: e164,
    options: { data: { role: intended, phone: e164 } },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, phone: e164 };
}

export async function verifyPhoneOtp(phone, token) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured' };
  const e164 = toE164(phone);
  const { data, error } = await supabase.auth.verifyOtp({
    phone: e164,
    token: String(token || '').trim(),
    type: 'sms',
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, session: data.session, user: data.user };
}

export async function signUpWithEmail({ email, password, ownerName, role = 'brand_owner' }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured' };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { owner_name: ownerName, full_name: ownerName, role },
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user, session: data.session };
}

export async function signInWithEmail({ email, password }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user, session: data.session };
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getAuthUser() {
  if (!isSupabaseConfigured) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user) return sessionData.session.user;
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

export { redirectUrl };
