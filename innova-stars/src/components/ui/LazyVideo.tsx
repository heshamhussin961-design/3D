'use client';

import { useEffect, useRef } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** Vertical px margin to start playing before fully in view. */
  rootMargin?: string;
}

/**
 * Looping autoplay `<video>` that **only plays while in the viewport**.
 *
 * Big mobile perf win — multiple autoplay videos on the same page each pin
 * a hardware decoder, eat RAM, and trigger thermals. Pausing the ones the
 * user can't see frees those resources for the visible one.
 *
 * Always muted + playsInline + preload=metadata so iOS Safari allows
 * autoplay. Reload happens on `src` change.
 */
export function LazyVideo({
  src,
  poster,
  className,
  rootMargin = '200px',
}: LazyVideoProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // play() returns a promise; ignore failures (autoplay policies).
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
    />
  );
}

export default LazyVideo;
