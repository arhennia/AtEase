function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function phoneKey(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

export function summarizeStudioStats(clients = [], analytics = []) {
  const periods = [...(analytics || [])].sort((a, b) => String(a.period_start).localeCompare(String(b.period_start)));
  return {
    clientCount: (clients || []).length,
    bookingCount: periods.reduce((sum, row) => sum + asNumber(row.booking_count), 0),
    visitValue: periods.reduce((sum, row) => sum + asNumber(row.revenue), 0),
    bookingSeries: periods.map((row) => asNumber(row.booking_count)),
    revenueSeries: periods.map((row) => asNumber(row.revenue)),
    clientSeries: periods.map((row) => asNumber(row.unique_clients)),
    periods,
  };
}

export function bookingsForClient(bookings = [], client) {
  if (!client) return [];
  const phone = phoneKey(client.client_phone);
  return (bookings || []).filter((row) => {
    if (client.id && row.clientId && row.clientId === client.id) return true;
    if (client.client_phone && row.clientPhone && row.clientPhone === client.client_phone) return true;
    const rowPhone = phoneKey(row.clientPhone);
    return Boolean(phone) && rowPhone === phone;
  });
}

export function bookingDaysInMonth(bookings = [], monthDate = new Date()) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const days = new Set();
  for (const row of bookings || []) {
    if (!row?.bookingTime) continue;
    const date = new Date(row.bookingTime);
    if (Number.isNaN(date.getTime())) continue;
    if (date.getFullYear() === year && date.getMonth() === month) days.add(date.getDate());
  }
  return days;
}
