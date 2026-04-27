export type ServiceIcon =
  | 'Brain'
  | 'Share2'
  | 'Video'
  | 'Users'
  | 'TrendingUp'
  | 'Smartphone'
  | 'Sparkles';

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
}

/**
 * The seven stars of the constellation. Positions are tuned by hand so
 * the graph reads as a balanced cluster with crossing connection lines.
 */
export const SERVICES: Service[] = [
  {
    id: 'ai-marketing',
    name: 'AI Marketing Solutions',
    shortDesc: 'Predictive campaigns powered by machine learning',
    longDesc:
      'Harness AI to predict trends, optimize campaigns in real-time, and deliver personalized experiences at scale.',
    icon: 'Brain',
    position: { x: 50, y: 20 },
    connections: ['social', 'seo', 'apps'],
  },
  {
    id: 'social',
    name: 'Social Media Management',
    shortDesc: 'Full-service social presence across all platforms',
    longDesc:
      'Community growth, always-on publishing, and performance reporting across every platform your audience cares about.',
    icon: 'Share2',
    position: { x: 25, y: 35 },
    connections: ['ai-marketing', 'tiktok', 'influencer'],
  },
  {
    id: 'tiktok',
    name: 'TikTok & Content Creation',
    shortDesc: 'Viral-ready content for the attention economy',
    longDesc:
      'End-to-end content studios — trending formats, shoot production, editing, and publishing that built to move.',
    icon: 'Video',
    position: { x: 15, y: 60 },
    connections: ['social', 'influencer'],
  },
  {
    id: 'influencer',
    name: 'Influencer & Celebrity Management',
    shortDesc: 'Strategic partnerships with top creators',
    longDesc:
      'Deal sourcing, contracting, campaign execution, and measurement with regional and global creator networks.',
    icon: 'Users',
    position: { x: 35, y: 75 },
    connections: ['social', 'tiktok', 'brand'],
  },
  {
    id: 'seo',
    name: 'SEO & Performance Marketing',
    shortDesc: 'Data-driven growth that compounds',
    longDesc:
      'Technical SEO, content strategy, paid search, and CRO working in lock-step to lower CAC every quarter.',
    icon: 'TrendingUp',
    position: { x: 75, y: 35 },
    connections: ['ai-marketing', 'apps'],
  },
  {
    id: 'apps',
    name: 'Smart App Solutions',
    shortDesc: 'Custom applications with AI integration',
    longDesc:
      'Native and cross-platform apps, built on modern stacks with AI features baked in from day one.',
    icon: 'Smartphone',
    position: { x: 85, y: 60 },
    connections: ['ai-marketing', 'seo', 'brand'],
  },
  {
    id: 'brand',
    name: 'Brand Strategy & Identity',
    shortDesc: 'Distinctive brands that resonate',
    longDesc:
      'Positioning, visual identity, verbal identity, and rollout systems that give your brand staying power.',
    icon: 'Sparkles',
    position: { x: 65, y: 75 },
    connections: ['influencer', 'apps'],
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
