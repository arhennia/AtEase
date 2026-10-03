/** Display copy for the plans seeded in supabase/migrations/009_subscriptions.sql. */

export const PLAN_CATALOG = [
  {
    id: 'trial',
    eyebrow: 'Trial',
    name: '14 days free',
    priceInr: 0,
    price: '₹0',
    cadence: 'for 14 days',
    billingInterval: 'trial',
    description: 'Full access to your booking page and dashboard. No card required.',
    features: ['Your branded booking page', 'Dashboard & scheduling', 'Client records', 'No card required'],
    cta: 'Start free',
    tone: 'muted',
    featured: false,
    href: '/signup',
  },
  {
    id: 'self_managed',
    eyebrow: 'Self-Managed',
    name: 'Run it yourself',
    priceInr: 549,
    price: '₹549',
    cadence: '/ month',
    billingInterval: 'month',
    description: 'For professionals who want to manage and run every dashboard feature on their own.',
    features: ['Everything in the trial', 'Unlimited bookings', 'Offers & client follow-ups', 'You run the dashboard'],
    cta: 'Get Self-Managed',
    tone: 'muted',
    featured: false,
    href: '/signup',
  },
  {
    id: 'managed',
    eyebrow: 'Managed & Boosted',
    name: 'We run it with you',
    priceInr: 999,
    price: '₹999',
    cadence: '/ month',
    billingInterval: 'month',
    description: 'For professionals who want us to fully manage, support, and boost their business.',
    features: ['Everything in Self-Managed', 'We handle the dashboard', 'Support when you need it', 'Marketing boost'],
    cta: 'Talk to us',
    tone: 'purple',
    featured: true,
    href: '/signup',
  },
];

export function formatPlanPrice(priceInr) {
  const amount = Number(priceInr);
  if (!Number.isFinite(amount)) return '₹0';
  return `₹${amount}`;
}

export function presentPlans(rows) {
  const byId = new Map((rows || []).map((row) => [row.id, row]));
  return PLAN_CATALOG.map((plan) => {
    const row = byId.get(plan.id);
    if (!row) return plan;
    const features = Array.isArray(row.features) && row.features.length ? row.features : plan.features;
    const priceInr = Number(row.price_inr);
    return {
      ...plan,
      name: row.name || plan.name,
      priceInr: Number.isFinite(priceInr) ? priceInr : plan.priceInr,
      price: Number.isFinite(priceInr) ? formatPlanPrice(priceInr) : plan.price,
      description: row.description || plan.description,
      features,
    };
  });
}

export function paidPlans() {
  return PLAN_CATALOG.filter((plan) => plan.priceInr > 0);
}
