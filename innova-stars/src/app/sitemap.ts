import type { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/lib/constants';
import { SERVICES } from '@/lib/constants/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/careers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...SERVICES.map((s) => ({
      url: `${SITE_CONFIG.url}/services/${s.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_CONFIG.url}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
