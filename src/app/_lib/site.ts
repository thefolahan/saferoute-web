/**
 * Single source of truth for the canonical origin and the list of indexable
 * routes. sitemap.ts and robots.ts both read from here so that adding a page
 * means editing one list, not three files that quietly drift apart.
 */

/**
 * The canonical origin, always with the `www.` host. The apex redirects to www
 * at the edge (308), so serving a canonical that points at the apex would tell
 * Google to index a URL that immediately redirects — the two hosts have to
 * agree on which one is the real one, and www is what is already deployed.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saferoutehq.com';

export const SITE_NAME = 'SafeRoute Africa';

/**
 * `priority` and `changeFrequency` are hints Google has said it largely
 * ignores; they are kept because other crawlers (Bing among them) still read
 * them, and they cost nothing. What actually matters in a sitemap is that the
 * URL list is complete and every entry returns 200.
 */
export const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/enterprise', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/government-officials', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/news-outlets', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/help-center', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/terms-of-use', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/community-guidelines', priority: 0.4, changeFrequency: 'yearly' }
] as const satisfies readonly {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}[];

/**
 * Routes deliberately kept out of the index. /coming-soon and the 404 are the
 * same placeholder screen — letting either into the index risks Google showing
 * "Coming soon" as the answer to a search for the brand.
 */
export const NOINDEX_ROUTES = ['/coming-soon'];
