import { SITE_CONFIG } from '@/lib/constants';

/**
 * JSON-LD `Organization` block. Lives in the root layout so every page
 * carries the brand entity to search engines and rich-result tools.
 *
 * Renders as a server-only `<script type="application/ld+json">`.
 */
export function StructuredData(): JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abu Dhabi',
      addressCountry: 'AE',
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.tiktok,
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.youtube,
    ],
    logo: `${SITE_CONFIG.url}/favicon.svg`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default StructuredData;
