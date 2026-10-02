export function mapPackageFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    categoryId: 'packages',
    name: row.name || '',
    description: row.description || '',
    duration: row.duration || '',
    price: Number(row.price) || 0,
    originalPrice: row.original_price == null ? '' : Number(row.original_price),
    discountPercent: row.discount_percent == null ? '' : Number(row.discount_percent),
    imageUrl: row.image_url || '',
    badge: 'package',
    isPackage: true,
    isActive: row.is_active !== false,
    vipMonthly: Boolean(row.vip_monthly),
    vipDayOfMonth: row.vip_day_of_month || 5,
    packageItems: Array.isArray(row.included_items) ? row.included_items.filter(Boolean) : [],
  };
}

export function validatePackage(input) {
  const name = String(input?.name || '').trim();
  if (!name) return { ok: false, error: 'Enter a package name.' };

  const price = Number(input?.price);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: 'Enter a price of 0 or more.' };
  }

  let originalPrice = input?.originalPrice;
  if (originalPrice === '' || originalPrice == null) originalPrice = null;
  else {
    originalPrice = Number(originalPrice);
    if (!Number.isFinite(originalPrice) || originalPrice < 0) {
      return { ok: false, error: 'Enter a valid original price.' };
    }
  }

  let discountPercent = input?.discountPercent;
  if (discountPercent === '' || discountPercent == null) discountPercent = null;
  else {
    discountPercent = Number(discountPercent);
    if (!Number.isInteger(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      return { ok: false, error: 'Discount must be a whole number from 0 to 100.' };
    }
  }

  const vipMonthly = Boolean(input?.vipMonthly);
  let vipDayOfMonth = null;
  if (vipMonthly) {
    vipDayOfMonth = Number(input?.vipDayOfMonth || 5);
    if (!Number.isInteger(vipDayOfMonth) || vipDayOfMonth < 1 || vipDayOfMonth > 28) {
      return { ok: false, error: 'Pick a day of the month from 1 to 28.' };
    }
  }

  const packageItems = (Array.isArray(input?.packageItems) ? input.packageItems : [])
    .map((line) => String(line || '').trim())
    .filter(Boolean);

  return {
    ok: true,
    package: {
      name,
      description: String(input?.description || '').trim(),
      price,
      originalPrice,
      discountPercent,
      duration: String(input?.duration || '').trim(),
      imageUrl: String(input?.imageUrl || '').trim(),
      packageItems,
      vipMonthly,
      vipDayOfMonth,
      isActive: input?.isActive !== false,
    },
  };
}

export function packageToDb(pkg) {
  return {
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    original_price: pkg.originalPrice,
    discount_percent: pkg.discountPercent,
    duration: pkg.duration,
    image_url: pkg.imageUrl,
    included_items: pkg.packageItems,
    vip_monthly: pkg.vipMonthly,
    vip_day_of_month: pkg.vipDayOfMonth,
    is_active: pkg.isActive,
  };
}
