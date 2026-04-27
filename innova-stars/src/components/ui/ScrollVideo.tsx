'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollVideoProps {
  /** mp4 source — should be encoded with all keyframes for smooth seek. */
  src: string;
  /** Poster shown until the video metadata loads. */
  poster?: string;
  className?: string;
  /** ScrollTrigger `start` value. Default `'top top'`. */
  triggerStart?: string;
  /** ScrollTrigger `end` value. Default `'bottom top'`. */
  triggerEnd?: string;
  /** Whether to pin the container while scrubbing. Default `true`. */
  pin?: boolean;
}

/**
 * Scroll-scrubbed video on mobile (and desktop). The user's scroll position
 * drives `video.currentTime` instead of a real-time playback rate, so the
 * video moves frame-by-frame with their scroll.
 *
 * The source mp4 must be encoded with all keyframes (e.g. ffmpeg
 * `-x264opts keyint=1:min-keyint=1`) — otherwise seeking between
 * keyframes stalls and the scrub stutters badly on mobile.
 *
 * Why this exists separate from `FrameSequence`:
 *   - On mobile, canvas + frame loading + ScrollTrigger pin fight with
 *     touch scroll and produce black frames.
 *   - A native `<video>` element with seek-on-scroll is hardware-decoded,
 *     plays nicely with iOS Safari/Chrome Mobile, and skips the WebP
 *     loading overhead.
 */
export function ScrollVideo({
  src,
  poster,
  className,
  triggerStart = 'top top',
  triggerEnd = 'bottom top',
  pin = true,
}: ScrollVideoProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  useGSAP(
    () => {
      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;

      // Latched-rAF seek: bunch up scroll updates and apply once per frame
      // so we never enqueue more than one seek at a time.
      let pendingTime: number | null = null;
      let raf = 0;

      function flush(): void {
        raf = 0;
        if (pendingTime !== null && video) {
          // Guard against NaN / out-of-range before assigning.
          const t = Math.max(0, Math.min(video.duration || 0, pendingTime));
          if (Number.isFinite(t)) video.currentTime = t;
          pendingTime = null;
        }
      }

      function setTime(t: number): void {
        pendingTime = t;
        if (raf === 0) raf = window.requestAnimationFrame(flush);
      }

      function onLoaded(): void {
        setReady(true);
        // Refresh ScrollTrigger so end-of-pin maps correctly once duration
        // is known.
        ScrollTrigger.refresh();
      }
      video.addEventListener('loadedmetadata', onLoaded);
      // iOS sometimes only fires `loadeddata`, not `loadedmetadata`.
      video.addEventListener('loadeddata', onLoaded);

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: triggerStart,
        end: triggerEnd,
        scrub: true,
        pin,
        onUpdate: (self) => {
          const duration = video.duration;
          if (!duration || !Number.isFinite(duration)) return;
          setTime(self.progress * duration);
        },
      });

      return () => {
        if (raf) window.cancelAnimationFrame(raf);
        trigger.kill();
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeEventListener('loadeddata', onLoaded);
      };
    },
    { scope: containerRef, dependencies: [src, triggerStart, triggerEnd, pin] },
  );

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        // Important: NOT autoplay/loop — scroll drives the timeline.
        preload="auto"
        // `disablePictureInPicture` discourages the browser from offering PiP
        // on a non-playing video.
        disablePictureInPicture
        // Hide native controls on iOS.
        controls={false}
        className="block h-full w-full object-cover"
      />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-deep-space/90">
          <svg
            className="h-10 w-10 animate-spin text-gold"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
}

export default ScrollVideo;
