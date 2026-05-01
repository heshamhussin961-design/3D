'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Brain,
  Code,
  Globe,
  Share2,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { ServiceCard } from '@/components/ui/ServiceCard';
import {
  SERVICES,
  SERVICES_BY_ID,
  type Service,
  type ServiceIcon,
  getConnectionEdges,
} from '@/lib/constants/services';
import { cn } from '@/lib/utils/cn';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ICON_MAP: Record<ServiceIcon, LucideIcon> = {
  Brain,
  Share2,
  Video,
  Users,
  TrendingUp,
  Smartphone,
  Sparkles,
  Code,
  ShoppingCart,
  Globe,
  Star,
};

const VIEWBOX_W = 1000;
const VIEWBOX_H = 600;
const DECORATIVE_STARS_COUNT = 40;

interface TooltipState {
  service: Service;
  /** Screen-space position of the node in the container's coordinate space. */
  top: number;
  left: number;
}

function generateBackgroundStars(): {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}[] {
  // Deterministic seed so SSR and CSR match.
  const stars: { cx: number; cy: number; r: number; opacity: number }[] = [];
  let seed = 12345;
  const rand = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < DECORATIVE_STARS_COUNT; i++) {
    stars.push({
      cx: rand() * VIEWBOX_W,
      cy: rand() * VIEWBOX_H,
      r: 0.5 + rand() * 1.2,
      opacity: 0.2 + rand() * 0.4,
    });
  }
  return stars;
}

/**
 * Desktop constellation — SVG connection lines + static decorative stars
 * as a backdrop, with HTML-positioned nodes for crisp icons and robust
 * hover/focus handling.
 *
 * The whole graph animates in on scroll:
 *   1. Connection lines draw themselves (dashoffset → 0) staggered.
 *   2. Each node fades in + pulses.
 *   3. Labels fade in after their node.
 *
 * Hover on a node: highlight its edges, dim the rest, show a tooltip.
 * Keyboard: each node is a `<button>` in tab order; focus mirrors hover.
 */
