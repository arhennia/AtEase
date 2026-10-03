/** Role already stored on profiles. Callers cannot upgrade it. */
export function resolveStoredRole(existingRole) {
  return existingRole === 'brand_owner' ? 'brand_owner' : 'client';
}

/** Post-login path. Owner-only routes are refused unless the stored role is brand_owner. */
export function safePostAuthPath(profileRole, requestedPath) {
  const raw = typeof requestedPath === 'string' ? requestedPath : '';
  const internal = raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\');
  if (profileRole === 'brand_owner') {
    return internal ? raw : '/dashboard';
  }
  if (!internal) return '/';
  if (
    raw === '/dashboard' ||
    raw.startsWith('/dashboard/') ||
    raw === '/onboarding' ||
    raw.startsWith('/onboarding/')
  ) {
    return '/';
  }
  return raw;
}
