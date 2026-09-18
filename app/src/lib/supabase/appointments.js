import { supabase, isSupabaseConfigured } from './client';
import { normalizeAppointment } from './mappers';
import { getAuthUser } from './auth';

function toBookingTime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return new Date().toISOString();
  const combined = `${dateStr || ''} ${timeStr || ''}`.trim();
  const parsed = new Date(combined);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date().toISOString();
}

export async function fetchAppointmentsByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return [];
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchAppointmentsByOwnerId', error);
    return [];
  }
  return (data || []).map(normalizeAppointment);
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
  const clientPhone = String(bookingData.clientPhone || '').trim();
  if (!clientName) {
    return { success: false, error: 'Enter your name so the salon knows who is booking.' };
  }
  if (clientPhone.replace(/\D/g, '').length < 10) {
    return { success: false, error: 'Enter a valid 10-digit phone number.' };
  }

  const user = await getAuthUser();
  const amount = Number(bookingData.amount || 0);
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const serviceId = bookingData.serviceId || bookingData.service_id || null;
  const salonId = bookingData.salonId || null;
  const payload = {
    owner_id: ownerId,
    salon_id: uuidRe.test(String(salonId || '')) ? salonId : null,
    service_id: uuidRe.test(String(serviceId || '')) ? serviceId : null,
    client_user_id: user?.id || null,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: user?.email || bookingData.clientEmail || null,
    service_name: bookingData.serviceName || 'Booked service',
    service_price: amount,
    booking_time: toBookingTime(bookingData.date, bookingData.time),
    location: bookingData.location || null,
    service_type: bookingData.serviceType || 'at-home',
    status: bookingData.status || 'pending',
    amount,
    payment_method: 'direct',
    booking_source: bookingData.bookingSource || 'whatsapp',
  };

  // Guests cannot SELECT the row they just inserted (RLS). Insert without returning.
  const { data, error } = user
    ? await supabase.from('bookings').insert([payload]).select().single()
    : await supabase.from('bookings').insert([payload]);

  if (error) {
    return { success: false, error: error.message };
  }
  return {
    success: true,
    data: normalizeAppointment(data || payload),
  };
}
