'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

interface TeamGridProps {
  members: TeamMember[];
}

/**
 * Animated team grid:
 *   1. Scroll-in: each card fades up with a stagger.
 *   2. Hover: photo gently zooms, gold ring lights up, bio brightens, the
 *      whole card lifts. Pointer-driven 3D tilt nudges the photo toward
 *      the cursor.
 *   3. Continuous: a subtle gold-glow halo behind each photo pulses on
 *      its own scroll-rev timeline so the row feels alive at rest.
 */
export function TeamGrid({ members }: TeamGridProps): JSX.Element {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>('[data-team-card]');

      gsap.set(cards, { opacity: 0, y: 60, scale: 0.94 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          once: true,
        },
      });

      // Continuous halo pulse on each photo, slightly out of phase.
      const halos = grid.querySelectorAll<HTMLElement>('[data-team-halo]');
      halos.forEach((el, i) => {
        gsap.to(el, {
          opacity: 0.55,
          scale: 1.08,
          duration: 2 + i * 0.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });
      });
    },
    { scope: gridRef },
  );

  return (
    <div
      ref={gridRef}
      className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {members.map((m) => (
        <TeamCard key={m.id} member={m} />
      ))}
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }): JSX.Element {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>): void {
    const card = cardRef.current;
    const photo = photoRef.current;
    if (!card || !photo) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(photo, {
      rotateX: -y * 8,
      rotateY: x * 10,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  function handleLeave(): void {
    const photo = photoRef.current;
    if (!photo) return;
    gsap.to(photo, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  }

  return (
    <div
      ref={cardRef}
      data-team-card
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative flex flex-col items-center gap-5 border border-gold/15 bg-black/30 p-8 transition-all duration-500 hover:border-gold/50 hover:bg-black/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)]"
      style={{ perspective: '1000px' }}
    >
      {/* Pulsing gold halo behind the photo */}
      <div
        aria-hidden="true"
        data-team-halo
        className="pointer-events-none absolute left-1/2 top-12 h-44 w-44 -translate-x-1/2 rounded-full opacity-0 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0) 70%)',
        }}
      />

      {/* Photo with 3D tilt + ring */}
      <div
        ref={photoRef}
        className="relative h-40 w-40 transition-transform duration-300 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/60 via-gold/20 to-transparent opacity-50 blur-md transition-opacity duration-500 group-hover:opacity-90"
        />
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={`${member.name} — ${member.role}`}
            loading="lazy"
            className="relative h-40 w-40 rounded-full object-cover ring-2 ring-gold/40 transition-all duration-500 group-hover:scale-[1.04] group-hover:ring-gold"
          />
        ) : (
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gold font-orbitron text-3xl font-bold text-black ring-2 ring-gold/40">
            {member.initials}
          </div>
        )}

        {/* Orbital ring accent */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-full border border-dashed border-gold/30 opacity-0 transition-all duration-700 group-hover:rotate-45 group-hover:opacity-100"
        />
      </div>

      <div className="text-center">
        <p className="font-orbitron text-lg font-semibold text-white">
          {member.name}
        </p>
        <p className="mt-1 font-inter text-xs uppercase tracking-[0.22em] text-gold">
          {member.role}
        </p>
      </div>

      <p className="text-center font-inter text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
        {member.bio}
      </p>
    </div>
  );
}

export default TeamGrid;
