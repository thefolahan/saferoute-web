import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { extensionNoiseGuard } from './_lib/extension-noise-guard';
import { revealGate } from './_lib/reveal-gate';

const siteFont = Inter({
  subsets: ['latin'],
  variable: '--font-site',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saferoutehq.com';

/**
 * The brand name carries "Africa" in the title and the description, and the
 * description names Nigeria. That is not padding: "SafeRoute" alone is shared
 * with several unrelated products, so the unqualified name is a word this site
 * cannot realistically own, while "SafeRoute Africa" is one nothing else is
 * competing for. Ranking for the qualified name is the achievable goal, and it
 * only works if the qualified name actually appears in the indexed text.
 */
const description =
  'SafeRoute Africa is a community safety platform for Nigeria. Get real-time alerts on incidents near you, plan safer routes, and travel with confidence.';

const title = 'SafeRoute Africa: Know Before You Go';

export const metadata: Metadata = {
  // Chat and social crawlers only follow absolute URLs, so the preview image
  // resolves against this rather than the deploy's own hostname.
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: '%s | SafeRoute Africa'
  },
  description,
  applicationName: 'SafeRoute',
  /**
   * Google Search Console's HTML-tag verification method. Set
   * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in the Vercel project to the token
   * Search Console hands you; left unset, no tag is emitted and the DNS or
   * file verification methods still work.
   */
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title,
    description,
    siteName: 'SafeRoute Africa',
    url: '/',
    type: 'website',
    // The logo is white on transparency, which vanishes against the white card
    // WhatsApp/iMessage draw the preview in. og-cover bakes in the dark brand
    // background so the mark reads on any client, in either theme.
    images: [
      {
        url: '/images/og-cover.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'SafeRoute — Know Before You Go'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/og-cover.png']
  },
  /**
   * `googleBot` repeats index/follow on purpose and lifts the snippet caps:
   * without max-snippet/max-image-preview, Google applies conservative
   * defaults and may show a truncated snippet or no preview image.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  },
  /**
   * Same problem, same fix: these carry the dark background rather than relying
   * on transparency. (The old /images/logo.svg was also a 1.9MB favicon.)
   *
   * /favicon.ico leads because Google's favicon crawler probes that path
   * directly, on top of reading these tags — and it previously 404'd here,
   * which left a retired logo pinned in the search results. The PNG sizes are
   * Google's documented ones (square, a multiple of 48px); 512 is not a
   * multiple of 48 and stays only for PWA installs and high-DPI tabs.
   *
   * All of these are emitted by scripts/generate-brand-assets.mjs — regenerate
   * rather than hand-editing when the mark changes.
   */
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '48x48 96x96 144x144' },
      { url: '/images/icon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/images/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/images/icon-512.png', type: 'image/png', sizes: '512x512' }
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/images/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }]
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /**
     * `suppressHydrationWarning` covers exactly one attribute: `data-reveal`,
     * which revealGate sets on this element before React ever runs. That is the
     * whole point of that script — the attribute cannot be in the server HTML
     * without the flash-of-hidden-content the gate exists to prevent — so the
     * mismatch is by design and React should stop reporting it. It applies only
     * to this element's own attributes; mismatches anywhere below still warn.
     *
     * `data-scroll-behavior` tells Next the smooth scrolling in globals.css is
     * deliberate, so it stops warning and turns it off for route transitions
     * (where smooth means the new page visibly slides to the top).
     */
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={extensionNoiseGuard} />
        {/* Must run before first paint — see reveal-gate.ts. */}
        <script dangerouslySetInnerHTML={revealGate} />
      </head>
      <body className={siteFont.variable}>{children}</body>
    </html>
  );
}
