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

  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: 'Sign in with Google or phone to book.' };
  }

  const ownerId = bookingData.ownerId || bookingData.partnerId;
  if (!ownerId) {
    return { success: false, error: 'Missing brand owner for this booking.' };
  }

  const amount = Number(bookingData.amount || 0);
  const payload = {
    owner_id: ownerId,
    salon_id: bookingData.salonId || null,
    service_id: bookingData.serviceId || bookingData.service_id || null,
    client_user_id: user.id,
    client_name: bookingData.clientName || user.user_metadata?.full_name || 'Guest',
    client_phone: bookingData.clientPhone || user.phone || '',
    client_email: user.email || bookingData.clientEmail || null,
    service_name: bookingData.serviceName || 'Booked service',
    service_price: amount,
    booking_time: toBookingTime(bookingData.date, bookingData.time),
    location: bookingData.location || null,
    service_type: bookingData.serviceType || 'at-home',
    status: bookingData.status || 'confirmed',
    amount,
    payment_method: 'direct',
    booking_source: bookingData.bookingSource || 'storefront',
  };

  const { data, error } = await supabase.from('bookings').insert([payload]).select().single();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: normalizeAppointment(data) };
}
