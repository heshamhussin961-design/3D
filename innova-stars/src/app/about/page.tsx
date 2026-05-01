import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Layers,
  Sparkles,
  Telescope,
} from 'lucide-react';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'A small studio in Abu Dhabi pairing brand strategy, design, and AI to launch ambitious products into category-defining brands.',
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
  openGraph: {
    title: `About — ${SITE_CONFIG.name}`,
    description:
      'Strategy, design, and AI for ambitious brands. Built in Abu Dhabi.',
    url: `${SITE_CONFIG.url}/about`,
    type: 'website',
  },
};

const VALUES = [
  {
    icon: Telescope,
    title: 'See further',
    body: 'We start by asking what the work is really for, even when the brief gives us a different answer. Strategy before pixels — every time.',
  },
  {
    icon: Layers,
    title: 'Build to last',
    body: 'A launch is a milestone, not the goal. We design systems — brands, products, sites — that compound for years after we leave.',
  },
  {
    icon: Sparkles,
    title: 'Make it shine',
    body: 'The craft is the marketing. If a thing is built well — visually, technically, narratively — it earns attention without asking for it.',
  },
  {
    icon: Compass,
    title: 'Stay accountable',
    body: 'We share what we measure. Every engagement has a small set of metrics we agree on at kickoff and report on monthly.',
  },
];

interface TeamMember {
  /** Slug-style id, also used as photo filename in /public/team/. */
  id: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  /** Optional photo path. If unset, the initials block is shown. */
  photo?: string;
}

// To attach a real photo, save the file as /public/team/<id>.jpg and add
// `photo: '/team/<id>.jpg'` to the corresponding entry below.
const TEAM: TeamMember[] = [
  {
    id: 'founder',
    initials: 'IS',
    name: 'Founder',
    role: 'Founder · Strategy',
    bio: 'Brand & product strategy. Building Innova Stars from Abu Dhabi.',
    // photo: '/team/founder.jpg',
  },
  {
    id: 'creative',
    initials: 'CD',
    name: 'Creative Director',
    role: 'Creative · Identity',
    bio: 'Identity systems, art direction, and editorial design.',
    // photo: '/team/creative.jpg',
  },
  {
    id: 'ai',
    initials: 'AI',
    name: 'Head of AI',
    role: 'AI · Engineering',
    bio: 'Applied ML, automation, and AI product features.',
    // photo: '/team/ai.jpg',
  },
  {
    id: 'growth',
    initials: 'GR',
    name: 'Head of Growth',
    role: 'Growth · Analytics',
    bio: 'Performance marketing, SEO, and conversion analytics.',
    // photo: '/team/growth.jpg',
  },
];

export default function AboutPage(): JSX.Element {
  return (
    <main className="relative bg-deep-space pb-32 pt-32 md:pt-40">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 md:px-10">
        <p className="font-orbitron text-[11px] font-semibold tracking-[0.4em] text-gold">
          ABOUT · 07
        </p>
        <h1 className="mt-6 font-orbitron text-4xl font-bold leading-[1.05] text-white md:text-[72px]">
          A small studio with{' '}
          <span className="text-gradient-gold">large ambition.</span>
        </h1>
        <p className="mt-6 max-w-3xl font-inter text-lg text-white/70 md:text-xl">
          Innova Stars is a strategy, design, and AI studio in Abu Dhabi. We
          partner with founders and category leaders to build brands and
          products that earn attention — and keep it.
        </p>
      </section>

      {/* Mission */}
      <section className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-10 px-6 md:grid-cols-3 md:px-10">
        <h2 className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Our mission
        </h2>
        <div className="md:col-span-2">
          <p className="font-orbitron text-2xl font-medium leading-snug text-white md:text-3xl">
            To make ambitious work the default — and turn small studios into
            unfair advantages for the brands that hire them.
          </p>
          <p className="mt-6 font-inter text-base leading-relaxed text-white/65">
            Most marketing is a tax on the work. We try to make it the work.
            That means starting with strategy, building the smallest brand
            system that holds, and pairing it with the right tooling — AI
            included, where it actually helps — so the result outlives the
            campaign.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto mt-32 max-w-6xl px-6 md:px-10">
        <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          What we believe
        </p>
        <h2 className="mt-4 font-orbitron text-3xl font-bold text-white md:text-5xl">
          Four operating principles.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 border border-gold/15 bg-black/30 p-8 transition-colors duration-300 hover:border-gold/40"
            >
              <Icon className="h-7 w-7 text-gold" strokeWidth={1.6} />
              <h3 className="font-orbitron text-xl font-semibold text-white">
                {title}
              </h3>
              <p className="font-inter text-sm leading-relaxed text-white/65">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto mt-32 max-w-6xl px-6 md:px-10">
        <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The team
        </p>
        <h2 className="mt-4 font-orbitron text-3xl font-bold text-white md:text-5xl">
          Small by design.
        </h2>
        <p className="mt-4 max-w-2xl font-inter text-base text-white/60">
          Four senior partners doing the work directly. No layered handoffs,
          no juniors put on your retainer. Bigger when a project genuinely
          calls for it.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-4 border border-white/10 bg-black/30 p-6 transition-colors duration-300 hover:border-gold/30"
            >
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo}
                  alt={`${m.name} — ${m.role}`}
                  className="h-20 w-20 object-cover ring-1 ring-gold/40"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center bg-gold font-orbitron text-base font-bold tracking-[0.05em] text-black">
                  {m.initials}
                </div>
              )}
              <div>
                <p className="font-orbitron text-base font-semibold text-white">
                  {m.name}
                </p>
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-gold">
                  {m.role}
                </p>
              </div>
              <p className="font-inter text-sm leading-relaxed text-white/60">
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Careers anchor — full page lives at /careers */}
      <section
        id="careers"
        className="mx-auto mt-32 max-w-3xl border-t border-gold/15 px-6 pt-16 text-center md:px-10"
      >
        <p className="font-orbitron text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Careers
        </p>
        <h2 className="mt-4 font-orbitron text-3xl font-bold text-white md:text-4xl">
          We hire rarely. When we do, we hire well.
        </h2>
        <p className="mt-4 font-inter text-base text-white/60">
          Senior strategists, designers, and ML engineers in the GCC region
          are always welcome to send their work.
        </p>
        <Link
          href="/careers"
          className="mt-6 inline-block font-orbitron text-sm font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-light"
        >
          See open roles →
        </Link>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-32 max-w-3xl px-6 text-center md:px-10">
        <h2 className="font-orbitron text-3xl font-bold text-white md:text-5xl">
          Build something extraordinary.
        </h2>
        <p className="mt-4 font-inter text-base text-white/60 md:text-lg">
          Tell us about the project. We’ll respond within 24 hours.
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
