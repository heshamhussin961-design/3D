'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ParticleField } from '@/components/ui/ParticleField';

import { STATS } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Stats — "Star Power".
 *
 * Animated gradient background + ambient gold particles + four headline
 * metrics with scroll-triggered count-up animations. Semantic `dl`/`dt`/`dd`
 * for each metric so the numbers map correctly in assistive tech.
 */
export function Stats(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDListElement | null>(null);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (header) {
        const reveals = header.querySelectorAll('[data-reveal]');
        gsap.set(reveals, { autoAlpha: 0, y: 24 });
        gsap.to(reveals, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      const grid = gridRef.current;
      if (grid) {
        const stats = grid.querySelectorAll('[data-stat]');
        gsap.set(stats, { autoAlpha: 0, y: 40 });
        gsap.to(stats, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="stats"
      aria-label="Our results by the numbers"
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32"
    >
      {/* Readability scrim over the global video backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />
      <ParticleField count={30} />

      <div
        ref={headerRef}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <div data-reveal className="flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-gold/30" />
          <p className="font-orbitron text-xs font-semibold tracking-[0.3em] text-gold">
            BY THE NUMBERS
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-gold/30" />
        </div>
        <h2
          data-reveal
          className="mt-4 font-orbitron text-5xl font-bold text-white md:text-[72px]"
        >
          Star Power
        </h2>
        <p
          data-reveal
          className="mt-4 font-inter text-base text-white/60 md:text-xl"
        >
          Results that speak louder than promises
        </p>
      </div>

      <dl
        ref={gridRef}
        className="relative z-10 mx-auto mt-12 grid max-w-[1400px] grid-cols-1 gap-10 md:mt-20 md:grid-cols-2 md:gap-14 lg:grid-cols-4 lg:divide-x lg:divide-gold/20 lg:gap-0"
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            data-stat
            className="group flex flex-col items-center px-6 text-center transition-transform duration-300 lg:hover:scale-[1.03]"
          >
            <dd className="order-1 m-0 font-orbitron text-[56px] font-black leading-none tracking-tight text-gold gold-glow sm:text-[72px] md:text-[80px] lg:text-[120px]">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </dd>
            <span
              aria-hidden="true"
              className="order-2 mt-4 block h-0.5 w-10 bg-gold"
            />
            <dt className="order-3 mt-4 font-orbitron text-base font-medium uppercase tracking-[0.1em] text-white md:text-lg">
              {stat.label}
            </dt>
            {stat.description ? (
              <dd className="order-4 mt-2 max-w-[240px] font-inter text-sm text-white/50 transition-colors duration-300 group-hover:text-white/80">
                {stat.description}
              </dd>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Stats;
