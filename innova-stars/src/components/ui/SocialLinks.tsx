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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
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

function FacebookIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.05 4.91A10 10 0 0 0 4.5 18.46L3 22l3.62-1.47a10 10 0 0 0 4.78 1.22h.01a10 10 0 0 0 7.64-16.84zM12.41 20.1h-.01a8.32 8.32 0 0 1-4.24-1.16l-.3-.18-2.15.87.91-2.1-.2-.32a8.32 8.32 0 1 1 5.99 2.89zm4.78-6.22c-.26-.13-1.55-.77-1.79-.85s-.42-.13-.59.13-.68.85-.83 1.03-.31.19-.57.06a6.81 6.81 0 0 1-2-1.24 7.55 7.55 0 0 1-1.39-1.73c-.15-.26 0-.4.11-.52s.26-.31.39-.46a1.69 1.69 0 0 0 .26-.43.48.48 0 0 0 0-.46c-.06-.13-.59-1.42-.81-1.94s-.43-.44-.59-.45h-.5a.96.96 0 0 0-.7.32 2.92 2.92 0 0 0-.91 2.18 5.06 5.06 0 0 0 1.07 2.69 11.62 11.62 0 0 0 4.45 3.94 14.95 14.95 0 0 0 1.49.55 3.58 3.58 0 0 0 1.65.1 2.7 2.7 0 0 0 1.77-1.25 2.19 2.19 0 0 0 .15-1.25c-.06-.11-.23-.17-.49-.3z" />
    </svg>
  );
}

const ENTRIES: SocialEntry[] = [
  { label: 'WhatsApp', href: SITE_CONFIG.social.whatsapp, Icon: WhatsAppIcon },
  {
    label: 'Instagram',
    href: SITE_CONFIG.social.instagram,
    Icon: InstagramIcon,
  },
  { label: 'LinkedIn', href: SITE_CONFIG.social.linkedin, Icon: LinkedInIcon },
  { label: 'Facebook', href: SITE_CONFIG.social.facebook, Icon: FacebookIcon },
  { label: 'TikTok', href: SITE_CONFIG.social.tiktok, Icon: TikTokIcon },
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
