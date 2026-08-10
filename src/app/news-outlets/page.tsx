import type { Metadata } from 'next';
import { WaitlistPage, type WaitlistConfig } from '../_components/waitlist/waitlist-page';

export const metadata: Metadata = {
  title: 'News Outlets',
  description:
    'Gain direct access to verified citizen broadcasts, safety logs, and emergency briefings on transit developments.'
};

const newsOutletsConfig: WaitlistConfig = {
  variant: 'news-outlets',
  source: 'news-outlets',
  heading: { lines: ['Get the story first.', 'Verify with community truth.'] },
  subhead: {
    text: 'Gain direct access to verified citizen broadcasts, safety logs, and emergency briefings on transit developments.'
  },
  socialProof: {
    orientation: 'horizontal',
    avatars: [],
    avatarSize: 32,
    overlap: 10,
    countText: '',
    countBg: '#F3F4F6',
    countColor: '#6B7280',
    countSize: 10,
    countLineHeight: 12,
    title: '',
    subtitle: ''
  },
  form: { variant: 'row', placeholder: 'Enter your press email...', width: 520 },
  trustNote: { text: 'Trusted by reporters at leading outlets. No spam, ever.' },
  footer: {
    copyright: 'SafeRoute Africa. All rights reserved.',
    links: ['Privacy Policy', 'Terms of Service']
  }
};

export default function NewsOutletsWaitlistPage() {
  return <WaitlistPage config={newsOutletsConfig} />;
}
