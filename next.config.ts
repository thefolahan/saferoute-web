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
  }
};

export default nextConfig;
