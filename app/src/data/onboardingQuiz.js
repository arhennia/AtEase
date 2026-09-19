export const CRAFTS = [
  { id: 'hair', label: 'Hair' },
  { id: 'skin', label: 'Skin & facials' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'nails', label: 'Nails' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'wellness', label: 'Massage & spa' },
];

export const VISIT_TYPES = [
  { id: 'studio', label: 'At my studio' },
  { id: 'home', label: 'I visit the client' },
  { id: 'both', label: 'Both' },
];

export const CITIES = [
  'Bhubaneswar',
  'Cuttack',
  'Pune',
  'Hyderabad',
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Kolkata',
];

export const PRICE_BANDS = [
  { value: 500, label: '₹500' },
  { value: 1000, label: '₹1,000' },
  { value: 2000, label: '₹2,000' },
  { value: 3500, label: '₹3,500' },
  { value: 5000, label: '₹5,000' },
];

export const SERVICE_PRESETS = {
  hair: [
    { name: 'Haircut & blow dry', duration: '45 mins' },
    { name: 'Hair spa', duration: '60 mins' },
    { name: 'Keratin / smoothening', duration: '120 mins' },
    { name: 'Global colour', duration: '90 mins' },
  ],
  skin: [
    { name: 'Cleanup', duration: '45 mins' },
    { name: 'Signature facial', duration: '60 mins' },
    { name: 'Brightening facial', duration: '75 mins' },
    { name: 'Hydra facial', duration: '60 mins' },
  ],
  makeup: [
    { name: 'Party makeup', duration: '60 mins' },
    { name: 'Engagement makeup', duration: '90 mins' },
    { name: 'Photoshoot makeup', duration: '75 mins' },
  ],
  nails: [
    { name: 'Manicure', duration: '45 mins' },
    { name: 'Pedicure', duration: '45 mins' },
    { name: 'Gel / extensions', duration: '75 mins' },
  ],
  bridal: [
    { name: 'Bridal trial', duration: '90 mins' },
    { name: 'Wedding day makeup', duration: '150 mins' },
    { name: 'Family makeup', duration: '60 mins' },
  ],
  wellness: [
    { name: 'Head & shoulder massage', duration: '30 mins' },
    { name: 'Body massage', duration: '60 mins' },
    { name: 'Aromatherapy', duration: '60 mins' },
  ],
};

export function presetsForCrafts(craftIds) {
  const ids = craftIds?.length ? craftIds : Object.keys(SERVICE_PRESETS);
  const seen = new Set();
  const list = [];
  for (const id of ids) {
    for (const item of SERVICE_PRESETS[id] || []) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);
      list.push({ ...item, category: id });
    }
  }
  return list;
}

export function serviceUptoPrice(service) {
  return Number(service?.price || service?.uptoPrice || service?.price_fixed || service?.inSalonPrice || service?.homePrice || 0);
}

export function formatUptoPrice(value) {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString('en-IN')}`;
}
