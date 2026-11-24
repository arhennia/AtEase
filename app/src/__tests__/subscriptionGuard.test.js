import { describe, it, expect } from 'vitest';
import { withoutSubscriptionColumns, LOCKED_SUBSCRIPTION_COLUMNS } from '../lib/subscriptionGuard.js';

describe('subscriptionGuard', () => {
  it('locks subscription_status and trial_ends_at', () => {
    expect(LOCKED_SUBSCRIPTION_COLUMNS).toContain('subscription_status');
    expect(LOCKED_SUBSCRIPTION_COLUMNS).toContain('trial_ends_at');
  });

  it('strips locked columns from a patch', () => {
    const patch = {
      brand_name: 'New Name',
      subscription_status: 'active',
      trial_ends_at: '2030-01-01',
      description: 'Updated',
    };
    const result = withoutSubscriptionColumns(patch);
    expect(result.brand_name).toBe('New Name');
    expect(result.description).toBe('Updated');
    expect(result.subscription_status).toBeUndefined();
    expect(result.trial_ends_at).toBeUndefined();
  });

  it('does not modify the original object', () => {
    const patch = { brand_name: 'Test', subscription_status: 'trial' };
    const result = withoutSubscriptionColumns(patch);
    expect(patch.subscription_status).toBe('trial');
    expect(result.subscription_status).toBeUndefined();
  });

  it('handles null/undefined input', () => {
    expect(withoutSubscriptionColumns(null)).toEqual({});
    expect(withoutSubscriptionColumns(undefined)).toEqual({});
  });
});
