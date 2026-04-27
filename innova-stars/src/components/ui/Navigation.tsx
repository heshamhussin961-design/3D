'use client';

import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLenisInstance } from '@/components/providers/LenisProvider';
import { Logo } from '@/components/ui/Logo';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

const ContactModal = dynamic(
  () => import('@/components/ui/ContactModal').then((m) => m.ContactModal),
  { ssr: false },
);

const SECTION_IDS = ['home', 'services', 'ai-core', 'stats', 'contact'];

/**
 * Sticky top navigation. Transparent at page top, frosted + bordered when
 * the user has scrolled.
 *
 * Active link logic:
 *   - On the home page (`/`), uses IntersectionObserver to highlight the
 *     section the user is currently scrolled to.
 *   - Off home (e.g. `/work`, `/about`), highlights the link whose path
 *     matches the current pathname.
 *
 * Click logic:
 *   - Pure `/path` links → Next.js `<Link>` navigation.
 *   - `/#anchor` (cross-page anchor) → if already on home, smooth-scroll
 *     via Lenis; otherwise navigate to home with the hash.
 */
export function Navigation(): JSX.Element {
  const lenis = useLenisInstance();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [contactOpen, setContactOpen] = useState<boolean>(false);

  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActiveSectionId(id);
          });
        },
        { threshold: 0.35 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  function isActiveLink(href: string): boolean {
    if (href === '/') return isHome && activeSectionId === 'home';
    if (href.startsWith('/#')) {
      return isHome && href.replace('/#', '') === activeSectionId;
    }
    // For pure paths (/work, /about), match by pathname.
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleNavClick(e: React.MouseEvent, href: string): void {
    // Cross-page anchors (`/#contact`): on home, smooth-scroll. Off home,
    // let Next handle the navigation so we land at the section.
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (isHome) {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el && lenis) lenis.scrollTo(el, { offset: -80 });
        else if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return; // off-home: native <a>/<Link> handles the route + hash
    }

    // Plain `/` to top, or any other path → let Next.js handle.
    if (href === '/' && isHome) {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Else: <Link>'s default navigation runs.
  }

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-gold/10 bg-deep-space/80 py-3 backdrop-blur-xl md:py-4'
            : 'bg-transparent py-4 md:py-6',
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'group relative font-inter text-sm font-medium tracking-[0.05em] transition-colors duration-200',
                    isActive ? 'text-gold' : 'text-white hover:text-gold',
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-1 left-0 block h-px bg-gold transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <MagneticButton
              type="button"
              onClick={() => setContactOpen(true)}
              className="hidden bg-gold px-6 py-2.5 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-200 hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] sm:inline-block"
              strength={10}
              innerStrength={16}
            >
              Start Project
            </MagneticButton>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenContact={() => setContactOpen(true)}
      />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default Navigation;
