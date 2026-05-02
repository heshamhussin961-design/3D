'use client';

import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { MagneticButton } from '@/components/ui/MagneticButton';

const Starfield = dynamic(
  () => import('@/components/ui/Starfield').then((m) => m.Starfield),
  { ssr: false },
);

/**
 * 404 — "Lost in space".
 *
 * Re-uses the Hero starfield (no warp) for visual consistency with the
 * rest of the brand. Single CTA back to home.
 */
export default function NotFound(): JSX.Element {
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 60%), #0A0A1A',
      }}
    >
      <div className="absolute inset-0 z-0">
        <Starfield />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6">
        <p className="font-orbitron text-[11px] font-semibold tracking-[0.4em] text-gold">
          ERROR · 404
        </p>
        <h1 className="font-orbitron text-[64px] font-black leading-none tracking-tight text-gold gold-glow md:text-[120px]">
          LOST
        </h1>
        <p className="font-orbitron text-2xl font-bold tracking-[0.1em] text-white md:text-4xl">
          IN SPACE
        </p>
        <p className="max-w-md font-inter text-base text-white/60">
          The signal you’re looking for never reached us. Drift back to base and
          we’ll plot another course.
        </p>

        <Link href="/" className="inline-block">
          <MagneticButton
            type="button"
            className="mt-4 inline-flex items-center gap-3 bg-gold px-10 py-4 font-orbitron text-sm font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Home
          </MagneticButton>
        </Link>
      </div>
    </main>
  );
}
