import { NextResponse } from 'next/server';

import { clientKey, rateLimit } from '@/lib/utils/rateLimit';

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  budget: string;
  message: string;
  /** Honeypot — must be empty. Bots fill every field they see. */
  website?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = 5_000;

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name?.trim()) return 'Name is required.';
  if (!body.email?.trim() || !EMAIL_RE.test(body.email))
    return 'Valid email is required.';
  if (!body.budget?.trim()) return 'Budget is required.';
  if (!body.message?.trim()) return 'Message is required.';
  if (
    (body.name?.length ?? 0) > MAX_FIELD_LEN ||
    (body.email?.length ?? 0) > MAX_FIELD_LEN ||
    (body.message?.length ?? 0) > MAX_FIELD_LEN
  )
    return 'Field too long.';
  return null;
}

/**
 * POST /api/contact
 *
 * Validates, rate-limits, honeypot-checks, and (optionally) emails the
 * payload via Resend if `RESEND_API_KEY` is set.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Rate limit: 5 submissions per 10 minutes per IP.
  const rl = rateLimit(`contact:${clientKey(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rl.resetMs / 1000)),
        },
      },
    );
  }

  let body: Partial<ContactPayload>;
  try {
    body = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  // Honeypot — silently accept then drop. Returns 200 so bots can't tell.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const error = validate(body);
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 422 });
  }

  // If Resend is configured, send a transactional email. Otherwise log.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? 'info@innova-stars.ae';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'site@innova-stars.ae';

  if (apiKey) {
    try {
      // Internal notification to the team.
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          subject: `New mission from ${body.name}`,
          reply_to: body.email,
          text: [
            `Name: ${body.name}`,
            `Email: ${body.email}`,
            `Company: ${body.company ?? '—'}`,
            `Budget: ${body.budget}`,
            '',
            body.message,
          ].join('\n'),
        }),
      });
      if (!adminRes.ok) {
        const errorText = await adminRes.text();
        // eslint-disable-next-line no-console
        console.error('[contact] Resend error', adminRes.status, errorText);
        return NextResponse.json(
          { ok: false, error: 'Failed to send. Please try again.' },
          { status: 502 },
        );
      }

      // Auto-reply to the sender. Best-effort — failures here don't block
      // the success response (the team already got their copy).
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: body.email,
            subject: `We received your message — Innova Stars`,
            text: [
              `Hi ${body.name?.split(' ')[0] ?? 'there'},`,
              '',
              "Thanks for reaching out to Innova Stars. We received your message and will respond within 24 hours.",
              '',
              'In the meantime, if your request is urgent you can WhatsApp us at +971 54 318 0337.',
              '',
              '— The Innova Stars team',
              'https://innova-stars.ae',
            ].join('\n'),
          }),
        });
      } catch {
        // Auto-reply failure is logged but not surfaced.
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[contact] Resend exception', e);
      return NextResponse.json(
        { ok: false, error: 'Failed to send. Please try again.' },
        { status: 502 },
      );
    }
  } else {
    // Dev fallback — log to server console.
    // eslint-disable-next-line no-console
    console.log('[contact] new submission (no RESEND_API_KEY set)', {
      name: body.name,
      email: body.email,
      company: body.company ?? '',
      budget: body.budget,
      message: body.message,
      receivedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
