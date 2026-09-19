export type SiteService = {
  id: string;
  name: string;
  price?: string;
  description?: string;
};

export type SiteAbout = {
  ownerName: string;
  ownerPhotoUrl: string;
  experience: string;
  bio: string;
  location: string;
};

export type SiteConfig = {
  slug: string;
  businessName: string;
  subtitle: string;
  services: SiteService[];
  contactPhone: string;
  whatsappMessage: string;
  galleryUrls: string[];
  bannerUrl: string;
  about: SiteAbout;
  published: boolean;
  publishedAt?: string | null;
};

export type SiteConfigDraft = Omit<SiteConfig, 'published' | 'publishedAt'> & {
  published?: boolean;
  publishedAt?: string | null;
};

export const PUBLIC_SITE_PREFIX = '/s';

export function publicSitePath(slug: string): string {
  const clean = String(slug || '').replace(/^\/+|\/+$/g, '');
  return `${PUBLIC_SITE_PREFIX}/${clean}`;
}

export function publicSiteUrl(slug: string, origin?: string): string {
  const path = publicSitePath(slug);
  if (origin) return `${origin.replace(/\/$/, '')}${path}`;
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}

/** Digits only, India default. wa.me wants 9198… not +91. */
export function toWhatsAppDigits(raw: string, defaultCountry = '91'): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith(defaultCountry) && digits.length >= 12) return digits;
  if (digits.length === 10) return `${defaultCountry}${digits}`;
  return digits;
}

export function isValidWhatsAppNumber(raw: string): boolean {
  const digits = toWhatsAppDigits(raw);
  return digits.length >= 11 && digits.length <= 15;
}

export function buildWhatsAppActionUrl(phone: string, message: string): string | null {
  const phoneNumber = toWhatsAppDigits(phone);
  if (!isValidWhatsAppNumber(phoneNumber)) return null;
  const customMessage = String(message || '').trim() || 'Hi, I would like to book.';
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;
}

export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(String(text || '').trim())}`;
}

export function emptyAbout(): SiteAbout {
  return {
    ownerName: '',
    ownerPhotoUrl: '',
    experience: '',
    bio: '',
    location: '',
  };
}

export function emptySiteConfig(slug = ''): SiteConfig {
  return {
    slug,
    businessName: '',
    subtitle: '',
    services: [],
    contactPhone: '',
    whatsappMessage: '',
    galleryUrls: [],
    bannerUrl: '',
    about: emptyAbout(),
    published: false,
    publishedAt: null,
  };
}

export function newServiceRow(partial: Partial<SiteService> = {}): SiteService {
  return {
    id: partial.id || `svc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: partial.name || '',
    price: partial.price || '',
    description: partial.description || '',
  };
}

type PartnerLike = {
  slug?: string;
  brandName?: string;
  ownerName?: string;
  professionalTitle?: string;
  description?: string;
  location?: string;
  whatsappNumber?: string;
  ownerPhone?: string;
  coverUrl?: string;
  logoUrl?: string;
  catalog?: Array<{
    services?: Array<{
      id?: string;
      name?: string;
      price?: number;
      uptoPrice?: number;
      inSalonPrice?: number;
      description?: string;
      imageUrl?: string;
    }>;
  }>;
  siteConfig?: SiteConfig | null;
};

function normalizeAbout(raw?: Partial<SiteAbout> | null, partner?: PartnerLike | null): SiteAbout {
  const base = emptyAbout();
  return {
    ownerName: String(raw?.ownerName || partner?.ownerName || partner?.brandName || '').trim(),
    ownerPhotoUrl: String(raw?.ownerPhotoUrl || partner?.logoUrl || '').trim(),
    experience: String(raw?.experience || partner?.professionalTitle || '').trim(),
    bio: String(raw?.bio || partner?.description || '').trim(),
    location: String(raw?.location || partner?.location || '').trim(),
  };
}

