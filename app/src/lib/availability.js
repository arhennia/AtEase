export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function defaultWorkingHours() {
  return {
    start: '09:00 AM',
    end: '08:00 PM',
    daysOpen: [...DEFAULT_DAYS],
  };
}

export function parseTimeToMinutes(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3] ? match[3].toUpperCase() : '';
  if (minutes < 0 || minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'AM') hours = hours === 12 ? 0 : hours;
    if (meridiem === 'PM') hours = hours === 12 ? 12 : hours + 12;
  } else if (hours > 23) {
    return null;
  }
  return hours * 60 + minutes;
}

export function formatMinutes(total) {
  const minutes = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${meridiem}`;
}

function to24Hour(total) {
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function normalizeWorkingHours(raw) {
  const fallback = defaultWorkingHours();
  if (!raw || typeof raw !== 'object') return fallback;
  const startMinutes = parseTimeToMinutes(raw.start);
  const endMinutes = parseTimeToMinutes(raw.end);
  const days = Array.isArray(raw.daysOpen) ? raw.daysOpen : raw.days_open;
  const daysOpen = WEEKDAYS.filter((day) => (days || fallback.daysOpen).includes(day));
  return {
    start: startMinutes == null ? fallback.start : formatMinutes(startMinutes),
    end: endMinutes == null ? fallback.end : formatMinutes(endMinutes),
    daysOpen,
  };
}

export function workingHoursToDb(hours) {
  const normalized = normalizeWorkingHours(hours);
  return {
    start: to24Hour(parseTimeToMinutes(normalized.start)),
    end: to24Hour(parseTimeToMinutes(normalized.end)),
    days_open: normalized.daysOpen,
  };
}

export function validateWorkingHours(hours) {
  const start = parseTimeToMinutes(hours?.start);
  const end = parseTimeToMinutes(hours?.end);
  if (start == null || end == null) {
    return { ok: false, error: 'Enter opening and closing times like 09:00 AM.' };
  }
  if (start >= end) {
    return { ok: false, error: 'Opening time must be before closing time.' };
  }
  const daysOpen = WEEKDAYS.filter((day) => (hours?.daysOpen || []).includes(day));
  return {
    ok: true,
    hours: {
      start: formatMinutes(start),
      end: formatMinutes(end),
      daysOpen,
    },
  };
}

export function validateRadius(radius) {
  const value = Number(radius);
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    return { ok: false, error: 'Choose a coverage radius between 1 and 50 km.' };
  }
  return { ok: true, value };
}

export function normalizeServiceArea(areas) {
  if (!Array.isArray(areas)) return [];
  const seen = new Set();
  const next = [];
  for (const area of areas) {
    const name = String(area || '').trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    next.push(name);
  }
  return next;
}

export function isDayOpen(hours, dayName) {
  const normalized = normalizeWorkingHours(hours);
  return normalized.daysOpen.includes(dayName);
}

export function slotsForDay(hours, dayName, onDate = null) {
  const empty = { morning: [], afternoon: [], evening: [] };
  const check = validateWorkingHours(hours);
  if (!check.ok || !check.hours.daysOpen.includes(dayName)) return empty;
  const start = parseTimeToMinutes(check.hours.start);
  const end = parseTimeToMinutes(check.hours.end);
  const grouped = { morning: [], afternoon: [], evening: [] };
  const now = Date.now();
  for (let cursor = start; cursor < end; cursor += 45) {
    if (onDate instanceof Date) {
      const slotAt = new Date(
        onDate.getFullYear(),
        onDate.getMonth(),
        onDate.getDate(),
        Math.floor(cursor / 60),
        cursor % 60,
        0,
        0,
      );
      if (slotAt.getTime() <= now) continue;
    }
    const label = formatMinutes(cursor);
    const hour = Math.floor(cursor / 60);
    if (hour < 12) grouped.morning.push(label);
    else if (hour < 17) grouped.afternoon.push(label);
    else grouped.evening.push(label);
  }
  return grouped;
}

export function omitTakenSlots(slots, takenLabels = []) {
  const taken = new Set(takenLabels || []);
  const keep = (list) => (list || []).filter((label) => !taken.has(label));
  return {
    morning: keep(slots?.morning),
    afternoon: keep(slots?.afternoon),
    evening: keep(slots?.evening),
  };
}

export function weekdayName(date) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

export function parseBookingWhen(dateStr, timeStr) {
  const combined = `${String(dateStr || '').trim()} ${String(timeStr || '').trim()}`.trim();
  if (!combined) return null;
  const parsed = new Date(combined);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function slotInstant(dayDate, timeLabel) {
  const minutes = parseTimeToMinutes(timeLabel);
  if (minutes == null || !(dayDate instanceof Date) || Number.isNaN(dayDate.getTime())) return null;
  return new Date(
    dayDate.getFullYear(),
    dayDate.getMonth(),
    dayDate.getDate(),
    Math.floor(minutes / 60),
    minutes % 60,
    0,
    0,
  );
}

export function withinWorkingHours(hours, when) {
  if (!(when instanceof Date) || Number.isNaN(when.getTime())) {
    return { ok: false, error: 'That date and time are not valid.' };
  }
  if (when.getTime() <= Date.now()) {
    return { ok: false, error: 'That time has already passed.' };
  }
  const dayName = weekdayName(when);
  const check = validateWorkingHours(hours);
  if (!check.ok || !check.hours.daysOpen.includes(dayName)) {
    return { ok: false, error: `Closed on ${dayName}.` };
  }
  const start = parseTimeToMinutes(check.hours.start);
  const end = parseTimeToMinutes(check.hours.end);
  const minute = when.getHours() * 60 + when.getMinutes();
  if (minute < start || minute >= end) {
    return { ok: false, error: 'That time is outside business hours.' };
  }
  return { ok: true, when };
}

export function slotAllowed(hours, when, timeLabel, takenLabels = []) {
  const open = withinWorkingHours(hours, when);
  if (!open.ok) return open;
  const minute = when.getHours() * 60 + when.getMinutes();
  if (parseTimeToMinutes(timeLabel) !== minute) {
    return { ok: false, error: 'That date and time are not valid.' };
  }
  const labels = slotLabels(slotsForDay(hours, weekdayName(when)));
  if (!labels.includes(timeLabel)) {
    return { ok: false, error: 'That time is not an available slot.' };
  }
  if ((takenLabels || []).includes(timeLabel)) {
    return { ok: false, error: 'That time is already booked.' };
  }
  return { ok: true, when };
}

export function slotLabels(slots) {
  return [...(slots?.morning || []), ...(slots?.afternoon || []), ...(slots?.evening || [])];
}
