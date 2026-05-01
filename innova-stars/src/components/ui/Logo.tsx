'use client';

import { useLenisInstance } from '@/components/providers/LenisProvider';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

/**
 * Innova Stars brand mark — gold logo image + wordmark. Click scrolls to
 * the top smoothly via Lenis (native fallback if Lenis isn't mounted).
 */
export function Logo({ className }: LogoProps): JSX.Element {
  const lenis = useLenisInstance();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#home"
      onClick={handleClick}
      aria-label="Innova Stars — back to top"
      className={cn(
        'group inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space',
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/innova-logo.svg"
        alt=""
        aria-hidden="true"
        className="h-9 w-auto transition-transform duration-300 group-hover:scale-110 md:h-10"
      />
      <span className="font-orbitron text-base font-bold tracking-[0.1em] text-gold md:text-lg">
        INNOVA STARS
      </span>
    </a>
  );
}

export default Logo;
