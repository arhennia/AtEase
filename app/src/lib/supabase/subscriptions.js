import { supabase, isSupabaseConfigured } from './client';

export function mapSubscriptionFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    planId: row.plan_id,
    status: row.status,
    startedAt: row.started_at,
    currentPeriodEnd: row.current_period_end,
    cancelledAt: row.cancelled_at,
    provider: row.provider || null,
    providerCustomerId: row.provider_customer_id || null,
    providerSubscriptionId: row.provider_subscription_id || null,
    providerPaymentId: row.provider_payment_id || null,
  };
}

export async function fetchSubscriptionByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) {
    return { ok: false, data: null, error: 'Supabase is not configured.' };
  }
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (error) return { ok: false, data: null, error: error.message };
  return { ok: true, data: mapSubscriptionFromDb(data), error: '' };
}

export async function fetchPublicPlans() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('plans').select('*').order('sort_order');
  if (error || !data?.length) return [];
  return data;
}
