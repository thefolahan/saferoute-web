import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'Journalist',
  description:
    'Gain direct access to verified citizen broadcasts, safety logs, and emergency briefings on transit developments.'
};

const journalistConfig: WaitlistConfig = {
  orbVariant: 'journalist',
  heading: { text: 'Get the story first. Verify with community truth.' },
  subhead: {
    text: 'Gain direct access to verified citizen broadcasts, safety logs, and emergency briefings on transit developments.'
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
    subtitle: 'from Reuters, AP, BBC and more'
  },
  form: { variant: 'row', placeholder: 'Enter your press email...', width: 520 },
  trustNote: { text: 'Trusted by reporters at leading outlets. No spam, ever.' },
  valueProps: [
    { label: 'Exclusive Press Kits', dot: '#A78BFA' },
    { label: 'Live Citizen Updates', dot: '#F9A8D4' },
    { label: 'Incident News Desks', dot: '#6EE7B7' }
  ],
  footer: {
    copyright: '© 2026 SafeRoute. All rights reserved.',
    links: ['Privacy Policy', 'Terms of Service']
  }
};

export default function JournalistWaitlistPage() {
  return <WaitlistPage config={journalistConfig} />;
}
