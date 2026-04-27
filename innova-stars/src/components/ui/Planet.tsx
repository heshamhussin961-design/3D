'use client';

import { cn } from '@/lib/utils/cn';

interface PlanetProps {
  className?: string;
}

/**
 * The central gold planet for the CTA section. Radial gradient + layered
 * glow + decorative crater spots. Hidden from assistive tech — it's decoration.
 */
export function Planet({ className }: PlanetProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative aspect-square animate-pulse-glow rounded-full',
        className,
      )}
      style={{
        background:
          'radial-gradient(circle at 35% 35%, #F0D060 0%, #D4AF37 25%, #8a6a18 55%, #0A0A1A 85%, #000 100%)',
        boxShadow:
          '0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.25), 0 0 200px rgba(212,175,55,0.12), inset 0 0 80px rgba(0,0,0,0.55)',
      }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          animation: 'planet-spin 60s linear infinite',
        }}
      >
        {/* Crater-ish shadow spots — positioned around the sphere for surface texture. */}
        <span className="absolute left-[22%] top-[30%] h-2 w-2 rounded-full bg-black/30 blur-[1px]" />
        <span className="absolute left-[65%] top-[25%] h-3 w-3 rounded-full bg-black/25 blur-[2px]" />
        <span className="absolute left-[40%] top-[60%] h-2 w-3 rounded-full bg-black/30 blur-[1px]" />
        <span className="absolute left-[70%] top-[55%] h-1.5 w-1.5 rounded-full bg-black/40 blur-[1px]" />
        <span className="absolute left-[30%] top-[70%] h-2 w-2 rounded-full bg-black/25 blur-[1px]" />
      </span>

      {/* Atmospheric rim glow */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: 'inset 0 0 60px rgba(240, 208, 96, 0.25)',
        }}
      />
    </div>
  );
}

export default Planet;
