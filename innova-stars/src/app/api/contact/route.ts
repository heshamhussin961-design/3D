import { NextResponse } from 'next/server';

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  budget: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name?.trim()) return 'Name is required.';
  if (!body.email?.trim() || !EMAIL_RE.test(body.email))
    return 'Valid email is required.';
  if (!body.budget?.trim()) return 'Budget is required.';
  if (!body.message?.trim()) return 'Message is required.';
  return null;
}

/**
 * POST /api/contact
 *
 * Validates the contact form payload and returns success.
 *
 * To wire to a real provider, drop the call in below:
 *
 *   // Resend (preferred for transactional):
 *   //   const { Resend } = await import('resend');
 *   //   const resend = new Resend(process.env.RESEND_API_KEY!);
 *   //   await resend.emails.send({
 *   //     from: 'site@innovastars.ae',
 *   //     to: 'hello@innovastars.ae',
 *   //     subject: `New mission from ${payload.name}`,
 *   //     text: JSON.stringify(payload, null, 2),
 *   //   });
 *
 *   // Formspree:
 *   //   await fetch(process.env.FORMSPREE_ENDPOINT!, {
 *   //     method: 'POST',
 *   //     headers: { 'Content-Type': 'application/json' },
 *   //     body: JSON.stringify(payload),
 *   //   });
 *
 * Server-side env vars never reach the client. Add `RESEND_API_KEY` to
 * `.env.local` for local development; configure in your hosting provider
 * for production.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: Partial<ContactPayload>;
  try {
    body = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const error = validate(body);
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 422 });
  }

  // No email provider wired yet — log to server console so submissions are
  // still observable during development.
  // eslint-disable-next-line no-console
  console.log('[contact] new submission', {
    name: body.name,
    email: body.email,
    company: body.company ?? '',
    budget: body.budget,
    message: body.message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
