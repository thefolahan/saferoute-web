import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Government Officials',
  description:
    'Get early access to real-time incident intelligence and secure your spot on the government waitlist.'
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
  // Kept to two lines at desktop width, like Enterprise's heading — a longer
  // line wraps to three and the two pages stop looking like siblings.
  heading: { text: 'Protect your citizens. Optimize public transit.' },
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
    links: ['Privacy Policy', 'Terms of Service']
  }
};

export default function GovernmentOfficialsWaitlistPage() {
  return <WaitlistPage config={governmentConfig} />;
}
