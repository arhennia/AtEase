import { describe, it, expect } from 'vitest';
import { normalizeVipPhone, validateVipMember, mapVipMemberFromDb } from '../lib/vip.js';

describe('normalizeVipPhone', () => {
  it('extracts last 10 digits', () => {
    expect(normalizeVipPhone('9876543210')).toBe('9876543210');
    expect(normalizeVipPhone('+919876543210')).toBe('9876543210');
    expect(normalizeVipPhone('91-98765-43210')).toBe('9876543210');
  });

  it('handles empty/null input', () => {
    expect(normalizeVipPhone('')).toBe('');
    expect(normalizeVipPhone(null)).toBe('');
    expect(normalizeVipPhone(undefined)).toBe('');
  });
});

describe('validateVipMember', () => {
  it('validates a complete member', () => {
    const result = validateVipMember({
      clientName: 'Priya Sharma',
      clientPhone: '9876543210',
      dayOfMonth: 5,
      packageName: 'Monthly package',
    });
    expect(result.ok).toBe(true);
    expect(result.member.clientName).toBe('Priya Sharma');
    expect(result.member.clientPhone).toBe('9876543210');
    expect(result.member.dayOfMonth).toBe(5);
  });

  it('rejects missing name', () => {
    const result = validateVipMember({ clientName: '', clientPhone: '9876543210', dayOfMonth: 5 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/client name/i);
  });

  it('rejects invalid phone', () => {
    const result = validateVipMember({ clientName: 'Test', clientPhone: '123', dayOfMonth: 5 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/10-digit/i);
  });

  it('rejects dayOfMonth out of range', () => {
    const result = validateVipMember({ clientName: 'Test', clientPhone: '9876543210', dayOfMonth: 0 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/day of the month/i);

    const result2 = validateVipMember({ clientName: 'Test', clientPhone: '9876543210', dayOfMonth: 29 });
    expect(result2.ok).toBe(false);
  });

  it('defaults packageName to "Monthly package"', () => {
    const result = validateVipMember({ clientName: 'Test', clientPhone: '9876543210', dayOfMonth: 5 });
    expect(result.ok).toBe(true);
    expect(result.member.packageName).toBe('Monthly package');
  });
});

describe('mapVipMemberFromDb', () => {
  it('maps a DB row to the app model', () => {
    const row = {
      id: 'abc',
      owner_id: 'owner-1',
      client_name: 'Priya',
      client_phone: '9876543210',
      package_id: 'pkg-1',
      package_name: 'Gold',
      day_of_month: 10,
      created_at: '2024-01-01',
    };
    const result = mapVipMemberFromDb(row);
    expect(result.id).toBe('abc');
    expect(result.partnerId).toBe('owner-1');
    expect(result.clientName).toBe('Priya');
    expect(result.dayOfMonth).toBe(10);
  });

  it('returns null for null input', () => {
    expect(mapVipMemberFromDb(null)).toBeNull();
  });

  it('defaults dayOfMonth to 5 when zero', () => {
    const result = mapVipMemberFromDb({ day_of_month: 0 });
    expect(result.dayOfMonth).toBe(5);
  });
});
