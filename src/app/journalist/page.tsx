import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Journalist | SafeRoute',
  description:
    'Gain direct access to verified citizen broadcasts, safety logs, and emergency briefings on transit developments.'
};

const journalistConfig: WaitlistConfig = {
  orbVariant: 'journalist',
  pageBg: '#FAFAFA',
  header: {
    variant: 'back-right',
    logo: 'pin',
    brandColor: '#0A0D12',
    brandSize: 17,
    brandLineHeight: 21,
    backColor: '#717680'
  },
  badge: {
    text: 'Reporters & Press',
    dotColor: '#F59E0B',
    textColor: '#6B7280',
    borderColor: '#E9EAEB',
    shadow: '0 1px 3px 0 rgba(10,13,18,0.04)',
    fontSize: 12,
    lineHeight: 15,
    gap: 6,
    uppercase: true
  },
  heading: {
    text: 'Get the story first. Verify with community truth.',
    color: '#0A0D12',
    size: 58,
    lineHeight: 68
  },
  subhead: {
    text: 'Gain direct access to verified citizen broadcasts, safety logs, and emergency briefings on transit developments.',
    color: '#717680',
    size: 18,
    lineHeight: 28
  },
  socialProof: {
    orientation: 'horizontal',
    avatars: [
      '/images/landing/496-18346.png',
      '/images/landing/496-18347.png',
      '/images/landing/496-18348.png'
    ],
    avatarSize: 32,
    overlap: 10,
    countText: '+14',
    countBg: '#F3F4F6',
    countColor: '#6B7280',
    countSize: 10,
    countLineHeight: 12,
    title: 'Join 200+ journalists',
    titleColor: '#0A0D12',
    subtitle: 'from Reuters, AP, BBC and more',
    subtitleColor: '#9CA3AF'
  },
  form: { variant: 'row', placeholder: 'Enter your press email...', width: 520 },
  trustNote: {
    text: 'Trusted by reporters at leading outlets. No spam, ever.',
    color: '#9CA3AF'
  },
  valueProps: [
    { label: 'Exclusive Press Kits', dot: '#A78BFA', color: '#6B7280' },
    { label: 'Live Citizen Updates', dot: '#F9A8D4', color: '#6B7280' },
    { label: 'Incident News Desks', dot: '#6EE7B7', color: '#6B7280' }
  ],
  footer: {
    copyright: '© 2024 SafeRoute. All rights reserved.',
    copyrightColor: '#73737A',
    links: ['Privacy Policy', 'Terms of Service'],
    linkColor: '#9CA3AF'
  }
};

export default function JournalistWaitlistPage() {
  return <WaitlistPage config={journalistConfig} />;
}
