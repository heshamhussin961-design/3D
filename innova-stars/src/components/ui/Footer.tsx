'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

import { Logo } from '@/components/ui/Logo';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { SITE_CONFIG } from '@/lib/constants';
import { SERVICES } from '@/lib/constants/services';

const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Work', href: '/work' },
  { label: 'Careers', href: '/about#careers' },
  { label: 'Contact', href: '/#contact' },
];

/**
 * Four-column footer with a bottom bar. Always present — lives inside the
 * root layout below the main content.
 */
export function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-gold/10 bg-black px-6 pb-8 pt-24 md:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="font-orbitron text-xs tracking-[0.2em] text-gold">
            LEAD YOU TO THE STARS
          </p>
          <p className="max-w-xs font-inter text-sm leading-relaxed text-white/60">
            {SITE_CONFIG.description}
          </p>
          <NewsletterForm className="mt-2" />
          <SocialLinks className="mt-3" />
        </div>

        {/* Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Services
          </h3>
          <ul className="flex flex-col gap-3">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href={`/services/${s.id}`}
                  className="font-inter text-sm text-white/60 transition-colors duration-200 hover:text-gold"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h3 className="font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Company
          </h3>
          <ul className="flex flex-col gap-3">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-inter text-sm text-white/60 transition-colors duration-200 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Get In Touch
          </h3>
          <ul className="flex flex-col gap-3 font-inter text-sm text-white/60">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="transition-colors hover:text-gold"
              >
                {SITE_CONFIG.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="transition-colors hover:text-gold"
              >
                {SITE_CONFIG.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              {SITE_CONFIG.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] border-t border-gold/15 pt-6">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="font-inter text-xs text-white/40">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-inter text-xs text-white/40">
            <span className="hidden md:inline">Crafted in UAE</span>
            <a
              href="#privacy"
              className="transition-colors hover:text-gold"
            >
              Privacy
            </a>
            <span aria-hidden="true" className="text-white/20">
              |
            </span>
            <a href="#terms" className="transition-colors hover:text-gold">
              Terms
            </a>
            <span aria-hidden="true" className="text-white/20">
              |
            </span>
            <a href="#cookies" className="transition-colors hover:text-gold">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
