'use client';

import { cn } from '@/lib/utils/cn';

interface OrbitalRingsProps {
  className?: string;
}

/**
 * Three elliptical gold rings rotating at different speeds + tilts. Pure
 * CSS — no JS cost — placed behind the central planet.
 */
export function OrbitalRings({ className }: OrbitalRingsProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center',
        className,
      )}
    >
      {/* Each ring rotates on its own via inline `animation` — different axis tilts create a 3D illusion. */}
      <span
        className="absolute block aspect-square w-[150%] rounded-full border border-gold/30"
        style={{
          transform: 'rotateX(75deg) rotateZ(30deg)',
          animation: 'orbit-spin 22s linear infinite',
        }}
      />
      <span
        className="absolute block aspect-square w-[130%] rounded-full border border-gold/20"
        style={{
          transform: 'rotateX(70deg) rotateZ(60deg)',
          animation: 'orbit-spin 30s linear infinite reverse',
        }}
      />
      <span
        className="absolute block aspect-square w-[170%] rounded-full border border-gold/15"
        style={{
          transform: 'rotateX(80deg) rotateZ(120deg)',
          animation: 'orbit-spin 45s linear infinite',
        }}
      />
    </div>
  );
}

export default OrbitalRings;
