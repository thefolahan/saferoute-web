import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Enterprise | SafeRoute',
  description:
    'Get early access to real-time safety routing and secure your spot on the enterprise waitlist.'
};

const enterpriseConfig: WaitlistConfig = {
  orbVariant: 'enterprise',
  pageBg: '#000000',
  header: {
    variant: 'back-left',
    logo: 'globe',
    brandColor: '#1C1C1C',
    brandSize: 24,
    brandLineHeight: 29,
    backColor: '#9CA3AF'
  },
  badge: {
    text: 'Enterprise is launching soon',
    dotColor: '#7C3AED',
    textColor: '#4B5563',
    borderColor: '#E5E7EB',
    shadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
    fontSize: 13,
    lineHeight: 16,
    gap: 8
  },
  heading: {
    text: 'Protect your workforce. Optimize their transit.',
    color: '#111827',
    size: 60,
    lineHeight: 68
  },
  subhead: {
    text: 'Get early access to real-time safety routing and secure your spot on the enterprise waitlist.',
    color: '#6B7280',
    size: 17,
    lineHeight: 26
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
    titleColor: '#111827',
    subtitle: 'Sign up to be one of the first to use SafeRoute.',
    subtitleColor: '#6B7280'
  },
  form: { variant: 'card', placeholder: 'Enter your email...', width: 460 },
  followUs: { text: 'Follow us', color: '#9CA3AF' }
};

export default function EnterpriseWaitlistPage() {
  return <WaitlistPage config={enterpriseConfig} />;
}
