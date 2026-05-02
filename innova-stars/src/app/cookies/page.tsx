import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Innova Stars uses cookies and similar technologies.',
  alternates: { canonical: `${SITE_CONFIG.url}/cookies` },
};

export default function CookiesPage(): JSX.Element {
  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Legal
        </p>
        <h1 className="mt-4 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[56px]">
          Cookie Policy
        </h1>
        <p className="mt-4 font-inter text-sm text-white/50">
          Last updated: April 2026
        </p>

        <div className="mt-12 flex flex-col gap-8 font-inter text-base leading-relaxed text-white/80">
          <p>
            This site uses a minimal set of cookies. We do not use third-party
            advertising or cross-site tracking cookies.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gold/30 font-orbitron text-xs uppercase tracking-[0.15em] text-gold">
                <tr>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Purpose</th>
                  <th className="pb-3 pr-4">Duration</th>
                  <th className="pb-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-inter">
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-gold">
                    is-cookie-consent
                  </td>
                  <td className="py-3 pr-4">
                    Stores your cookie banner choice so we don’t show it again.
                  </td>
                  <td className="py-3 pr-4">12 months</td>
                  <td className="py-3 text-white/60">Essential</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-gold">
                    _vercel_analytics
                  </td>
                  <td className="py-3 pr-4">
                    Anonymous page-view analytics. No personal data, no
                    cross-site tracking.
                  </td>
                  <td className="py-3 pr-4">Session</td>
                  <td className="py-3 text-white/60">Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-6 font-orbitron text-xl font-semibold text-gold">
            Managing cookies
          </h2>
          <p>
            You can clear cookies anytime from your browser settings. Doing so
            will reset your banner preferences — we’ll show the consent banner
            again on your next visit.
          </p>

          <h2 className="mt-6 font-orbitron text-xl font-semibold text-gold">
            Questions?
          </h2>
          <p>
            Write to{' '}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-gold underline-offset-4 hover:underline"
            >
              {SITE_CONFIG.email}
            </a>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
