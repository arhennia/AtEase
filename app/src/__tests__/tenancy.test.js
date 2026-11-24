import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  slugify,
  addDaysIso,
  accessFromSubscription,
  getPlanStatus,
  tenantPath,
  publicSitePath,
  getTenantBySlug,
  getTenantById,
  getTenantByEmail,
  getTenantCatalog,
  assertSameTenant,
  scopeByPartner,
  TRIAL_DAYS,
} from '../lib/tenancy.js';

describe('slugify', () => {
  it('lowercases and replaces non-alphanumeric with dashes', () => {
    expect(slugify('Rajkumari Beauty')).toBe('rajkumari-beauty');
    expect(slugify('  Hello  World  ')).toBe('hello-world');
  });

  it('truncates to 48 characters', () => {
    const long = 'a'.repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(48);
  });

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
  });
});

describe('addDaysIso', () => {
  it('adds days to a date', () => {
    const from = new Date('2024-01-01T00:00:00Z');
    const result = addDaysIso(14, from);
    expect(result).toContain('2024-01-15');
  });
});

describe('TRIAL_DAYS', () => {
  it('is 14', () => {
    expect(TRIAL_DAYS).toBe(14);
  });
});

describe('accessFromSubscription', () => {
  it('returns none for null subscription', () => {
    const result = accessFromSubscription(null);
    expect(result.active).toBe(false);
    expect(result.status).toBe('none');
  });

  it('returns active for an active subscription with a future period end', () => {
    const future = new Date(Date.now() + 86400000 * 30).toISOString();
    const result = accessFromSubscription({
      status: 'active',
      provider: 'razorpay',
      currentPeriodEnd: future,
    });
    expect(result.active).toBe(true);
    expect(result.status).toBe('active');
    expect(result.daysLeft).toBeGreaterThan(0);
  });

  it('returns expired for an active subscription with a past period end', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const result = accessFromSubscription({
      status: 'active',
      provider: 'razorpay',
      currentPeriodEnd: past,
    });
    expect(result.active).toBe(false);
    expect(result.status).toBe('expired');
  });

  it('returns expired for an active subscription without a provider', () => {
    const future = new Date(Date.now() + 86400000 * 30).toISOString();
    const result = accessFromSubscription({
      status: 'active',
      provider: null,
      currentPeriodEnd: future,
    });
    expect(result.active).toBe(false);
  });

  it('returns trial for a trial subscription with days remaining', () => {
    const future = new Date(Date.now() + 86400000 * 7).toISOString();
    const result = accessFromSubscription({
      status: 'trial',
      currentPeriodEnd: future,
    });
    expect(result.active).toBe(true);
    expect(result.status).toBe('trial');
  });

  it('returns expired for a trial subscription past its end', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const result = accessFromSubscription({
      status: 'trial',
      currentPeriodEnd: past,
    });
    expect(result.active).toBe(false);
    expect(result.status).toBe('expired');
  });

  it('returns the raw status for other statuses', () => {
    const result = accessFromSubscription({ status: 'cancelled', currentPeriodEnd: null });
    expect(result.active).toBe(false);
    expect(result.status).toBe('cancelled');
  });
});

describe('getPlanStatus', () => {
  it('returns none for null partner', () => {
    const result = getPlanStatus(null);
    expect(result.status).toBe('none');
    expect(result.active).toBe(false);
  });

  it('uses subscription when present', () => {
    const future = new Date(Date.now() + 86400000 * 10).toISOString();
    const result = getPlanStatus({
      subscription: { status: 'active', provider: 'razorpay', currentPeriodEnd: future },
    });
    expect(result.active).toBe(true);
  });
});

describe('tenantPath', () => {
  it('builds correct paths', () => {
    expect(tenantPath('my-studio')).toBe('/p/my-studio');
    expect(tenantPath('my-studio', 'review')).toBe('/p/my-studio/review');
    expect(tenantPath('my-studio', '/review')).toBe('/p/my-studio/review');
  });
});

describe('publicSitePath', () => {
  it('builds /s/ paths', () => {
    expect(publicSitePath('my-studio')).toBe('/s/my-studio');
  });
});

describe('getTenantBySlug', () => {
  const partners = [
    { id: '1', slug: 'alpha' },
    { id: '2', slug: 'beta' },
  ];

  it('finds by slug', () => {
    expect(getTenantBySlug(partners, 'alpha')?.id).toBe('1');
  });

  it('finds by id as fallback', () => {
    expect(getTenantBySlug(partners, '2')?.slug).toBe('beta');
  });

  it('returns null for no match', () => {
    expect(getTenantBySlug(partners, 'gamma')).toBeNull();
    expect(getTenantBySlug(partners, '')).toBeNull();
  });
});

describe('getTenantByEmail', () => {
  const partners = [{ id: '1', ownerEmail: 'Test@Example.COM' }];

  it('matches case-insensitively', () => {
    expect(getTenantByEmail(partners, 'test@example.com')?.id).toBe('1');
  });

  it('trims whitespace', () => {
    expect(getTenantByEmail(partners, '  test@example.com  ')?.id).toBe('1');
  });
});

describe('getTenantCatalog', () => {
  it('returns empty for partners without catalog', () => {
    expect(getTenantCatalog({})).toEqual([]);
    expect(getTenantCatalog({ catalog: [] })).toEqual([]);
  });

  it('returns the catalog array', () => {
    const catalog = [{ categoryName: 'Hair', services: [] }];
    expect(getTenantCatalog({ catalog })).toBe(catalog);
  });
});

describe('assertSameTenant', () => {
  it('returns true when IDs match', () => {
    expect(assertSameTenant('abc', 'abc')).toBe(true);
  });

  it('returns false when IDs differ or are missing', () => {
    expect(assertSameTenant('abc', 'def')).toBe(false);
    expect(assertSameTenant(null, 'abc')).toBe(false);
    expect(assertSameTenant('abc', '')).toBe(false);
  });
});

describe('scopeByPartner', () => {
  it('filters records by partnerId', () => {
    const records = [
      { partnerId: 'a', name: 'A' },
      { partnerId: 'b', name: 'B' },
      { partnerId: 'a', name: 'A2' },
    ];
    expect(scopeByPartner(records, 'a')).toHaveLength(2);
    expect(scopeByPartner(records, 'c')).toHaveLength(0);
    expect(scopeByPartner(records, null)).toEqual([]);
  });
});
