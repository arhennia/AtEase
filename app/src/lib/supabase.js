import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase env vars missing! Check your .env.local file.');
}

// The single Supabase client — import this wherever you need DB/auth access
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Provider Auth & Database operations
 */

export async function signUpProvider({ email, password, ownerName }) {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured' };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        owner_name: ownerName,
      },
    },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, user: data.user, session: data.session };
}

export async function signInProvider({ email, password }) {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured' };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, user: data.user, session: data.session };
}

export async function signOutProvider() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function fetchBrandOwnerByUserId(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('brand_owners')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.error('Error fetching brand owner by user_id:', error);
    return null;
  }
  return data;
}

export async function fetchBrandOwnerBySlug(slug) {
  if (!isSupabaseConfigured || !slug) return null;
  const { data, error } = await supabase
    .from('brand_owners')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) {
    console.error('Error fetching brand owner by slug:', error);
    return null;
  }
  return data;
}

export async function fetchServicesByOwnerId(ownerId) {
  if (!isSupabaseConfigured || !ownerId) return [];
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching services by ownerId:', error);
    return [];
  }
  return data || [];
}

export async function createBrandOwnerRecord(payload) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('brand_owners')
    .insert([payload])
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function createServicesRecords(servicesList) {
  if (!isSupabaseConfigured || !servicesList?.length) return { ok: true, data: [] };
  const { data, error } = await supabase
    .from('services')
    .insert(servicesList)
    .select();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export function mapBrandOwnerFromDb(row, services = []) {
  if (!row) return null;

  const categoryMap = {};
  for (const s of services) {
    const cat = s.category_name || 'FEATURED SERVICES';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push({
      id: s.id,
      name: s.title,
      description: s.description || '',
      duration: s.duration || '60 mins',
      inSalonPrice: Number(s.price_salon || s.price_fixed || 1200),
      homePrice: Number(s.price_home || s.price_fixed || 1500),
      imageUrl: s.image_url || '',
    });
  }

  const catalog = Object.keys(categoryMap).map((catName, idx) => ({
    id: `cat-${idx}`,
    categoryName: catName,
    services: categoryMap[catName],
  }));

  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    brandName: row.brand_name,
    ownerName: row.owner_name,
    ownerEmail: row.owner_email,
    ownerPhone: row.owner_phone || '',
    whatsappNumber: row.whatsapp_number || '',
    professionalTitle: row.professional_title || 'Independent Studio',
    description: row.description || '',
    logoUrl: row.logo_url || '',
    coverUrl: row.cover_url || '',
    location: row.location || '',
    theme: row.theme || { accent: '#111111', mode: 'light' },
    typeLabel: row.type_label || 'Private Brand Site',
    rating: '5.0',
    reviewCount: '1',
    coverageRadiusKm: row.coverage_radius_km || 10,
    trialEndsAt: row.trial_ends_at,
    subscriptionStatus: row.subscription_status || 'trial',
    catalog: catalog.length
      ? catalog
      : [
          {
            id: 'featured',
            categoryName: 'FEATURED SERVICES',
            services: [
              {
                id: `srv-${row.id}-1`,
                name: 'Signature Consultation',
                description: 'Custom personal styling consultation and service.',
                duration: '45 mins',
                inSalonPrice: 1000,
                homePrice: 1300,
              },
            ],
          },
        ],
  };
}

/**
 * Normalizes an appointment record from DB into a standard object format
 */
export function normalizeAppointment(record) {
  if (!record) return null;

  let serviceName = record.service_name || record.service_title || record.service;
  let amount = record.amount || record.price || record.total_price;

  if (record.service_id && RAJKUMARI_PROVIDER_DATA?.serviceCategories) {
    const allServices = RAJKUMARI_PROVIDER_DATA.serviceCategories.flatMap(c => c.services || []);
    const foundService = allServices.find(s => s.id === record.service_id);
    if (foundService) {
      if (!serviceName) serviceName = foundService.name;
      if (!amount) amount = foundService.homePrice || foundService.inSalonPrice;
    }
  }

  if (!serviceName) serviceName = 'Hair Spa & Scalp Massage';
  if (!amount) amount = 1350;

  let dateStr = record.date || record.booking_date;
  let timeStr = record.time || record.appointment_time;

  if (record.booking_time) {
    const bt = String(record.booking_time).trim();
    const d = new Date(bt);
    if (!isNaN(d.getTime())) {
      if (!dateStr) {
        dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (!timeStr) {
        timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    } else if (bt.includes(' ')) {
      const parts = bt.split(' ');
      if (!dateStr) dateStr = parts[0];
      if (!timeStr && parts.length > 1) timeStr = parts.slice(1).join(' ');
    }
  }

  if (!dateStr) dateStr = 'Today';
  if (!timeStr) timeStr = '11:30 AM';

  return {
    id: record.id || `app-${Math.random().toString(36).substr(2, 9)}`,
    clientName: record.client_name || record.customer_name || record.name || record.client || 'Guest Client',
    clientPhone: record.client_phone || record.customer_phone || record.phone || '+91 98765 43210',
    serviceName: serviceName,
    serviceId: record.service_id || null,
    date: dateStr,
    time: timeStr,
    bookingTime: record.booking_time || `${dateStr} ${timeStr}`.trim(),
    location: record.location || record.address || record.service_location || 'Plot No. 42, Unit-III, Bhubaneswar, Odisha',
    status: record.status || 'confirmed',
    amount: Number(amount),
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
    service_id: bookingData.serviceId || bookingData.service_id || null,
    service_name: bookingData.serviceName || 'Hair Spa & Scalp Massage',
    date: bookingData.date || 'Oct 24, 2023',
    time: bookingData.time || '11:30 AM',
    booking_time: bookingData.bookingTime || `${bookingData.date || 'Oct 24, 2023'} ${bookingData.time || '11:30 AM'}`,
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
