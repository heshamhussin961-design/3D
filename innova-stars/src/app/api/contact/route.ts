import { NextResponse } from 'next/server';

import { clientKey, rateLimit } from '@/lib/utils/rateLimit';

interface ContactPayload {
  name: string;
  phone: string;
  message: string;
  /** Honeypot — must be empty. Bots fill every field they see. */
  website?: string;
}

const PHONE_DIGITS_RE = /\d/g;
const MAX_FIELD_LEN = 5_000;

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name?.trim()) return 'Name is required.';
  if (!body.phone?.trim()) return 'Phone number is required.';
  const digits = body.phone.match(PHONE_DIGITS_RE)?.length ?? 0;
  if (digits < 7 || digits > 18) return 'Valid phone number is required.';
  if (!body.message?.trim()) return 'Message is required.';
  if (
    (body.name?.length ?? 0) > MAX_FIELD_LEN ||
    (body.phone?.length ?? 0) > MAX_FIELD_LEN ||
    (body.message?.length ?? 0) > MAX_FIELD_LEN
  )
    return 'Field too long.';
  return null;
}

/**
 * POST /api/contact
 *
 * Validates, rate-limits, honeypot-checks, and (optionally) emails the
 * payload via Resend if `RESEND_API_KEY` is set. Auto-reply is omitted
 * because the form only collects a phone number — the team will follow up
 * via WhatsApp / call.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const rl = rateLimit(`contact:${clientKey(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) },
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

  // Honeypot — silently accept then drop.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const error = validate(body);
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? 'info@innova-stars.ae';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'site@innova-stars.ae';

  if (apiKey) {
    try {
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
          text: [
            `Name: ${body.name}`,
            `Phone: ${body.phone}`,
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[contact] Resend exception', e);
      return NextResponse.json(
        { ok: false, error: 'Failed to send. Please try again.' },
        { status: 502 },
      );
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('[contact] new submission (no RESEND_API_KEY set)', {
      name: body.name,
      phone: body.phone,
      message: body.message,
      receivedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