export function ConstellationMap(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const edges = useMemo(() => getConnectionEdges(), []);
  const bgStars = useMemo(() => generateBackgroundStars(), []);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const lines =
        svgRef.current?.querySelectorAll<SVGLineElement>('[data-edge]') ?? [];
      const nodes =
        container.querySelectorAll<HTMLElement>('[data-node]') ?? [];
      const labels =
        container.querySelectorAll<HTMLElement>('[data-node-label]') ?? [];

      lines.forEach((line) => {
        const x1 = Number(line.getAttribute('x1'));
        const y1 = Number(line.getAttribute('y1'));
        const x2 = Number(line.getAttribute('x2'));
        const y2 = Number(line.getAttribute('y2'));
        const length = Math.hypot(x2 - x1, y2 - y1);
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
      });

      gsap.set(nodes, { opacity: 0, scale: 0 });
      gsap.set(labels, { opacity: 0, y: -6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(lines, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        stagger: 0.08,
      });
      tl.to(
        nodes,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.8)',
          stagger: 0.08,
        },
        0.4,
      );
      tl.to(
        labels,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
        },
        '-=0.3',
      );
    },
    { scope: containerRef },
  );

  function handleEnter(service: Service, el: HTMLElement | null): void {
    if (!el || !containerRef.current) return;
    setActiveId(service.id);
    const containerRect = containerRef.current.getBoundingClientRect();
    const nodeRect = el.getBoundingClientRect();
    const top = nodeRect.top - containerRect.top + nodeRect.height / 2;
    const left = nodeRect.left - containerRect.left + nodeRect.width + 16;
    setTooltip({ service, top, left });
  }

  function handleLeave(): void {
    setActiveId(null);
    setTooltip(null);
  }

  function isEdgeActive(fromId: string, toId: string): boolean {
    return activeId !== null && (fromId === activeId || toId === activeId);
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[1200px]"
      style={{ aspectRatio: `${VIEWBOX_W} / ${VIEWBOX_H}` }}
      onMouseLeave={handleLeave}
    >
      {/* Subtle gold glow behind the whole graph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
        }}
      />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {bgStars.map((s, i) => (
          <circle
            key={`bg-${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="white"
            opacity={s.opacity}
          />
        ))}

        {edges.map((edge) => {
          const active = isEdgeActive(edge.fromId, edge.toId);
          const faded = activeId !== null && !active;
          return (
            <line
              key={`${edge.fromId}-${edge.toId}`}
              data-edge
              x1={(edge.from.x / 100) * VIEWBOX_W}
              y1={(edge.from.y / 100) * VIEWBOX_H}
              x2={(edge.to.x / 100) * VIEWBOX_W}
              y2={(edge.to.y / 100) * VIEWBOX_H}
              stroke="#D4AF37"
              strokeWidth={active ? 2 : 1}
              strokeOpacity={faded ? 0.1 : active ? 1 : 0.4}
              style={{ transition: 'stroke-opacity 0.3s, stroke-width 0.3s' }}
            />
          );
        })}
      </svg>

      {SERVICES.map((service) => {
        const Icon = ICON_MAP[service.icon];
        const faded = activeId !== null && activeId !== service.id;
        const hub = service.isHub === true;
        return (
          <button
            key={service.id}
            data-node
            type="button"
            aria-label={service.name}
            aria-describedby={`${service.id}-label`}
            className={cn(
              'group/node absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-transparent p-0 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space',
              faded ? 'opacity-30' : 'opacity-100',
            )}
            style={{
              top: `${service.position.y}%`,
              left: `${service.position.x}%`,
              transform: `translate(-50%, -50%) scale(${activeId === service.id ? 1.4 : 1})`,
            }}
            onMouseEnter={(e) => handleEnter(service, e.currentTarget)}
            onFocus={(e) => handleEnter(service, e.currentTarget)}
            onBlur={handleLeave}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-0 animate-pulse-glow rounded-full',
                hub ? '-m-9' : '-m-5',
              )}
              style={{
                background: hub
                  ? 'radial-gradient(circle, rgba(212,175,55,0.7) 0%, rgba(212,175,55,0) 70%)'
                  : 'radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0) 70%)',
              }}
            />
            <span
              className={cn(
                'relative flex items-center justify-center rounded-full bg-gold text-black',
                hub
                  ? 'h-16 w-16 shadow-[0_0_36px_rgba(212,175,55,0.95)] ring-2 ring-gold/60'
                  : 'h-10 w-10 shadow-[0_0_20px_rgba(212,175,55,0.7)]',
              )}
            >
              <Icon
                className={hub ? 'h-7 w-7' : 'h-4 w-4'}
                strokeWidth={2.2}
              />
            </span>
          </button>
        );
      })}

      {SERVICES.map((service) => {
        const hub = service.isHub === true;
        return (
          <div
            key={`${service.id}-label`}
            id={`${service.id}-label`}
            data-node-label
            className={cn(
              'pointer-events-none absolute -translate-x-1/2 px-2 text-center font-orbitron tracking-[0.1em] transition-colors duration-300',
              hub
                ? 'text-[14px] font-bold tracking-[0.2em] text-gold'
                : 'text-[11px] font-medium text-white/70',
              activeId === service.id && 'text-gold',
            )}
            style={{
              top: `calc(${service.position.y}% + ${hub ? 44 : 28}px)`,
              left: `${service.position.x}%`,
            }}
          >
            {service.name}
          </div>
        );
      })}

      {tooltip ? (
        <div
          className="pointer-events-none absolute z-20 -translate-y-1/2 animate-in"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          <ServiceCard
            service={SERVICES_BY_ID[tooltip.service.id]}
            variant="tooltip"
          />
        </div>
      ) : null}
    </div>
  );
}

export default ConstellationMap;
