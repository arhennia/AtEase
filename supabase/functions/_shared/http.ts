import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://checkout.razorpay.com',
];

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * CORS headers for webhook endpoints that receive callbacks from known third-party origins.
 * Uses a specific origin instead of '*' so browsers enforce the boundary.
 */
export function webhookCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowed || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature, x-razorpay-event-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

export function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...headers },
  });
}

export function webhookJson(status: number, body: Record<string, unknown>, req: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...webhookCorsHeaders(req), 'Content-Type': 'application/json' },
  });
}

export function adminClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function requireUser(req: Request) {
  const header = req.headers.get('Authorization') ?? '';
  if (!header.toLowerCase().startsWith('bearer ')) {
    return { user: null, error: 'Sign in again.' };
  }
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const client = createClient(url, anon, {
    global: { headers: { Authorization: header } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { user: null, error: 'Sign in again.' };
  return { user: data.user, error: '' };
}

export async function ownerIdForUser(admin: SupabaseClient, userId: string) {
  const { data, error } = await admin
    .from('brand_owners')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data?.id) return null;
  return data.id as string;
}
