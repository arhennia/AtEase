import { describe, it, expect } from 'vitest';
import {
  toWhatsAppDigits,
  toNationalDigits,
  isValidWhatsAppNumber,
  formatBookingWhatsAppMessage,
  buildWhatsAppBookingUrl,
  buildWhatsAppDelayUrl,
} from '../lib/whatsapp.js';

describe('toWhatsAppDigits', () => {
  it('prepends country code for 10-digit numbers', () => {
    expect(toWhatsAppDigits('9876543210')).toBe('919876543210');
  });

  it('keeps existing country code', () => {
    expect(toWhatsAppDigits('+919876543210')).toBe('919876543210');
    expect(toWhatsAppDigits('919876543210')).toBe('919876543210');
  });

  it('strips non-digit characters', () => {
    expect(toWhatsAppDigits('+91 98765 43210')).toBe('919876543210');
    expect(toWhatsAppDigits('(98765) 43210')).toBe('919876543210');
  });

  it('returns empty for empty input', () => {
    expect(toWhatsAppDigits('')).toBe('');
    expect(toWhatsAppDigits(null)).toBe('');
  });
});

describe('toNationalDigits', () => {
  it('strips country code', () => {
    expect(toNationalDigits('+919876543210')).toBe('9876543210');
    expect(toNationalDigits('919876543210')).toBe('9876543210');
  });

  it('keeps bare 10-digit numbers', () => {
    expect(toNationalDigits('9876543210')).toBe('9876543210');
  });
});

describe('isValidWhatsAppNumber', () => {
  it('accepts valid Indian numbers', () => {
    expect(isValidWhatsAppNumber('9876543210')).toBe(true);
    expect(isValidWhatsAppNumber('+919876543210')).toBe(true);
  });

  it('rejects too-short numbers', () => {
    expect(isValidWhatsAppNumber('12345')).toBe(false);
    expect(isValidWhatsAppNumber('')).toBe(false);
  });
});

describe('formatBookingWhatsAppMessage', () => {
  it('formats a booking message', () => {
    const msg = formatBookingWhatsAppMessage({
      clientName: 'Priya',
      services: 'Hair spa, Facial',
      date: 'Jan 15, 2025',
      time: '10:00 AM',
      total: 2500,
      studioName: 'Glow Studio',
    });
    expect(msg).toContain('Hi Glow Studio');
    expect(msg).toContain('Priya');
    expect(msg).toContain('Hair spa, Facial');
    expect(msg).toContain('Jan 15, 2025');
    expect(msg).toContain('10:00 AM');
    expect(msg).toContain('2,500');
  });

  it('omits price line when total is 0', () => {
    const msg = formatBookingWhatsAppMessage({
      clientName: 'Test',
      services: 'Service',
      date: 'Today',
      time: 'Now',
      total: 0,
    });
    expect(msg).not.toContain('Total');
  });

  it('joins array services with commas', () => {
    const msg = formatBookingWhatsAppMessage({
      clientName: 'Test',
      services: ['Hair', 'Facial', 'Spa'],
      date: 'Today',
      time: 'Now',
      total: 0,
    });
    expect(msg).toContain('Hair, Facial, Spa');
  });
});

describe('buildWhatsAppBookingUrl', () => {
  it('builds a wa.me URL', () => {
    const url = buildWhatsAppBookingUrl({
      phone: '9876543210',
      clientName: 'Priya',
      services: 'Hair spa',
      date: 'Jan 15',
      time: '10 AM',
      total: 1000,
    });
    expect(url).toMatch(/^https:\/\/wa\.me\/919876543210\?text=/);
    expect(url).toContain(encodeURIComponent('Priya'));
  });

  it('returns null for invalid phone', () => {
    expect(buildWhatsAppBookingUrl({ phone: '' })).toBeNull();
  });
});

describe('buildWhatsAppDelayUrl', () => {
  it('builds a delay notification URL', () => {
    const url = buildWhatsAppDelayUrl({
      phone: '9876543210',
      studioName: 'Glow',
      serviceName: 'Hair spa',
      date: 'Jan 15',
      time: '10:00 AM',
      minutes: 15,
    });
    expect(url).toContain('wa.me');
    expect(url).toContain(encodeURIComponent('15 minutes'));
  });
});
