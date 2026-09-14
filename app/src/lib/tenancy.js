import { RAJKUMARI_PROVIDER_DATA } from '../data/providerData';

export const TRIAL_DAYS = 14;
export const DEMO_PARTNER_EMAIL = 'aisha@rajkumari.studio';
export const DEMO_PARTNER_PASSWORD = 'demo';

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

export function getPlanStatus(partner) {
  if (!partner) {
    return { status: 'none', active: false, daysLeft: 0 };
  }
  if (partner.subscriptionStatus === 'active') {
    return { status: 'active', active: true, daysLeft: null };
  }
  const ends = new Date(partner.trialEndsAt);
  const daysLeft = Math.ceil((ends.getTime() - Date.now()) / 86400000);
  if (daysLeft > 0) {
    return { status: 'trial', active: true, daysLeft };
  }
  return { status: 'expired', active: false, daysLeft: 0 };
}

export function tenantPath(slug, rest = '') {
  const suffix = rest.startsWith('/') ? rest : rest ? `/${rest}` : '';
  return `/p/${slug}${suffix}`;
}

export function tenantSiteUrl(slug) {
  if (typeof window === 'undefined') return `/p/${slug}`;
  return `${window.location.origin}/p/${slug}`;
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

/** Strict catalog lookup — never falls back to another tenant. */
export function getTenantCatalog(partner) {
  if (!partner) return [];
  if (partner.catalog?.length) return partner.catalog;
  if (partner.slug === 'rajkumari-beauty') {
    return RAJKUMARI_PROVIDER_DATA.serviceCategories;
  }
  return [];
}

export function assertSameTenant(recordPartnerId, tenantId) {
  return Boolean(recordPartnerId && tenantId && recordPartnerId === tenantId);
}

export function scopeByPartner(records, partnerId) {
  if (!partnerId) return [];
  return (records || []).filter((row) => row.partnerId === partnerId);
}
