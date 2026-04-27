'use client';

import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

const ZERO: MousePosition = { x: 0, y: 0 };
const FRAME_INTERVAL_MS = 1000 / 60;

/**
 * Tracks the mouse position normalized to the range `[-1, 1]` on both axes,
 * with the origin at the viewport center.
 *
 * Throttled to ~60fps using `requestAnimationFrame`. On touch-only devices
 * (no fine pointer) it returns `{ x: 0, y: 0 }` and skips listener setup.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>(ZERO);
  const lastUpdateRef = useRef<number>(0);
  const pendingRef = useRef<MousePosition | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchOnly) return;

    function flush(): void {
      rafRef.current = null;
      const next = pendingRef.current;
      if (next) {
        pendingRef.current = null;
        lastUpdateRef.current = performance.now();
        setPosition(next);
      }
    }

    function handleMove(event: MouseEvent): void {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      pendingRef.current = { x, y };

      const now = performance.now();
      if (now - lastUpdateRef.current < FRAME_INTERVAL_MS) {
        if (rafRef.current === null) {
          rafRef.current = window.requestAnimationFrame(flush);
        }
        return;
      }

      lastUpdateRef.current = now;
      pendingRef.current = null;
      setPosition({ x, y });
    }

    window.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return position;
}
