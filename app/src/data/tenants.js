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
