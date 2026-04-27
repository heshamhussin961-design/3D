'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useLenisInstance } from '@/components/providers/LenisProvider';
import { Logo } from '@/components/ui/Logo';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { NAV_LINKS } from '@/lib/constants';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

/**
 * Full-screen mobile nav overlay. Slides in from the right, locks body
 * scroll, and returns focus on close. Framer Motion drives the animations.
 */
export function MobileMenu({
  open,
  onClose,
  onOpenContact,
}: MobileMenuProps): JSX.Element {
  const lenis = useLenisInstance();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeydown(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeydown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeydown);
    };
  }, [open, onClose]);

  // Routing-aware: cross-page anchors navigate, in-page anchors smooth-scroll.
  function navigate(href: string): void {
    const isHome = pathname === '/';
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (isHome) {
        const el = document.getElementById(id);
        if (el && lenis) lenis.scrollTo(el, { offset: -80 });
        else if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(href);
      }
    } else if (href === '/' && isHome) {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push(href);
    }
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[90] flex flex-col bg-deep-space px-6 pb-10 pt-6"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-white/80 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                onClick={() => navigate(link.href)}
                className="font-orbitron text-3xl font-medium tracking-[0.05em] text-white transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:text-gold"
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="bg-gold px-10 py-4 font-orbitron text-sm font-semibold uppercase tracking-[0.2em] text-black transition-transform duration-200 hover:scale-[1.03]"
            >
              Start Project
            </button>
            <SocialLinks />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MobileMenu;
