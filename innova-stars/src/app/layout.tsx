import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Inter, Orbitron } from 'next/font/google';
import { Suspense, type ReactNode } from 'react';

import { LenisProvider } from '@/components/providers/LenisProvider';
import { StructuredData } from '@/components/providers/StructuredData';
import { BackToTop } from '@/components/ui/BackToTop';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { FrameBackdrop } from '@/components/ui/FrameBackdrop';
import { Footer } from '@/components/ui/Footer';
import { HashScroller } from '@/components/ui/HashScroller';
import { Navigation } from '@/components/ui/Navigation';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { WhatsAppFab } from '@/components/ui/WhatsAppFab';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  // 500 (medium), 700 (bold), 900 (black) cover every weight we
  // actually use — semibold and regular orbitron were near-duplicates.
  weight: ['500', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const bukra = localFont({
  src: '../fonts/29LTBukra-BoldItalic.ttf',
  variable: '--font-bukra',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'marketing agency',
    'AI marketing',
    'social media',
    'TikTok marketing',
    'influencer management',
    'brand strategy',
    'UAE',
    'Abu Dhabi',
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: `${SITE_CONFIG.name} for Marketing & Technology`,
  applicationName: SITE_CONFIG.name,
  other: {
    copyright: `© 2026 ${SITE_CONFIG.name} for Marketing & Technology. All rights reserved.`,
    'og:rights': `${SITE_CONFIG.name}`,
  },
  // Note: og:image (and twitter:image fallback) are generated dynamically
  // by `src/app/opengraph-image.tsx`.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  icons: {
    icon: [
      { url: '/icon.webp', type: 'image/webp' },
    ],
    shortcut: '/icon.webp',
    apple: '/icon.webp',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A1A',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${bukra.variable}`}>
      <head>
        {/* Preload the first frame of the rocket sequence so the hero
            paints fast while the rest of the frames stream in. */}
        <link
          rel="preload"
          as="image"
          href="/frames/innova/frame_0001.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="bg-black text-white antialiased">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:font-orbitron focus:text-sm focus:text-black"
        >
          Skip to main content
        </a>
        <StructuredData />
        <FrameBackdrop
          basePath="/frames/innova/"
          mobileBasePath="/frames/innova-mobile/"
          frameCount={290}
        />
        <Suspense fallback={null}>
          <LenisProvider>
            <HashScroller />
            <ScrollProgress />
            <Navigation />
            <div className="relative z-10">
              {children}
              <Footer />
            </div>
            <BackToTop />
            <WhatsAppFab />
            <CookieBanner />
          </LenisProvider>
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
