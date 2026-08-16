import type { MetadataRoute } from 'next';
import { ROUTES, SITE_URL } from './_lib/site';

/**
 * Served at /sitemap.xml. Google will not discover a brand-new site quickly on
 * its own — a sitemap plus a Search Console submission is what turns "not in
 * the index" into "crawled within days".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp for the whole build rather than new Date() per entry, so the
  // lastModified values in a single sitemap agree with each other.
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
