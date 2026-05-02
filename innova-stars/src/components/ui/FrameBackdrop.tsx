'use client';

import { useEffect, useRef, useState } from 'react';

interface FrameBackdropProps {
  /** URL prefix that ends with `/`. Frames at `${basePath}frame_NNNN.webp`. */
  basePath: string;
  /** Optional smaller variant served when the viewport is below
   * `mobileBreakpoint`. Saves a lot of bandwidth on phones. */
  mobileBasePath?: string;
  mobileBreakpoint?: number;
  /** Number of frames in the sequence. Numbered 1..frameCount. */
  frameCount: number;
  /** Zero-padding for the frame number — `4` ⇒ `frame_0001.webp`. */
  padLength?: number;
  framePrefix?: string;
  frameExtension?: string;
}

/**
 * Fixed full-viewport frame-sequence backdrop.
 *
 * Pre-loads numbered WebP frames as `<img>` objects and draws the right
 * one onto a canvas as the user scrolls. Apple-style scrollytelling with
 * zero video-decode cost.
 *
 * Improvements on top of the basic version:
 *   1. Picks a small `mobileBasePath` variant on narrow viewports.
 *   2. Cross-fades between adjacent frames using fractional scroll
 *      progress, hiding the discrete-frame stepping that an integer
 *      index alone would produce.
 *   3. Critical first-frame load is prioritized so the page paints fast.
 *   4. `nearestLoaded` fallback prevents holes during initial download.
 *
 * Frame index follows scroll-Y in both directions so scrolling up
 * naturally rewinds the sequence.
 */
export function FrameBackdrop({
  basePath,
  mobileBasePath,
  mobileBreakpoint = 768,
  frameCount,
  padLength = 4,
  framePrefix = 'frame_',
  frameExtension = 'webp',
}: FrameBackdropProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const targetProgressRef = useRef<number>(0); // 0..frameCount-1, fractional
  const drawnSignatureRef = useRef<string>('');
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Pick the responsive variant once on mount.
    const useMobile =
      typeof window !== 'undefined' &&
      mobileBasePath &&
      window.innerWidth < mobileBreakpoint;
    const activeBase = useMobile ? mobileBasePath! : basePath;

    const images: Array<HTMLImageElement | null> = new Array(frameCount).fill(
      null,
    );
    imagesRef.current = images;

    function urlFor(i: number): string {
      const num = String(i + 1).padStart(padLength, '0');
      return `${activeBase}${framePrefix}${num}.${frameExtension}`;
    }

    let firstPainted = false;

    function sizeCanvasToWindow(): void {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /**
     * Paint a frame using object-fit: cover. `alpha < 1` lets the
     * caller stack frames for cross-fade without needing a second
     * canvas.
     */
    function paintFrame(
      img: HTMLImageElement,
      alpha: number,
      clear: boolean,
    ): void {
      if (!ctx || !canvas) return;
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      const ir = img.width / img.height;
      const cr = cssW / cssH;
      let dw: number;
      let dh: number;
      let dx: number;
      let dy: number;
      if (ir > cr) {
        dh = cssH;
        dw = cssH * ir;
        dx = (cssW - dw) / 2;
        dy = 0;
      } else {
        dw = cssW;
        dh = cssW / ir;
        dx = 0;
        dy = (cssH - dh) / 2;
      }
      if (clear) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cssW, cssH);
      }
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }

    function nearestLoadedIdx(idx: number): number {
      if (images[idx]) return idx;
      for (let d = 1; d < frameCount; d++) {
        if (idx - d >= 0 && images[idx - d]) return idx - d;
        if (idx + d < frameCount && images[idx + d]) return idx + d;
      }
      return -1;
    }

    let lastProgress = -1;

    /** Draw either a single frame or a cross-fade between two adjacent
     * frames. During fast play-throughs (auto-scroll, fling) we drop
     * the cross-fade — at 60fps the user can't see the blend anyway and
     * one paint per tick keeps the GPU pipeline empty. */
    function drawAt(progress: number): void {
      const lo = Math.floor(progress);
      const hi = Math.min(frameCount - 1, lo + 1);
      const t = progress - lo;
      const velocity = Math.abs(progress - lastProgress);
      lastProgress = progress;
      const fastPlay = velocity > 1.5; // > 1.5 frames per tick = fast scroll

      const aIdx = nearestLoadedIdx(lo);
      const bIdx = nearestLoadedIdx(hi);
      if (aIdx === -1 && bIdx === -1) return;

      // Skip redundant repaints.
      const sig = fastPlay
        ? `fast:${Math.round(progress)}`
        : `${aIdx}:${bIdx}:${t.toFixed(3)}`;
      if (sig === drawnSignatureRef.current) return;
      drawnSignatureRef.current = sig;

      if (fastPlay || aIdx === bIdx || aIdx === -1 || bIdx === -1) {
        // Single frame paint — pick whichever side rounded closer.
        const idx = t < 0.5 ? aIdx : bIdx;
        const img = images[idx !== -1 ? idx : aIdx !== -1 ? aIdx : bIdx];
        if (img) paintFrame(img, 1, true);
        return;
      }

      // Cross-fade between adjacent frames at slow scroll speeds.
      const aImg = images[aIdx];
      const bImg = images[bIdx];
      if (!aImg || !bImg) return;
      paintFrame(aImg, 1, true);
      if (t > 0) paintFrame(bImg, t, false);
    }

    function onScroll(): void {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, p));
      targetProgressRef.current = clamped * (frameCount - 1);
    }

    // ─── Frame loading ────────────────────────────────────────────────
    function loadFrame(idx: number, priority: boolean): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        if (priority) img.fetchPriority = 'high';
        img.onload = (): void => {
          // Force decode into a raster now so the first paint inside
          // the rAF loop is essentially free. Without this, the browser
          // defers decode to first-paint, which stutters when an auto
          // -scroll plays through many never-painted frames in a row.
          const finalize = (): void => {
            images[idx] = img;
            if (!firstPainted && idx === 0) {
              firstPainted = true;
              sizeCanvasToWindow();
              paintFrame(img, 1, true);
              setReady(true);
            }
            resolve();
          };
          if (typeof img.decode === 'function') {
            img.decode().then(finalize, finalize);
          } else {
            finalize();
          }
        };
        img.onerror = (): void => resolve();
        img.src = urlFor(idx);
      });
    }

    // Load critical frames first, then everything else in parallel.
    const criticalIdxs = [
      0,
      Math.floor(frameCount * 0.25),
      Math.floor(frameCount * 0.5),
      Math.floor(frameCount * 0.75),
      frameCount - 1,
    ];
    const seen = new Set<number>();
    void Promise.all(
      criticalIdxs.map((i) => {
        seen.add(i);
        return loadFrame(i, true);
      }),
    ).then(() => {
      for (let i = 0; i < frameCount; i++) {
        if (!seen.has(i)) void loadFrame(i, false);
      }
    });

    // ─── Scroll → repaint loop ───────────────────────────────────────
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    function onResize(): void {
      sizeCanvasToWindow();
      drawnSignatureRef.current = '';
      drawAt(targetProgressRef.current);
      onScroll();
    }
    window.addEventListener('resize', onResize);

    function tick(): void {
      drawAt(targetProgressRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    }
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [
    basePath,
    mobileBasePath,
    mobileBreakpoint,
    frameCount,
    framePrefix,
    frameExtension,
    padLength,
  ]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-black"
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
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

export default FrameBackdrop;
