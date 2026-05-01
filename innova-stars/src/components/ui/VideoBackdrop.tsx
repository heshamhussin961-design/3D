'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface VideoBackdropProps {
  src: string;
}

/**
 * Fixed full-viewport video backdrop, scrubbed by document scroll.
 *
 * Source mp4 must be encoded intra-only (every frame is a keyframe) for
 * smooth seeks — `innova-scrub.mp4` is. Seeks are latched to one
 * `requestAnimationFrame` to avoid queueing.
 */
export function VideoBackdrop({ src }: VideoBackdropProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    let pendingTime: number | null = null;
    let raf = 0;

    function flush(): void {
      raf = 0;
      if (pendingTime !== null && video) {
        const t = Math.max(0, Math.min(video.duration || 0, pendingTime));
        if (Number.isFinite(t)) video.currentTime = t;
        pendingTime = null;
      }
    }

    function setTime(t: number): void {
      pendingTime = t;
      if (raf === 0) raf = window.requestAnimationFrame(flush);
    }

    function onReady(): void {
      // Force a tiny seek to make Chrome paint the first frame — without
      // this, a non-autoplay video stays black until the user scrolls.
      const v = videoRef.current;
      if (v) {
        try {
          v.currentTime = 0.01;
        } catch {
          // ignore — some browsers throw before metadata.
        }
      }
      ScrollTrigger.refresh();
    }

    if (video.readyState >= 1) onReady();
    video.addEventListener('loadedmetadata', onReady);
    video.addEventListener('loadeddata', onReady);

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const dur = video.duration;
        if (!dur || !Number.isFinite(dur)) return;
        setTime(self.progress * dur);
      },
    });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      trigger.kill();
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('loadeddata', onReady);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        poster="/videos/innova-poster.jpg"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        className="h-full w-full object-cover"
      />

      {/* Soft radial scrim — readability without horizontal banding. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Gold cinematic tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.18) 0%, transparent 65%)',
        }}
      />
    </div>
  );
}

export default VideoBackdrop;
