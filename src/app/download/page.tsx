import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Get the app',
  description:
    'SafeRoute is coming to iOS and Android. Join the waitlist and be first to know when it lands.',
  alternates: { canonical: '/download' }
};

/**
 * Where every "Download App" and store badge on the site leads until SafeRoute
 * is actually listed. They used to go to /coming-soon, which is the same
 * placeholder the 404 renders — so the most deliberate click on the site, from
 * someone who had decided to install the app, collected nothing.
 *
 * Same layout as Enterprise (`variant: 'enterprise'`) so the two stay identical
 * by construction; only the copy differs. `source: 'download'` keeps these
 * signups separable from everyone who merely hit a placeholder.
 */
const downloadConfig: WaitlistConfig = {
  variant: 'enterprise',
  source: 'download',
  heading: { lines: ['Safety in your pocket.', 'Almost ready.'] },
  subhead: {
    text: 'SafeRoute is coming to iOS and Android. Join the waitlist and be first to know when it lands.'
  },
  socialProof: {
    orientation: 'vertical',
    avatars: [],
    avatarSize: 36,
    overlap: 7,
    countText: '',
    countBg: '#F3F4F6',
    countColor: '#374151',
    countSize: 11,
    countLineHeight: 13,
    title: 'Join the waitlist',
    subtitle: 'Sign up to be one of the first to use SafeRoute.'
  },
  form: { variant: 'card', placeholder: 'Enter your email...', width: 460 },
  footer: {
    copyright: 'SafeRoute Africa. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Community Guidelines', href: '/community-guidelines' }
    ]
  }
};

export default function DownloadWaitlistPage() {
  return <WaitlistPage config={downloadConfig} />;
}
