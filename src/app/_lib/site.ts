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
 *
 * `lastModified` is the one field Google does act on, and it is a hand-kept
 * date rather than a build timestamp on purpose. Deriving it from the build
 * clock made all ten routes claim to have changed on every single deploy —
 * the legal pages included, which had not been edited in months — and
 * Google's documented response to lastmod values it judges unreliable is to
 * stop trusting the field at all. So the one signal a sitemap contributes
 * that Google respects was the one we were training it to ignore.
 *
 * Bump a route's date only when that route's content actually changes. A date
 * that is stale but true is worth more than a fresh one that is a lie.
 *
 * Git commit dates are no substitute: this repo's history is bulk commits
 * that touch every page at once, so they come out exactly as uniform as the
 * build clock did. Whoever edits a page updates its date here, or the field
 * carries no information.
 */
export const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly', lastModified: '2026-08-16' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-08-16' },
  { path: '/enterprise', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-08-16' },
  {
    path: '/government-officials',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-08-16'
  },
  { path: '/news-outlets', priority: 0.7, changeFrequency: 'monthly', lastModified: '2026-08-16' },
  { path: '/help-center', priority: 0.7, changeFrequency: 'monthly', lastModified: '2026-08-16' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly', lastModified: '2026-08-16' },
  { path: '/terms-of-use', priority: 0.4, changeFrequency: 'yearly', lastModified: '2026-08-16' },
  { path: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly', lastModified: '2026-08-16' },
  {
    path: '/community-guidelines',
    priority: 0.4,
    changeFrequency: 'yearly',
    lastModified: '2026-08-16'
  }
] as const satisfies readonly {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** W3C date, `YYYY-MM-DD`. See the note above before changing one. */
  lastModified: string;
}[];

/**
 * Routes deliberately kept out of the index. /coming-soon and the 404 are the
 * same placeholder screen — letting either into the index risks Google showing
 * "Coming soon" as the answer to a search for the brand.
 */
export const NOINDEX_ROUTES = ['/coming-soon'];
