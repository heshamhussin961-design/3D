'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils/cn';

const HIDE_AFTER_MS = 3000;
const HIDE_AFTER_SCROLL_PX = 100;

/**
 * Bottom-of-viewport scroll cue: a small "SCROLL" label and a bouncing
 * chevron. Auto-fades after a few seconds or once the user has scrolled.
 */
export function ScrollIndicator(): JSX.Element {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), HIDE_AFTER_MS);

    function handleScroll(): void {
      if (window.scrollY > HIDE_AFTER_SCROLL_PX) {
        setVisible(false);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700 ease-out',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <span className="font-inter text-[10px] tracking-[0.3em] text-white/50 md:text-xs">
        SCROLL
      </span>
      <ChevronDown
        className="h-4 w-4 animate-bounce text-white/60"
        strokeWidth={1.5}
      />
    </div>
  );
}

export default ScrollIndicator;
