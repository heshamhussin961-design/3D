'use client';

import { useLenisInstance } from '@/components/providers/LenisProvider';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

/**
 * Innova Stars wordmark + star glyph. Click scrolls to the top smoothly
 * via Lenis (native fallback if Lenis isn't mounted for some reason).
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
        'group inline-flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-gold transition-transform duration-300 group-hover:rotate-[20deg]"
        aria-hidden="true"
      >
        <path
          d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-orbitron text-base font-bold tracking-[0.1em] text-gold md:text-lg">
        INNOVA STARS
      </span>
    </a>
  );
}

export default Logo;
