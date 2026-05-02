import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms governing the use of the Innova Stars website and services.',
  alternates: { canonical: `${SITE_CONFIG.url}/terms` },
};

export default function TermsPage(): JSX.Element {
  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Legal
        </p>
        <h1 className="mt-4 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[56px]">
          Terms of Service
        </h1>
        <p className="mt-4 font-inter text-sm text-white/50">
          Last updated: April 2026
        </p>

        <div className="mt-12 flex flex-col gap-8 font-inter text-base leading-relaxed text-white/80">
          <Section title="1. Acceptance">
            <p>
              By accessing {SITE_CONFIG.url} you agree to these terms. If you
              don’t agree, please don’t use the site.
            </p>
          </Section>

          <Section title="2. Use of the site">
            <p>
              The site is provided for informational purposes. You may not (a)
              attempt to bypass security controls, (b) automate submissions
              (bots, scraping at scale), (c) introduce malware, or (d) use the
              site in any way that could damage, disable, or impair it.
            </p>
          </Section>

          <Section title="3. Intellectual property">
            <p>
              All content on this site — copy, logos, brand marks, video, code —
              is owned by {SITE_CONFIG.name} unless otherwise stated. You may
              not copy, redistribute, or reuse our content without written
              permission.
            </p>
          </Section>

          <Section title="4. Submissions">
            <p>
              When you submit a contact form, you confirm the information is
              accurate and that you have the right to share it. We may use your
              enquiry to respond and follow up; see our{' '}
              <a
                href="/privacy"
                className="text-gold underline-offset-4 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </Section>

          <Section title="5. No warranty">
            <p>
              The site is provided “as is”. We make no warranties about
              accuracy, fitness for a particular purpose, or uninterrupted
              availability.
            </p>
          </Section>

          <Section title="6. Limitation of liability">
            <p>
              To the fullest extent allowed by law, {SITE_CONFIG.name} shall not
              be liable for any indirect, incidental, or consequential damages
              arising from your use of the site.
            </p>
          </Section>

          <Section title="7. Governing law">
            <p>
              These terms are governed by the laws of the United Arab Emirates.
              Any disputes will be resolved in the courts of Abu Dhabi.
            </p>
          </Section>

          <Section title="8. Changes">
            <p>
              We may update these terms. Continued use after changes means you
              accept the new version.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              Questions about these terms? Email{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section>
      <h2 className="font-orbitron text-xl font-semibold text-gold md:text-2xl">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}
