'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

import { cn } from '@/lib/utils/cn';

interface MagneticWordmarkProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Pixel pull strength toward the cursor at zero distance. */
  strength?: number;
  /** Cursor radius (px) at which the effect falls off to zero. */
  radius?: number;
}

/**
 * Wordmark whose individual letters subtly drift toward the cursor when
 * it gets close. Falls off with the inverse distance from each letter.
 *
 * Pure DOM transforms via refs + a single rAF — no React re-renders per
 * mouse move. Disabled on touch-only devices and when the user prefers
 * reduced motion.
 */
export function MagneticWordmark({
  text,
  className,
  style,
  strength = 18,
  radius = 220,
}: MagneticWordmarkProps): JSX.Element {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (isTouch || reduced) return;

    let raf = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let active = false;

    function flush(): void {
      raf = 0;
      const letters = lettersRef.current;
      for (const letter of letters) {
        if (!letter) continue;
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy);
        if (!active || dist > radius) {
          letter.style.transform = 'translate3d(0, 0, 0)';
          continue;
        }
        const fall = 1 - dist / radius;
        const tx = (dx / dist) * fall * strength;
        const ty = (dy / dist) * fall * strength;
        letter.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
    }

    function schedule(): void {
      if (raf) return;
      raf = window.requestAnimationFrame(flush);
    }

    function onMove(e: MouseEvent): void {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
      schedule();
    }

    function onLeave(): void {
      active = false;
      schedule();
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, radius, text]);

  return (
    <span
      ref={containerRef}
      style={style}
      className={cn('inline-block', className)}
    >
      {Array.from(text).map((char, i) => (
        <span
          key={`${char}-${i}`}
          ref={(el) => {
            if (el) lettersRef.current[i] = el;
          }}
          className="inline-block whitespace-pre transition-transform duration-200 ease-out will-change-transform"
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
}

export default MagneticWordmark;
