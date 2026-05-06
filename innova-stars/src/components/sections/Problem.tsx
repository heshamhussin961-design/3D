'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, useState } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const OLD_MARKETING_DESKTOP = [
  'AI Solutions',
  'Brand Identity',
  'Social Media',
  'SEO Growth',
  'Influencer Mgmt',
  'Smart Apps',
  'Web Development',
  'Mobile App Development',
  'Brand Strategy',
];

const OLD_MARKETING_MOBILE = [
  'AI Solutions',
  'Brand Identity',
  'Social Media',
  'SEO Growth',
  'Smart Apps',
  'Brand Strategy',
];

const HEADLINE_LINE_1 = 'Traditional marketing';
const HEADLINE_LINE_2 = 'is dead.';
const RISING = 'It’s time to rise above.';

interface BadgePosition {
  left: number;
  top: number;
  rotation: number;
}

/**
 * Deterministic pseudo-random layout for the falling badges. Seeded so that
 * SSR and CSR render identical positions (avoids hydration mismatch) while
 * still looking "scattered".
 */
function generateBadgePositions(count: number): BadgePosition[] {
  const positions: BadgePosition[] = [];
  // A handful of hand-tuned seeds that look scattered without overlap.
  const seeds = [0.14, 0.72, 0.38, 0.91, 0.56, 0.23, 0.08, 0.64];
  for (let i = 0; i < count; i++) {
    const s = seeds[i % seeds.length];
    const left = 8 + ((s * 100 + i * 13) % 80); // 8–88%
    const top = 10 + ((s * 53 + i * 17) % 45); // 10–55% (upper 60%)
    const rotation = ((s * 90 + i * 23) % 30) - 15; // -15° to +15°
    positions.push({ left, top, rotation });
  }
  return positions;
}

function splitLetters(text: string): { char: string; key: string }[] {
  return Array.from(text).map((char, i) => ({ char, key: `${char}-${i}` }));
}

/**
 * Problem — "Earth Perspective".
 *
 * A pinned narrative section. As the user scrolls, the opening headline
 * appears letter by letter, a handful of old-marketing pills fall away,
 * and a gold rising headline takes their place. All driven by a single
 * GSAP timeline scrubbed to scroll.
 */
