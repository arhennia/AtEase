export const LOCKED_SUBSCRIPTION_COLUMNS = ['subscription_status', 'trial_ends_at'];

export function withoutSubscriptionColumns(patch) {
  const next = { ...(patch || {}) };
  for (const key of LOCKED_SUBSCRIPTION_COLUMNS) delete next[key];
  return next;
}
