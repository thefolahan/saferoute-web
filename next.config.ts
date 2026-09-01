import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { NextConfig } from 'next';

/**
 * The monorepo keeps one .env at its root (apps/api reads it the same way), but
 * Next only auto-loads .env from its own directory. Without this, server-only
 * values like ADMIN_OFFICE_CODE — which src/proxy.ts needs to route the
 * dashboard at all — are simply undefined here.
 *
 * Anything already in the environment wins, so a real deployment sets these as
 * platform env vars and this file is a local-development convenience.
 */
function loadRootEnv(): void {
  try {
    const raw = readFileSync(resolve(process.cwd(), '../../.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;
      const [, key, rawValue] = match as unknown as [string, string, string];
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.trim().replace(/^["'](.*)["']$/, '$1');
    }
  } catch {
    // No root .env (CI, or a deploy that injects real env vars) — fine.
  }
}

loadRootEnv();

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
