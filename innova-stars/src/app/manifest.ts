import type { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/lib/constants';

/**
 * PWA manifest — lets users "Add to home screen" on mobile and gives the
 * site a proper theme color and icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: 'Innova Stars',
    description: SITE_CONFIG.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A1A',
    theme_color: '#D4AF37',
    icons: [
      { src: '/icon.webp', sizes: 'any', type: 'image/webp' },
      { src: '/logo.webp', sizes: '512x512', type: 'image/webp' },
    ],
    categories: ['business', 'design', 'productivity'],
  };
}
