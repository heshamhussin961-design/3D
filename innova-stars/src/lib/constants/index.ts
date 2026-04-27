/**
 * Global site configuration. Used in metadata, OG tags, sitemap, and footer.
 */
export const SITE_CONFIG = {
  name: 'Innova Stars',
  tagline: 'Lead you to the stars',
  description:
    'A cosmic marketing agency crafting stellar experiences through AI-powered solutions and creative excellence.',
  url: 'https://innovastars.ae',
  ogImage: '/og-image.jpg',
  email: 'hello@innovastars.ae',
  phone: '+971 XX XXX XXXX',
  address: 'Abu Dhabi, UAE',
  social: {
    instagram: 'https://instagram.com/innovastars',
    linkedin: 'https://linkedin.com/company/innovastars',
    tiktok: 'https://tiktok.com/@innovastars',
    twitter: 'https://twitter.com/innovastars',
    youtube: 'https://youtube.com/@innovastars',
  },
} as const;

export interface ServiceSummary {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
}

/**
 * The seven core services. The full constellation data with positions
 * and connections lives in `src/lib/constants/services.ts`.
 */
export const SERVICES: ServiceSummary[] = [
  {
    id: 'ai-marketing',
    name: 'AI Marketing Solutions',
    shortDesc: 'Predictive campaigns powered by machine learning',
    icon: 'Brain',
  },
  {
    id: 'social',
    name: 'Social Media Management',
    shortDesc: 'Full-service social presence across all platforms',
    icon: 'Share2',
  },
  {
    id: 'tiktok',
    name: 'TikTok & Content Creation',
    shortDesc: 'Viral-ready content for the attention economy',
    icon: 'Video',
  },
  {
    id: 'influencer',
    name: 'Influencer & Celebrity Management',
    shortDesc: 'Strategic partnerships with top creators',
    icon: 'Users',
  },
  {
    id: 'seo',
    name: 'SEO & Performance Marketing',
    shortDesc: 'Data-driven growth that compounds',
    icon: 'TrendingUp',
  },
  {
    id: 'apps',
    name: 'Smart App Solutions',
    shortDesc: 'Custom applications with AI integration',
    icon: 'Smartphone',
  },
  {
    id: 'brand',
    name: 'Brand Strategy & Identity',
    shortDesc: 'Distinctive brands that resonate',
    icon: 'Sparkles',
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  description?: string;
}

export const STATS: Stat[] = [
  {
    value: 500,
    suffix: '+',
    label: 'Campaigns Launched',
    description: 'Across industries and continents',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Client Satisfaction',
    description: 'Measured quarterly',
  },
  {
    value: 12,
    suffix: 'x',
    label: 'Average ROI',
    description: 'For our retained clients',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Brands Transformed',
    description: 'From startups to enterprises',
  },
];

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Our Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
];
