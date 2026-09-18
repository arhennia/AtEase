import { addDaysIso, TRIAL_DAYS } from '../lib/tenancy';
import { RAJKUMARI_PROVIDER_DATA } from './providerData';
import { MOCK_PROVIDERS } from './mockProviders';

function providerToTenant(provider, extras = {}) {
  return {
    id: `partner_${provider.slug}`,
    slug: provider.slug,
    brandName: provider.name,
    professionalTitle: provider.title,
    ownerEmail: extras.ownerEmail || `${provider.slug.split('-')[0]}@studio.demo`,
    ownerName: extras.ownerName || provider.name.split(' ')[0],
    logoUrl: provider.avatarUrl,
    coverUrl: provider.imageUrl,
    theme: { accent: '#111111', mode: 'light' },
    location: provider.location,
    description: provider.description,
    typeLabel: provider.typeLabel,
    rating: provider.rating,
    reviewCount: provider.reviewCount,
    coverageRadiusKm: provider.coverageRadiusKm,
    trialEndsAt: extras.trialEndsAt || addDaysIso(TRIAL_DAYS),
    subscriptionStatus: extras.subscriptionStatus || 'trial',
    whatsappNumber: extras.whatsappNumber || provider.whatsappNumber || '',
    catalog: extras.catalog || [],
  };
}

const rajkumari = MOCK_PROVIDERS.find((p) => p.slug === 'rajkumari-beauty');
const maison = MOCK_PROVIDERS.find((p) => p.slug === 'maison-curls');

/** Seeded tenants exist for isolation tests. They are never listed on the B2B homepage. */
export function createSeedPartners() {
  return [
    providerToTenant(rajkumari, {
      ownerEmail: 'aisha@rajkumari.studio',
      ownerName: 'Aisha',
      whatsappNumber: RAJKUMARI_PROVIDER_DATA.provider.whatsappNumber,
      catalog: RAJKUMARI_PROVIDER_DATA.serviceCategories,
    }),
    providerToTenant(maison, {
      ownerEmail: 'studio@maisoncurls.demo',
      ownerName: 'Maison',
      catalog: [
        {
          id: 'hair-atelier',
          categoryName: 'HAIR ATELIER',
          services: [
            {
              id: 'mc1',
              name: 'Signature Balayage',
              description: 'Dimensional color exclusive to Maison de Curls.',
              duration: '180 mins',
              inSalonPrice: 6500,
              homePrice: 7200,
            },
          ],
        },
      ],
    }),
  ];
}

export function tenantToStorefrontProfile(partner) {
  if (!partner) return null;
  return {
    id: partner.id,
    slug: partner.slug,
    name: partner.brandName,
    title: partner.professionalTitle,
    rating: partner.rating || '5.0',
    reviewCount: partner.reviewCount || '0',
    typeLabel: partner.typeLabel || 'Private Studio',
    location: partner.location || '',
    description: partner.description || '',
    imageUrl: partner.coverUrl || partner.logoUrl,
    avatarUrl: partner.logoUrl,
    coverageRadiusKm: partner.coverageRadiusKm || 10,
    partnerId: partner.id,
    salonId: partner.salonId || null,
    whatsappNumber: partner.whatsappNumber || partner.ownerPhone || '',
  };
}
