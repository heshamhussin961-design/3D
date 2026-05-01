import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { Suspense, type ReactNode } from 'react';

import { LenisProvider } from '@/components/providers/LenisProvider';
import { StructuredData } from '@/components/providers/StructuredData';
import { BackToTop } from '@/components/ui/BackToTop';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { VideoBackdrop } from '@/components/ui/VideoBackdrop';
import { WhatsAppFab } from '@/components/ui/WhatsAppFab';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/innova-logo.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <head>
        {/* Poster for the Services backdrop — keeps the section legible while
            the looping Innova video streams in. */}
        <link
          rel="preload"
          as="image"
          href="/frames/services/frame_0180.webp"
          type="image/webp"
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
        <VideoBackdrop src="/videos/innova-scrub.mp4" />
        <Suspense fallback={null}>
          <LenisProvider>
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
