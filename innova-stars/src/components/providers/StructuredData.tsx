import { SITE_CONFIG } from '@/lib/constants';

/**
 * JSON-LD `LocalBusiness` block. Lives in the root layout so every page
 * carries the brand entity to search engines and rich-result tools.
 *
 * `LocalBusiness` is more specific than `Organization` for a regional
 * agency — Google uses it for the knowledge panel and local results.
 */
export function StructuredData(): JSX.Element {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    image: `${SITE_CONFIG.url}/innova-logo.svg`,
    logo: `${SITE_CONFIG.url}/favicon.svg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abu Dhabi',
      addressRegion: 'Abu Dhabi',
      addressCountry: 'AE',
    },
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'AdministrativeArea', name: 'GCC' },
    ],
    priceRange: 'AED',
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.tiktok,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE_CONFIG.email,
      telephone: SITE_CONFIG.phone,
      availableLanguage: ['English', 'Arabic'],
      areaServed: 'AE',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default StructuredData;
