'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  opacityPhase: number;
  opacitySpeed: number;
  drift: number;
}

interface ParticleFieldProps {
  /** Desktop particle count. Mobile is automatically halved. */
  count?: number;
  className?: string;
}

const GOLD = '212, 175, 55';

/**
 * Ambient gold particles drifting upward on a canvas. Used as a backdrop
 * element on the Stats section. Pure Canvas for cheap compositing; mobile
 * halves the count to keep battery usage reasonable.
 */
export function ParticleField({
  count = 30,
  className,
}: ParticleFieldProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const total = isMobile ? Math.floor(count / 2) : count;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize(): void {
      if (!canvas || !ctx) return;
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticle(startAtRandomY: boolean): Particle {
      return {
        x: Math.random() * width,
        y: startAtRandomY
          ? Math.random() * height
          : height + Math.random() * 60,
        radius: 1 + Math.random() * 2,
        speed: 10 + Math.random() * 25, // px/s
        opacity: 0.2 + Math.random() * 0.4,
        opacityPhase: Math.random() * Math.PI * 2,
        opacitySpeed: 0.4 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 8, // slight horizontal sway
      };
    }

    resize();
    const particles: Particle[] = [];
    for (let i = 0; i < total; i++) {
      particles.push(makeParticle(true));
    }

    let raf = 0;
    let prev = performance.now();

    function frame(now: number): void {
      if (!ctx) return;
      const dt = Math.min(0.1, (now - prev) / 1000);
      prev = now;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y -= p.speed * dt;
        p.x += Math.sin((now / 1000) * 0.5 + p.opacityPhase) * p.drift * dt;
        p.opacityPhase += dt * p.opacitySpeed;

        if (p.y + p.radius < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        const o = p.opacity * (0.6 + 0.4 * Math.sin(p.opacityPhase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${GOLD}, ${o})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(frame);
    }

    raf = window.requestAnimationFrame(frame);

    function handleResize(): void {
      resize();
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        className ?? 'pointer-events-none absolute inset-0 h-full w-full'
      }
    />
  );
}

export default ParticleField;
