export function normalizeVipPhone(phone) {
  return String(phone || '').replace(/\D/g, '').slice(-10);
}

export function mapVipMemberFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    partnerId: row.owner_id,
    clientName: row.client_name || '',
    clientPhone: row.client_phone || '',
    packageId: row.package_id || '',
    packageName: row.package_name || 'Monthly package',
    dayOfMonth: Number(row.day_of_month) || 5,
    createdAt: row.created_at || null,
  };
}

export function validateVipMember(input) {
  const clientName = String(input?.clientName || '').trim();
  if (!clientName) return { ok: false, error: 'Enter the client name.' };

  const clientPhone = normalizeVipPhone(input?.clientPhone);
  if (clientPhone.length !== 10) {
    return { ok: false, error: 'Enter a 10-digit phone number.' };
  }

  const dayOfMonth = Number(input?.dayOfMonth ?? 5);
  if (!Number.isInteger(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 28) {
    return { ok: false, error: 'Pick a day of the month from 1 to 28.' };
  }

  const packageName = String(input?.packageName || 'Monthly package').trim() || 'Monthly package';
  return {
    ok: true,
    member: {
      clientName,
      clientPhone,
      packageId: input?.packageId || null,
      packageName,
      dayOfMonth,
    },
  };
}
