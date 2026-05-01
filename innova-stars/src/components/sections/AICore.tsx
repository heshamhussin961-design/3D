'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { FloatingLabel } from '@/components/ui/FloatingLabel';
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
 * AI Core — text-and-HUD overlay over the global Innova.mp4 backdrop.
 *
 * No own video; this section adds a cyber-grid + bracket frame that frames
 * the running backdrop so the same video reads as a "neural mission core"
 * here, distinct from the cinematic hero treatment.
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
      className="relative"
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
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.7)' }}
        >
          Where data meets imagination, and insight becomes action
        </p>
      </div>

      <div className="relative h-screen overflow-hidden">
        {/* Cyber grid overlay — masked radial so it reads as a HUD frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />

        {/* Inner soft vignette so labels stay readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(circle at center, rgba(212,175,55,0.18) 0%, transparent 45%), radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* HUD bracket corners */}
        <HudBracket className="left-6 top-6 md:left-10 md:top-10" pos="tl" />
        <HudBracket className="right-6 top-6 md:right-10 md:top-10" pos="tr" />
        <HudBracket
          className="left-6 bottom-6 md:left-10 md:bottom-10"
          pos="bl"
        />
        <HudBracket
          className="right-6 bottom-6 md:right-10 md:bottom-10"
          pos="br"
        />

        {/* Live data ticker */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold/70 md:bottom-10 md:text-xs"
        >
          <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-gold align-middle shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
          NEURAL · 0x7F · STREAMING
        </div>

        {/* Desktop floating corner labels */}
        <div className="hidden md:block">
          <FloatingLabel corner="top-left">Predictive Analytics</FloatingLabel>
          <FloatingLabel corner="top-right">AI Content Generation</FloatingLabel>
          <FloatingLabel corner="bottom-left">Smart Automation</FloatingLabel>
          <FloatingLabel corner="bottom-right">Real-time Insights</FloatingLabel>
        </div>
      </div>

      {/* Mobile capability grid */}
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

function HudBracket({
  className,
  pos,
}: {
  className: string;
  pos: 'tl' | 'tr' | 'bl' | 'br';
}): JSX.Element {
  const lines: Record<typeof pos, string> = {
    tl: 'border-t-2 border-l-2',
    tr: 'border-t-2 border-r-2',
    bl: 'border-b-2 border-l-2',
    br: 'border-b-2 border-r-2',
  };
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-10 w-10 border-gold/80 ${lines[pos]} ${className}`}
      style={{ boxShadow: '0 0 20px rgba(212,175,55,0.25)' }}
    />
  );
}

export default AICore;
