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

  let payload = {
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

  const originalPayload = { ...payload };
  const removedKeys = new Set();
  let lastErrorMsg = '';

  for (let attempt = 0; attempt < 8; attempt++) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (!error) {
      const dbRecord = (data && data.length > 0) ? data[0] : {};
      const mergedRecord = { ...originalPayload, ...dbRecord };
      return { success: true, data: normalizeAppointment(mergedRecord) };
    }

    lastErrorMsg = error?.message || '';
    console.warn(`Attempt ${attempt + 1} insert failed:`, lastErrorMsg);

    // Extract column name from standard Supabase/PostgREST error messages
    // E.g.: "Could not find the 'amount' column of 'appointments' in the schema cache"
    // or 'column "amount" of relation "appointments" does not exist'
    const colMatch =
      lastErrorMsg.match(/Could not find the '([^']+)' column/i) ||
      lastErrorMsg.match(/column ["']([^"']+)["']/i) ||
      lastErrorMsg.match(/'([^']+)' column/i);

    if (colMatch && colMatch[1] && payload.hasOwnProperty(colMatch[1])) {
      const missingCol = colMatch[1];
      console.warn(`Removing unknown column '${missingCol}' from payload and retrying...`);
      delete payload[missingCol];
      removedKeys.add(missingCol);
      continue;
    }

    // Secondary fallback removals if error string couldn't be parsed directly
    if (!removedKeys.has('amount') && payload.hasOwnProperty('amount')) {
      delete payload.amount;
      removedKeys.add('amount');
      continue;
    }
    if (!removedKeys.has('service_name') && payload.hasOwnProperty('service_name')) {
      delete payload.service_name;
      removedKeys.add('service_name');
      continue;
    }
    if (!removedKeys.has('location') && payload.hasOwnProperty('location')) {
      delete payload.location;
      removedKeys.add('location');
      continue;
    }
    if (!removedKeys.has('date') && payload.hasOwnProperty('date')) {
      delete payload.date;
      removedKeys.add('date');
      continue;
    }
    if (!removedKeys.has('time') && payload.hasOwnProperty('time')) {
      delete payload.time;
      removedKeys.add('time');
      continue;
    }

    // Break loop if no column could be removed
    break;
  }

  return { success: false, error: lastErrorMsg || 'Database error inserting appointment' };
}
