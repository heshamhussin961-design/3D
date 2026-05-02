'use client';

import { type RefObject, useEffect, useRef } from 'react';

import { useMousePosition } from '@/hooks/useMousePosition';

interface Star {
  /** Static base position (set once at generation). */
  baseX: number;
  baseY: number;
  /** Animation runtime position (used during warp). */
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  /** Depth: 0 far → 1 close. Drives warp velocity. */
  z: number;
  /** Visual radius of the inner pinpoint (px). */
  radius: number;
  /** RGB tint string, e.g. `'255, 255, 255'`. */
  rgb: string;
  /** Mean opacity. Twinkles oscillate around this. */
  baseOpacity: number;
  /** Per-star outward velocity multiplier (warp). */
  velocity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  /** If false, the star renders at constant opacity (no twinkle). */
  twinkles: boolean;
  /** True for "feature" stars — gets a cross-shaped diffraction lens flare. */
  hasFlare: boolean;
}

interface Nebula {
  cx: number;
  cy: number;
  radius: number;
  rgb: string;
  alpha: number;
}

interface StarfieldProps {
  /** Total star count on desktop. Mobile renders ~half. */
  starCount?: number;
  /**
   * Mutable ref whose `current` is the warp progress (0 → 1).
   * Hero updates it from a scrubbed ScrollTrigger; we sample it
   * each frame for the hyperspace effect.
   */
  warpProgressRef?: RefObject<number>;
  className?: string;
}

const PARALLAX_MAX_PX = 18;
const MAX_VELOCITY_PX_PER_S = 1400;
const DEEP_SPACE_RGB = '10, 10, 26';

// Color palette — weighted random selection.
// 80% white, 10% warm white, 5% cool blue, 5% gold (gold reserved for brightest).
const COLOR_WHITE = '255, 255, 255';
const COLOR_WARM = '255, 245, 230';
const COLOR_COOL = '230, 240, 255';
const COLOR_GOLD = '212, 175, 55';

function pickColor(rng: () => number, isBright: boolean): string {
  const r = rng();
  if (isBright && r < 0.5) return COLOR_GOLD; // bright stars more likely gold
  if (r < 0.8) return COLOR_WHITE;
  if (r < 0.9) return COLOR_WARM;
  if (r < 0.95) return COLOR_COOL;
  return isBright ? COLOR_GOLD : COLOR_WHITE;
}

function pickRadius(rng: () => number): {
  radius: number;
  tier: 'tiny' | 'small' | 'bright';
} {
  const r = rng();
  if (r < 0.7) return { radius: 0.5 + rng() * 0.5, tier: 'tiny' };
  if (r < 0.95) return { radius: 1 + rng() * 0.5, tier: 'small' };
  return { radius: 1.5 + rng() * 1.0, tier: 'bright' };
}

/**
 * Realistic NASA-style canvas starfield. Each star is rendered as a tiny
 * solid pinpoint surrounded by a pre-cached radial-gradient halo (so no
 * per-frame gradient construction). Bright "feature" stars get a four-arm
 * diffraction lens flare. A faint nebula and edge vignette add depth.
 *
 * Two compositing layers:
 *   - **Static layer** (offscreen canvas): nebula + vignette + non-twinkling
 *     stars. Drawn once on resize.
 *   - **Animated layer** (main canvas): copies the static buffer each frame,
 *     then redraws the twinkling stars on top. During warp, all stars
 *     stretch radially outward and recycle near center.
 *
 * Mobile (< 768px) renders ~half the stars and skips the warp path.
 */
