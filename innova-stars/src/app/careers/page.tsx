import type { Metadata } from 'next';
import { Mail } from 'lucide-react';

import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join Innova Stars — a marketing studio in Abu Dhabi pairing brand strategy, design, and AI.',
  alternates: { canonical: `${SITE_CONFIG.url}/careers` },
  openGraph: {
    title: `Careers — ${SITE_CONFIG.name}`,
    description: 'Join a small senior team building ambitious work.',
    url: `${SITE_CONFIG.url}/careers`,
    type: 'website',
  },
};

interface OpenRole {
  title: string;
  type: string;
  location: string;
  summary: string;
}

/**
 * Open roles. Add an entry here when hiring; if the array is empty the
 * page renders the "no open roles" state automatically.
 */
const OPEN_ROLES: OpenRole[] = [];

export default function CareersPage(): JSX.Element {
  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      <section className="mx-auto max-w-5xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold tracking-[0.4em] text-gold">
          CAREERS · 08
        </p>
        <h1 className="mt-6 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[72px]">
          Build with us at{' '}
          <span className="text-gradient-gold">Innova Stars</span>.
        </h1>
        <p className="mt-6 max-w-3xl font-inter text-lg text-white/70 md:text-xl">
          We hire rarely and we hire well. Senior strategists, designers, and
          ML engineers in the GCC region are always welcome to send their
          work — even when no role is open.
        </p>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-6 md:px-10">
        <h2 className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Open roles
        </h2>

        {OPEN_ROLES.length === 0 ? (
          <div className="mt-8 border border-gold/15 bg-black/30 p-10 text-center">
            <p className="font-orbitron text-xl font-medium text-white md:text-2xl">
              No open roles right now.
            </p>
            <p className="mt-3 font-inter text-base text-white/60">
              We open positions in waves. Send us your work and we’ll keep
              your file when the next wave starts.
            </p>
            <a
              href={`mailto:${SITE_CONFIG.email}?subject=Careers — sending my work`}
              className="mt-6 inline-flex items-center gap-2 bg-gold px-8 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={2.5} />
              {SITE_CONFIG.email}
            </a>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {OPEN_ROLES.map((role) => (
              <li
                key={role.title}
                className="flex flex-col gap-3 border border-gold/15 bg-black/30 p-6 transition-colors duration-300 hover:border-gold/40 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-orbitron text-lg font-bold text-white md:text-xl">
                    {role.title}
                  </h3>
                  <p className="mt-1 font-inter text-sm text-white/60">
                    {role.summary}
                  </p>
                  <p className="mt-2 font-inter text-xs uppercase tracking-[0.2em] text-gold">
                    {role.type} · {role.location}
                  </p>
                </div>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Application — ${role.title}`}
                  className="inline-flex flex-shrink-0 items-center gap-2 border border-gold/40 px-6 py-2.5 font-orbitron text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition-colors duration-200 hover:bg-gold/10"
                >
                  Apply
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto mt-32 max-w-3xl px-6 text-center md:px-10">
        <h2 className="font-orbitron text-3xl font-bold text-white md:text-4xl">
          What we look for
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-3 text-left font-inter text-base text-white/75 md:grid-cols-2">
          {[
            'A portfolio that shows judgement, not just craft.',
            'Comfort working directly with clients (no layered handoffs).',
            'Curiosity about AI without being precious about hype.',
            'A bias toward shipping over polishing forever.',
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-3 border border-white/10 bg-black/20 p-4"
            >
              <span
                aria-hidden="true"
                className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold"
              />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
