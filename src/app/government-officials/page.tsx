import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Government Officials',
  description:
    'Get early access to real-time incident intelligence and secure your spot on the government waitlist.',
  alternates: { canonical: '/government-officials' }
};

/**
 * Deliberately the same layout as Enterprise — `variant: 'enterprise'` selects
 * the card form, the vertical social proof and the socials row. Only the copy
 * differs, so the two pages stay identical by construction rather than by
 * someone remembering to mirror a change across both files.
 */
const governmentConfig: WaitlistConfig = {
  variant: 'enterprise',
  source: 'government-officials',
  heading: { lines: ['Protect your citizens.', 'Respond before it escalates.'] },
  subhead: {
    text: 'Get early access to real-time incident intelligence and secure your spot on the government waitlist.'
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
  form: { variant: 'card', placeholder: 'Enter your official email...', width: 460 },
  footer: {
    copyright: 'SafeRoute Africa. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Community Guidelines', href: '/community-guidelines' }
    ]
  }
};

export default function GovernmentOfficialsWaitlistPage() {
  return <WaitlistPage config={governmentConfig} />;
}
