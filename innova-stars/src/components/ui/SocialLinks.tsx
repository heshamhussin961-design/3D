'use client';

import type { ComponentType, SVGProps } from 'react';

import { SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

interface SocialLinksProps {
  className?: string;
}

interface SocialEntry {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

// Lucide v1 dropped brand icons, so these are hand-written.
function InstagramIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.5c0-1.3-.03-3-1.85-3-1.85 0-2.13 1.3-2.13 2.92V21H9V9z" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.32 5.56a5.12 5.12 0 0 1-5.12-5.12h-3.42v13.86a2.85 2.85 0 1 1-2.85-2.85c.16 0 .31.01.46.04V7.95a6.28 6.28 0 1 0 5.81 6.26V8.41a8.54 8.54 0 0 0 5.12 1.7V6.69a5.1 5.1 0 0 1 0-1.13z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  // X / Twitter glyph
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.53 3H20.7l-7 7.99L22 21h-6.36l-5-6.53L4.9 21H1.72l7.5-8.56L1.5 3h6.52l4.52 5.98L17.53 3zm-1.11 16.05h1.76L7.62 4.86H5.74l10.68 14.19z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.48 3.5 12 3.5 12 3.5s-7.48 0-9.37.56A3.02 3.02 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 0 0 2.13 2.14C4.52 20.5 12 20.5 12 20.5s7.48 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
    </svg>
  );
}

const ENTRIES: SocialEntry[] = [
  { label: 'Instagram', href: SITE_CONFIG.social.instagram, Icon: InstagramIcon },
  { label: 'LinkedIn', href: SITE_CONFIG.social.linkedin, Icon: LinkedInIcon },
  { label: 'TikTok', href: SITE_CONFIG.social.tiktok, Icon: TikTokIcon },
  { label: 'Twitter', href: SITE_CONFIG.social.twitter, Icon: TwitterIcon },
  { label: 'YouTube', href: SITE_CONFIG.social.youtube, Icon: YouTubeIcon },
];

/** Horizontal row of social icon buttons with gold hover. */
export function SocialLinks({ className }: SocialLinksProps): JSX.Element {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {ENTRIES.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center bg-white/5 text-white/70 transition-all duration-200 hover:scale-110 hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Icon className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SocialLinks;
