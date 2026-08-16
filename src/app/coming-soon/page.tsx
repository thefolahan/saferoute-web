import type { Metadata } from 'next';
import { ComingSoon } from '../_components/coming-soon';

/**
 * noindex, not a robots.txt Disallow. Blocking the path would stop Google
 * fetching the page, which also stops it seeing any noindex — a URL it cannot
 * crawl can still be indexed from an external link. Letting it be crawled and
 * telling it not to index is what actually keeps "Coming soon" from turning up
 * as the search result for the brand.
 */
export const metadata: Metadata = {
  title: 'Coming soon',
  robots: { index: false, follow: true }
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
