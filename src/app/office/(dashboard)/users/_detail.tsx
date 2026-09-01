import {
  ActivityPanel,
  ContactsPanel,
  InfoPanel,
  LocationPanel,
  ReportsPanel,
  SubscriptionPanel,
  UserDetail,
  type DetailSubject
} from '../../_components/user-detail';
import { officeFetch } from '../../_lib/session';

/**
 * Both /users/agency and /users/community render this; they differ only in the
 * tab set and which subject fields are meaningful. `id` selects the record —
 * without one we show the most recent account of that kind, so the page is
 * never blank when reached from the sidebar.
 */
export type ApiUserDetail = {
  id: string;
  /** 0-1 confidence, or null on an account with no history to score. */
  trustScore: number | null;
  /** Percentage of active accounts at or above this one, or null. */
  trustPercentile: number | null;
  name: string;
  reference: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  accountType: 'community' | 'official' | 'news_outlet';
  organizationName: string | null;
  organizationState: string | null;
  organizationUnit: string | null;
  verificationStatus: string;
  kycStatus: string;
  status: string;
  city: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  stats: {
    followers: number;
    posts: number;
    reportsSubmitted: number;
    verifiedReports: number;
    impressions: number | null;
    communityRank: number | null;
    liveBroadcasts: number | null;
  };
  subscription: {
    planId: string;
    status: string;
    priceMinor: number;
    currency: string;
    startedAt: string;
    currentPeriodEnd: string;
    provider: string;
  } | null;
  emergencyContacts: {
    id: string;
    name: string;
    phoneNumber: string;
    relationship: string | null;
  }[];
  reports: {
    id: string;
    title: string;
    category: string;
    status: string;
    place: string;
    body: string;
    confirmations: number;
    reportedAt: string;
  }[];
};

