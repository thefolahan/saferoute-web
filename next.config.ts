import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    /**
     * The dev image optimizer caches every variant it produces under
     * .next/dev/cache/images, keyed by url + width + quality — nothing about
     * the file's contents. Replace an image in public/ under the same name and
     * it keeps serving the old bytes, across restarts, until the entry expires.
     * Skipping optimization in dev takes that cache out of the path entirely:
     * next/image points straight at the file on disk, so a swapped image shows
     * up on the next reload. Production builds optimize as normal.
     */
    unoptimized: isDev
  },
  /**
   * Renamed pages. Permanent so the old paths stop being indexed, and so
   * anything already linking to one — a pitch deck, an email, a social bio,
   * an app-store listing — still lands on the page instead of a 404.
   */
  async redirects() {
    return [
      { source: '/journalist', destination: '/news-outlets', permanent: true },
      // /coming-soon was where the download buttons pointed; /download does
      // that job now, and the old path was already indexable.
      { source: '/coming-soon', destination: '/download', permanent: true },
      { source: '/terms', destination: '/terms-of-use', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true }
    ];
  }
};

export default nextConfig;
