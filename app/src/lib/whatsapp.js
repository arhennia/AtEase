/** Digits only, with India country code. wa.me wants 9198… not +91. */
export function toWhatsAppDigits(raw, defaultCountry = '91') {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith(defaultCountry) && digits.length >= 12) return digits;
  if (digits.length === 10) return `${defaultCountry}${digits}`;
  return digits;
}

export function toNationalDigits(raw, defaultCountry = '91') {
  const digits = toWhatsAppDigits(raw, defaultCountry);
  if (digits.startsWith(defaultCountry) && digits.length >= 12) {
    return digits.slice(defaultCountry.length);
  }
  return digits.slice(-10);
}

export function isValidWhatsAppNumber(raw) {
  const digits = toWhatsAppDigits(raw);
  return digits.length >= 11 && digits.length <= 15;
}

export function formatBookingWhatsAppMessage({
  clientName,
  services,
  date,
  time,
  total,
  studioName,
}) {
  const serviceLine = Array.isArray(services)
    ? services.filter(Boolean).join(', ')
    : services || 'Service';
  const amount = Number(total);
  const priceLine = Number.isFinite(amount) && amount > 0
    ? `Total: ₹${amount.toLocaleString('en-IN')}`
    : null;

  return [
    `Hi${studioName ? ` ${studioName}` : ''}, I would like to book:`,
    '',
    `Name: ${clientName || 'Guest'}`,
    `Service: ${serviceLine}`,
    `Date: ${date || 'TBD'}`,
    `Time: ${time || 'TBD'}`,
    priceLine,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export function buildWhatsAppBookingUrl({ phone, ...details }) {
  const digits = toWhatsAppDigits(phone);
  if (!isValidWhatsAppNumber(digits)) return null;
  const text = formatBookingWhatsAppMessage(details);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(url) {
  if (!url || typeof window === 'undefined') return false;
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (!opened) {
    window.location.href = url;
  }
  return true;
}
