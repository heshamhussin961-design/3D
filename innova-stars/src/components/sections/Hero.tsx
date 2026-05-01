'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { MagneticWordmark } from '@/components/ui/MagneticWordmark';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TAGLINE = 'LEAD YOU TO THE STARS';

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
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8, filter: 'blur(10px)' });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      gsap.set('[data-cta]', { opacity: 0, y: 20 });

      const taglineLetters =
        taglineRef.current?.querySelectorAll<HTMLSpanElement>('[data-letter]') ??
        [];
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
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        1.8,
      );
      intro.to(
        '[data-cta]',
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        2.2,
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

  const tagline = splitLetters(TAGLINE);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Innova Stars hero"
      className="relative h-screen w-full overflow-hidden"
    >
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center will-change-[transform,opacity,filter]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-center">
          <div
            ref={logoRef}
            className="font-orbitron text-[28px] font-black tracking-[0.05em] text-gold gold-glow sm:text-[36px] md:text-[64px]"
          >
            <MagneticWordmark
              text="INNOVA STARS"
              strength={14}
              radius={180}
            />
          </div>

          <h1
            ref={taglineRef}
            className="mt-5 font-orbitron text-[26px] font-bold leading-tight tracking-[0.08em] text-white sm:text-[32px] sm:tracking-[0.1em] md:mt-10 md:text-[72px]"
            style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.25)' }}
          >
            {tagline.map((letter) => (
              <span
                key={letter.key}
                data-letter
                className="inline-block whitespace-pre"
              >
                {letter.char === ' ' ? ' ' : letter.char}
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="mt-5 font-inter text-sm text-white/75 sm:text-base md:text-xl"
            style={{ textShadow: '0 0 16px rgba(0,0,0,0.6)' }}
          >
            <span className="font-orbitron tracking-[0.18em] text-gold">
              INNOVA STARS
            </span>
            <span className="mx-2 text-white/40">—</span>
            Innovation meets imagination
          </p>

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
