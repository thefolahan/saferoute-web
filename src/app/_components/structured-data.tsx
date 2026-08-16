import { FAQS } from '../_lib/faq';
import { SITE_NAME, SITE_URL } from '../_lib/site';

/**
 * JSON-LD for the homepage.
 *
 * This is the part of the SEO work aimed specifically at the "I search my own
 * brand and get nothing" problem. "SafeRoute" on its own is a crowded name —
 * several unrelated products ship under it — so the goal here is not to win
 * that word, it is to make Google recognise *this* site as the entity called
 * SafeRoute Africa / SafeRouteHq. An Organization block with an explicit
 * `alternateName` list is how you state the names you answer to.
 *
 * The blocks are emitted as one @graph rather than three separate scripts so
 * the nodes can reference each other by @id.
 */
export function StructuredData() {
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      // Every spelling a person might actually type. Without this, a search for
      // "SafeRouteHq" has no lexical hook into the site at all — the string
      // appears nowhere in the page copy, only in the domain.
      alternateName: ['SafeRoute', 'SafeRouteHq', 'SafeRoute HQ', 'SafeRoute Nigeria'],
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/icon-512.png`,
        width: 512,
        height: 512
      },
      description:
        'SafeRoute Africa is a community safety and intelligence platform that lets people share, discover, and verify safety incidents, and plan safer journeys across Nigeria.',
      email: 'support@saferoutehq.com',
      telephone: '+234 814 667 3694',
      areaServed: { '@type': 'Country', name: 'Nigeria' },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@saferoutehq.com',
          telephone: '+234 814 667 3694',
          areaServed: 'NG',
          availableLanguage: ['English']
        }
      ]
      // `sameAs` is deliberately absent: it should list the brand's real social
      // and directory profiles, and every social href in social-icons.tsx is
      // still a '#' placeholder. Listing URLs that do not exist is worse than
      // listing none — see the note in the handover.
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: 'SafeRoute',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en'
    },
    {
      '@type': 'MobileApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'SafeRoute',
      applicationCategory: 'TravelApplication',
      operatingSystem: 'iOS, Android',
      publisher: { '@id': `${SITE_URL}/#organization` },
      description:
        'Plan safer routes, receive real-time alerts on incidents near you, and share your journey with a trusted Safety Circle.',
      // No `offers` and no `aggregateRating`: the app is pre-launch, and an
      // invented price or star rating in structured data is a manual-action
      // risk, not a ranking shortcut.
      url: SITE_URL
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    }
  ];

  return (
    <script
      type="application/ld+json"
      // The content is built from constants in this repo, not from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
      }}
    />
  );
}
