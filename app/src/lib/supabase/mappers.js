export function mapBrandOwnerFromDb(row, services = [], salon = null) {
  if (!row) return null;

  const categoryMap = {};
  for (const s of services) {
    const cat = s.category_name || 'FEATURED SERVICES';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push({
      id: s.id,
      name: s.title,
      description: s.description || '',
      duration: s.duration || `${s.duration_mins || 60} mins`,
      inSalonPrice: Number(s.price_salon || s.price_fixed || 0),
      homePrice: Number(s.price_home || s.price_fixed || 0),
      uptoPrice: Number(s.price_fixed || s.price_home || s.price_salon || 0),
      imageUrl: s.image_url || '',
      pricingModel: s.pricing_model || s.price_model || 'starting_at',
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
    location: row.location || salon?.city || salon?.address || '',
    theme: row.theme || { accent: '#111111', mode: 'light' },
    typeLabel: row.type_label || 'Private Brand Site',
    rating: '—',
    reviewCount: '0',
    coverageRadiusKm: row.coverage_radius_km || salon?.coverage_radius_km || 10,
    trialEndsAt: row.trial_ends_at,
    subscriptionStatus: row.subscription_status || 'trial',
    salonId: salon?.id || null,
    catalog,
  };
}

export function normalizeAppointment(record) {
  if (!record) return null;

  const serviceName = record.service_name || record.service_title || 'Booked service';
  const amount = Number(record.amount || record.service_price || record.price || 0);
  let dateStr = record.slot_date || record.date || record.booking_date;
  let timeStr = record.slot_time || record.time || record.appointment_time;

  if (record.booking_time) {
    const d = new Date(record.booking_time);
    if (!Number.isNaN(d.getTime())) {
      if (!dateStr) {
        dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (!timeStr) {
        timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    }
  }

  return {
    id: record.booking_ref || record.id,
    partnerId: record.owner_id,
    ownerId: record.owner_id,
    salonId: record.salon_id,
    clientId: record.client_id,
    clientUserId: record.client_user_id,
    clientName: record.client_name || 'Guest',
    clientPhone: record.client_phone || '',
    serviceName,
    serviceId: record.service_id || null,
    date: dateStr || 'Today',
    time: timeStr || '',
    location: record.location || '',
    status: record.status || 'pending',
    amount,
    bookingSource: record.booking_source || 'storefront',
    createdAt: record.created_at || new Date().toISOString(),
  };
}
