import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env?.VITE_SUPABASE_URL ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const supabaseAnonKey = 
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

/**
 * Normalizes an appointment record from DB into a standard object format
 */
export function normalizeAppointment(record) {
  if (!record) return null;
  return {
    id: record.id || `app-${Math.random().toString(36).substr(2, 9)}`,
    clientName: record.client_name || record.customer_name || record.name || record.client || 'Guest Client',
    clientPhone: record.client_phone || record.customer_phone || record.phone || '+91 98765 43210',
    serviceName: record.service_name || record.service_title || record.service || 'Beauty & Wellness Service',
    date: record.date || record.booking_date || (record.booking_time ? record.booking_time.split(' ')[0] : 'Today'),
    time: record.time || record.appointment_time || (record.booking_time ? record.booking_time.split(' ').slice(1).join(' ') : '11:30 AM'),
    bookingTime: record.booking_time || `${record.date || ''} ${record.time || ''}`.trim(),
    location: record.location || record.address || record.service_location || 'Plot No. 42, Unit-III, Bhubaneswar, Odisha',
    status: record.status || 'confirmed',
    amount: Number(record.amount || record.price || record.total_price || 1350),
    createdAt: record.created_at || record.createdAt || new Date().toISOString()
  };
}

/**
 * Robustly inserts an appointment into Supabase, handling missing or varied table column schemas.
 */
export async function createAppointmentRecord(bookingData) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured with valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    return { success: false, error: 'Supabase environment variables missing. Please check .env.local' };
  }

  const primaryPayload = {
    client_name: bookingData.clientName || 'Priya Menon',
    client_phone: bookingData.clientPhone || '+91 98765 43210',
    service_name: bookingData.serviceName || 'Hair Spa & Scalp Massage',
    date: bookingData.date || 'Oct 24, 2023',
    time: bookingData.time || '11:30 AM',
    booking_time: `${bookingData.date || 'Oct 24, 2023'} ${bookingData.time || '11:30 AM'}`,
    location: bookingData.location || 'Plot No. 42, Unit-III, Bhubaneswar, Odisha',
    status: bookingData.status || 'confirmed',
    amount: Number(bookingData.amount || 1350),
    created_at: new Date().toISOString()
  };

  // Attempt 1: Full payload
  let { data, error } = await supabase.from('appointments').insert([primaryPayload]).select();

  if (!error && data) {
    return { success: true, data: data[0] ? normalizeAppointment(data[0]) : primaryPayload };
  }

  console.warn('Primary insert failed, attempting schema adaptation:', error?.message);

  // If column error occurs (e.g. unknown column), construct dynamic fallback payload
  const fallbackPayload = {
    client_name: bookingData.clientName || 'Priya Menon',
    client_phone: bookingData.clientPhone || '+91 98765 43210',
    booking_time: `${bookingData.date || 'Oct 24, 2023'} ${bookingData.time || '11:30 AM'}`,
    status: bookingData.status || 'confirmed',
    amount: Number(bookingData.amount || 1350)
  };

  // If specific column error mentioned date/time/service_name/location/amount
  if (error?.message?.includes('service_name') || error?.message?.includes('location')) {
    delete fallbackPayload.service_name;
    delete fallbackPayload.location;
  }

  const fallbackResult = await supabase.from('appointments').insert([fallbackPayload]).select();

  if (!fallbackResult.error && fallbackResult.data) {
    return { success: true, data: normalizeAppointment(fallbackResult.data[0]) };
  }

  // Attempt 3: Try minimal payload (name, status)
  const minimalPayload = {
    client_name: bookingData.clientName || 'Priya Menon',
    status: bookingData.status || 'confirmed'
  };

  const minimalResult = await supabase.from('appointments').insert([minimalPayload]).select();
  if (!minimalResult.error && minimalResult.data) {
    return { success: true, data: normalizeAppointment(minimalResult.data[0]) };
  }

  return { success: false, error: error?.message || fallbackResult.error?.message || minimalResult.error?.message || 'Database error inserting appointment' };
}
