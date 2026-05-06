'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

import { ConstellationMap } from '@/components/ui/ConstellationMap';

import { ServiceCard } from '@/components/ui/ServiceCard';
import { SERVICES } from '@/lib/constants/services';

// Mobile/tablet grid shows individual services only — the constellation
// hub doesn't make sense as a card.
const GRID_SERVICES = SERVICES.filter((s) => !s.isHub);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP_BREAKPOINT = 1024;

/**
 * Services — "Constellation Map".
 *
 * Desktop (≥1024px): interactive SVG constellation overlaid on a subtle
 * golden backdrop frame.
 * Mobile/tablet: stack of `ServiceCard`s, staggered in on scroll.
 */
export function Services(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useIsomorphicLayoutEffect(() => {
    function check(): void {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (header) {
        const reveals = header.querySelectorAll('[data-reveal]');
        gsap.set(reveals, { autoAlpha: 0, y: 30 });
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
        const cards = grid.querySelectorAll('[data-grid-card]');
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [isDesktop] },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="Our services"
      className="relative overflow-hidden px-6 py-24 md:px-10"
    >
      {/* Local readability scrim — keeps text legible against the global
          Innova video backdrop without occluding it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <div ref={headerRef} className="mx-auto max-w-2xl text-center">
        <div data-reveal className="flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-gold/30" />
          <p className="font-orbitron text-xs font-semibold tracking-[0.3em] text-gold">
            OUR SERVICES
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-gold/30" />
        </div>
        <h2
          data-reveal
          className="mt-4 font-bukra text-4xl font-bold text-white md:text-[56px]"
        >
          Our Services
        </h2>
        <p
          data-reveal
          className="mt-4 font-inter text-base text-white/60 md:text-lg"
        >
          A consultation of services guiding your brand to success
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-[1200px]">
        {isDesktop ? (
          <ConstellationMap />
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {GRID_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                data-grid-card
                className="block"
              >
                <ServiceCard service={service} variant="grid" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;
