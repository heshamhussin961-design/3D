import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Apple touch icon — 180x180 PNG generated at request time. iOS Safari
 * pulls this when users add the site to their home screen.
 */
export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F1430',
        backgroundImage:
          'radial-gradient(circle at 50% 70%, rgba(212,175,55,0.35) 0%, rgba(31,20,48,0) 60%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Rocket */}
        <svg width="60" height="60" viewBox="0 0 32 32">
          <path
            d="M16 2 C 21 6 24 12 24 18 L 24 24 L 8 24 L 8 18 C 8 12 11 6 16 2 Z"
            fill="#D4AF37"
          />
          <circle cx="16" cy="14" r="3" fill="#1F1430" />
          <path d="M8 22 L 4 28 L 8 28 Z" fill="#D4AF37" />
          <path d="M24 22 L 28 28 L 24 28 Z" fill="#D4AF37" />
          <path d="M13 28 L 16 32 L 19 28 Z" fill="#FFB347" />
        </svg>

        {/* Saturn planet */}
        <svg width="100" height="40" viewBox="0 0 100 40">
          <ellipse
            cx="50"
            cy="22"
            rx="36"
            ry="9"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
          />
          <circle cx="50" cy="20" r="18" fill="#D4AF37" />
          <path
            d="M35 18 Q 50 10 65 18"
            stroke="#7A5E12"
            strokeWidth="2.4"
            fill="none"
          />
        </svg>
      </div>
    </div>,
    size,
  );
}
