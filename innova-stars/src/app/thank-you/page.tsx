import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'We received your message and will respond within 24 hours.',
  alternates: { canonical: `${SITE_CONFIG.url}/thank-you` },
  robots: { index: false, follow: false },
};

export default function ThankYouPage(): JSX.Element {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-deep-space px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2
          className="mx-auto h-20 w-20 text-gold"
          strokeWidth={1.5}
        />
        <p className="mt-6 font-orbitron text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Mission Received
        </p>
        <h1 className="mt-4 font-orbitron text-4xl font-bold text-white md:text-[64px]">
          Message <span className="text-gradient-gold">launched</span>.
        </h1>
        <p className="mt-6 font-inter text-lg text-white/70 md:text-xl">
          Thanks for reaching out. We’ll respond within 24 hours — keep an eye
          on your inbox.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
          <Link
            href="/#services"
            className="inline-flex items-center gap-3 border border-gold/40 px-8 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:bg-gold/10"
          >
            Explore services
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gold px-8 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            Back to home
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}
