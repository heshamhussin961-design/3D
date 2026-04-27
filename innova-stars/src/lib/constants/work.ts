export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  year: string;
  /** One-line headline. */
  title: string;
  /** Short narrative shown on the card. */
  summary: string;
  /** Tags shown as chips. */
  services: string[];
  /** Headline metric — gold-highlighted. */
  metric: { value: string; label: string };
  /**
   * Path under `/public/frames/` of a frame to use as the visual.
   * Re-using existing assets keeps the bundle small and the look consistent.
   */
  visual: string;
}

/**
 * Sample case studies — placeholders that read as credible until replaced
 * with real client work. Names are generic-but-realistic regional brand
 * archetypes; do not claim real engagements.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'heights-real-estate',
    client: 'Heights',
    industry: 'Real Estate',
    year: '2026',
    title: 'A landing experience that closes 3× faster',
    summary:
      'Rebuilt the discovery funnel for a luxury developer in Abu Dhabi. Cinematic property tours, AI-led recommendations, and a single-step lead form replaced a six-page maze.',
    services: ['Brand', 'Web Experience', 'AI Personalization'],
    metric: { value: '+312%', label: 'qualified leads in 90 days' },
    visual: '/frames/services/frame_0096.webp',
  },
  {
    id: 'aurora-beauty',
    client: 'Aurora',
    industry: 'Beauty & Wellness',
    year: '2026',
    title: 'TikTok-native content that doubled organic reach',
    summary:
      'Studio-as-a-service for a fast-growing beauty brand. Weekly trend-aligned drops, creator partnerships, and an always-on community team.',
    services: ['TikTok', 'Influencer', 'Content Studio'],
    metric: { value: '2.1M', label: 'organic monthly views' },
    visual: '/frames/ai/frame_0040.webp',
  },
  {
    id: 'vault-fintech',
    client: 'Vault',
    industry: 'Fintech',
    year: '2025',
    title: 'A bank app that feels like Apple, regulated like a bank',
    summary:
      'Product strategy, identity, and the first three releases of a UAE-licensed neobank. Compliance-grade with experience-grade polish.',
    services: ['Brand', 'Product', 'App Development'],
    metric: { value: '4.9★', label: 'App Store rating at launch' },
    visual: '/frames/ai/frame_0150.webp',
  },
  {
    id: 'pulse-health',
    client: 'Pulse',
    industry: 'Healthtech',
    year: '2025',
    title: 'SEO that compounds in a regulated market',
    summary:
      'Paired clinical-grade content with technical SEO and YMYL trust signals. Now ranks page-one for 140 high-intent terms across the GCC.',
    services: ['SEO', 'Content', 'Performance'],
    metric: { value: '−47%', label: 'patient acquisition cost' },
    visual: '/frames/services/frame_0050.webp',
  },
  {
    id: 'orbit-saas',
    client: 'Orbit',
    industry: 'B2B SaaS',
    year: '2025',
    title: 'A category-defining launch in eight weeks',
    summary:
      'Positioning, narrative, marketing site, and demand engine for a logistics SaaS taking on incumbents. Sold-out pilots within the launch quarter.',
    services: ['Brand Strategy', 'Web', 'AI Marketing'],
    metric: { value: '11×', label: 'pipeline coverage post-launch' },
    visual: '/frames/services/frame_0140.webp',
  },
  {
    id: 'nimbus-cloud',
    client: 'Nimbus',
    industry: 'Cloud Infrastructure',
    year: '2024',
    title: 'A developer brand that engineers actually trust',
    summary:
      'A complete identity and dev-portal redesign for a regional cloud platform. Documentation, SDKs, and a marketing layer that finally speak to engineers.',
    services: ['Brand', 'Developer Experience', 'Web'],
    metric: { value: '+58%', label: 'free-tier signups in Q1' },
    visual: '/frames/ai/frame_0096.webp',
  },
];
