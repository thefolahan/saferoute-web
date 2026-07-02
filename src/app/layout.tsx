import './globals.css';
import 'aos/dist/aos.css';
import type { Metadata, Viewport } from 'next';
import { Nunito_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { AosInit } from './_components/aos-init';

const siteFont = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-site',
  weight: ['500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'SafeRoute | Know Before You Go',
  description:
    'SafeRoute helps people in Nigerian cities see verified safety alerts, report incidents responsibly, and call 112 when it matters.',
  applicationName: 'SafeRoute',
  openGraph: {
    title: 'SafeRoute | Know Before You Go',
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
      <body className={siteFont.variable}>
        <AosInit />
        {children}
      </body>
    </html>
  );
}
