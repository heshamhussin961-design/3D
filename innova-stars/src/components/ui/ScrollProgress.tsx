'use client';

import { useEffect, useRef } from 'react';

/**
 * Hairline gold progress bar pinned to the top of the viewport.
 * Reflects the user's vertical scroll position 0 → 100% across the page.
 *
 * Drives the bar's `transform: scaleX()` directly via a ref + rAF, so
 * scrolling never triggers React re-renders or layout work.
 */
export function ScrollProgress(): JSX.Element {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let pending = false;

    function update(): void {
      pending = false;
      const bar = barRef.current;
      if (!bar) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;
      bar.style.transform = `scaleX(${ratio})`;
    }

    function onScroll(): void {
      if (pending) return;
      pending = true;
      raf = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

export default ScrollProgress;
