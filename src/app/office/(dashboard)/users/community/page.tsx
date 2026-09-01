'use client';

import {
  ActivityPanel,
  ContactsPanel,
  InfoPanel,
  LocationPanel,
  ReportsPanel,
  SubscriptionPanel,
  UserDetail,
  type DetailSubject
} from '../../../_components/user-detail';

/* Figma 907:15289 / 15437 / 15725 / 15841 / 15955 / 16038 — "User details". */

const SUBJECT: DetailSubject = {
  breadcrumb: ['Dashboard', 'Users', '...', 'User details'],
  idLabel: 'User ID: USR-03001',
  name: 'Tomiwa Oyeledu Dolapo',
  kind: 'Community Member',
  score: '84%',
  avatar: 'person',
  official: false,
  gauge: 'amber',
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
    { id: 'activity', label: 'Activity' },
    { id: 'contacts', label: 'Emergency contacts' },
    { id: 'plan', label: 'Subscription ' },
    { id: 'location', label: 'Location' }
  ]
};

const ACTIVITY = [
  {
    day: 'TODAY',
    items: [
      {
        title: 'Emergency alert activated',
        body: 'User activated an SOS emergency alert Lekki Phase 1, Lagos',
        time: '10:42 AM'
      },
      {
        title: 'Incident reported',
        body: 'Reported a road accident Admiralty Way, Lekki ',
        time: '3:30 AM'
      },
      {
        title: 'Community post published',
        body: 'Road is currently blocked... ',
        time: '2:42 AM'
      }
    ]
  },
  {
    day: 'YESTERDAY',
    items: [
      {
        title: 'Emergency alert activated',
        body: 'User activated an SOS emergency alert Lekki Phase 1',
        time: '14:56 PM'
      },
      {
        title: 'Incident reported',
        body: 'Reported a road accident Admiralty Way, ',
        time: '09:00 AM'
      },
      {
        title: 'Community post published',
        body: 'Road is currently blocked... ',
        time: '06:42 AM'
      }
    ]
  }
];

const CONTACTS = [
  { name: 'Oluwatomison Jumoke', phone: '+234 456 7383 930', relation: 'Family' },
  { name: 'Brother Micheal Oyeledu', phone: '+234 456 7383 930', relation: 'Sibiling' },
  { name: 'Tobiloba anthony', phone: '+234 456 7383 930', relation: 'Spouse' },
  { name: 'Tomiwa Dumebi', phone: '+234 456 7383 930', relation: 'Family' },
  { name: 'Taiwo Ayebunam', phone: '+234 456 7383 930', relation: 'Guardian' },
  { name: 'Oluwatomison Jumoke', phone: '+234 456 7383 930', relation: 'Family' }
];

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
  }
];

export default function CommunityUserPage() {
  return (
    <UserDetail
      subject={SUBJECT}
      panels={{
        overview: (
          <InfoPanel
            title="Personal information"
            rows={[
              { label: 'Full name', value: 'Tomiwa Oyeledu Dolapo' },
              { label: 'Username', value: '@tomiwa673' },
              { label: 'Phone', value: '••• ••• ••••', reveal: true },
              { label: 'Email', value: 'T***@***.com', reveal: true },
              { label: 'Gender', value: 'Female' },
              { label: 'Date joined', value: '2026-05-29 22:34' },
              { label: 'Last active', value: '2026-08-04 18:34' },
              { label: 'City', value: 'Owerri' }
            ]}
          />
        ),
        reports: <ReportsPanel count="1,284" items={REPORTS} />,
        activity: <ActivityPanel groups={ACTIVITY} />,
        contacts: <ContactsPanel contacts={CONTACTS} />,
        plan: <SubscriptionPanel />,
        location: <LocationPanel />
      }}
    />
  );
}
