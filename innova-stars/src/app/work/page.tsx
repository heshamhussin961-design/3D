import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { SITE_CONFIG } from '@/lib/constants';
import { CASE_STUDIES } from '@/lib/constants/work';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'Selected work from across real estate, beauty, fintech, healthtech, and B2B SaaS. Brand, web, AI, and growth — built to outlast the launch.',
  alternates: { canonical: `${SITE_CONFIG.url}/work` },
  openGraph: {
    title: `Our Work — ${SITE_CONFIG.name}`,
    description:
      'A selection of brand, web, AI, and growth work for clients across the GCC.',
    url: `${SITE_CONFIG.url}/work`,
    type: 'website',
  },
};

export default function WorkPage(): JSX.Element {
  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      <section className="mx-auto max-w-5xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold tracking-[0.4em] text-gold">
          PORTFOLIO · 06
        </p>
        <h1 className="mt-6 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[72px]">
          Work that <span className="text-gradient-gold">moves brands</span>
          <br />
          to the next orbit.
        </h1>
        <p className="mt-6 max-w-2xl font-inter text-lg text-white/70 md:text-xl">
          A selection of recent engagements across real estate, beauty,
          fintech, healthtech, and B2B SaaS — chosen for what they teach about
          the work, not just the logos.
        </p>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-10 px-6 md:px-10 lg:grid-cols-2">
        {CASE_STUDIES.map((cs, i) => (
          <article
            key={cs.id}
            className={cn(
              'group relative flex flex-col overflow-hidden border border-white/10 bg-black/40 transition-colors duration-300 hover:border-gold/40',
              i % 3 === 0 && 'lg:col-span-2',
            )}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.visual}
                alt=""
                className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              />
              <div className="absolute left-6 top-6 flex items-center gap-3 font-orbitron text-[10px] uppercase tracking-[0.3em] text-white/70">
                <span>{cs.industry}</span>
                <span aria-hidden="true" className="text-white/30">
                  /
                </span>
                <span>{cs.year}</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
              <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {cs.client}
              </p>
              <h2 className="font-orbitron text-xl font-bold leading-snug text-white md:text-2xl">
                {cs.title}
              </h2>
              <p className="font-inter text-sm leading-relaxed text-white/65">
                {cs.summary}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {cs.services.map((s) => (
                  <span
                    key={s}
                    className="border border-gold/20 px-3 py-1 font-orbitron text-[10px] uppercase tracking-[0.2em] text-gold/80"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-5">
                <div>
                  <div className="font-orbitron text-3xl font-black leading-none text-gold gold-glow md:text-4xl">
                    {cs.metric.value}
                  </div>
                  <div className="mt-2 font-inter text-xs text-white/50">
                    {cs.metric.label}
                  </div>
                </div>
                <span className="font-inter text-xs uppercase tracking-[0.2em] text-white/30">
                  Case study
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-32 max-w-3xl px-6 text-center md:px-10">
        <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Ready when you are
        </p>
        <h2 className="mt-4 font-orbitron text-3xl font-bold text-white md:text-5xl">
          Have a project in motion?
        </h2>
        <p className="mt-4 font-inter text-base text-white/60 md:text-lg">
          We take on a small number of engagements each quarter so we can show
          up fully on every one. Tell us what you’re building.
        </p>
        <Link href="/#contact" className="mt-8 inline-block">
          <MagneticButton
            type="button"
            className="inline-flex items-center gap-3 bg-gold px-12 py-4 font-orbitron text-sm font-semibold uppercase tracking-[0.2em] text-black transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
          >
            Start a conversation
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </MagneticButton>
        </Link>
      </section>
    </main>
  );
}
