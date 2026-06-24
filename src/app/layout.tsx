import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
