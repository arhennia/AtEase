import { describe, it, expect } from 'vitest';
import {
  parseTimeToMinutes,
  formatMinutes,
  normalizeWorkingHours,
  validateWorkingHours,
  validateRadius,
  slotsForDay,
  omitTakenSlots,
  weekdayName,
  withinWorkingHours,
  slotAllowed,
  slotLabels,
  parseBookingWhen,
  slotInstant,
  normalizeServiceArea,
  defaultWorkingHours,
} from '../lib/availability.js';

describe('parseTimeToMinutes', () => {
  it('parses 12-hour AM times', () => {
    expect(parseTimeToMinutes('9:00 AM')).toBe(540);
    expect(parseTimeToMinutes('12:00 AM')).toBe(0);
    expect(parseTimeToMinutes('12:30 AM')).toBe(30);
  });

  it('parses 12-hour PM times', () => {
    expect(parseTimeToMinutes('12:00 PM')).toBe(720);
    expect(parseTimeToMinutes('1:00 PM')).toBe(780);
    expect(parseTimeToMinutes('11:59 PM')).toBe(1439);
  });

  it('parses 24-hour times without meridiem', () => {
    expect(parseTimeToMinutes('09:00')).toBe(540);
    expect(parseTimeToMinutes('14:30')).toBe(870);
    expect(parseTimeToMinutes('0:00')).toBe(0);
    expect(parseTimeToMinutes('23:59')).toBe(1439);
  });

  it('returns null for invalid input', () => {
    expect(parseTimeToMinutes('')).toBeNull();
    expect(parseTimeToMinutes(null)).toBeNull();
    expect(parseTimeToMinutes('abc')).toBeNull();
    expect(parseTimeToMinutes('25:00')).toBeNull();
    expect(parseTimeToMinutes('13:00 PM')).toBeNull();
    expect(parseTimeToMinutes('0:00 AM')).toBeNull(); // 0 is invalid for 12-hour
  });
});

describe('formatMinutes', () => {
  it('formats minutes to 12-hour time without leading zero on hour', () => {
    expect(formatMinutes(0)).toBe('12:00 AM');
    expect(formatMinutes(540)).toBe('9:00 AM');
    expect(formatMinutes(720)).toBe('12:00 PM');
    expect(formatMinutes(780)).toBe('1:00 PM');
    expect(formatMinutes(1200)).toBe('8:00 PM');
  });

  it('pads minutes to two digits', () => {
    expect(formatMinutes(541)).toBe('9:01 AM');
    expect(formatMinutes(545)).toBe('9:05 AM');
  });

  it('wraps past midnight', () => {
    expect(formatMinutes(1440)).toBe('12:00 AM');
    expect(formatMinutes(1500)).toBe('1:00 AM');
  });
});