export function Problem(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const risingRef = useRef<HTMLHeadingElement | null>(null);
  const raysRef = useRef<SVGGElement | null>(null);

  // Always render the desktop list on SSR + first client render so hydration
  // sees identical markup, then collapse to the mobile list after mount.
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    function check(): void {
      setIsMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const words = isMobile ? OLD_MARKETING_MOBILE : OLD_MARKETING_DESKTOP;

  const positions = useMemo(
    () => generateBadgePositions(words.length),
    [words.length],
  );

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) return;

      const mobile = window.innerWidth < 768;

      const headlineLetters =
        headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          '[data-letter]',
        ) ?? [];
      const risingLetters =
        risingRef.current?.querySelectorAll<HTMLSpanElement>('[data-letter]') ??
        [];

      if (mobile) {
        // Mobile: no animation, text visible by default
        return;
      }

      // Desktop: pinned scroll-driven animation
      gsap.set(headlineLetters, { opacity: 0, y: 40 });
      gsap.set(risingLetters, { opacity: 0, y: 40 });
      gsap.set(risingRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      });

      // Timeline spans 1 "unit" — positions below are fractions of total scroll.
      // Phase 1 (0 → 0.15): headline letters appear.
      tl.to(
        headlineLetters,
        { opacity: 1, y: 0, duration: 0.15, stagger: { each: 0.004 } },
        0,
      );

      // Phase 2 (0.2 → 0.7): badges fall one after another.
      const badges = Array.from(
        sectionRef.current?.querySelectorAll<HTMLDivElement>('[data-badge]') ??
          [],
      );
      badges.forEach((badge, i) => {
        const enter = 0.18 + i * 0.04;
        const fall = 0.25 + i * 0.08;
        tl.fromTo(
          badge,
          { opacity: 0, scale: 0.9, y: -20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.05 },
          enter,
        );
        tl.to(
          badge,
          {
            y: () => window.innerHeight + 200,
            rotation: (i % 2 === 0 ? 1 : -1) * (20 + i * 6),
            scale: 0.6,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.25,
          },
          fall,
        );
      });

      // Phase 1 exit: headline fades when rising starts.
      tl.to(headlineRef.current, { opacity: 0, y: -40, duration: 0.1 }, 0.7);

      // Phase 3 (0.7 → 0.9): rising headline appears.
      tl.to(risingRef.current, { opacity: 1, duration: 0.05 }, 0.7);
      tl.to(
        risingLetters,
        { opacity: 1, y: 0, duration: 0.2, stagger: { each: 0.006 } },
        0.7,
      );

      // Light rays fade in.
      tl.fromTo(
        raysRef.current,
        { opacity: 0 },
        { opacity: 0.3, duration: 0.3 },
        0.6,
      );

      // Phase 4 (0.95 → 1): rising headline fades, rays dim.
      tl.to(risingRef.current, { opacity: 0, duration: 0.05 }, 0.95);
      tl.to(raysRef.current, { opacity: 0, duration: 0.05 }, 0.95);
    },
    { scope: sectionRef, dependencies: [words.length] },
  );

  const headlineLine1 = splitLetters(HEADLINE_LINE_1);
  const headlineLine2 = splitLetters(HEADLINE_LINE_2);
  const risingChars = splitLetters(RISING);

  return (
    <section
      ref={sectionRef}
      aria-label="Why traditional marketing no longer works"
      className="relative min-h-[80vh] w-full overflow-hidden md:h-screen"
    >
      {/* Gold light rays */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full"
      >
        <defs>
          <linearGradient id="ray-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.6)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </linearGradient>
        </defs>
        <g ref={raysRef} opacity={0}>
          {[200, 380, 500, 620, 800].map((x, i) => (
            <polygon
              key={x}
              points={`${x - 40},1000 ${x + 40},1000 ${x + 10 + i * 4},0 ${x - 10 + i * 4},0`}
              fill="url(#ray-gradient)"
            />
          ))}
        </g>
      </svg>

      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 md:h-full md:min-h-0 md:flex-row md:gap-0">
        <h2
          ref={headlineRef}
          className="max-w-5xl text-center font-bukra text-[20px] font-bold leading-[1.15] text-white sm:text-[40px] md:text-[80px]"
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.5)' }}
        >
          <span className="block">
            {headlineLine1.map((letter) => (
              <span
                key={letter.key}
                data-letter
                className="inline-block whitespace-pre"
              >
                {letter.char}
              </span>
            ))}
          </span>
          <span className="mt-2 block md:mt-4">
            {headlineLine2.map((letter) => (
              <span
                key={letter.key}
                data-letter
                className="inline-block whitespace-pre"
              >
                {letter.char}
              </span>
            ))}
          </span>
        </h2>

        <h2
          ref={risingRef}
          className="text-center font-bukra text-[24px] font-semibold leading-tight sm:text-[32px] md:absolute md:left-1/2 md:top-1/2 md:max-w-4xl md:-translate-x-1/2 md:-translate-y-1/2 md:text-[64px]"
          style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
        >
          <span className="text-gradient-gold">
            {risingChars.map((letter) => (
              <span
                key={letter.key}
                data-letter
                className="inline-block whitespace-pre"
              >
                {letter.char}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {/* Falling badges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
      >
        {words.map((word, i) => (
          <div
            key={word}
            data-badge
            style={{
              left: `${positions[i].left}%`,
              top: `${positions[i].top}%`,
              transform: `rotate(${positions[i].rotation}deg)`,
            }}
            className="absolute inline-flex origin-center items-center whitespace-nowrap rounded-full border border-gold/40 bg-gold/10 px-4 py-2 font-inter text-xs font-medium text-gold backdrop-blur-sm md:px-6 md:py-3 md:text-lg"
          >
            {word}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Problem;
