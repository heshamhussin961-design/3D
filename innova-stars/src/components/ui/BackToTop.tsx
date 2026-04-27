'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLenisInstance } from '@/components/providers/LenisProvider';

/**
 * Floating "back to top" button. Fades in after the user has scrolled
 * 500px. Smooth-scrolls via Lenis when clicked.
 */
export function BackToTop(): JSX.Element {
  const lenis = useLenisInstance();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    function onScroll(): void {
      setVisible(window.scrollY > 500);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleClick(): void {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="back-to-top"
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={handleClick}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export default BackToTop;
