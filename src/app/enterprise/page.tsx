import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Enterprise',
  description:
    'Get early access to real-time safety routing and secure your spot on the enterprise waitlist.'
};

const enterpriseConfig: WaitlistConfig = {
  orbVariant: 'enterprise',
  heading: { text: 'Protect your workforce. Optimize their transit.' },
  subhead: {
    text: 'Get early access to real-time safety routing and secure your spot on the enterprise waitlist.'
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
    copyright: '© 2026 SafeRoute. All rights reserved.',
    links: ['Privacy Policy', 'Terms of Service']
  }
};

export default function EnterpriseWaitlistPage() {
  return <WaitlistPage config={enterpriseConfig} />;
}
