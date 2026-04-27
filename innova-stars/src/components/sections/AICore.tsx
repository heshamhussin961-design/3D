'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { FloatingLabel } from '@/components/ui/FloatingLabel';
import { FrameSequence } from '@/components/ui/FrameSequence';
import { SectionNumber } from '@/components/ui/SectionNumber';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CAPABILITIES = [
  'Predictive Analytics',
  'AI Content Generation',
  'Smart Automation',
  'Real-time Insights',
];

/**
 * AI Core — "The Intelligence Core".
 *
 * Desktop: scroll-scrubbed neural-network frame sequence with four corner
 * callouts.
 * Mobile: static first frame + a 2-column grid of capability chips beneath
 * the visual (corner labels overlap on small viewports — this reads cleanly).
 */
export function AICore(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const header = headerRef.current;
      const section = sectionRef.current;
      if (!section) return;

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

      const labels = section.querySelectorAll('[data-floating-label]');
      if (labels.length > 0) {
        gsap.from(labels, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            once: true,
          },
        });
      }

      const chips = section.querySelectorAll('[data-mobile-chip]');
      if (chips.length > 0) {
        gsap.from(chips, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="ai-core"
      aria-label="AI capabilities"
      className="relative bg-black"
    >
      <div
        ref={headerRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto max-w-3xl px-6 pt-16 text-center md:pt-28"
      >
        <div data-reveal className="flex items-center justify-center gap-3">
          <SectionNumber number="03" />
          <span aria-hidden="true" className="h-px w-8 bg-gold/30" />
          <p className="font-orbitron text-[10px] font-semibold tracking-[0.3em] text-gold md:text-xs">
            POWERED BY AI
          </p>
        </div>
        <h2
          data-reveal
          className="mt-4 font-orbitron text-3xl font-bold leading-tight sm:text-4xl md:text-[64px]"
          style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
        >
          <span className="text-gradient-gold">The Intelligence Core</span>
        </h2>
        <p
          data-reveal
          className="mt-3 font-inter text-sm text-white/60 md:mt-4 md:text-lg"
        >
          Where data meets imagination, and insight becomes action
        </p>
      </div>

      <div className="relative">
        <FrameSequence
          basePath="/frames/ai/"
          frameCount={192}
          framePrefix="frame_"
          frameExtension="webp"
          padLength={4}
          triggerStart="top top"
          triggerEnd="bottom top"
          scrub={1}
          pin
          className="h-screen w-full"
          mobileFallback="video-scrub"
          mobileVideoSrc="/videos/neural-scrub.mp4"
        />

        {/* Desktop floating corner labels (hidden on mobile to avoid overlap). */}
        <div className="hidden md:block">
          <FloatingLabel corner="top-left">Predictive Analytics</FloatingLabel>
          <FloatingLabel corner="top-right">AI Content Generation</FloatingLabel>
          <FloatingLabel corner="bottom-left">Smart Automation</FloatingLabel>
          <FloatingLabel corner="bottom-right">Real-time Insights</FloatingLabel>
        </div>
      </div>

      {/* Mobile capability grid — stacked under the visual. */}
      <div className="px-6 pb-16 pt-10 md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap}
              data-mobile-chip
              className="flex items-center gap-2 border border-gold/25 bg-black/60 px-3 py-3 backdrop-blur-md"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.9)]"
              />
              <span className="font-orbitron text-[11px] font-medium tracking-[0.1em] text-gold">
                {cap}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AICore;
