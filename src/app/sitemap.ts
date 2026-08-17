import type { MetadataRoute } from 'next';
import { ROUTES, SITE_URL } from './_lib/site';

/**
 * Served at /sitemap.xml. Google will not discover a brand-new site quickly on
 * its own — a sitemap plus a Search Console submission is what turns "not in
 * the index" into "crawled within days".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified comes from ROUTES, not from the build clock: a timestamp
  // generated at build time claimed every page had changed on every deploy,
  // which is how you teach Google to ignore the field. See the note in site.ts.
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
