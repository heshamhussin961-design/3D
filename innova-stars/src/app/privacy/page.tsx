import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Innova Stars collects, uses, and protects personal information.',
  alternates: { canonical: `${SITE_CONFIG.url}/privacy` },
};

export default function PrivacyPage(): JSX.Element {
  const updated = 'April 2026';

  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Legal
        </p>
        <h1 className="mt-4 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[56px]">
          Privacy Policy
        </h1>
        <p className="mt-4 font-inter text-sm text-white/50">
          Last updated: {updated}
        </p>

        <div className="prose-invert mt-12 flex flex-col gap-8 font-inter text-base leading-relaxed text-white/80">
          <Section title="1. Who we are">
            <p>
              {SITE_CONFIG.name} (“we”, “us”, “our”) is a marketing studio based
              in {SITE_CONFIG.address}. This policy explains what data we
              collect through {SITE_CONFIG.url} and how we use it. For
              questions, write to{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </Section>

          <Section title="2. What we collect">
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-white">Contact form data:</strong> name,
                email, optional company, budget range, and message.
              </li>
              <li>
                <strong className="text-white">Newsletter signups:</strong>{' '}
                email address only.
              </li>
              <li>
                <strong className="text-white">Technical data:</strong> IP
                address (used for rate limiting and abuse prevention), browser
                user-agent, and pages visited (basic analytics).
              </li>
            </ul>
          </Section>

          <Section title="3. How we use it">
            <ul className="ml-5 list-disc space-y-2">
              <li>To respond to your enquiry within 24 hours.</li>
              <li>To send our monthly newsletter (if you subscribed).</li>
              <li>
                To detect abuse — repeated submissions from the same IP get
                rate-limited.
              </li>
              <li>
                To improve the site through aggregated, non-identifying
                analytics.
              </li>
            </ul>
          </Section>

          <Section title="4. Legal basis (GDPR / UAE PDPL)">
            <p>
              We process your data on the basis of (a) your consent (when you
              submit a form), (b) our legitimate interest in operating and
              improving the site, and (c) compliance with legal obligations
              where applicable.
            </p>
          </Section>

          <Section title="5. Sharing">
            <p>
              We do not sell your data. We share it only with sub-processors
              that help us operate the site:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>Hosting (Vercel) — server logs and request handling.</li>
              <li>Email delivery (Resend) — when you submit a contact form.</li>
              <li>Analytics — anonymous aggregate counts only.</li>
            </ul>
          </Section>

          <Section title="6. Retention">
            <p>
              Contact submissions are kept for up to 24 months. Newsletter
              subscriptions are kept until you unsubscribe (every email
              contains an unsubscribe link).
            </p>
          </Section>

          <Section title="7. Your rights">
            <p>
              You can request access to, correction of, or deletion of your
              personal data at any time. Email{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>{' '}
              and we’ll respond within 30 days.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              We use a minimal set of cookies. See our{' '}
              <a
                href="/cookies"
                className="text-gold underline-offset-4 hover:underline"
              >
                Cookie Policy
              </a>{' '}
              for the full list.
            </p>
          </Section>

          <Section title="9. Changes">
            <p>
              We’ll update this policy from time to time. Material changes will
              be flagged at the top of this page with a new “Last updated”
              date.
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
