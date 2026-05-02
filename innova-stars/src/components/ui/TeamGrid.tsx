'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, useState } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
}

interface TeamGridProps {
  members: TeamMember[];
}

interface CardCenter {
  x: number;
  y: number;
}

/**
 * Premium team grid:
 *  - Counter-rotating orbital rings around each photo (continuous).
 *  - Constellation lines connecting all photos (drawn in on scroll,
 *    pulsing gently afterwards).
 *  - Magnetic cursor pull on each card.
 *  - Shimmer sweep on the role text once after reveal.
 */
export function TeamGrid({ members }: TeamGridProps): JSX.Element {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [centers, setCenters] = useState<CardCenter[]>([]);

  const lgColsClass =
    members.length === 3
      ? 'lg:grid-cols-3'
      : members.length === 4
        ? 'lg:grid-cols-4'
        : 'lg:grid-cols-3';

  // Recompute photo centers (in grid-local coords) so the connection lines
  // line up exactly with each photo. Recomputed on resize.
  useEffect(() => {
    function compute(): void {
      const grid = gridRef.current;
      if (!grid) return;
      const photos = grid.querySelectorAll<HTMLElement>('[data-team-photo]');
      const gridRect = grid.getBoundingClientRect();
      const next: CardCenter[] = [];
      photos.forEach((p) => {
        const r = p.getBoundingClientRect();
        next.push({
          x: r.left - gridRect.left + r.width / 2,
          y: r.top - gridRect.top + r.height / 2,
        });
      });
      setCenters(next);
    }
    compute();
    window.addEventListener('resize', compute);
    const ro =
      typeof ResizeObserver !== 'undefined' && gridRef.current
        ? new ResizeObserver(compute)
        : null;
    if (ro && gridRef.current) ro.observe(gridRef.current);
    return () => {
      window.removeEventListener('resize', compute);
      ro?.disconnect();
    };
  }, [members.length]);

  // Edges between consecutive photos (a chain) — looks like a constellation.
  const edges = useMemo(() => {
    if (centers.length < 2) return [];
    const result: { from: CardCenter; to: CardCenter }[] = [];
    for (let i = 0; i < centers.length - 1; i++) {
      result.push({ from: centers[i], to: centers[i + 1] });
    }
    return result;
  }, [centers]);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>('[data-team-card]');
      const halos = grid.querySelectorAll<HTMLElement>('[data-team-halo]');
      const ringsCw = grid.querySelectorAll<HTMLElement>('[data-ring-cw]');
      const ringsCcw = grid.querySelectorAll<HTMLElement>('[data-ring-ccw]');
      const lines =
        svgRef.current?.querySelectorAll<SVGLineElement>('[data-edge]') ?? [];
      const shimmers = grid.querySelectorAll<HTMLElement>(
        '[data-role-shimmer]',
      );

      // Card reveal stagger.
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.94 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      });

      // Halo gentle pulse.
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

      // Counter-rotating orbital rings.
      ringsCw.forEach((el) => {
        gsap.to(el, {
          rotation: 360,
          duration: 18,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      });
      ringsCcw.forEach((el) => {
        gsap.to(el, {
          rotation: -360,
          duration: 26,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      });

      // Constellation line draw-in.
      lines.forEach((line) => {
        const x1 = Number(line.getAttribute('x1'));
        const y1 = Number(line.getAttribute('y1'));
        const x2 = Number(line.getAttribute('x2'));
        const y2 = Number(line.getAttribute('y2'));
        const length = Math.hypot(x2 - x1, y2 - y1);
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
      });

      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        stagger: 0.18,
        scrollTrigger: { trigger: grid, start: 'top 75%', once: true },
      });

      // Lines breathe gently after they finish drawing.
      lines.forEach((line) => {
        gsap.to(line, {
          strokeOpacity: 0.85,
          duration: 2.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.6 + Math.random() * 0.6,
        });
      });

      // Role shimmer sweep — repeats every few seconds, slightly out of
      // phase between cards. Always lands back on a visible gradient so
      // the text never disappears.
      shimmers.forEach((el, i) => {
        gsap.fromTo(
          el,
          { backgroundPositionX: '100%' },
          {
            backgroundPositionX: '-100%',
            duration: 2.4,
            ease: 'power2.inOut',
            repeat: -1,
            repeatDelay: 4,
            delay: 0.8 + i * 0.4,
          },
        );
      });
    },
    { scope: gridRef, dependencies: [edges.length] },
  );

  return (
    <div ref={gridRef} className="relative mt-12">
      {/* Constellation lines layer — sits behind the cards */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: 'visible' }}
      >
        {edges.map((e, i) => (
          <line
            key={`edge-${i}`}
            data-edge
            x1={e.from.x}
            y1={e.from.y}
            x2={e.to.x}
            y2={e.to.y}
            stroke="#D4AF37"
            strokeWidth={1}
            strokeOpacity={0.45}
            strokeLinecap="round"
          />
        ))}
        {/* End-point dots so the chain visually clamps onto each photo */}
        {centers.map((c, i) => (
          <circle
            key={`dot-${i}`}
            cx={c.x}
            cy={c.y}
            r={2.5}
            fill="#D4AF37"
            opacity={0.7}
          />
        ))}
      </svg>

      <div
        className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${lgColsClass} relative`}
      >
        {members.map((m) => (
          <TeamCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }): JSX.Element {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>): void {
    const card = cardRef.current;
    const photo = photoRef.current;
    const inner = innerRef.current;
    if (!card || !photo || !inner) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // 3D tilt
    gsap.to(photo, {
      rotateX: -y * 8,
      rotateY: x * 10,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Magnetic pull — entire card content drifts toward the cursor.
    gsap.to(inner, {
      x: x * 14,
      y: y * 14,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  function handleLeave(): void {
    const photo = photoRef.current;
    const inner = innerRef.current;
    if (photo) {
      gsap.to(photo, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
    if (inner) {
      gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
    }
  }

  return (
    <div
      ref={cardRef}
      data-team-card
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative flex flex-col items-center gap-5 border border-gold/15 bg-black/40 p-8 backdrop-blur-sm transition-all duration-500 hover:border-gold/50 hover:bg-black/55 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)]"
      style={{ perspective: '1000px' }}
    >
      <div ref={innerRef} className="flex flex-col items-center gap-5">
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

        {/* Photo + orbital rings */}
        <div
          ref={photoRef}
          data-team-photo
          className="relative h-40 w-40 transition-transform duration-300 will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Outer counter-clockwise ring with traveling dots */}
          <svg
            data-ring-ccw
            aria-hidden="true"
            className="pointer-events-none absolute -inset-5 h-[calc(100%+2.5rem)] w-[calc(100%+2.5rem)]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(212,175,55,0.25)"
              strokeWidth="0.6"
              strokeDasharray="2 4"
            />
            <circle cx="50" cy="2" r="1.6" fill="#D4AF37" />
            <circle cx="98" cy="50" r="1.2" fill="#D4AF37" opacity="0.6" />
          </svg>

          {/* Inner clockwise ring */}
          <svg
            data-ring-cw
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(212,175,55,0.4)"
              strokeWidth="0.4"
            />
            <circle cx="50" cy="2" r="1.4" fill="#F0D060" />
          </svg>

          {/* Soft glow disc behind the photo */}
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
        </div>

        {/* Name + role with shimmer sweep */}
        <div className="text-center">
          <p className="font-orbitron text-lg font-semibold text-white">
            {member.name}
          </p>
          <p
            data-role-shimmer
            className="mt-1 bg-clip-text font-inter text-xs uppercase tracking-[0.22em] text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(110deg, #D4AF37 0%, #D4AF37 40%, #FFF6CC 50%, #D4AF37 60%, #D4AF37 100%)',
              backgroundSize: '200% 100%',
              backgroundRepeat: 'repeat-x',
              backgroundPositionX: '0%',
            }}
          >
            {member.role}
          </p>
        </div>

        {member.bio ? (
          <p className="text-center font-inter text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
            {member.bio}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default TeamGrid;
