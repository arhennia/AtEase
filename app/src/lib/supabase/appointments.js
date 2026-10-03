import { supabase, isSupabaseConfigured } from './client';
import { normalizeAppointment } from './mappers';
import { getAuthUser } from './auth';
import { defaultWorkingHours, formatMinutes, parseBookingWhen, slotAllowed } from '../availability';

function resolveWhen(bookingData) {
  if (bookingData?.bookingTime) {
    const parsed = new Date(bookingData.bookingTime);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return parseBookingWhen(bookingData?.date, bookingData?.time);
}

function nationalPhone(raw) {
  return String(raw || '').replace(/\D/g, '').slice(-10);
}

export async function fetchBookingsByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) {
    return { ok: false, error: 'Supabase is not configured.', data: [] };
  }
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('booking_time', { ascending: false });
  if (error) return { ok: false, error: error.message, data: [] };
  return { ok: true, data: (data || []).map(normalizeAppointment).filter(Boolean) };
}

export async function fetchAppointmentsByOwnerId(ownerId) {
  const result = await fetchBookingsByOwnerId(ownerId);
  if (!result.ok) console.error('fetchAppointmentsByOwnerId', result.error);
  return result.data;
}

export async function createAppointmentRecord(bookingData) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  const ownerId = bookingData.ownerId || bookingData.partnerId;
  if (!ownerId) {
    return { success: false, error: 'Missing brand owner for this booking.' };
  }

  const clientName = String(bookingData.clientName || '').trim();
  const clientPhone = nationalPhone(bookingData.clientPhone);
  if (!clientName) {
    return { success: false, error: 'Enter your name so the salon knows who is booking.' };
  }
  if (clientPhone.length !== 10) {
    return { success: false, error: 'Enter a valid 10-digit phone number.' };
  }

  const when = resolveWhen(bookingData);
  if (!when) {
    return { success: false, error: 'That date and time are not valid.' };
  }
  const taken = await fetchTakenSlotLabels(ownerId, when);
  const slot = slotAllowed(
    bookingData.workingHours || defaultWorkingHours(),
    when,
    bookingData.time,
    taken,
  );
  if (!slot.ok) {
    return { success: false, error: slot.error };
  }

  const user = await getAuthUser();
  const amount = Number(bookingData.amount || 0);
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const serviceId = bookingData.serviceId || bookingData.service_id || null;
  const packageId = bookingData.packageId || bookingData.package_id || null;
  const salonId = bookingData.salonId || null;
  const packageUuid = uuidRe.test(String(packageId || '')) ? packageId : null;
  const payload = {
    owner_id: ownerId,
    salon_id: uuidRe.test(String(salonId || '')) ? salonId : null,
    service_id: packageUuid ? null : uuidRe.test(String(serviceId || '')) ? serviceId : null,
    client_user_id: user?.id || null,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: user?.email || bookingData.clientEmail || null,
    service_name: bookingData.serviceName || 'Booked service',
    service_price: amount,
    booking_time: when.toISOString(),
    location: bookingData.location || null,
    service_type: bookingData.serviceType || 'at-home',
    status: bookingData.status || 'pending',
    amount,
    payment_method: 'direct',
    booking_source: bookingData.bookingSource || 'whatsapp',
  };
  if (packageUuid) payload.package_id = packageUuid;

  // Guests cannot SELECT the row they just inserted (RLS). Insert without returning.
  const { data, error } = user
    ? await supabase.from('bookings').insert([payload]).select().single()
    : await supabase.from('bookings').insert([payload]);

  if (error) {
    return { success: false, error: error.message };
  }
  return {
    success: true,
    data: data ? normalizeAppointment(data) : { saved: true },
  };
}

export async function delayBookingRecord(bookingId, bookingTimeIso) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }
  const { data, error } = await supabase
    .from('bookings')
    .update({ booking_time: bookingTimeIso })
    .eq('id', bookingId)
    .select('id, booking_time, booking_ref')
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function fetchTakenSlotLabels(ownerId, dayDate) {
  if (!isSupabaseConfigured || !ownerId || !(dayDate instanceof Date)) return [];
  const start = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const { data, error } = await supabase.rpc('taken_booking_slots', {
    p_owner_id: ownerId,
    p_day_start: start.toISOString(),
    p_day_end: end.toISOString(),
  });
  if (error || !Array.isArray(data)) return [];
  return data.map((row) => {
    const at = new Date(row.slot_start);
    if (Number.isNaN(at.getTime())) return '';
    return formatMinutes(at.getHours() * 60 + at.getMinutes());
  }).filter(Boolean);
}
