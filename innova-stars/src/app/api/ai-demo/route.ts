import { NextResponse } from 'next/server';

import { clientKey, rateLimit } from '@/lib/utils/rateLimit';

interface AiDemoPayload {
  message?: string;
}

const MAX_PROMPT_LEN = 2_000;

/**
 * POST /api/ai-demo
 *
 * Tiny demo endpoint that proxies to Anthropic's Messages API. Requires
 * `ANTHROPIC_API_KEY` in the environment. If unset, returns a friendly
 * stub so the demo still loads in dev / preview.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const rl = rateLimit(`ai-demo:${clientKey(request)}`, {
    limit: 10,
    windowMs: 60 * 1000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Rate limit reached. Try again in a minute.' },
      { status: 429 },
    );
  }

  let body: AiDemoPayload;
  try {
    body = (await request.json()) as AiDemoPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  const message = body.message?.trim() ?? '';
  if (!message) {
    return NextResponse.json(
      { ok: false, error: 'Message is required.' },
      { status: 422 },
    );
  }
  if (message.length > MAX_PROMPT_LEN) {
    return NextResponse.json(
      { ok: false, error: `Message too long (max ${MAX_PROMPT_LEN} chars).` },
      { status: 422 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      reply:
        '[Demo mode] Set ANTHROPIC_API_KEY to enable real responses. Your prompt was: ' +
        message,
    });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system:
          "You're the Innova Stars marketing studio's demo assistant. Be concise, on-brand, and helpful.",
        messages: [{ role: 'user', content: message }],
      }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[ai-demo] Anthropic error', res.status);
      return NextResponse.json(
        { ok: false, error: 'AI service unavailable. Try again later.' },
        { status: 502 },
      );
    }
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const reply =
      data.content
        ?.filter((c) => c.type === 'text')
        .map((c) => c.text ?? '')
        .join('\n')
        .trim() ?? '';
    return NextResponse.json({ ok: true, reply });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[ai-demo] exception', e);
    return NextResponse.json(
      { ok: false, error: 'AI service error.' },
      { status: 502 },
    );
  }
}
