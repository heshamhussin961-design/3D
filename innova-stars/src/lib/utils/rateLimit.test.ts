import { describe, expect, it, vi } from 'vitest';

import { rateLimit } from './rateLimit';

describe('rateLimit', () => {
  it('allows requests up to the limit', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      const r = rateLimit(key, { limit: 3, windowMs: 60_000 });
      expect(r.allowed).toBe(true);
    }
  });

  it('rejects the next request after the limit', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, { limit: 3, windowMs: 60_000 });
    }
    const r = rateLimit(key, { limit: 3, windowMs: 60_000 });
    expect(r.allowed).toBe(false);
    expect(r.resetMs).toBeGreaterThan(0);
  });

  it('refills tokens over time', () => {
    const key = `test-${Math.random()}`;
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    for (let i = 0; i < 3; i++) {
      rateLimit(key, { limit: 3, windowMs: 60_000 });
    }
    vi.setSystemTime(now + 30_000);
    const r = rateLimit(key, { limit: 3, windowMs: 60_000 });
    expect(r.allowed).toBe(true);
    vi.useRealTimers();
  });
});
