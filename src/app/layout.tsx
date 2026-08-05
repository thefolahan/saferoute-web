import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { extensionNoiseGuard } from './_lib/extension-noise-guard';

const siteFont = Inter({
  subsets: ['latin'],
  variable: '--font-site',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saferoutehq.com';

const description =
  'Stay safe and informed with SafeRoute. Receive instant alerts and live updates on reported crimes and incidents happening near you.';

export const metadata: Metadata = {
  // Chat and social crawlers only follow absolute URLs, so the preview image
  // resolves against this rather than the deploy's own hostname.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SafeRoute: Know Before You Go',
    template: '%s | SafeRoute'
  },
  description,
  applicationName: 'SafeRoute',
  openGraph: {
    title: 'SafeRoute: Know Before You Go',
    description,
    siteName: 'SafeRoute',
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
    title: 'SafeRoute: Know Before You Go',
    description,
    images: ['/images/og-cover.png']
  },
  robots: {
    index: true,
    follow: true
  },
  // Same problem, same fix: these carry the dark background rather than relying
  // on transparency. (The old /images/logo.svg was also a 1.9MB favicon.)
  icons: {
    icon: [{ url: '/images/icon-512.png', type: 'image/png', sizes: '512x512' }],
    shortcut: [{ url: '/images/icon-512.png', type: 'image/png' }],
    apple: [{ url: '/images/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }]
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={extensionNoiseGuard} />
      </head>
      <body className={siteFont.variable}>{children}</body>
    </html>
  );
}
