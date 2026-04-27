'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useFrameSequence } from '@/hooks/useFrameSequence';
import { getFrameUrl } from '@/lib/utils/frameLoader';
import type { FrameSequenceProps } from '@/types/frames';

import { LazyVideo } from './LazyVideo';
import { ScrollVideo } from './ScrollVideo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll-scrubbed image sequence — Apple-style scrollytelling.
 *
 * Renders a folder of numbered WebP frames onto a canvas, linked to scroll
 * progress via a pinned GSAP `ScrollTrigger`. Frames are loaded in three
 * phases (critical → sampled → fill) so the UI becomes interactive fast.
 *
 * Below `mobileBreakpoint`, the scrub is replaced by a static `<img>` of
 * the first or last frame (`mobileFallback`), because pinning + frame
 * decode is expensive on low-end touch devices.
 *
 * @example
 * <FrameSequence
 *   basePath="/frames/hero/"
 *   frameCount={192}
 *   triggerStart="top top"
 *   triggerEnd="bottom top"
 *   scrub={1}
 *   pin
 *   className="h-screen w-full"
 * />
 */
export function FrameSequence({
  basePath,
  frameCount,
  framePrefix = 'frame_',
  frameExtension = 'webp',
  padLength = 4,
  triggerStart = 'top top',
  triggerEnd = 'bottom top',
  scrub = 1,
  pin = true,
  className,
  style,
  onLoadProgress,
  onLoadComplete,
  mobileFallback = 'none',
  mobileVideoSrc,
  mobileBreakpoint = 768,
}: FrameSequenceProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameRef = useRef<number>(-1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const config = useMemo(
    () => ({
      basePath,
      frameCount,
      framePrefix,
      frameExtension,
      padLength,
    }),
    [basePath, frameCount, framePrefix, frameExtension, padLength],
  );

  // Skip loading the WebP frame pipeline entirely on mobile when we'll
  // render a video / static image instead — saves ~13MB of pointless
  // downloads and keeps the loader off the main thread.
  const skipFrames =
    isMobile &&
    (mobileFallback === 'video' ||
      mobileFallback === 'video-scrub' ||
      mobileFallback === 'first' ||
      mobileFallback === 'last');

  const { loadProgress, isReady, isComplete, getFrame } = useFrameSequence(
    config,
    { skip: skipFrames },
  );

  // Surface progress + completion to the caller.
  useEffect(() => {
    onLoadProgress?.(loadProgress);
  }, [loadProgress, onLoadProgress]);

  useEffect(() => {
    if (isComplete) onLoadComplete?.();
  }, [isComplete, onLoadComplete]);

  // Responsive: decide desktop canvas vs mobile fallback.
  useEffect(() => {
    function check(): void {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [mobileBreakpoint]);

  // Canvas sizing (DPR-aware) + ScrollTrigger scrub.
  // Note: scrub runs on mobile too — `mobileFallback` only kicks in when
  // explicitly set to `'first'` or `'last'`. Default is `'none'`.
  useGSAP(
    () => {
      if (!isReady) return;
      if (isMobile && mobileFallback !== 'none') return;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      function renderFrame(index: number): void {
        const frame = getFrame(Math.floor(index));
        if (!frame || !canvas || !ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const canvasW = canvas.width / dpr;
        const canvasH = canvas.height / dpr;
        ctx.clearRect(0, 0, canvasW, canvasH);
        const scale = Math.max(
          canvasW / frame.naturalWidth,
          canvasH / frame.naturalHeight,
        );
        const sw = frame.naturalWidth * scale;
        const sh = frame.naturalHeight * scale;
        const ox = (canvasW - sw) / 2;
        const oy = (canvasH - sh) / 2;
        ctx.drawImage(frame, ox, oy, sw, sh);
      }

      function resize(): void {
        if (!canvas || !container || !ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderFrame(currentFrameRef.current < 0 ? 0 : currentFrameRef.current);
      }

      resize();
      renderFrame(0);
      currentFrameRef.current = 0;

      let resizeTimer: number | null = null;
      function onResize(): void {
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          resize();
          ScrollTrigger.refresh();
        }, 200);
      }
      window.addEventListener('resize', onResize);

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: triggerStart,
        end: triggerEnd,
        scrub,
        pin,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * (frameCount - 1));
          if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            renderFrame(index);
          }
        },
      });

      return () => {
        trigger.kill();
        window.removeEventListener('resize', onResize);
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      };
    },
    {
      scope: containerRef,
      dependencies: [
        isReady,
        isMobile,
        getFrame,
        frameCount,
        triggerStart,
        triggerEnd,
        scrub,
        pin,
      ],
    },
  );

  // Mobile, scroll-scrub video: native `<video>` element with `currentTime`
  // driven by scroll progress. Skips the canvas + frame-loading path that
  // misbehaves with touch scroll. The mp4 must be encoded with all
  // keyframes for smooth seeking — see `ScrollVideo` docs.
  if (isMobile && mobileFallback === 'video-scrub' && mobileVideoSrc) {
    return (
      <ScrollVideo
        src={mobileVideoSrc}
        poster={getFrameUrl(config, 0)}
        className={className}
        triggerStart={triggerStart}
        triggerEnd={triggerEnd}
        pin={pin}
      />
    );
  }

  // Mobile, looping autoplay video (only plays in-viewport). Cheaper than
  // scroll-scrub but the timeline isn't tied to user scroll.
  if (isMobile && mobileFallback === 'video' && mobileVideoSrc) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={style}
        aria-hidden="true"
      >
        <LazyVideo
          src={mobileVideoSrc}
          poster={getFrameUrl(config, 0)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // Mobile: static-image fallback when explicitly opted-in.
  if (isMobile && (mobileFallback === 'first' || mobileFallback === 'last')) {
    const fallbackIndex = mobileFallback === 'last' ? frameCount - 1 : 0;
    return (
      <div
        ref={containerRef}
        className={className}
        style={style}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getFrameUrl(config, fallbackIndex)}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ''}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full"
      />
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-deep-space/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-12 w-12 animate-spin text-gold"
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
            <p className="font-inter text-sm tracking-wider text-white/60">
              Loading experience… {Math.floor(loadProgress)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FrameSequence;