describe('normalizeWorkingHours', () => {
  it('returns defaults for null/undefined', () => {
    const result = normalizeWorkingHours(null);
    expect(result.start).toBe('9:00 AM');
    expect(result.end).toBe('8:00 PM');
    expect(result.daysOpen).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('normalizes valid hours', () => {
    const result = normalizeWorkingHours({ start: '10:00 AM', end: '6:00 PM', daysOpen: ['Mon', 'Wed', 'Fri'] });
    expect(result.start).toBe('10:00 AM');
    expect(result.end).toBe('6:00 PM');
    expect(result.daysOpen).toEqual(['Mon', 'Wed', 'Fri']);
  });

  it('filters invalid day names', () => {
    const result = normalizeWorkingHours({ start: '9:00 AM', end: '5:00 PM', daysOpen: ['Mon', 'Funday', 'Fri'] });
    expect(result.daysOpen).toEqual(['Mon', 'Fri']);
  });
});

describe('validateWorkingHours', () => {
  it('accepts valid hours', () => {
    const result = validateWorkingHours({ start: '9:00 AM', end: '5:00 PM', daysOpen: ['Mon', 'Tue'] });
    expect(result.ok).toBe(true);
  });

  it('rejects when start >= end', () => {
    const result = validateWorkingHours({ start: '5:00 PM', end: '9:00 AM', daysOpen: ['Mon'] });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/before closing/i);
  });

  it('rejects when times are unparseable', () => {
    const result = validateWorkingHours({ start: 'abc', end: '5:00 PM', daysOpen: [] });
    expect(result.ok).toBe(false);
  });
});

describe('validateRadius', () => {
  it('accepts integers 1-50', () => {
    expect(validateRadius(10).ok).toBe(true);
    expect(validateRadius(1).ok).toBe(true);
    expect(validateRadius(50).ok).toBe(true);
  });

  it('rejects out-of-range values', () => {
    expect(validateRadius(0).ok).toBe(false);
    expect(validateRadius(51).ok).toBe(false);
    expect(validateRadius(3.5).ok).toBe(false);
  });
});

describe('slotsForDay', () => {
  it('generates 45-minute slots within working hours', () => {
    const hours = { start: '9:00 AM', end: '12:00 PM', daysOpen: ['Mon'] };
    const slots = slotsForDay(hours, 'Mon');
    const all = slotLabels(slots);
    expect(all.length).toBe(4); // 9:00, 9:45, 10:30, 11:15
    expect(all[0]).toBe('9:00 AM');
    expect(all[1]).toBe('9:45 AM');
  });

  it('returns empty for a closed day', () => {
    const hours = { start: '9:00 AM', end: '5:00 PM', daysOpen: ['Mon'] };
    const slots = slotsForDay(hours, 'Tue');
    expect(slotLabels(slots)).toEqual([]);
  });
});

describe('omitTakenSlots', () => {
  it('removes taken slots from each group', () => {
    const slots = {
      morning: ['9:00 AM', '9:45 AM', '10:30 AM', '11:15 AM'],
      afternoon: ['12:00 PM', '12:45 PM'],
      evening: ['5:00 PM'],
    };
    const result = omitTakenSlots(slots, ['9:45 AM', '12:00 PM']);
    expect(result.morning).toEqual(['9:00 AM', '10:30 AM', '11:15 AM']);
    expect(result.afternoon).toEqual(['12:45 PM']);
    expect(result.evening).toEqual(['5:00 PM']);
  });
});

describe('weekdayName', () => {
  it('returns the correct day name', () => {
    // 2024-01-01 is a Monday
    const monday = new Date(2024, 0, 1);
    expect(weekdayName(monday)).toBe('Mon');
    // 2024-01-07 is a Sunday
    const sunday = new Date(2024, 0, 7);
    expect(weekdayName(sunday)).toBe('Sun');
  });
});

describe('withinWorkingHours', () => {
  // Use a date well in the future so the "already passed" check doesn't interfere.
  // 2030-01-07 is a Monday.
  const futureMonday = new Date(2030, 0, 7);
  // 2030-01-12 is a Saturday.
  const futureSaturday = new Date(2030, 0, 12);

  it('accepts a time within hours on an open day', () => {
    const hours = { start: '9:00 AM', end: '5:00 PM', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };
    const when = new Date(futureMonday);
    when.setHours(10, 0, 0, 0);
    const result = withinWorkingHours(hours, when);
    expect(result.ok).toBe(true);
  });

  it('rejects a time outside hours', () => {
    const hours = { start: '9:00 AM', end: '5:00 PM', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };
    const when = new Date(futureMonday);
    when.setHours(8, 0, 0, 0);
    const result = withinWorkingHours(hours, when);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/outside business hours/i);
  });

  it('rejects a time on a closed day', () => {
    const hours = { start: '9:00 AM', end: '5:00 PM', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };
    const when = new Date(futureSaturday);
    when.setHours(10, 0, 0, 0);
    const result = withinWorkingHours(hours, when);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/closed/i);
  });
});

describe('parseBookingWhen', () => {
  it('parses date and time strings', () => {
    const result = parseBookingWhen('Jan 1, 2025', '10:00 AM');
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(10);
  });

  it('returns null for empty input', () => {
    expect(parseBookingWhen('', '')).toBeNull();
    expect(parseBookingWhen(null, null)).toBeNull();
  });
});

describe('normalizeServiceArea', () => {
  it('deduplicates case-insensitively', () => {
    expect(normalizeServiceArea(['Koramangala', 'koramangala', 'HSR'])).toEqual(['Koramangala', 'HSR']);
  });

  it('filters empty strings', () => {
    expect(normalizeServiceArea(['  ', 'Indiranagar', ''])).toEqual(['Indiranagar']);
  });

  it('returns empty array for non-array input', () => {
    expect(normalizeServiceArea(null)).toEqual([]);
    expect(normalizeServiceArea(undefined)).toEqual([]);
  });
});

describe('defaultWorkingHours', () => {
  it('returns a fresh copy each time', () => {
    const a = defaultWorkingHours();
    const b = defaultWorkingHours();
    a.daysOpen.push('Sun');
    expect(b.daysOpen).not.toContain('Sun');
  });
});
