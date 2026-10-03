export const TRIAL_DAYS = 14;

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function addDaysIso(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function daysUntil(value) {
  const ends = new Date(value);
  if (Number.isNaN(ends.getTime())) return 0;
  return Math.ceil((ends.getTime() - Date.now()) / 86400000);
}

function planResult(status, active, daysLeft, planId) {
  return { status, active, daysLeft, planId: planId || null };
}

/** A paid row counts only with a provider and a renewal date still ahead. */
export function accessFromSubscription(subscription) {
  if (!subscription) return planResult('none', false, 0, null);
  const status = subscription.status;
  const planId = subscription.planId || subscription.plan_id || null;
  const endsAt = subscription.currentPeriodEnd || subscription.current_period_end;
  const provider = subscription.provider;

  if (status === 'active') {
    const daysLeft = daysUntil(endsAt);
    if (!provider || daysLeft <= 0) return planResult('expired', false, 0, planId);
    return planResult('active', true, daysLeft, planId);
  }

  if (status === 'trial') {
    const daysLeft = daysUntil(endsAt);
    if (daysLeft > 0) return planResult('trial', true, daysLeft, planId || 'trial');
    return planResult('expired', false, 0, planId || 'trial');
  }

  return planResult(status || 'expired', false, 0, planId);
}

export function getPlanStatus(partner) {
  if (!partner) return planResult('none', false, 0, null);
  if (partner.subscription) return accessFromSubscription(partner.subscription);

  const status = partner.subscriptionStatus;
  if (status === 'active') {
    const daysLeft = daysUntil(partner.trialEndsAt);
    if (daysLeft <= 0) return planResult('expired', false, 0, null);
    return planResult('active', true, daysLeft, null);
  }
  if (status && status !== 'trial') return planResult(status, false, 0, null);

  const daysLeft = daysUntil(partner.trialEndsAt);
  if (daysLeft > 0) return planResult('trial', true, daysLeft, 'trial');
  return planResult('expired', false, 0, 'trial');
}

export function tenantPath(slug, rest = '') {
  const suffix = rest.startsWith('/') ? rest : rest ? `/${rest}` : '';
  return `/p/${slug}${suffix}`;
}

export function publicSitePath(slug) {
  return `/s/${slug}`;
}

export function tenantSiteUrl(slug) {
  if (typeof window === 'undefined') return `/p/${slug}`;
  return `${window.location.origin}/p/${slug}`;
}

export function publicSiteUrl(slug) {
  if (typeof window === 'undefined') return `/s/${slug}`;
  return `${window.location.origin}/s/${slug}`;
}

export function getTenantBySlug(partners, slug) {
  if (!slug) return null;
  return partners.find((p) => p.slug === slug || p.id === slug) || null;
}

export function getTenantById(partners, id) {
  if (!id) return null;
  return partners.find((p) => p.id === id) || null;
}

export function getTenantByEmail(partners, email) {
  if (!email) return null;
  const needle = email.trim().toLowerCase();
  return partners.find((p) => p.ownerEmail?.toLowerCase() === needle) || null;
}

/** Catalog stored on the studio. No demo-studio fallback. */
export function getTenantCatalog(partner) {
  if (!partner?.catalog?.length) return [];
  return partner.catalog;
}

export function assertSameTenant(recordPartnerId, tenantId) {
  return Boolean(recordPartnerId && tenantId && recordPartnerId === tenantId);
}

export function scopeByPartner(records, partnerId) {
  if (!partnerId) return [];
  return (records || []).filter((row) => row.partnerId === partnerId);
}
