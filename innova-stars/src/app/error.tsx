'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary. Caught client + server errors land here.
 * Sends to Sentry/console; gives the user a clear "try again" path.
 */
export default function GlobalError({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[app error]', error);
    // If Sentry is wired, it will pick this up automatically via its
    // global handlers. No-op otherwise.
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-deep-space px-6 py-32">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-orbitron text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Mission Anomaly
        </p>
        <h1 className="mt-4 font-orbitron text-4xl font-bold text-white md:text-[56px]">
          Something <span className="text-gradient-gold">went wrong</span>.
        </h1>
        <p className="mt-6 font-inter text-base text-white/70 md:text-lg">
          Our flight computer hit an unexpected error. Please try again — and if
          it keeps happening, drop us a line.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-[11px] text-white/30">
            ref: {error.digest}
          </p>
        ) : null}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-3 bg-gold px-8 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-gold/40 px-8 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:bg-gold/10"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
