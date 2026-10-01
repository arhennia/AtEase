const FIXTURE_SLUGS = new Set(['rajkumari-beauty', 'maison-curls']);
const FIXTURE_IDS = new Set(['partner_rajkumari-beauty', 'partner_maison-curls']);

/** True only for the old demo studios. Real onboarded studios are never in this set. */
export function isSeedFixture(record) {
  if (!record) return false;
  return FIXTURE_SLUGS.has(record.slug) || FIXTURE_IDS.has(record.id) || FIXTURE_IDS.has(record.partnerId);
}

/**
 * Opt-in local fixtures. Off in production, and off in dev unless
 * VITE_USE_LOCAL_FIXTURES=true. Supabase data still wins when it is configured.
 */
export function localSeedFixturesEnabled() {
  return import.meta.env.DEV === true && import.meta.env.VITE_USE_LOCAL_FIXTURES === 'true';
}