export async function renderUserDetail({
  id,
  kind
}: {
  id?: string;
  kind: 'agency' | 'community';
}) {
  const resolvedId = id ?? (await firstIdOfKind(kind));

  if (!resolvedId) {
    return (
      <p className="p-16 text-center text-sm text-gray-500">
        No {kind === 'agency' ? 'official or agency' : 'community'} accounts yet.
      </p>
    );
  }

  const user = await officeFetch<ApiUserDetail>(`/admin/users/${resolvedId}`);

  if (!user) {
    return (
      <p className="p-16 text-center text-sm text-gray-500">
        That account could not be loaded.
      </p>
    );
  }

  const isAgency = user.accountType !== 'community';

  const subject: DetailSubject = {
    id: user.id,
    email: user.email,
    avatarUrl: user.avatarUrl,
    status: user.status,
    breadcrumb: [
      'Dashboard',
      isAgency ? 'Officials & Agency' : 'Users',
      '...',
      isAgency ? 'Official & Agency details' : 'User details'
    ],
    idLabel: `${isAgency ? 'Agency' : 'User'} ID: ${user.reference}`,
    name: user.organizationName ?? user.name,
    kind: isAgency
      ? [user.organizationUnit, user.organizationState].filter(Boolean).join(' · ') ||
        'Official'
      : 'Community Member',
    /**
     * The gauge, from this account's own record. `users.trust_score` is a
     * 0-1 confidence, so it reads as a percentage; the band and the percentile
     * line replace what used to be a fixed "Excellent / Top 5%".
     */
    score: user.trustScore === null ? '—' : `${Math.round(user.trustScore * 100)}`,
    scoreBand: trustBand(user.trustScore),
    scoreNote:
      user.trustPercentile === null
        ? 'Not enough accounts to rank against'
        : `Top ${user.trustPercentile}% of SafeRoute users`,
    avatar: isAgency ? 'agency' : 'person',
    official: isAgency,
    gauge:
      user.trustScore !== null && user.trustScore >= 0.6 ? 'green' : 'amber',
    stats: [
      { value: format(user.stats.followers), label: 'Followers' },
      { value: format(user.stats.impressions), label: 'Impressions' },
      { value: format(user.stats.verifiedReports), label: 'Verified reports' },
      { value: format(user.stats.communityRank), label: 'Community Rank' },
      { value: format(user.stats.liveBroadcasts), label: 'Live Broadcasts' },
      { value: format(user.stats.reportsSubmitted), label: 'Reports Submitted' }
    ],
    tabs: isAgency
      ? [
          { id: 'overview', label: 'Overview' },
          { id: 'reports', label: 'Reports' },
          { id: 'plan', label: 'Subscription Plan' },
          { id: 'location', label: 'Location' }
        ]
      : [
          { id: 'overview', label: 'Overview' },
          { id: 'reports', label: 'Reports' },
          { id: 'activity', label: 'Activity' },
          { id: 'contacts', label: 'Emergency contacts' },
          { id: 'plan', label: 'Subscription ' },
          { id: 'location', label: 'Location' }
        ]
  };

  const overviewRows = isAgency
    ? [
        { label: 'Agency Name', value: user.organizationName ?? user.name },
        { label: 'Agency Type', value: user.organizationUnit ?? '—' },
        { label: 'Phone', value: mask(user.phoneNumber), reveal: !!user.phoneNumber },
        { label: 'Email', value: mask(user.email), reveal: !!user.email },
        { label: 'Jurisdiction', value: user.organizationState ?? '—' },
        { label: 'Headquarters', value: user.city ?? '—' },
        { label: 'Registration Date', value: date(user.createdAt) },
        { label: 'Account Status', value: capitalise(user.status) },
        { label: 'Verification Status', value: capitalise(user.verificationStatus) }
      ]
    : [
        { label: 'Full name', value: user.name },
        { label: 'Username', value: user.username ? `@${user.username}` : '—' },
        { label: 'Phone', value: mask(user.phoneNumber), reveal: !!user.phoneNumber },
        { label: 'Email', value: mask(user.email), reveal: !!user.email },
        { label: 'Date joined', value: dateTime(user.createdAt) },
        { label: 'Last active', value: dateTime(user.lastActiveAt) },
        { label: 'City', value: user.city ?? '—' }
      ];

  return (
    <UserDetail
      subject={subject}
      panels={{
        overview: (
          <InfoPanel
            title={isAgency ? 'Agency Information' : 'Personal information'}
            rows={overviewRows}
          />
        ),
        reports: (
          <ReportsPanel
            count={String(user.reports.length)}
            items={user.reports.map((report) => ({
              id: report.id,
              title: capitalise(report.category.replace(/_/g, ' ')),
              place: report.place,
              when: date(report.reportedAt),
              body: report.body,
              verifications: `${report.confirmations} verification${
                report.confirmations === 1 ? '' : 's'
              }`
            }))}
          />
        ),
        activity: <ActivityPanel groups={[]} />,
        contacts: (
          <ContactsPanel
            contacts={user.emergencyContacts.map((contact) => ({
              name: contact.name,
              phone: contact.phoneNumber,
              relation: contact.relationship ?? 'Contact'
            }))}
          />
        ),
        plan: <SubscriptionPanel subscription={user.subscription} />,
        location: <LocationPanel city={user.city} lastActiveAt={user.lastActiveAt} />
      }}
    />
  );
}

async function firstIdOfKind(kind: 'agency' | 'community') {
  const list = await officeFetch<{ rows: { id: string }[] }>(
    `/admin/users?tab=${kind === 'agency' ? 'officials' : 'regular'}&page=1`
  );
  return list?.rows[0]?.id;
}

function format(value: number | null): string {
  return value === null ? '—' : new Intl.NumberFormat('en-NG').format(value);
}

function mask(value: string | null): string {
  if (!value) return '—';
  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    return `${name?.[0] ?? ''}***@***.${domain?.split('.').pop() ?? 'com'}`;
  }
  return '••• ••• ••••';
}

function date(iso: string): string {
  return new Date(iso).toLocaleDateString('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function dateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-CA', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

function capitalise(value: string): string {
  return value.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

/**
 * The word beside the gauge. Bands rather than a raw number because that is
 * what the design shows, and because a percentage on its own does not say
 * whether it is good.
 */
function trustBand(score: number | null): string | null {
  if (score === null) return null;
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Fair';
  return 'Needs review';
}
