'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { SectionNumber } from '@/components/ui/SectionNumber';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactModal = dynamic(
  () => import('@/components/ui/ContactModal').then((m) => m.ContactModal),
  { ssr: false },
);

const HEADLINE = 'Ready to reach the stars?';

function splitLetters(text: string): { char: string; key: string }[] {
  return Array.from(text).map((char, i) => ({ char, key: `${char}-${i}` }));
}

/**
 * CTA — "Mission Control".
 *
 * Emotional finale: a central gold planet with orbital rings, a
 * letter-reveal headline, and a button that opens the contact modal.
 */
export function CTA(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const letters =
        headlineRef.current?.querySelectorAll<HTMLSpanElement>('[data-letter]') ??
        [];

      gsap.set(letters, { opacity: 0, y: 30 });
      gsap.set(contentRef.current?.querySelectorAll('[data-reveal]') ?? [], {
        opacity: 0,
        y: 20,
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        },
      });

      intro.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.03,
      });
      intro.to(
        contentRef.current?.querySelectorAll('[data-reveal]') ?? [],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
        },
        '-=0.3',
      );

    },
    { scope: sectionRef },
  );

  const letters = splitLetters(HEADLINE);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Start your project"
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at center 80%, rgba(212,175,55,0.18) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.7) 100%)',
      }}
    >
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center md:py-32"
      >
        <div data-reveal className="flex items-center justify-center gap-3">
          <SectionNumber number="05" />
          <span aria-hidden="true" className="h-px w-8 bg-gold/30" />
          <p className="font-orbitron text-xs font-semibold tracking-[0.3em] text-gold">
            YOUR JOURNEY STARTS HERE
          </p>
        </div>

        <h2
          ref={headlineRef}
          className="mt-6 font-orbitron text-[28px] font-bold leading-tight sm:text-[36px] md:text-[64px] lg:text-[80px]"
        >
          {letters.map((letter) => (
            <span
              key={letter.key}
              data-letter
              className="inline-block whitespace-pre text-gradient-gold"
            >
              {letter.char}
            </span>
          ))}
        </h2>

        <p
          data-reveal
          className="mt-6 max-w-xl font-inter text-lg text-white/70 md:text-xl"
        >
          Let’s build something extraordinary together.
        </p>

        <div data-reveal className="mt-12">
          <MagneticButton
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex min-h-[56px] animate-pulse-glow items-center gap-3 bg-gold px-10 py-4 font-orbitron text-xs font-semibold uppercase tracking-[0.18em] text-black transition-shadow duration-300 ease-out hover:shadow-[0_0_60px_rgba(212,175,55,0.7)] sm:px-16 sm:py-6 sm:text-sm sm:tracking-[0.2em] md:text-base"
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            strength={20}
            innerStrength={32}
          >
            Start Your Mission
            <Rocket className="h-5 w-5" strokeWidth={2.2} />
          </MagneticButton>
        </div>

        <p
          data-reveal
          className="mt-8 font-inter text-xs tracking-wider text-white/40"
        >
          Or scroll to explore more
        </p>
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

export default CTA;
