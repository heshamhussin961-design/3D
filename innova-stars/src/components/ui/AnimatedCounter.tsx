'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedCounterProps {
  /** Final numeric value to count up to. */
  value: number;
  /** Unit/suffix displayed after the number (e.g. `'+'`, `'%'`, `'x'`). */
  suffix?: string;
  /** Animation length in seconds. Default `2`. */
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 up to `value` when the element scrolls into view, exactly
 * once. The element's `aria-label` is set to the final value up-front so
 * assistive tech announces the result, not the in-flight number.
 *
 * Honors `prefers-reduced-motion`: renders the final value immediately
 * without animation.
 */
export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps): JSX.Element {
  const ref = useRef<HTMLSpanElement | null>(null);
  const finalLabel = `${value}${suffix}`;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      el.textContent = finalLabel;
      return;
    }

    const state = { n: 0 };
    el.textContent = `0${suffix}`;

    const tween = gsap.to(state, {
      n: value,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        if (el) el.textContent = `${Math.floor(state.n)}${suffix}`;
      },
      onComplete: () => {
        if (el) el.textContent = finalLabel;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className={className} aria-label={finalLabel}>
      0{suffix}
    </span>
  );
}

export default AnimatedCounter;
