'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'is-cookie-consent';

/**
 * Cookie consent banner. Shows once per browser; choice is persisted in
 * `localStorage`. Both buttons dismiss the banner — analytics scripts can
 * read the value to decide whether to load.
 */
export function CookieBanner(): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage may be blocked — just don't show the banner.
    }
  }, []);

  function persist(choice: 'accepted' | 'rejected'): void {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-3xl border border-gold/30 bg-black/80 p-5 backdrop-blur-md md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div>
              <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                We use minimal cookies
              </p>
              <p className="mt-2 font-inter text-sm leading-relaxed text-white/75">
                Essential cookies keep the site running, and anonymous analytics
                help us understand what works. No advertising or cross-site
                tracking.{' '}
                <Link
                  href="/cookies"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  Read the cookie policy →
                </Link>
              </p>
            </div>

            <div className="flex flex-shrink-0 gap-3">
              <button
                type="button"
                onClick={() => persist('rejected')}
                className="border border-white/20 px-4 py-2.5 font-orbitron text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => persist('accepted')}
                className="bg-gold px-5 py-2.5 font-orbitron text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-200 hover:shadow-[0_0_24px_rgba(212,175,55,0.5)]"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default CookieBanner;
