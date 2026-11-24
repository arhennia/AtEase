import { describe, it, expect } from 'vitest';
import { mapPackageFromDb, validatePackage, packageToDb } from '../lib/packages.js';

describe('mapPackageFromDb', () => {
  it('maps a DB row to the app model', () => {
    const row = {
      id: 'pkg-1',
      name: 'Gold Package',
      description: 'A premium package',
      duration: '2 hours',
      price: 2999,
      original_price: 3499,
      discount_percent: 14,
      image_url: 'https://example.com/img.jpg',
      is_active: true,
      vip_monthly: false,
      vip_day_of_month: 5,
      included_items: ['Item A', 'Item B'],
    };
    const result = mapPackageFromDb(row);
    expect(result.id).toBe('pkg-1');
    expect(result.name).toBe('Gold Package');
    expect(result.price).toBe(2999);
    expect(result.originalPrice).toBe(3499);
    expect(result.discountPercent).toBe(14);
    expect(result.isActive).toBe(true);
    expect(result.isPackage).toBe(true);
    expect(result.packageItems).toEqual(['Item A', 'Item B']);
  });

  it('returns null for null input', () => {
    expect(mapPackageFromDb(null)).toBeNull();
  });

  it('defaults optional fields', () => {
    const result = mapPackageFromDb({ id: 'x', name: 'Basic' });
    expect(result.price).toBe(0);
    expect(result.originalPrice).toBe('');
    expect(result.discountPercent).toBe('');
    expect(result.packageItems).toEqual([]);
  });
});

describe('validatePackage', () => {
  it('accepts a valid package', () => {
    const result = validatePackage({
      name: 'Gold',
      price: 2999,
      description: 'Premium',
    });
    expect(result.ok).toBe(true);
  });

  it('rejects missing name', () => {
    const result = validatePackage({ name: '', price: 100 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/package name/i);
  });

  it('rejects negative price', () => {
    const result = validatePackage({ name: 'Test', price: -1 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/price/i);
  });

  it('rejects non-finite price', () => {
    const result = validatePackage({ name: 'Test', price: 'abc' });
    expect(result.ok).toBe(false);
  });

  it('validates discount percent is 0-100', () => {
    expect(validatePackage({ name: 'T', price: 100, discountPercent: 50 }).ok).toBe(true);
    expect(validatePackage({ name: 'T', price: 100, discountPercent: 101 }).ok).toBe(false);
    expect(validatePackage({ name: 'T', price: 100, discountPercent: -1 }).ok).toBe(false);
    expect(validatePackage({ name: 'T', price: 100, discountPercent: 3.5 }).ok).toBe(false);
  });

  it('validates VIP day of month when vipMonthly is true', () => {
    const result = validatePackage({ name: 'T', price: 100, vipMonthly: true, vipDayOfMonth: 0 });
    expect(result.ok).toBe(false);

    const result2 = validatePackage({ name: 'T', price: 100, vipMonthly: true, vipDayOfMonth: 15 });
    expect(result2.ok).toBe(true);
  });

  it('filters empty package items', () => {
    const result = validatePackage({
      name: 'T',
      price: 100,
      packageItems: ['Item A', '', '  ', 'Item B'],
    });
    expect(result.ok).toBe(true);
    expect(result.package.packageItems).toEqual(['Item A', 'Item B']);
  });
});

describe('packageToDb', () => {
  it('converts app model to DB payload', () => {
    const pkg = {
      name: 'Gold',
      description: 'Premium',
      price: 2999,
      originalPrice: 3499,
      discountPercent: 14,
      duration: '2 hours',
      imageUrl: 'https://example.com/img.jpg',
      packageItems: ['A', 'B'],
      vipMonthly: true,
      vipDayOfMonth: 5,
      isActive: true,
    };
    const db = packageToDb(pkg);
    expect(db.name).toBe('Gold');
    expect(db.original_price).toBe(3499);
    expect(db.discount_percent).toBe(14);
    expect(db.included_items).toEqual(['A', 'B']);
    expect(db.vip_monthly).toBe(true);
    expect(db.is_active).toBe(true);
  });
});
