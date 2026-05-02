'use client';

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
import type { CSSProperties } from 'react';

import type { Service, ServiceIcon } from '@/lib/constants/services';
import { cn } from '@/lib/utils/cn';

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

interface ServiceCardProps {
  service: Service;
  /** `'tooltip'` — floating card used on desktop hover. `'grid'` — static card used in the mobile layout. */
  variant?: 'tooltip' | 'grid';
  /** Only used when `variant === 'tooltip'`. */
  style?: CSSProperties;
  className?: string;
}

/**
 * Card describing a single service — used both as a hover tooltip over the
 * constellation and as the building block of the mobile grid layout.
 */
export function ServiceCard({
  service,
  variant = 'grid',
  style,
  className,
}: ServiceCardProps): JSX.Element {
  const Icon = ICON_MAP[service.icon];
  const isTooltip = variant === 'tooltip';

  return (
    <article
      aria-label={service.name}
      style={style}
      className={cn(
        'flex flex-col gap-3 border border-gold/30 bg-deep-space/95 p-5 backdrop-blur-md',
        isTooltip
          ? 'pointer-events-none w-[280px] shadow-[0_0_40px_rgba(212,175,55,0.15)]'
          : 'group relative h-full w-full transition-colors duration-300 hover:border-gold/60 hover:bg-deep-space',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-gold" strokeWidth={1.75} />
        <h3 className="font-orbitron text-base font-semibold text-gold">
          {service.name}
        </h3>
      </div>

      <p className="font-inter text-sm leading-relaxed text-white/80">
        {isTooltip ? service.shortDesc : service.longDesc}
      </p>

      {!isTooltip ? (
        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1 font-orbitron text-xs uppercase tracking-[0.2em] text-gold transition-opacity duration-200 group-hover:text-gold-light"
        >
          Learn more <span aria-hidden="true">→</span>
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="mt-1 font-orbitron text-[10px] uppercase tracking-[0.2em] text-gold/80"
        >
          Learn more →
        </span>
      )}
    </article>
  );
}

export default ServiceCard;
