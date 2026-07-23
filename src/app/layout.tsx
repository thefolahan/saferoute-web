import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

// The landing design is set in Inter throughout (weights 400/500/600/700).
const siteFont = Inter({
  subsets: ['latin'],
  variable: '--font-site',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  // Home tab reads "SafeRoute: Know Before You Go"; every other page reads
  // "<Page> | SafeRoute" via the template.
  title: {
    default: 'SafeRoute: Know Before You Go',
    template: '%s | SafeRoute'
  },
  description:
    'SafeRoute helps people in Nigerian cities see verified safety alerts, report incidents responsibly, and call 112 when it matters.',
  applicationName: 'SafeRoute',
  openGraph: {
    title: 'SafeRoute: Know Before You Go',
    description:
      'Verified safety alerts, responsible reporting, and emergency guidance for Nigerian cities.',
    siteName: 'SafeRoute',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [{ url: '/images/logo.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/images/logo.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/images/logo.png', type: 'image/png' }]
  }
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={siteFont.variable}>{children}</body>
    </html>
  );
}
