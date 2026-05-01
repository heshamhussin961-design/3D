export type ServiceIcon =
  | 'Brain'
  | 'Share2'
  | 'Video'
  | 'Users'
  | 'TrendingUp'
  | 'Smartphone'
  | 'Sparkles'
  | 'Code'
  | 'ShoppingCart'
  | 'Globe'
  | 'Star';

export interface Service {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  icon: ServiceIcon;
  /** Position in the constellation as percentages of the SVG viewBox. */
  position: { x: number; y: number };
  /** IDs of directly connected services — renders as constellation lines. */
  connections: string[];
  /**
   * Marks the central hub node. Rendered larger and connected to every
   * other service.
   */
  isHub?: boolean;
}

/**
 * The Innova Stars constellation. INNOVA STARS sits in the center as the
 * hub; every service is connected to it (and a few cross-links between
 * related services for a fuller star-map look).
 */
export const SERVICES: Service[] = [
  {
    id: 'innova-stars',
    name: 'INNOVA STARS',
    shortDesc: 'Strategy + design + AI under one roof',
    longDesc:
      'The center of the constellation. Every service we run plugs into a single strategy so the work compounds instead of fragmenting.',
    icon: 'Star',
    position: { x: 50, y: 50 },
    connections: [
      'ai-marketing',
      'social',
      'tiktok',
      'influencer',
      'seo',
      'web-dev',
      'mobile-dev',
      'ecommerce',
      'brand',
    ],
    isHub: true,
  },
  {
    id: 'ai-marketing',
    name: 'AI Marketing Solutions',
    shortDesc: 'Predictive campaigns powered by machine learning',
    longDesc:
      'Harness AI to predict trends, optimize campaigns in real-time, and deliver personalized experiences at scale.',
    icon: 'Brain',
    position: { x: 50, y: 12 },
    connections: ['social', 'seo'],
  },
  {
    id: 'social',
    name: 'Social Media Management',
    shortDesc: 'Full-service social presence across all platforms',
    longDesc:
      'Community growth, always-on publishing, and performance reporting across every platform your audience cares about.',
    icon: 'Share2',
    position: { x: 22, y: 22 },
    connections: ['tiktok', 'influencer'],
  },
  {
    id: 'tiktok',
    name: 'TikTok & Content Creation',
    shortDesc: 'Viral-ready content for the attention economy',
    longDesc:
      'End-to-end content studios — trending formats, shoot production, editing, and publishing built to move.',
    icon: 'Video',
    position: { x: 10, y: 50 },
    connections: ['social', 'influencer'],
  },
  {
    id: 'influencer',
    name: 'Influencer & Celebrity Management',
    shortDesc: 'Strategic partnerships with top creators',
    longDesc:
      'Deal sourcing, contracting, campaign execution, and measurement with regional and global creator networks.',
    icon: 'Users',
    position: { x: 22, y: 78 },
    connections: ['tiktok', 'brand'],
  },
  {
    id: 'seo',
    name: 'SEO & Performance Marketing',
    shortDesc: 'Data-driven growth that compounds',
    longDesc:
      'Technical SEO, content strategy, paid search, and CRO working in lock-step to lower CAC every quarter.',
    icon: 'TrendingUp',
    position: { x: 78, y: 22 },
    connections: ['ai-marketing', 'web-dev'],
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    shortDesc: 'High-performance sites and web apps',
    longDesc:
      'Marketing sites, dashboards, and bespoke web apps — built on modern stacks (Next.js, React, TypeScript) with SEO and Core Web Vitals baked in.',
    icon: 'Globe',
    position: { x: 90, y: 50 },
    connections: ['mobile-dev', 'ecommerce', 'seo'],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Development',
    shortDesc: 'Native and cross-platform apps with AI built in',
    longDesc:
      'iOS, Android, and cross-platform apps (React Native, Flutter, SwiftUI) with AI features, payments, and analytics from day one.',
    icon: 'Smartphone',
    position: { x: 78, y: 78 },
    connections: ['web-dev', 'ai-marketing'],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Growth',
    shortDesc: 'Stores that ship, scale, and convert',
    longDesc:
      'Shopify, WooCommerce, and headless commerce — paired with growth tactics that turn first-time buyers into retained customers.',
    icon: 'ShoppingCart',
    position: { x: 65, y: 88 },
    connections: ['web-dev', 'brand'],
  },
  {
    id: 'brand',
    name: 'Brand Strategy & Identity',
    shortDesc: 'Distinctive brands that resonate',
    longDesc:
      'Positioning, visual identity, verbal identity, and rollout systems that give your brand staying power.',
    icon: 'Sparkles',
    position: { x: 35, y: 88 },
    connections: ['influencer', 'ecommerce'],
  },
];

export const SERVICES_BY_ID: Readonly<Record<string, Service>> =
  Object.freeze(
    SERVICES.reduce<Record<string, Service>>((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {}),
  );

interface ConnectionEdge {
  fromId: string;
  toId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

/**
 * Unique undirected edges between services. Each pair appears once so the
 * renderer doesn't draw the same line twice.
 */
export function getConnectionEdges(): ConnectionEdge[] {
  const seen = new Set<string>();
  const edges: ConnectionEdge[] = [];
  for (const service of SERVICES) {
    for (const otherId of service.connections) {
      const key = [service.id, otherId].sort().join('→');
      if (seen.has(key)) continue;
      seen.add(key);
      const other = SERVICES_BY_ID[otherId];
      if (!other) continue;
      edges.push({
        fromId: service.id,
        toId: otherId,
        from: service.position,
        to: other.position,
      });
    }
  }
  return edges;
}
