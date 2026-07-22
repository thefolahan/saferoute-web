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
    avatars: [
      '/images/landing/496-17883.png',
      '/images/landing/496-17884.png',
      '/images/landing/496-17885.png',
      '/images/landing/496-17886.png'
    ],
    avatarSize: 36,
    overlap: 7,
    countText: '+1k',
    countBg: '#F3F4F6',
    countColor: '#374151',
    countSize: 11,
    countLineHeight: 13,
    title: 'Join the waitlist',
    subtitle: 'Sign up to be one of the first to use SafeRoute.'
  },
  form: { variant: 'card', placeholder: 'Enter your email...', width: 460 }
};

export default function EnterpriseWaitlistPage() {
  return <WaitlistPage config={enterpriseConfig} />;
}