export function draftFromPartner(partner?: PartnerLike | null): SiteConfig {
  if (!partner) return emptySiteConfig();
  if (partner.siteConfig?.businessName) {
    return normalizeSiteConfig(partner.siteConfig, partner.slug, partner);
  }

  const catalogServices = (partner.catalog || [])
    .flatMap((cat) => cat.services || [])
    .slice(0, 8)
    .map((svc) =>
      newServiceRow({
        id: svc.id,
        name: svc.name || '',
        price:
          svc.price || svc.uptoPrice || svc.inSalonPrice
            ? `₹${Number(svc.price || svc.uptoPrice || svc.inSalonPrice).toLocaleString('en-IN')}`
            : '',
        description: svc.description || '',
      })
    );

  const galleryUrls = [
    partner.coverUrl,
    ...(partner.catalog || []).flatMap((cat) => (cat.services || []).map((s) => s.imageUrl)),
  ].filter((url, idx, arr): url is string => Boolean(url) && arr.indexOf(url) === idx);

  const name = partner.brandName || '';
  return {
    slug: partner.slug || '',
    businessName: name,
    subtitle: partner.professionalTitle || partner.description || '',
    services: catalogServices,
    contactPhone: partner.whatsappNumber || partner.ownerPhone || '',
    whatsappMessage: name ? `Hi ${name}, I would like to book an appointment.` : 'Hi, I would like to book an appointment.',
    galleryUrls: galleryUrls.slice(0, 6),
    bannerUrl: partner.coverUrl || galleryUrls[0] || '',
    about: normalizeAbout(null, partner),
    published: false,
    publishedAt: null,
  };
}

/** Alias used by the public studio menu. */
export function buildSiteConfigFromPartner(partner?: PartnerLike | null): SiteConfig {
  return draftFromPartner(partner);
}

export function normalizeSiteConfig(
  raw?: Partial<SiteConfig> | null,
  fallbackSlug = '',
  partner?: PartnerLike | null
): SiteConfig {
  const base = emptySiteConfig(fallbackSlug);
  if (!raw || typeof raw !== 'object') return base;

  const services = Array.isArray(raw.services)
    ? raw.services
        .map((svc) =>
          newServiceRow({
            id: svc?.id,
            name: String(svc?.name || '').trim(),
            price: String(svc?.price || '').trim(),
            description: String(svc?.description || '').trim(),
          })
        )
        .filter((svc) => svc.name)
    : [];

  const galleryUrls = Array.isArray(raw.galleryUrls)
    ? raw.galleryUrls.map((url) => String(url || '').trim()).filter(Boolean)
    : [];

  return {
    slug: String(raw.slug || fallbackSlug || '').trim(),
    businessName: String(raw.businessName || partner?.brandName || '').trim(),
    subtitle: String(raw.subtitle || partner?.professionalTitle || '').trim(),
    services,
    contactPhone: String(raw.contactPhone || partner?.whatsappNumber || partner?.ownerPhone || '').replace(/\D/g, ''),
    whatsappMessage: String(raw.whatsappMessage || '').trim(),
    galleryUrls,
    bannerUrl: String(raw.bannerUrl || galleryUrls[0] || partner?.coverUrl || '').trim(),
    about: normalizeAbout(raw.about, partner),
    published: Boolean(raw.published),
    publishedAt: raw.publishedAt || null,
  };
}

export function parseGalleryInput(value: string): string[] {
  return String(value || '')
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

export function siteConfigIsReady(config: SiteConfigDraft): { ok: boolean; error?: string } {
  if (!String(config.businessName || '').trim()) {
    return { ok: false, error: 'Add a business name.' };
  }
  if (!isValidWhatsAppNumber(config.contactPhone || '')) {
    return { ok: false, error: 'Enter a valid WhatsApp number (10 digits).' };
  }
  if (!String(config.whatsappMessage || '').trim()) {
    return { ok: false, error: 'Add a WhatsApp message for the booking button.' };
  }
  return { ok: true };
}
