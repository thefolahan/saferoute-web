import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

/**
 * The dashboard loads Inter as a VARIABLE font, while the marketing site loads
 * four static instances. That is not an oversight: the Figma frames were
 * measured against the variable face, and the static 500/600 instances render
 * ~3% narrower and visibly lighter, which shows up on every button label and
 * badge. Scoped to this subtree so the site keeps the font it was built with.
 */
const adminFont = Inter({
  subsets: ['latin'],
  variable: '--font-admin',
  display: 'swap'
});

/**
 * The dashboard is part of the site but not part of the marketing surface: it
 * gets no SiteNav/SiteFooter, and it is never indexed. `admin-root` scopes the
 * product-surface resets (white ground, navy body text, unstyled links and
 * buttons) so none of it reaches the public pages.
 *
 * Built from Figma page 907:2 "O-Dashboard" — see docs/design/odash-spec.
 */
export const metadata: Metadata = {
  title: {
    default: 'SafeRoute Admin',
    template: '%s | SafeRoute Admin'
  },
  description: 'SafeRoute operations dashboard',
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className={`${adminFont.variable} admin-root`}>{children}</div>;
}
