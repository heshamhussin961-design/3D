import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { SITE_CONFIG } from '@/lib/constants';
import { SERVICES, SERVICES_BY_ID } from '@/lib/constants/services';

interface RouteParams {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  // Exclude the hub — it isn't a real service page.
  return SERVICES.filter((s) => !s.isHub).map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: RouteParams): Metadata {
  const service = SERVICES_BY_ID[params.slug];
  if (!service) return {};
  const title = `${service.name}`;
  const description = service.shortDesc;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_CONFIG.url}/services/${service.id}` },
    openGraph: {
      title: `${title} — ${SITE_CONFIG.name}`,
      description,
      url: `${SITE_CONFIG.url}/services/${service.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${SITE_CONFIG.name}`,
      description,
    },
  };
}

export default function ServicePage({ params }: RouteParams): JSX.Element {
  const service = SERVICES_BY_ID[params.slug];
  if (!service || service.isHub) notFound();

  // Pull the ids of services this one connects to in the constellation —
  // perfect "related services" without duplicating logic. Skip the hub.
  const related = service.connections
    .map((id) => SERVICES_BY_ID[id])
    .filter(
      (s): s is (typeof SERVICES)[number] => Boolean(s) && !s.isHub,
    );

  // JSON-LD: structured data for the Service entity.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.longDesc,
    url: `${SITE_CONFIG.url}/services/${service.id}`,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      email: SITE_CONFIG.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Abu Dhabi',
        addressCountry: 'AE',
      },
    },
    areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
  };

  return (
    <main className="relative min-h-screen bg-deep-space pb-24 pt-32 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-6 md:px-10">
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 font-inter text-xs uppercase tracking-[0.2em] text-white/50 transition-colors duration-200 hover:text-gold"
        >
          <ArrowLeft className="h-3 w-3" />
          All services
        </Link>

        <header className="mt-8 flex flex-col gap-4 border-b border-gold/15 pb-10">
          <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Service
          </p>
          <h1 className="font-orbitron text-4xl font-bold leading-tight text-white md:text-6xl">
            <span className="text-gradient-gold">{service.name}</span>
          </h1>
          <p className="font-inter text-lg text-white/70 md:text-xl">
            {service.shortDesc}
          </p>
        </header>

        <section className="mt-12 grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              What this includes
            </h2>
            <p className="mt-4 font-inter text-base leading-relaxed text-white/80">
              {service.longDesc}
            </p>

            <h2 className="mt-12 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              How we engage
            </h2>
            <ol className="mt-4 flex flex-col gap-4 font-inter text-sm text-white/70">
              <li className="flex gap-3">
                <span className="font-orbitron text-gold">01</span>
                <span>
                  <strong className="text-white">Discover.</strong> A focused
                  workshop to map outcomes, audience, and constraints.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-orbitron text-gold">02</span>
                <span>
                  <strong className="text-white">Design.</strong> Strategy and
                  creative aligned to the metrics that move the business.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-orbitron text-gold">03</span>
                <span>
                  <strong className="text-white">Deploy.</strong> We ship in
                  iterations, measure, and double down on what works.
                </span>
              </li>
            </ol>
          </div>

          <aside className="border border-gold/20 p-6">
            <h3 className="font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Get a quote
            </h3>
            <p className="mt-3 font-inter text-sm text-white/70">
              Tell us about your goals. We’ll respond within 24 hours.
            </p>
            <Link href="/#contact" className="mt-6 inline-block">
              <MagneticButton
                type="button"
                className="inline-flex items-center gap-2 bg-gold px-6 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              >
                Start a conversation
                <ArrowRight className="h-3 w-3" />
              </MagneticButton>
            </Link>
          </aside>
        </section>

        {related.length > 0 ? (
          <section className="mt-20 border-t border-gold/15 pt-12">
            <h2 className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Pairs well with
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {related.map((s) => (
                <Link key={s.id} href={`/services/${s.id}`} className="block">
                  <ServiceCard service={s} variant="grid" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
