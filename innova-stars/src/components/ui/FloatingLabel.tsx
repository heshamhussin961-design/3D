'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type LabelCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface FloatingLabelProps {
  children: ReactNode;
  corner: LabelCorner;
  className?: string;
}

const CORNER_POSITION: Record<LabelCorner, string> = {
  'top-left': 'top-10 left-6 md:top-16 md:left-16',
  'top-right': 'top-10 right-6 md:top-16 md:right-16',
  'bottom-left': 'bottom-10 left-6 md:bottom-16 md:left-16',
  'bottom-right': 'bottom-10 right-6 md:bottom-16 md:right-16',
};

/**
 * Floating information pill anchored to a section corner.
 *
 * A gold-bordered, frosted badge used to annotate the AI Core visual
 * with capability callouts (e.g. "Predictive Analytics"). Respects
 * `prefers-reduced-motion` via Tailwind's default reduce-motion rules.
 */
export function FloatingLabel({
  children,
  corner,
  className,
}: FloatingLabelProps): JSX.Element {
  return (
    <div
      data-floating-label
      className={cn(
        'pointer-events-none absolute z-10 flex items-center gap-2 border border-gold/30 bg-black/60 px-4 py-2 backdrop-blur-md',
        CORNER_POSITION[corner],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.9)]"
      />
      <span className="font-orbitron text-xs font-medium tracking-[0.15em] text-gold md:text-sm">
        {children}
      </span>
    </div>
  );
}

export default FloatingLabel;
