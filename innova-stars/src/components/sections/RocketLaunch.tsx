'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADLINE = 'Ignition Sequence Engaged';
const SUBLINE = 'Strap in. The next frontier of marketing is taking off.';

function splitLetters(text: string): { char: string; key: string }[] {
  return Array.from(text).map((char, i) => ({ char, key: `${char}-${i}` }));
}

/**
 * Rocket Launch — pure text-reveal section. No backdrop bars or boxes;
 * lets the global Innova video flow through cleanly while the headline
 * animates in over it.
 */
export function RocketLaunch(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const tickerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const headlineLetters =
        headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          '[data-letter]',
        ) ?? [];

      gsap.set(headlineLetters, { opacity: 0, y: 40, rotateX: -45 });
      gsap.set(sublineRef.current, { opacity: 0, y: 20 });
      gsap.set(tickerRef.current, { opacity: 0, x: -20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to(tickerRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
      tl.to(
        headlineLetters,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.025,
        },
        '-=0.2',
      );
      tl.to(
        sublineRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4',
      );
    },
    { scope: sectionRef },
  );

  const letters = splitLetters(HEADLINE);

  return (
    <section
      ref={sectionRef}
      aria-label="Mission ignition"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* HUD ticker */}
      <div
        ref={tickerRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-10 z-30 flex items-center gap-2 font-orbitron text-[10px] uppercase tracking-[0.3em] text-gold/80 md:left-12"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.9)]" />
        <span>REC · MISSION 01 · LIVE</span>
      </div>

      {/* Centered headline reveal */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <h2
          ref={headlineRef}
          className="font-orbitron text-[36px] font-black leading-[1.05] tracking-[0.02em] text-white sm:text-[48px] md:text-[88px]"
          style={{
            textShadow:
              '0 0 30px rgba(0,0,0,0.6), 0 0 60px rgba(212,175,55,0.25)',
            perspective: '600px',
          }}
        >
          {letters.map((letter) => (
            <span
              key={letter.key}
              data-letter
              className="inline-block whitespace-pre will-change-transform"
            >
              {letter.char}
            </span>
          ))}
        </h2>

        <p
          ref={sublineRef}
          className="mt-6 font-inter text-base text-white/85 sm:text-lg md:text-xl"
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.7)' }}
        >
          {SUBLINE}
        </p>
      </div>
    </section>
  );
}

export default RocketLaunch;
