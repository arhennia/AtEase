import { describe, it, expect } from 'vitest';
import { resolveStoredRole, safePostAuthPath } from '../lib/authRole.js';

describe('resolveStoredRole', () => {
  it('returns brand_owner when stored role is brand_owner', () => {
    expect(resolveStoredRole('brand_owner')).toBe('brand_owner');
  });

  it('returns client for any other value', () => {
    expect(resolveStoredRole('client')).toBe('client');
    expect(resolveStoredRole(null)).toBe('client');
    expect(resolveStoredRole(undefined)).toBe('client');
    expect(resolveStoredRole('')).toBe('client');
    expect(resolveStoredRole('admin')).toBe('client');
  });
});

describe('safePostAuthPath', () => {
  it('allows brand_owner to access any internal path', () => {
    expect(safePostAuthPath('brand_owner', '/dashboard')).toBe('/dashboard');
    expect(safePostAuthPath('brand_owner', '/onboarding')).toBe('/onboarding');
    expect(safePostAuthPath('brand_owner', '/p/my-studio')).toBe('/p/my-studio');
  });

  it('redirects brand_owner to /dashboard for external paths', () => {
    expect(safePostAuthPath('brand_owner', 'https://evil.com')).toBe('/dashboard');
    expect(safePostAuthPath('brand_owner', '//evil.com')).toBe('/dashboard');
    expect(safePostAuthPath('brand_owner', '/\\evil.com')).toBe('/dashboard');
  });

  it('allows client to access non-dashboard internal paths', () => {
    expect(safePostAuthPath('client', '/')).toBe('/');
    expect(safePostAuthPath('client', '/p/my-studio')).toBe('/p/my-studio');
    expect(safePostAuthPath('client', '/privacy')).toBe('/privacy');
  });

  it('redirects client away from dashboard routes', () => {
    expect(safePostAuthPath('client', '/dashboard')).toBe('/');
    expect(safePostAuthPath('client', '/dashboard/settings')).toBe('/');
    expect(safePostAuthPath('client', '/onboarding')).toBe('/');
  });

  it('redirects client away from external paths', () => {
    expect(safePostAuthPath('client', 'https://evil.com')).toBe('/');
    expect(safePostAuthPath('client', '//evil.com')).toBe('/');
  });

  it('handles empty or non-string requestedPath', () => {
    expect(safePostAuthPath('brand_owner', '')).toBe('/dashboard');
    expect(safePostAuthPath('brand_owner', null)).toBe('/dashboard');
    expect(safePostAuthPath('client', '')).toBe('/');
    expect(safePostAuthPath('client', null)).toBe('/');
  });
});
