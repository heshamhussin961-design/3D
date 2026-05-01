import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Innova Stars collects, uses, stores, and protects personal information — including your rights under UAE PDPL and GDPR.',
  alternates: { canonical: `${SITE_CONFIG.url}/privacy` },
};

const UPDATED = 'May 2026';
const EFFECTIVE = '01 May 2026';

const SECTIONS: { id: string; label: string }[] = [
  { id: 'who', label: '1. Who we are' },
  { id: 'scope', label: '2. Scope of this policy' },
  { id: 'collect', label: '3. Information we collect' },
  { id: 'use', label: '4. How we use your information' },
  { id: 'legal-basis', label: '5. Legal basis for processing' },
  { id: 'sharing', label: '6. Sharing your data' },
  { id: 'transfers', label: '7. International transfers' },
  { id: 'retention', label: '8. How long we keep data' },
  { id: 'security', label: '9. Security measures' },
  { id: 'rights', label: '10. Your rights' },
  { id: 'cookies', label: '11. Cookies & tracking' },
  { id: 'children', label: '12. Children’s privacy' },
  { id: 'breach', label: '13. Data-breach notification' },
  { id: 'changes', label: '14. Changes to this policy' },
  { id: 'contact', label: '15. Contact us' },
];

export default function PrivacyPage(): JSX.Element {
  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      <article className="mx-auto max-w-4xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Legal
        </p>
        <h1 className="mt-4 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[56px]">
          Privacy Policy
        </h1>
        <div className="mt-4 flex flex-col gap-1 font-inter text-sm text-white/50">
          <p>Last updated: {UPDATED}</p>
          <p>Effective from: {EFFECTIVE}</p>
        </div>

        <p className="mt-8 max-w-3xl font-inter text-base leading-relaxed text-white/75 md:text-lg">
          {SITE_CONFIG.name} for Marketing &amp; Technology (“we”, “us”,
          “our”, “Innova Stars”) takes your privacy seriously. This document
          explains exactly what data we collect through{' '}
          {SITE_CONFIG.url.replace(/^https?:\/\//, '')}, why we collect it,
          how long we keep it, who we share it with, and the rights you have
          over it. If anything here is unclear, write to{' '}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-gold underline-offset-4 hover:underline"
          >
            {SITE_CONFIG.email}
          </a>
          .
        </p>

        {/* Table of contents */}
        <nav
          aria-label="Table of contents"
          className="mt-12 border border-gold/20 bg-black/30 p-6 md:p-8"
        >
          <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            On this page
          </p>
          <ol className="mt-4 grid grid-cols-1 gap-2 font-inter text-sm text-white/75 md:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="transition-colors duration-200 hover:text-gold"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-16 flex flex-col gap-12 font-inter text-base leading-relaxed text-white/85">
          <Section id="who" title="1. Who we are">
            <p>
              Innova Stars for Marketing &amp; Technology is a marketing and
              technology studio registered in {SITE_CONFIG.address}. For all
              privacy matters we act as the “Data Controller” of personal
              data collected via this website.
            </p>
            <p>
              <strong className="text-white">Contact:</strong>{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>{' '}
              · {SITE_CONFIG.phone}
            </p>
          </Section>

          <Section id="scope" title="2. Scope of this policy">
            <p>
              This policy covers personal data we collect through:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                The website at{' '}
                {SITE_CONFIG.url.replace(/^https?:\/\//, '')} and any
                subdomain we operate.
              </li>
              <li>Our contact and newsletter forms.</li>
              <li>
                Our official social channels (Instagram, LinkedIn, Facebook,
                TikTok), where data we collect is also subject to those
                platforms’ own privacy policies.
              </li>
              <li>
                Our WhatsApp Business number (+971 54 318 0337) for
                inbound enquiries.
              </li>
            </ul>
          </Section>

          <Section id="collect" title="3. Information we collect">
            <p>
              We collect only what we need to do business with you. The
              categories below are exhaustive — if a category isn’t listed,
              we don’t collect it.
            </p>

            <h3 className="mt-4 font-orbitron text-base font-semibold text-gold">
              3.1 Information you give us directly
            </h3>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-white">Contact form:</strong> name,
                email, optional company, budget range, and message.
              </li>
              <li>
                <strong className="text-white">Newsletter form:</strong>{' '}
                email address only.
              </li>
              <li>
                <strong className="text-white">Email / WhatsApp:</strong>{' '}
                whatever you choose to share when you message us.
              </li>
            </ul>

            <h3 className="mt-4 font-orbitron text-base font-semibold text-gold">
              3.2 Information we collect automatically
            </h3>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-white">Technical data:</strong> IP
                address (used for rate limiting and abuse prevention),
                browser user-agent, device type, screen size, referrer.
              </li>
              <li>
                <strong className="text-white">Usage data:</strong> pages
                visited, time on page, scroll depth, errors encountered —
                gathered through Vercel Analytics in an aggregated and
                anonymous form.
              </li>
              <li>
                <strong className="text-white">Cookies:</strong> see
                section 11 below.
              </li>
            </ul>

            <h3 className="mt-4 font-orbitron text-base font-semibold text-gold">
              3.3 What we don’t collect
            </h3>
            <ul className="ml-5 list-disc space-y-2">
              <li>Government IDs, passport numbers, or Emirates ID.</li>
              <li>Payment-card details (we don’t process payments here).</li>
              <li>Health, biometric, or sensitive data of any kind.</li>
              <li>Your social-graph or precise geolocation.</li>
            </ul>
          </Section>

          <Section id="use" title="4. How we use your information">
            <p>We use your data only for the purposes below:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>To respond to enquiries within 24 hours.</li>
              <li>
                To send our monthly newsletter, only if you explicitly
                subscribed.
              </li>
              <li>
                To send transactional emails (auto-reply confirmation,
                project updates if you become a client).
              </li>
              <li>
                To detect and prevent abuse — repeated submissions from the
                same IP get rate-limited or blocked.
              </li>
              <li>
                To improve the site through aggregated, non-identifying
                analytics.
              </li>
              <li>
                To comply with legal obligations (tax records, court
                orders, regulatory requests).
              </li>
            </ul>
            <p>
              <strong className="text-white">No automated decisions:</strong>{' '}
              we do not make decisions about you that have legal or
              significant effects without human review.
            </p>
          </Section>

          <Section id="legal-basis" title="5. Legal basis for processing">
            <p>
              Under the UAE Personal Data Protection Law (Federal Decree-Law
              45 of 2021, “PDPL”) and the EU/UK General Data Protection
              Regulation (GDPR) where it applies, we rely on the following
              legal bases:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-white">Consent</strong> — when you
                voluntarily submit a contact form or subscribe to the
                newsletter.
              </li>
              <li>
                <strong className="text-white">Legitimate interest</strong> —
                operating, securing, and improving the site (rate limiting,
                analytics, fraud prevention).
              </li>
              <li>
                <strong className="text-white">Contract</strong> — when you
                become a client, processing your data is necessary to
                deliver the service we agreed.
              </li>
              <li>
                <strong className="text-white">Legal obligation</strong> —
                where we’re required to retain or disclose data by law.
              </li>
            </ul>
          </Section>

          <Section id="sharing" title="6. Sharing your data">
            <p>
              We <strong className="text-white">do not sell</strong> your
              personal data, and we don’t share it with advertisers. We
              share data only with vetted sub-processors that help us
              operate the site, under contracts that bind them to the same
              standards described here.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gold/30 font-orbitron text-xs uppercase tracking-[0.15em] text-gold">
                  <tr>
                    <th className="pb-3 pr-4">Sub-processor</th>
                    <th className="pb-3 pr-4">Purpose</th>
                    <th className="pb-3">Region</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Vercel
                    </td>
                    <td className="py-3 pr-4">Hosting + analytics</td>
                    <td className="py-3 text-white/60">USA / EU</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Resend
                    </td>
                    <td className="py-3 pr-4">Transactional email</td>
                    <td className="py-3 text-white/60">USA / EU</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Anthropic
                    </td>
                    <td className="py-3 pr-4">
                      AI prompt processing (only for the AI demo page)
                    </td>
                    <td className="py-3 text-white/60">USA</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Cloudflare
                    </td>
                    <td className="py-3 pr-4">DDoS protection, DNS</td>
                    <td className="py-3 text-white/60">Global edge</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              We may also disclose your information when legally required —
              for example, in response to a valid court order, regulatory
              request, or to enforce our terms.
            </p>
          </Section>

          <Section id="transfers" title="7. International transfers">
            <p>
              Some of our sub-processors are based outside the UAE (United
              States, European Union). When your data leaves the UAE, we
              ensure the transfer is protected by:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                Standard Contractual Clauses (SCCs) approved by the European
                Commission, where the recipient is in the EU/UK GDPR scope.
              </li>
              <li>
                Adequacy decisions issued by the UAE Data Office or the
                European Commission where they exist.
              </li>
              <li>
                Industry-standard encryption in transit (TLS 1.2+) and at
                rest.
              </li>
            </ul>
          </Section>

          <Section id="retention" title="8. How long we keep data">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gold/30 font-orbitron text-xs uppercase tracking-[0.15em] text-gold">
                  <tr>
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3">Retention period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Contact-form submissions
                    </td>
                    <td className="py-3 text-white/75">Up to 24 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Newsletter subscribers
                    </td>
                    <td className="py-3 text-white/75">
                      Until you unsubscribe (every email contains a one-click
                      unsubscribe link)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Server logs (incl. IP)
                    </td>
                    <td className="py-3 text-white/75">30 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Analytics (anonymous)
                    </td>
                    <td className="py-3 text-white/75">25 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">
                      Client engagement records
                    </td>
                    <td className="py-3 text-white/75">
                      7 years from end of engagement (UAE accounting law)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="security" title="9. Security measures">
            <p>
              We apply industry-standard safeguards to protect your data:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                TLS 1.2+ encryption for every page and API request, with
                HSTS preload.
              </li>
              <li>
                Strict Content Security Policy, X-Frame-Options, and
                anti-clickjacking headers.
              </li>
              <li>Rate limiting and bot honeypots on every form.</li>
              <li>
                Principle of least privilege — only the team members who
                need access to your data have it, and access is logged.
              </li>
              <li>
                Sub-processors vetted for SOC 2, ISO 27001, or equivalent
                certifications.
              </li>
              <li>
                Encrypted backups; data deleted from backups within 30 days
                of the original deletion request.
              </li>
            </ul>
          </Section>

          <Section id="rights" title="10. Your rights">
            <p>
              Under UAE PDPL and GDPR, you have the rights below. To
              exercise any of them, email{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              . We respond within 30 days, free of charge for the first
              request in any rolling 12-month period.
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-white">Access</strong> — get a copy
                of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-white">Rectification</strong> —
                correct anything inaccurate or incomplete.
              </li>
              <li>
                <strong className="text-white">Erasure</strong> — have your
                data deleted (“right to be forgotten”), unless we’re
                required by law to retain it.
              </li>
              <li>
                <strong className="text-white">Restriction</strong> — pause
                our processing while a question is being resolved.
              </li>
              <li>
                <strong className="text-white">Portability</strong> —
                receive your data in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-white">Objection</strong> — object
                to processing based on our legitimate interests.
              </li>
              <li>
                <strong className="text-white">Withdraw consent</strong> —
                where processing is based on consent (e.g., newsletter), you
                can withdraw it at any time.
              </li>
              <li>
                <strong className="text-white">Lodge a complaint</strong> —
                with the UAE Data Office, your local data-protection
                authority, or a court of competent jurisdiction.
              </li>
            </ul>
          </Section>

          <Section id="cookies" title="11. Cookies & tracking">
            <p>
              We use a minimal set of cookies — no advertising or
              cross-site tracking. Full list and durations are on our{' '}
              <Link
                href="/cookies"
                className="text-gold underline-offset-4 hover:underline"
              >
                Cookie Policy
              </Link>
              . You control your choice through the consent banner shown
              on first visit, and you can change it anytime by clearing
              cookies for our domain.
            </p>
          </Section>

          <Section id="children" title="12. Children’s privacy">
            <p>
              Our services are intended for users aged 18 or above. We do
              not knowingly collect personal data from anyone under 18. If
              you believe a child has submitted information to us, contact{' '}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>{' '}
              and we will delete it promptly.
            </p>
          </Section>

          <Section id="breach" title="13. Data-breach notification">
            <p>
              In the unlikely event of a personal-data breach that is
              likely to result in a risk to your rights and freedoms, we
              will notify the UAE Data Office (and any other relevant
              regulator) within 72 hours of becoming aware of it, and we
              will notify affected users without undue delay through email
              or a prominent notice on this site.
            </p>
          </Section>

          <Section id="changes" title="14. Changes to this policy">
            <p>
              We may update this policy as our services or laws evolve.
              Material changes will be flagged at the top of this page with
              a new “Last updated” date, and — for significant changes —
              we’ll notify newsletter subscribers by email at least 14 days
              before they take effect.
            </p>
          </Section>

          <Section id="contact" title="15. Contact us">
            <p>
              For any privacy-related question, request, or complaint:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-white">Email:</strong>{' '}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <strong className="text-white">Phone / WhatsApp:</strong>{' '}
                {SITE_CONFIG.phone}
              </li>
              <li>
                <strong className="text-white">Post:</strong>{' '}
                {SITE_CONFIG.name} for Marketing &amp; Technology,{' '}
                {SITE_CONFIG.address}
              </li>
            </ul>
            <p className="mt-4 border-l-2 border-gold/40 pl-4 text-white/75">
              We aim to acknowledge privacy requests within 5 working days
              and resolve them within 30 days.
            </p>
          </Section>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-gold/15 pt-8 md:flex-row">
          <p className="font-inter text-xs text-white/40">
            © 2026 {SITE_CONFIG.name} for Marketing &amp; Technology. All
            rights reserved.
          </p>
          <div className="flex gap-4 font-inter text-xs text-white/50">
            <Link href="/terms" className="hover:text-gold">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-gold">
              Cookie Policy
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-orbitron text-xl font-semibold text-gold md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}
