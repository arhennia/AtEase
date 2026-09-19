export function formatInr(value) {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function servicePrice(service) {
  return Number(service?.price || service?.uptoPrice || service?.inSalonPrice || service?.homePrice || 0);
}

export const CATEGORY_PRESENTATION = {
  packages: {
    shortName: 'Packages',
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=600',
    isPackageCategory: true,
  },
  'hair-care': {
    shortName: 'Hair atelier',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
  },
  'skincare-facials': {
    shortName: 'Skin & facials',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
  },
  'body-manicure-pedicure': {
    shortName: 'Hands & body',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600',
  },
  'waxing-threading': {
    shortName: 'Waxing & brows',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=600',
  },
  'wedding-bridal-makeup': {
    shortName: 'Bridal & glam',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
  },
};

export const SERVICE_BADGES = {
  s1: 'bestseller',
  s10: 'bestseller',
  s12: 'recommended',
  s19: 'recommended',
  s25: 'recommended',
  s28: 'bestseller',
};

export function decorateCatalog(catalog = []) {
  return (catalog || []).map((cat) => {
    const meta = CATEGORY_PRESENTATION[cat.id] || {};
    return {
      ...cat,
      shortName: meta.shortName || cat.shortName || (cat.categoryName || 'Menu').split('&')[0].trim(),
      imageUrl: cat.imageUrl || meta.imageUrl || cat.services?.[0]?.imageUrl || '',
      badge: cat.badge && String(cat.badge).toLowerCase() !== 'new' ? cat.badge : '',
      isPackageCategory: Boolean(cat.isPackageCategory || meta.isPackageCategory),
      services: (cat.services || []).map((svc) => ({
        ...svc,
        price: servicePrice(svc),
        badge: svc.badge || SERVICE_BADGES[svc.id] || '',
        highlights: Array.isArray(svc.highlights) && svc.highlights.length
          ? svc.highlights
          : [svc.description].filter(Boolean),
        detailImages: Array.isArray(svc.detailImages) && svc.detailImages.length
          ? svc.detailImages
          : [svc.imageUrl].filter(Boolean),
      })),
    };
  });
}

export function defaultPackages() {
  return [
    {
      id: 'pkg-atelier-day',
      categoryId: 'packages',
      name: 'Atelier day',
      description: 'A composed visit: hair spa, glow facial, and a spa pedicure — one appointment, one price.',
      duration: '3 hrs 15 mins',
      price: 4200,
      originalPrice: 4900,
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
      badge: 'package',
      isPackage: true,
      highlights: ['Fixed studio price', 'Best for a full reset before an event'],
      detailImages: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800'],
      packageItems: [
        'Hair: Custom spa & blow dry',
        'Skin: Organic glow facial',
        'Hands & feet: Luxury spa pedicure',
      ],
    },
    {
      id: 'pkg-monthly-vip',
      categoryId: 'packages',
      name: 'Monthly atelier membership',
      description: 'VIP clients keep a recurring slot on a chosen date each month.',
      duration: '2 hrs',
      price: 2800,
      imageUrl: 'https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=800',
      badge: 'package',
      isPackage: true,
      vipMonthly: true,
      vipDayOfMonth: 5,
      highlights: ['Same date every month', 'Confirm on WhatsApp before each visit'],
      detailImages: ['https://images.unsplash.com/photo-1512290900673-7002b5e28a42?auto=format&fit=crop&q=80&w=800'],
      packageItems: [
        'Cleanup & hydration facial',
        'Threading: brow & upper lip',
        'Manicure or pedicure',
      ],
    },
  ];
}

export function uniqueClients(appointments = []) {
  const map = new Map();
  appointments.forEach((appt) => {
    const phone = String(appt.clientPhone || '').replace(/\D/g, '').slice(-10);
    const key = phone || String(appt.clientName || '').trim().toLowerCase();
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: appt.clientName || 'Guest',
        phone: appt.clientPhone || '',
        bookings: 0,
        spent: 0,
        lastService: '',
        lastDate: '',
      });
    }
    const row = map.get(key);
    row.bookings += 1;
    row.spent += Number(appt.amount) || 0;
    row.lastService = appt.serviceName || row.lastService;
    row.lastDate = appt.date || row.lastDate;
    if (appt.clientName) row.name = appt.clientName;
  });
  return Array.from(map.values()).sort((a, b) => b.bookings - a.bookings);
}

export function nextVipDate(dayOfMonth) {
  const day = Math.min(28, Math.max(1, Number(dayOfMonth) || 1));
  const now = new Date();
  const candidate = new Date(now.getFullYear(), now.getMonth(), day);
  if (candidate < now) candidate.setMonth(candidate.getMonth() + 1);
  return candidate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function averageRating(reviews = []) {
  if (!reviews.length) return null;
  const sum = reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0);
  return (sum / reviews.length).toFixed(2);
}

export function reviewsForService(reviews, partnerId, serviceId) {
  return (reviews || []).filter(
    (review) => review.partnerId === partnerId && (!serviceId || review.serviceId === serviceId)
  );
}

export function hasBookedService(appointments, partnerId, serviceName, phone) {
  const digits = String(phone || '').replace(/\D/g, '').slice(-10);
  if (!digits) return false;
  const needle = String(serviceName || '').toLowerCase();
  return (appointments || []).some((appt) => {
    if (appt.partnerId !== partnerId) return false;
    const apptPhone = String(appt.clientPhone || '').replace(/\D/g, '').slice(-10);
    if (apptPhone !== digits) return false;
    if (!needle) return true;
    return String(appt.serviceName || '').toLowerCase().includes(needle.split(' ')[0]);
  });
}
