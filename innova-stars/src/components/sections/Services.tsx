'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

import { ConstellationMap } from '@/components/ui/ConstellationMap';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { SectionNumber } from '@/components/ui/SectionNumber';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { SERVICES } from '@/lib/constants/services';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Looping constellation video used as the section's ambient backdrop. */
const BACKDROP_VIDEO = '/videos/constellation.mp4';
/** Poster shown until the video loads (and on `prefers-reduced-motion`). */
const BACKDROP_POSTER = '/frames/services/frame_0180.webp';
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
  // Video is mounted client-only to avoid hydration mismatch — autoplay
  // state diverges between server HTML and client immediately.
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
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
        gsap.from(header.querySelectorAll('[data-reveal]'), {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            once: true,
          },
        });
      }

      const grid = gridRef.current;
      if (grid) {
        gsap.from(grid.querySelectorAll('[data-grid-card]'), {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true,
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
      className="relative overflow-hidden bg-deep-space px-6 py-24 md:px-10"
    >
      {/* Ambient looping constellation backdrop. Static poster on SSR,
          autoplaying video swaps in after mount (avoids hydration mismatch). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {mounted ? (
          <LazyVideo
            src={BACKDROP_VIDEO}
            poster={BACKDROP_POSTER}
            className="h-full w-full object-cover opacity-30"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={BACKDROP_POSTER}
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-space/40 via-deep-space/60 to-deep-space" />
      </div>

      <div ref={headerRef} className="mx-auto max-w-2xl text-center">
        <div data-reveal className="flex items-center justify-center gap-3">
          <SectionNumber number="02" />
          <span aria-hidden="true" className="h-px w-8 bg-gold/30" />
          <p className="font-orbitron text-xs font-semibold tracking-[0.3em] text-gold">
            OUR SERVICES
          </p>
        </div>
        <h2
          data-reveal
          className="mt-4 font-orbitron text-4xl font-bold text-white md:text-[56px]"
        >
          Our Constellation
        </h2>
        <p
          data-reveal
          className="mt-4 font-inter text-base text-white/60 md:text-lg"
        >
          Seven stars guiding your brand to success
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-[1200px]">
        {isDesktop ? (
          <ConstellationMap />
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {SERVICES.map((service) => (
              <div key={service.id} data-grid-card>
                <ServiceCard service={service} variant="grid" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;
