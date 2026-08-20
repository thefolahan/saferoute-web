import type { MetadataRoute } from 'next';
import { SITE_URL } from './_lib/site';

/**
 * Served at /robots.txt, which currently 404s in production — a 404 there is
 * not fatal, but it means nothing points a crawler at the sitemap.
 *
 * Note the split between this file and the `robots` metadata on the pages
 * themselves: disallowing a path here stops it being *crawled*, which is not
 * the same as stopping it being *indexed* — a disallowed URL can still be
 * listed from external links, and because the crawler is not allowed to fetch
 * it, it never sees the noindex. So the 404 carries a `noindex` in its own
 * metadata and is left crawlable, rather than being blocked here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next's build output, not content. Nothing here is a landing page.
        disallow: ['/_next/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
