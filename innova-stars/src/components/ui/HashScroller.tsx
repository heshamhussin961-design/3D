'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useLenisInstance } from '@/components/providers/LenisProvider';

/**
 * Resolves URL hashes to smooth scrolls.
 *
 * Two cases this fixes:
 *   1. Direct load of `/...#section` — scrolls to the target after the
 *      page (and Lenis) mounts.
 *   2. Cross-page nav with `<Link href="/#section">` from `/about` etc. —
 *      Next.js routes us but doesn't auto-scroll to the hash; we do it
 *      here when the pathname becomes `/` and the hash is present.
 *
 * Lives once in the root layout under LenisProvider so all routes share
 * the behavior.
 */
export function HashScroller(): null {
  const pathname = usePathname();
  const lenis = useLenisInstance();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    // Wait one frame so the target section is in the DOM, then scroll.
    let attempts = 0;
    function tryScroll(): void {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { offset: -80 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      // Section may render lazily; retry briefly.
      if (attempts++ < 20) {
        window.setTimeout(tryScroll, 80);
      }
    }
    window.requestAnimationFrame(tryScroll);
  }, [pathname, lenis]);

  return null;
}

export default HashScroller;
