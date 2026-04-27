import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter — store a newsletter subscriber.
 *
 * Logs the subscription server-side and returns success. To wire to a real
 * provider, replace the console.log with one of:
 *
 *   // Resend audience:
 *   //   const { Resend } = await import('resend');
 *   //   await new Resend(process.env.RESEND_API_KEY!).contacts.create({
 *   //     email, audienceId: process.env.RESEND_AUDIENCE_ID!,
 *   //   });
 *
 *   // Mailchimp:
 *   //   await fetch(`https://${region}.api.mailchimp.com/3.0/lists/${listId}/members`, {
 *   //     method: 'POST',
 *   //     headers: { Authorization: `Bearer ${process.env.MAILCHIMP_KEY}` },
 *   //     body: JSON.stringify({ email_address: email, status: 'subscribed' }),
 *   //   });
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email.' },
      { status: 422 },
    );
  }

  // eslint-disable-next-line no-console
  console.log('[newsletter] new subscriber', {
    email,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
