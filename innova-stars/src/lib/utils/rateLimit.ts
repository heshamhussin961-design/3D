/**
 * Tiny in-memory token-bucket rate limiter for API routes.
 *
 * Good enough for a single-instance deployment. For multi-instance
 * (Vercel serverless, multiple regions) swap the `Map` for Redis
 * (Upstash) so the bucket is shared.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimitOptions {
  /** How many requests allowed in the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

const buckets = new Map<string, Bucket>();

// Clean up old buckets occasionally so this Map doesn't grow forever.
let lastSweep = 0;
function maybeSweep(now: number, windowMs: number): void {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  buckets.forEach((b, key) => {
    if (now - b.lastRefill > windowMs * 5) buckets.delete(key);
  });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  maybeSweep(now, windowMs);

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(key, bucket);
  }

  // Refill tokens proportional to time elapsed.
  const elapsed = now - bucket.lastRefill;
  const refill = (elapsed / windowMs) * limit;
  bucket.tokens = Math.min(limit, bucket.tokens + refill);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    const resetMs = Math.ceil(((1 - bucket.tokens) / limit) * windowMs);
    return { allowed: false, remaining: 0, resetMs };
  }

  bucket.tokens -= 1;
  return {
    allowed: true,
    remaining: Math.floor(bucket.tokens),
    resetMs: 0,
  };
}

/** Best-effort client IP from common proxy headers. Falls back to a stub. */
export function clientKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'anonymous';
}
