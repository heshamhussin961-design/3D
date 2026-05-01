import { NextResponse } from 'next/server';

import { clientKey, rateLimit } from '@/lib/utils/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterPayload {
  email?: string;
  /** Honeypot — must be empty. */
  website?: string;
}

/**
 * POST /api/newsletter — store a newsletter subscriber.
 *
 * If `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` are set, the contact is
 * added to the Resend audience. Otherwise logs to server console.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const rl = rateLimit(`newsletter:${clientKey(request)}`, {
    limit: 3,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: NewsletterPayload;
  try {
    body = (await request.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  // Honeypot.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim() ?? '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email.' },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (apiKey && audienceId) {
    try {
      const res = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        },
      );
      if (!res.ok && res.status !== 409) {
        // 409 = already subscribed, treat as success.
        // eslint-disable-next-line no-console
        console.error('[newsletter] Resend error', res.status);
        return NextResponse.json(
          { ok: false, error: 'Failed to subscribe. Try again later.' },
          { status: 502 },
        );
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[newsletter] Resend exception', e);
      return NextResponse.json(
        { ok: false, error: 'Failed to subscribe. Try again later.' },
        { status: 502 },
      );
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(
      '[newsletter] new subscriber (no RESEND_API_KEY/AUDIENCE_ID set)',
      { email, receivedAt: new Date().toISOString() },
    );
  }

  return NextResponse.json({ ok: true });
}