export function Starfield({
  starCount = 400,
  warpProgressRef,
  className,
}: StarfieldProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useMousePosition();
  const mouseRef = useRef(mouse);
  mouseRef.current = mouse;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    // Mobile gets 1/3 the stars to keep the per-frame draw cost manageable
    // on lower-tier GPUs and to avoid thermal throttling on long sessions.
    const count = isMobile ? Math.floor(starCount / 3) : starCount;

    // Seeded RNG so positions are stable across re-renders.
    let seed = 987654321;
    const rng = (): number => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let nebulae: Nebula[] = [];
    let staticCanvas: HTMLCanvasElement | null = null;

    function resize(): void {
      if (!canvas || !ctx) return;
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function generate(): void {
      stars = [];
      for (let i = 0; i < count; i++) {
        const { radius, tier } = pickRadius(rng);
        const isBright = tier === 'bright';
        const x = rng() * width;
        const y = rng() * height;
        stars.push({
          baseX: x,
          baseY: y,
          x,
          y,
          prevX: x,
          prevY: y,
          z: rng(),
          radius,
          rgb: pickColor(rng, isBright),
          baseOpacity: 0.7 + rng() * 0.3,
          velocity: 0.4 + rng() * 0.6,
          twinkleSpeed: 0.2 + rng() * 0.13, // 4.8s–7.7s cycles
          twinklePhase: rng() * Math.PI * 2,
          twinkles: rng() > 0.3, // 30% don't twinkle
          hasFlare: isBright && rng() > 0.4,
        });
      }

      // 1–2 faint nebulas
      const nebulaCount = isMobile ? 1 : 1 + Math.floor(rng() * 2);
      nebulae = [];
      for (let i = 0; i < nebulaCount; i++) {
        nebulae.push({
          cx: 0.2 * width + rng() * width * 0.6,
          cy: 0.2 * height + rng() * height * 0.6,
          radius: Math.max(width, height) * (0.35 + rng() * 0.25),
          rgb: rng() > 0.5 ? '160, 100, 200' : '212, 175, 55', // purple or gold
          alpha: 0.04 + rng() * 0.04,
        });
      }
    }

    function drawStarHalo(
      target: CanvasRenderingContext2D,
      star: Star,
      x: number,
      y: number,
      opacity: number,
    ): void {
      const haloR = star.radius * 4;
      const grad = target.createRadialGradient(x, y, 0, x, y, haloR);
      grad.addColorStop(0, `rgba(${star.rgb}, ${opacity})`);
      grad.addColorStop(0.4, `rgba(${star.rgb}, ${opacity * 0.4})`);
      grad.addColorStop(1, `rgba(${star.rgb}, 0)`);
      target.fillStyle = grad;
      target.beginPath();
      target.arc(x, y, haloR, 0, Math.PI * 2);
      target.fill();

      // Hard pinpoint
      target.fillStyle = `rgba(${star.rgb}, ${opacity})`;
      target.beginPath();
      target.arc(x, y, star.radius, 0, Math.PI * 2);
      target.fill();

      // Diffraction lens flare for feature stars
      if (star.hasFlare) {
        const flareLen = star.radius * 6;
        target.strokeStyle = `rgba(${star.rgb}, ${opacity * 0.3})`;
        target.lineWidth = 0.5;
        target.beginPath();
        target.moveTo(x - flareLen, y);
        target.lineTo(x + flareLen, y);
        target.moveTo(x, y - flareLen);
        target.lineTo(x, y + flareLen);
        target.stroke();
      }
    }

    function paintBackdrop(target: CanvasRenderingContext2D): void {
      // Faint nebulas
      for (const n of nebulae) {
        const grad = target.createRadialGradient(
          n.cx,
          n.cy,
          0,
          n.cx,
          n.cy,
          n.radius,
        );
        grad.addColorStop(0, `rgba(${n.rgb}, ${n.alpha})`);
        grad.addColorStop(1, `rgba(${n.rgb}, 0)`);
        target.fillStyle = grad;
        target.fillRect(0, 0, width, height);
      }

      // Subtle vignette: darker at edges
      const vignette = target.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75,
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      target.fillStyle = vignette;
      target.fillRect(0, 0, width, height);
    }

    function buildStaticLayer(): void {
      const off = document.createElement('canvas');
      off.width = Math.floor(width * dpr);
      off.height = Math.floor(height * dpr);
      const offCtx = off.getContext('2d');
      if (!offCtx) return;
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      paintBackdrop(offCtx);

      // Pre-render non-twinkling stars at their full opacity
      for (const star of stars) {
        if (star.twinkles) continue;
        drawStarHalo(offCtx, star, star.baseX, star.baseY, star.baseOpacity);
      }
      staticCanvas = off;
    }

    function recycleNearCenter(star: Star): void {
      const cx = width / 2;
      const cy = height / 2;
      const angle = rng() * Math.PI * 2;
      const spawnRadius = 8 + rng() * 30;
      star.x = cx + Math.cos(angle) * spawnRadius;
      star.y = cy + Math.sin(angle) * spawnRadius;
      star.prevX = star.x;
      star.prevY = star.y;
      star.z = rng() * 0.5;
      star.velocity = 0.4 + rng() * 0.6;
    }

    function syncStarsToBase(): void {
      // Reset warp positions when progress drops back to 0.
      for (const star of stars) {
        star.x = star.baseX;
        star.y = star.baseY;
        star.prevX = star.baseX;
        star.prevY = star.baseY;
      }
    }

    resize();
    generate();
    buildStaticLayer();

    let rafId = 0;
    let prev = performance.now();
    const start = prev;
    let warpedLastFrame = false;

    function frame(now: number): void {
      if (!ctx) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const elapsed = (now - start) / 1000;

      const progress = isMobile
        ? 0
        : Math.max(0, Math.min(1, warpProgressRef?.current ?? 0));
      const warping = progress > 0.02;

      // Reset to base positions when warp ends so stars re-anchor.
      if (warpedLastFrame && !warping) syncStarsToBase();
      warpedLastFrame = warping;

      const offsetX = mouseRef.current.x * PARALLAX_MAX_PX * (1 - progress);
      const offsetY = mouseRef.current.y * PARALLAX_MAX_PX * (1 - progress);

      // Frame clear strategy: warp uses alpha-fill for trails; idle uses
      // copy-from-static for crisp non-twinkling stars.
      if (warping) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(${DEEP_SPACE_RGB}, ${0.12 + 0.18 * progress})`;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (staticCanvas) {
          // Draw the prerendered backdrop + static stars in CSS pixels.
          ctx.drawImage(staticCanvas, 0, 0, width, height);
        }
      }

      ctx.globalCompositeOperation = 'lighter';

      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {
        if (warping) {
          star.prevX = star.x;
          star.prevY = star.y;
          star.z = Math.min(1, star.z + dt * progress * 0.8 * star.velocity);
          const dx = star.x - cx;
          const dy = star.y - cy;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const angle = Math.atan2(dy, dx);
          const speed =
            MAX_VELOCITY_PX_PER_S *
            progress *
            star.velocity *
            (0.2 + star.z * 1.2);
          const newDist = dist + speed * dt;
          star.x = cx + Math.cos(angle) * newDist;
          star.y = cy + Math.sin(angle) * newDist;
          if (
            star.x < -50 ||
            star.x > width + 50 ||
            star.y < -50 ||
            star.y > height + 50
          ) {
            recycleNearCenter(star);
            continue;
          }

          const trail = Math.hypot(star.x - star.prevX, star.y - star.prevY);
          const opacity = Math.min(
            1,
            star.baseOpacity + star.z * progress * 0.6,
          );
          if (trail > 1.2) {
            ctx.strokeStyle = `rgba(${star.rgb}, ${opacity})`;
            ctx.lineWidth = star.radius * (1 + star.z);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(star.prevX + offsetX, star.prevY + offsetY);
            ctx.lineTo(star.x + offsetX, star.y + offsetY);
            ctx.stroke();
          } else {
            drawStarHalo(
              ctx,
              star,
              star.x + offsetX,
              star.y + offsetY,
              opacity,
            );
          }
        } else if (star.twinkles) {
          const twinkle =
            star.baseOpacity *
            (0.85 +
              0.15 * Math.sin(elapsed * star.twinkleSpeed + star.twinklePhase));
          drawStarHalo(
            ctx,
            star,
            star.baseX + offsetX,
            star.baseY + offsetY,
            twinkle,
          );
        }
        // Non-twinkling, non-warping stars are already in the static layer.
      }

      ctx.globalCompositeOperation = 'source-over';
      rafId = window.requestAnimationFrame(frame);
    }

    rafId = window.requestAnimationFrame(frame);

    function handleResize(): void {
      resize();
      generate();
      buildStaticLayer();
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      staticCanvas = null;
    };
  }, [starCount, warpProgressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'pointer-events-none absolute inset-0'}
    />
  );
}

export default Starfield;
