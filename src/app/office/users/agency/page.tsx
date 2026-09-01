'use client';

import {
  InfoPanel,
  LocationPanel,
  ReportsPanel,
  SubscriptionPanel,
  UserDetail,
  type DetailSubject
} from '../../_components/user-detail';

/* Figma 907:14716 / 14866 / 15149 / 15227 — "Official & Agency details". */

const SUBJECT: DetailSubject = {
  breadcrumb: ['Dashboard', 'Officials & Agency', '...', 'Official & Agency details'],
  idLabel: 'Agency ID: AGY-00012',
  name: 'Federal Road Safety Corps',
  kind: 'Law Enforcement · Nationwide',
  score: '94%',
  avatar: 'agency',
  official: true,
  gauge: 'green',
  stats: [
    { value: '24.4k', label: 'Followers' },
    { value: '5.6k', label: 'Impressions' },
    { value: '210', label: 'Verified reports' },
    { value: '#46', label: 'Community Rank' },
    { value: '9', label: 'Live Broadcasts' },
    { value: '450', label: 'Reports Submitted' }
  ],
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'reports', label: 'Reports' },
    { id: 'plan', label: 'Subscription Plan' },
    { id: 'location', label: 'Location' }
  ]
};

const REPORTS = [
  {
    title: 'Road accident',
    place: 'Lekki Phase 1, Lagos',
    when: '2 hours ago',
    body: 'Car crash near Admiralty intersection. Police team dispatched.',
    verifications: '34 verifications'
  },
  {
    title: 'Armed Robbery',
    place: 'Lekki Phase 1, Lagos',
    when: '2 hours ago',
    body: 'Attempted robbery near Admiralty intersection. Police team dispatched.',
    verifications: '34 verifications'
  },
  {
    title: 'Flooding',
    place: 'Victoria Island, Lagos',
    when: '5 hours ago',
    body: 'High water levels observed along Kofo Abayomi Street.',
    verifications: '42 verifications'
  },
  {
    title: 'Flooding',
    place: 'Third Mainland Bridge',
    when: '4 hours ago',
    body: 'Multi-car collision causing severe outbound gridlock.',
    verifications: '18 verifications'
  }
];

export default function AgencyDetailPage() {
  return (
    <UserDetail
      subject={SUBJECT}
      panels={{
        overview: (
          <InfoPanel
            title="Agency Information"
            rows={[
              { label: 'Agency Name', value: 'Federal Road Safety Corps' },
              { label: 'Agency Type', value: 'Law Enforcement' },
              { label: 'Phone', value: '••• ••• ••••', reveal: true },
              { label: 'Email', value: 'T***@***.com', reveal: true },
              { label: 'Jurisdiction', value: 'Nationwide' },
              { label: 'Headquarters', value: 'Abuja' },
              { label: 'Registration Date', value: 'March 12, 2026' },
              { label: 'Account Status', value: 'Active' },
              { label: 'Verification Status', value: 'Verified' }
            ]}
          />
        ),
        reports: <ReportsPanel count="1,284" items={REPORTS} />,
        plan: <SubscriptionPanel />,
        location: <LocationPanel />
      }}
    />
  );
}
