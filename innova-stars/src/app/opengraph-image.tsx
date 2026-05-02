import { ImageResponse } from 'next/og';

import { SITE_CONFIG } from '@/lib/constants';

export const runtime = 'edge';

export const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Branded Open Graph image rendered at build time via @vercel/og.
 *
 * Deep-space gradient background, gold radial glow, four-point gold star,
 * the wordmark, and the tagline. No external font required — uses the
 * default Inter that next/og bundles.
 */
export default async function OpenGraphImage(): Promise<ImageResponse> {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A1A',
        backgroundImage:
          'radial-gradient(circle at 50% 70%, rgba(212,175,55,0.25) 0%, rgba(10,10,26,0) 55%)',
        color: '#FFFFFF',
        padding: 64,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Star glyph */}
      <svg
        width="84"
        height="84"
        viewBox="0 0 32 32"
        style={{ marginBottom: 32 }}
      >
        <path
          d="M16 4 L18.6 13.4 L28 16 L18.6 18.6 L16 28 L13.4 18.6 L4 16 L13.4 13.4 Z"
          fill="#D4AF37"
        />
        <circle cx="16" cy="16" r="2" fill="#F0D060" />
      </svg>

      <div
        style={{
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: '0.05em',
          color: '#D4AF37',
          textShadow: '0 0 60px rgba(212,175,55,0.5)',
          textTransform: 'uppercase',
        }}
      >
        {SITE_CONFIG.name}
      </div>

      <div
        style={{
          marginTop: 24,
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
        }}
      >
        {SITE_CONFIG.tagline}
      </div>

      <div
        style={{
          marginTop: 48,
          fontSize: 22,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {SITE_CONFIG.description}
      </div>

      {/* Hairline gold rule + URL */}
      <div
        style={{
          position: 'absolute',
          bottom: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 20,
          color: '#D4AF37',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ width: 60, height: 1, backgroundColor: '#D4AF37' }} />
        <span>{SITE_CONFIG.url.replace(/^https?:\/\//, '')}</span>
        <div style={{ width: 60, height: 1, backgroundColor: '#D4AF37' }} />
      </div>
    </div>,
    size,
  );
}
