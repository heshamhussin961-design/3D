'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TAGLINE_LINE_1 = 'LEAD YOUR BUSINESS';
const TAGLINE_LINE_2 = 'TO THE STARS';

function splitLetters(text: string): { char: string; key: string }[] {
  return Array.from(text).map((char, index) => ({
    char,
    key: `${char}-${index}`,
  }));
}

/**
 * Hero — "The Launch". The first thing every visitor sees.
 *
 * Layered z-index: starfield (0), content (10), scroll cue (20).
 *
 * Two animation systems run side-by-side:
 *   1. Entry timeline (mounts once) — fade/blur the logo, stagger letters,
 *      reveal subtitle and CTA.
 *   2. Scroll-linked ScrollTrigger — drives both the Starfield warp progress
 *      (via a shared ref) and the hero content fade/translate/blur as the
 *      user scrolls down.
 */
export function Hero(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(10px)',
      });
      gsap.set('[data-cta]', { opacity: 0, y: 20 });

      const taglineLetters =
        taglineRef.current?.querySelectorAll<HTMLSpanElement>(
          '[data-letter]',
        ) ?? [];
      gsap.set(taglineLetters, { opacity: 0, y: 30 });

      const intro = gsap.timeline();
      intro.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out',
      });
      intro.to(
        taglineLetters,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.05,
        },
        0.8,
      );
      intro.to(
        '[data-cta]',
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        1.8,
      );

      // Scroll-linked: content fades, lifts and blurs as the user scrolls
      // out of the hero — handing the visual baton over to the next section.
      const contentFade = gsap.to(contentRef.current, {
        opacity: 0,
        y: -100,
        filter: 'blur(10px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      return () => {
        contentFade.scrollTrigger?.kill();
      };
    },
    { scope: sectionRef },
  );

  const tagline1 = splitLetters(TAGLINE_LINE_1);
  const tagline2 = splitLetters(TAGLINE_LINE_2);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Innova Stars hero"
      className="relative min-h-[80vh] w-full overflow-hidden md:h-screen"
    >
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center will-change-[transform,opacity,filter]"
      >
        <div
          ref={logoRef}
          className="mx-auto flex max-w-[1200px] flex-col items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Innova Stars"
            className="h-32 w-auto md:h-48 lg:h-56"
            style={{
              filter:
                'drop-shadow(0 0 30px rgba(212,175,55,0.55)) drop-shadow(0 0 60px rgba(212,175,55,0.25))',
            }}
          />

          <h1
            ref={taglineRef}
            className="mt-6 rounded-xl bg-black/40 px-8 py-4 font-orbitron text-[26px] font-bold leading-[1.05] tracking-[0.08em] text-white backdrop-blur-sm sm:text-[32px] sm:tracking-[0.1em] md:mt-10 md:px-12 md:py-6 md:text-[72px]"
            style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.25)' }}
          >
            <span className="block">
              {tagline1.map((letter) => (
                <span
                  key={letter.key}
                  data-letter
                  className="inline-block whitespace-pre"
                >
                  {letter.char === ' ' ? ' ' : letter.char}
                </span>
              ))}
            </span>
            <span className="mt-2 block md:mt-4">
              {tagline2.map((letter) => (
                <span
                  key={letter.key}
                  data-letter
                  className="inline-block whitespace-pre"
                >
                  {letter.char === ' ' ? ' ' : letter.char}
                </span>
              ))}
            </span>
          </h1>

          <div data-cta className="mt-10 md:mt-12">
            <MagneticButton
              href="/#contact"
              aria-label="Start your mission"
              className="group inline-flex min-h-[52px] items-center gap-3 bg-gold px-10 py-4 font-orbitron text-xs font-semibold uppercase tracking-[0.18em] text-black transition-shadow duration-300 ease-out hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] sm:px-12 sm:py-[18px] sm:text-sm sm:tracking-[0.2em]"
            >
              Start Your Mission
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </MagneticButton>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}

export default Hero;
