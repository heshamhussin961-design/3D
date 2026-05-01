/**
 * Global site configuration. Used in metadata, OG tags, sitemap, and footer.
 */
export const SITE_CONFIG = {
  name: 'Innova Stars',
  tagline: 'Lead you to the stars',
  description:
    'A cosmic marketing agency crafting stellar experiences through AI-powered solutions and creative excellence.',
  url: 'https://innova-stars.ae',
  ogImage: '/og-image.jpg',
  email: 'info@innova-stars.ae',
  phone: '+971 54 318 0337',
  whatsapp: 'https://wa.me/971543180337',
  address: 'Abu Dhabi, UAE',
  social: {
    whatsapp: 'https://wa.me/971543180337',
    instagram: 'https://www.instagram.com/innovastars/',
    linkedin:
      'https://www.linkedin.com/company/innova-stars-for-marketing-technology/',
    tiktok: 'https://www.tiktok.com/@innova.stars.tech',
    facebook: 'https://www.facebook.com/share/1DmhuFKqna/',
  },
} as const;

export interface ServiceSummary {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
}

/**
 * The core services for grid/list views. Full constellation data with
 * positions and connections lives in `src/lib/constants/services.ts`.
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
    id: 'web-dev',
    name: 'Web Development',
    shortDesc: 'High-performance sites and web apps',
    icon: 'Globe',
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Development',
    shortDesc: 'Native and cross-platform apps with AI built in',
    icon: 'Smartphone',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Growth',
    shortDesc: 'Stores that ship, scale, and convert',
    icon: 'ShoppingCart',
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
    value: 4,
    suffix: '',
    label: 'Years of Experience',
    description: 'Building brands across the GCC',
  },
  {
    value: 70,
    suffix: '+',
    label: 'Happy Clients',
    description: 'From startups to enterprises',
  },
  {
    value: 99,
    suffix: '%',
    label: 'Client Satisfaction',
    description: 'Measured quarterly',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Completed Projects',
    description: 'Shipped end-to-end',
  },
];

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/#contact' },
];
