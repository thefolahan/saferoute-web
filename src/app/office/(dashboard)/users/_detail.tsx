import Link from 'next/link';
import {
  InfoPanel,
  ReportsPanel,
  SubscriptionPanel,
  UserDetail,
  type DetailSubject
} from '../../_components/user-detail';
import {
  Empty,
  MiniTable,
  Person,
  Pill,
  Rows,
  Section,
  Tiles,
  Toggle,
  ago,
  bytes,
  coords,
  dateTime,
  day,
  num,
  words,
  type PersonCard
} from '../../_components/detail-panels';
import { PointMap, SOURCE_LABEL } from '../../_components/point-map';
import { officeBase, officeFetch } from '../../_lib/session';

/**
 * One account, in as much detail as the database holds.
 *
 * Both /users/agency and /users/community render this; they differ only in the
 * tab labels and which subject fields are meaningful. `id` selects the record —
 * without one we show the most recent account of that kind, so the page is
 * never blank when reached from the sidebar.
 *
 * **The tab is fetched, not filtered.** Each tab is a separate endpoint
 * (`/admin/users/:id/<tab>`), and only the one in the URL is requested. That is
 * why `tab` is a search parameter rather than component state: a client-side
 * tab could only show what the server had already sent, and the tabs that had
 * no data — Activity most visibly — drew an empty list forever.
 */

export type ApiUserDetail = {
  id: string;
  trustScore: number | null;
  trustPercentile: number | null;
  name: string;
  reference: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  gender: string | null;
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

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'account', label: 'Account record' },
  { id: 'reports', label: 'Reports' },
  { id: 'activity', label: 'Activity' },
  { id: 'content', label: 'Content' },
  { id: 'social', label: 'Social' },
  { id: 'safety', label: 'Safety' },
  { id: 'moderation', label: 'Trust & moderation' },
  { id: 'devices', label: 'Devices & sessions' },
  { id: 'preferences', label: 'Settings' },
  { id: 'support', label: 'Support' },
  { id: 'messages', label: 'Messages' },
  { id: 'location', label: 'Location' },
  { id: 'plan', label: 'Subscription' }
];

export async function renderUserDetail({
  id,
  kind,
  tab
}: {
  id?: string;
  kind: 'agency' | 'community';
  tab?: string;
}) {
  const resolvedId = id ?? (await firstIdOfKind(kind));

  if (!resolvedId) {
    return (
      <p className="p-16 text-center text-sm text-gray-500">
        No {kind === 'agency' ? 'official or agency' : 'community'} accounts yet.
      </p>
    );
  }

  const [user, base] = await Promise.all([
    officeFetch<ApiUserDetail>(`/admin/users/${resolvedId}`),
    officeBase()
  ]);

  if (!user) {
    return (
      <p className="p-16 text-center text-sm text-gray-500">
        That account could not be loaded.
      </p>
    );
  }

  const isAgency = user.accountType !== 'community';
  const active = TABS.some((t) => t.id === tab) ? tab! : 'overview';

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
    score: user.trustScore === null ? '—' : `${Math.round(user.trustScore * 100)}`,
    scoreBand: trustBand(user.trustScore),
    scoreNote:
      user.trustPercentile === null
        ? 'Not enough accounts to rank against'
        : `Top ${user.trustPercentile}% of SafeRoute users`,
    avatar: isAgency ? 'agency' : 'person',
    official: isAgency,
    gauge: user.trustScore !== null && user.trustScore >= 0.6 ? 'green' : 'amber',
    stats: [
      { value: format(user.stats.followers), label: 'Followers' },
      { value: format(user.stats.impressions), label: 'Impressions' },
      { value: format(user.stats.verifiedReports), label: 'Verified reports' },
      {
        value: user.stats.communityRank === null ? '—' : `#${format(user.stats.communityRank)}`,
        label: 'Community Rank'
      },
      { value: format(user.stats.liveBroadcasts), label: 'Live Broadcasts' },
      { value: format(user.stats.reportsSubmitted), label: 'Reports Submitted' }
    ],
    tabs: TABS.map((t) =>
      t.id === 'overview'
        ? { ...t, label: isAgency ? 'Agency information' : 'Overview' }
        : t
    )
  };

  return (
    <UserDetail
      subject={subject}
      activeTab={active}
      panel={await renderPanel(active, resolvedId, user, base, isAgency)}
    />
  );
}

/** Fetches and draws exactly the tab that was asked for. */
async function renderPanel(
  tab: string,
  id: string,
  user: ApiUserDetail,
  base: string,
  isAgency: boolean
) {
  switch (tab) {
    case 'reports':
      return (
        <ReportsPanel
          count={String(user.reports.length)}
          items={user.reports.map((report) => ({
            id: report.id,
            title: words(report.category),
            place: report.place,
            when: day(report.reportedAt),
            body: report.body,
            verifications: `${report.confirmations} verification${
              report.confirmations === 1 ? '' : 's'
            }`
          }))}
        />
      );
    case 'plan':
      return <SubscriptionPanel subscription={user.subscription} />;
    case 'account':
      return <AccountTab data={await get<AccountData>(id, 'account')} />;
    case 'activity':
      return <ActivityTab data={await get<ActivityData>(id, 'activity')} base={base} />;
    case 'content':
      return <ContentTab data={await get<ContentData>(id, 'content')} />;
    case 'social':
      return <SocialTab data={await get<SocialData>(id, 'social')} base={base} />;
    case 'safety':
      return <SafetyTab data={await get<SafetyData>(id, 'safety')} base={base} />;
    case 'moderation':
      return <ModerationTab data={await get<ModerationData>(id, 'moderation')} base={base} />;
    case 'devices':
      return <DevicesTab data={await get<DevicesData>(id, 'devices')} />;
    case 'preferences':
      return <PreferencesTab data={await get<PreferencesData>(id, 'preferences')} />;
    case 'support':
      return <SupportTab data={await get<SupportData>(id, 'support')} base={base} />;
    case 'messages':
      return <MessagesTab data={await get<MessagesData>(id, 'messages')} base={base} />;
    case 'location':
      return <LocationTab data={await get<LocationData>(id, 'locations')} user={user} />;
    default:
      return (
        <InfoPanel
          title={isAgency ? 'Agency Information' : 'Personal information'}
          rows={
            isAgency
              ? [
                  { label: 'Agency Name', value: user.organizationName ?? user.name },
                  { label: 'Agency Type', value: user.organizationUnit ?? '—' },
                  { label: 'Phone', value: user.phoneNumber ?? '—', reveal: !!user.phoneNumber },
                  { label: 'Email', value: user.email ?? '—', reveal: !!user.email },
                  { label: 'Jurisdiction', value: user.organizationState ?? '—' },
                  { label: 'Headquarters', value: user.city ?? '—' },
                  { label: 'Registration Date', value: day(user.createdAt) },
                  { label: 'Account Status', value: words(user.status) },
                  { label: 'Verification Status', value: words(user.verificationStatus) }
                ]
              : [
                  { label: 'Full name', value: user.name },
                  { label: 'Username', value: user.username ? `@${user.username}` : '—' },
                  { label: 'Gender', value: words(user.gender) },
                  { label: 'Phone', value: user.phoneNumber ?? '—', reveal: !!user.phoneNumber },
                  { label: 'Email', value: user.email ?? '—', reveal: !!user.email },
                  { label: 'Date joined', value: dateTime(user.createdAt) },
                  { label: 'Last active', value: dateTime(user.lastActiveAt) },
                  { label: 'City', value: user.city ?? '—' },
                  { label: 'KYC', value: words(user.kycStatus) }
                ]
          }
        />
      );
  }
}

function get<T>(id: string, path: string) {
  return officeFetch<T>(`/admin/users/${id}/${path}`);
}

/** Every tab draws this when its endpoint could not be reached. */
function Unreachable() {
  return (
    <Empty>
      That panel could not be loaded — the API did not answer. Everything else
      on this page is still current.
    </Empty>
  );
}

/* ------------------------------------------------------------ account tab */

type AccountData = {
  identity: Record<string, string | null>;
  contact: { phoneNumber: string | null; email: string | null; emailVerifiedAt: string | null };
  account: Record<string, string | number | boolean | null>;
  organisation: { name: string | null; state: string | null; unit: string | null } | null;
  kyc: {
    status: string;
    documentType: string | null;
    country: string | null;
    submittedAt: string | null;
    documentUrl: string | null;
  };
  onboarding: {
    ageRange: string | null;
    gender: string | null;
    referralSource: string | null;
    safetyGoals: unknown;
    completedAt: string | null;
  };
  deletionRequest: {
    purgeAfter: string;
    cancelledAt: string | null;
    purgedAt: string | null;
    createdAt: string;
  } | null;
  counts: Record<string, number>;
};

const COUNT_LABELS: Record<string, string> = {
  devices: 'Devices',
  authIdentities: 'Social logins',
  refreshTokens: 'Sessions ever',
  emergencyContacts: 'Safety circle',
  createdIncidents: 'Reports',
  incidentReports: 'Report submissions',
  confirmations: 'Confirmations given',
  incidentFollows: 'Reports followed',
  authoredUpdates: 'Report updates',
  feedPosts: 'Posts',
  feedComments: 'Comments',
  feedLikes: 'Likes given',
  feedDislikes: 'Dislikes given',
  feedBookmarks: 'Bookmarks',
  feedReposts: 'Reposts',
  feedViews: 'Posts viewed',
  followers: 'Followers',
  following: 'Following',
  blockedUsers: 'Accounts blocked',
  blockedByUsers: 'Blocked by',
  userReports: 'Reported by others',
  userReportsFiled: 'Reports filed',
  feedPostReports: 'Posts reported',
  mediaAssets: 'Files uploaded',
  placeReviews: 'Place reviews',
  placeReviewVotes: 'Review votes',
  placeSearches: 'Place searches',
  watchedPlaces: 'Saved places',
  safetyAlerts: 'Area alerts raised',
  alertResponses: 'Alerts answered',
  sosActivations: 'SOS activations',
  liveBroadcasts: 'Live broadcasts',
  liveViews: 'Broadcasts watched',
  liveComments: 'Live comments',
  liveLocations: 'Live location shares',
  notificationLogs: 'Notifications received',
  notificationPrefs: 'Category alerts set',
  notificationChannels: 'Channels set',
  problemReports: 'Support tickets',
  dataExports: 'Data exports',
  directMessages: 'Messages sent',
  profileVisitsTo: 'Profile views received',
  profileVisits: 'Profiles viewed',
  otpCodes: 'One-time codes',
  assistantUsage: 'Assistant months'
};

function AccountTab({ data }: { data: AccountData | null }) {
  if (!data) return <Unreachable />;

  const counts = Object.entries(data.counts)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-10">
      {data.deletionRequest && !data.deletionRequest.cancelledAt ? (
        <div className="edge-left-error rounded-[10px] bg-error-50 px-5 py-4">
          <p className="text-sm font-semibold leading-5 text-error-700">
            Deletion requested {day(data.deletionRequest.createdAt)}
          </p>
          <p className="text-sm font-normal leading-5 text-error-700">
            {data.deletionRequest.purgedAt
              ? `Purged ${day(data.deletionRequest.purgedAt)}.`
              : `Everything on this account is scheduled to be erased on ${day(
                  data.deletionRequest.purgeAfter
                )}.`}
          </p>
        </div>
      ) : null}

      <Section title="Identity">
        <Rows
          rows={[
            { label: 'Display name', value: data.identity.displayName ?? '—' },
            { label: 'First name', value: data.identity.firstName ?? '—' },
            { label: 'Last name', value: data.identity.lastName ?? '—' },
            {
              label: 'Username',
              value: data.identity.username ? `@${data.identity.username}` : '—'
            },
            { label: 'Username last changed', value: dateTime(data.identity.usernameChangedAt) },
            { label: 'Date of birth', value: day(data.identity.dateOfBirth) },
            { label: 'Gender', value: words(data.identity.gender) },
            { label: 'Home city', value: data.identity.homeCity ?? '—' },
            { label: 'Phone', value: data.contact.phoneNumber ?? '—' },
            { label: 'Email', value: data.contact.email ?? '—' },
            {
              label: 'Email confirmed',
              value: data.contact.emailVerifiedAt
                ? dateTime(data.contact.emailVerifiedAt)
                : 'Not confirmed'
            }
          ]}
        />
      </Section>

      <Section
        title="Standing"
        note="Ten strikes closes an account automatically. The trust score is a 0–1 confidence recomputed from reporting history."
      >
        <Rows
          rows={[
            { label: 'Account type', value: words(String(data.account.accountType)) },
            { label: 'Role', value: words(String(data.account.role)) },
            { label: 'Status', value: <Pill>{String(data.account.status)}</Pill> },
            {
              label: 'Verification',
              value: <Pill>{String(data.account.verificationStatus)}</Pill>
            },
            { label: 'Trust score', value: String(data.account.trustScore ?? '—') },
            {
              label: 'Percentile',
              value:
                data.account.trustPercentile === null
                  ? 'Not enough accounts to rank against'
                  : `Top ${data.account.trustPercentile}%`
            },
            { label: 'Strikes', value: String(data.account.strikes ?? 0) },
            { label: 'Banned', value: dateTime(data.account.bannedAt as string | null) },
            {
              label: 'Seeded demo account',
              value: data.account.seededBot ? (
                <Pill>flagged</Pill>
              ) : (
                'No — a real person'
              )
            },
            {
              label: 'Password set',
              value: data.account.hasPassword
                ? `Yes, last changed ${dateTime(data.account.passwordUpdatedAt as string | null)}`
                : 'No — social sign-in or phone only'
            },
            { label: 'Joined', value: dateTime(data.account.createdAt as string) },
            { label: 'Last active', value: dateTime(data.account.lastActiveAt as string | null) },
            { label: 'Record updated', value: dateTime(data.account.updatedAt as string) }
          ]}
        />
      </Section>

      {data.organisation ? (
        <Section title="Organisation">
          <Rows
            rows={[
              { label: 'Name', value: data.organisation.name ?? '—' },
              { label: 'Jurisdiction', value: data.organisation.state ?? '—' },
              { label: 'Unit', value: data.organisation.unit ?? '—' }
            ]}
          />
        </Section>
      ) : null}

      <Section title="Identity document">
        <Rows
          rows={[
            { label: 'KYC status', value: <Pill>{data.kyc.status}</Pill> },
            { label: 'Document type', value: words(data.kyc.documentType) },
            { label: 'Issuing country', value: data.kyc.country ?? '—' },
            { label: 'Submitted', value: dateTime(data.kyc.submittedAt) },
            {
              label: 'Document',
              value: data.kyc.documentUrl ? (
                <a
                  href={data.kyc.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold leading-5 text-secondary underline"
                >
                  Open the uploaded document
                </a>
              ) : (
                'No document on file'
              )
            }
          ]}
        />
      </Section>

      <Section
        title="Onboarding answers"
        note="What they told us when they signed up. Collected at onboarding and never shown anywhere until now."
      >
        <Rows
          rows={[
            { label: 'Age range', value: data.onboarding.ageRange ?? '—' },
            { label: 'Gender', value: words(data.onboarding.gender) },
            { label: 'Heard about us via', value: words(data.onboarding.referralSource) },
            {
              label: 'Safety goals',
              value: Array.isArray(data.onboarding.safetyGoals)
                ? (data.onboarding.safetyGoals as string[]).map(words).join(', ') || '—'
                : '—'
            },
            { label: 'Finished onboarding', value: dateTime(data.onboarding.completedAt) }
          ]}
        />
      </Section>

      <Section
        title="Everything on record"
        note="One count per table this account has a row in. A zero is not shown."
      >
        {counts.length === 0 ? (
          <Empty>This account has produced nothing yet.</Empty>
        ) : (
          <Tiles
            tiles={counts.map(([key, value]) => ({
              label: COUNT_LABELS[key] ?? words(key),
              value: num(value)
            }))}
          />
        )}
      </Section>
    </div>
  );
}

/* ----------------------------------------------------------- activity tab */

type ActivityData = {
  entries: {
    kind: string;
    at: string;
    title: string;
    body: string | null;
    link: { route: string; id: string } | null;
  }[];
  nextCursor: string | null;
};

const KIND_TONE: Record<string, string> = {
  sos: 'bg-error-50 text-error-700',
  moderation: 'bg-warning-50 text-warning-700',
  incident: 'bg-[#FEF0C7] text-[#B54708]',
  session: 'bg-rule text-gray-600',
  notification: 'bg-rule text-gray-600'
};

function ActivityTab({ data, base }: { data: ActivityData | null; base: string }) {
  if (!data) return <Unreachable />;

  if (data.entries.length === 0) {
    return (
      <Section title="Activity">
        <Empty>This account has not done anything yet.</Empty>
      </Section>
    );
  }

  /** Grouped by day, which is how the design's activity list reads. */
  const groups = new Map<string, ActivityData['entries']>();
  for (const entry of data.entries) {
    const key = day(entry.at);
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }

  return (
    <Section
      title="Activity"
      count={data.entries.length}
      note="Merged from reports, posts, comments, SOS activations, broadcasts, reviews, follows, tickets, notifications, sign-ins and moderation — newest first."
    >
      <div className="flex max-w-[820px] flex-col gap-6">
        {[...groups].map(([date, entries]) => (
          <div key={date} className="flex flex-col gap-3">
            <span className="text-sm font-medium leading-[17px] text-gray-600">{date}</span>
            {entries.map((entry, i) => (
              <div
                key={`${date}-${i}`}
                className="edge flex flex-col gap-2 rounded-[10px] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-2xl px-[9px] py-1 text-[11px] font-semibold capitalize leading-4 ${
                        KIND_TONE[entry.kind] ?? 'bg-rule text-gray-600'
                      }`}
                    >
                      {entry.kind}
                    </span>
                    <span className="text-[15px] font-medium leading-5 text-gray-900">
                      {entry.title}
                    </span>
                  </span>
                  {entry.body ? (
                    <span className="text-[13px] font-normal leading-[18px] text-gray-500">
                      {entry.body}
                    </span>
                  ) : null}
                </div>
                <span className="flex shrink-0 items-center gap-4">
                  <span className="text-xs font-normal leading-4 text-gray-500">
                    {new Date(entry.at).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {entry.link ? (
                    <Link
                      href={`${base}/${entry.link.route}?id=${entry.link.id}`}
                      className="text-[13px] font-semibold leading-[18px] text-secondary"
                    >
                      Open
                    </Link>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ content tab */

type ContentData = {
  posts: {
    id: string;
    caption: string;
    city: string | null;
    status: string;
    riskScore: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    repostCount: number;
    createdAt: string;
    editedAt: string | null;
    deletedAt: string | null;
    _count: { reports: number; media: number };
  }[];
  comments: { id: string; postId: string; body: string; status: string; createdAt: string }[];
  reviews: {
    id: string;
    placeLabel: string;
    rating: number;
    body: string;
    tags: string[];
    createdAt: string;
    _count: { votes: number; media: number };
  }[];
  broadcasts: {
    id: string;
    title: string;
    categoryLabel: string | null;
    city: string | null;
    addressText: string | null;
    status: string;
    verificationStatus: string;
    startedAt: string;
    endedAt: string | null;
    deletedAt: string | null;
    recordingMediaId: string | null;
    _count: { viewers: number; comments: number; reactions: number };
  }[];
  media: {
    id: string;
    mediaType: string;
    mimeType: string;
    sizeBytes: number;
    purpose: string;
    scanStatus: string;
    moderationStatus: string;
    capturedInApp: boolean;
    createdAt: string;
  }[];
  reposts: { at: string; postId: string; caption: string | null; author: { displayName: string | null; username: string | null } }[];
};

function ContentTab({ data }: { data: ContentData | null }) {
  if (!data) return <Unreachable />;

  return (
    <div className="flex flex-col gap-10">
      <Section title="Posts" count={data.posts.length}>
        <MiniTable
          head={['Caption', 'Status', 'Reach', 'Reports', 'Posted']}
          empty="This account has not posted."
          rows={data.posts.map((post) => [
            <span key="c" className="block max-w-[320px] text-gray-900">
              {post.caption}
              {post.editedAt ? (
                <span className="ml-2 text-xs text-gray-400">edited</span>
              ) : null}
            </span>,
            <Pill key="s">{post.deletedAt ? 'deleted' : post.status}</Pill>,
            <span key="r">
              {num(post.viewCount)} views · {num(post.likeCount)} likes ·{' '}
              {num(post.commentCount)} comments
            </span>,
            <span key="rp">{post._count.reports > 0 ? <Pill>{`${post._count.reports} reported`}</Pill> : '—'}</span>,
            <span key="d">{dateTime(post.createdAt)}</span>
          ])}
        />
      </Section>

      <Section title="Comments" count={data.comments.length}>
        <MiniTable
          head={['Comment', 'Status', 'Written']}
          empty="No comments."
          rows={data.comments.map((comment) => [
            <span key="b" className="block max-w-[420px]">{comment.body}</span>,
            <Pill key="s">{comment.status}</Pill>,
            <span key="d">{dateTime(comment.createdAt)}</span>
          ])}
        />
      </Section>

      <Section title="Live broadcasts" count={data.broadcasts.length}>
        <MiniTable
          head={['Title', 'Where', 'Status', 'Audience', 'Started']}
          empty="This account has never gone live."
          rows={data.broadcasts.map((live) => [
            <span key="t" className="text-gray-900">{live.title}</span>,
            <span key="w">{live.addressText ?? live.city ?? '—'}</span>,
            <span key="s" className="flex flex-wrap gap-2">
              <Pill>{live.deletedAt ? 'deleted' : live.status}</Pill>
              <Pill>{live.verificationStatus}</Pill>
            </span>,
            <span key="a">
              {num(live._count.viewers)} watched · {num(live._count.comments)} comments
            </span>,
            <span key="d">{dateTime(live.startedAt)}</span>
          ])}
        />
      </Section>

      <Section title="Place reviews" count={data.reviews.length}>
        <MiniTable
          head={['Place', 'Rating', 'Review', 'Written']}
          empty="No reviews."
          rows={data.reviews.map((review) => [
            <span key="p" className="text-gray-900">{review.placeLabel}</span>,
            <span key="r">{review.rating}/5</span>,
            <span key="b" className="block max-w-[360px]">{review.body}</span>,
            <span key="d">{dateTime(review.createdAt)}</span>
          ])}
        />
      </Section>

      <Section
        title="Files uploaded"
        count={data.media.length}
        note="Described rather than shown: signing fifty URLs to draw thumbnails nobody asked for would be fifty round trips to storage on every visit."
      >
        <MiniTable
          head={['Type', 'Size', 'Purpose', 'Scan', 'Moderation', 'Uploaded']}
          empty="No files."
          rows={data.media.map((file) => [
            <span key="t">{file.mediaType} · {file.mimeType}</span>,
            <span key="s">{bytes(file.sizeBytes)}</span>,
            <span key="p">{words(file.purpose)}{file.capturedInApp ? ' · in-app camera' : ''}</span>,
            <Pill key="sc">{file.scanStatus}</Pill>,
            <Pill key="m">{file.moderationStatus}</Pill>,
            <span key="d">{dateTime(file.createdAt)}</span>
          ])}
        />
      </Section>

      <Section title="Reposts" count={data.reposts.length}>
        <MiniTable
          head={['Post', 'Original author', 'When']}
          empty="No reposts."
          rows={data.reposts.map((repost) => [
            <span key="c" className="block max-w-[380px]">{repost.caption ?? '—'}</span>,
            <span key="a">
              {repost.author.displayName ??
                (repost.author.username ? `@${repost.author.username}` : '—')}
            </span>,
            <span key="d">{dateTime(repost.at)}</span>
          ])}
        />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------- social tab */

type SocialData = {
  counts: Record<string, number> | null;
  following: { at: string; user: PersonCard }[];
  followers: { at: string; user: PersonCard }[];
  blocked: { at: string; reason: string | null; user: PersonCard }[];
  blockedBy: { at: string; reason: string | null; user: PersonCard }[];
  visitors: { at: string; user: PersonCard }[];
  visited: { at: string; user: PersonCard }[];
};

function SocialTab({ data, base }: { data: SocialData | null; base: string }) {
  if (!data) return <Unreachable />;

  const people = (
    rows: { at: string; user: PersonCard; reason?: string | null }[],
    empty: string,
    withReason = false
  ) => (
    <MiniTable
      head={withReason ? ['Account', 'Reason', 'Since'] : ['Account', 'Trust', 'Since']}
      empty={empty}
      rows={rows.map((row) => [
        <Person key="p" person={row.user} base={base} />,
        withReason ? (
          <span key="r">{row.reason ?? '—'}</span>
        ) : (
          <span key="t">
            {row.user.trustScore === null ? '—' : Math.round(row.user.trustScore * 100)}
          </span>
        ),
        <span key="d">{dateTime(row.at)}</span>
      ])}
    />
  );

  return (
    <div className="flex flex-col gap-10">
      {data.counts ? (
        <Tiles
          tiles={[
            { label: 'Followers', value: num(data.counts.followers) },
            { label: 'Following', value: num(data.counts.following) },
            { label: 'Accounts blocked', value: num(data.counts.blockedUsers) },
            { label: 'Blocked by', value: num(data.counts.blockedByUsers) },
            { label: 'Profile views received', value: num(data.counts.profileVisitsTo) },
            { label: 'Profiles viewed', value: num(data.counts.profileVisits) }
          ]}
        />
      ) : null}

      <Section title="Followers" count={data.followers.length}>
        {people(data.followers, 'Nobody follows this account.')}
      </Section>

      <Section title="Following" count={data.following.length}>
        {people(data.following, 'This account follows nobody.')}
      </Section>

      <Section
        title="Blocked"
        count={data.blocked.length}
        note="Who this account has blocked, and who has blocked it. The second list is the one that matters when somebody is being complained about."
      >
        {people(data.blocked, 'Nobody blocked.', true)}
      </Section>

      <Section title="Blocked by" count={data.blockedBy.length}>
        {people(data.blockedBy, 'Nobody has blocked this account.', true)}
      </Section>

      <Section title="Recent profile visitors" count={data.visitors.length}>
        {people(data.visitors, 'No profile visits recorded.')}
      </Section>

      <Section title="Profiles they visited" count={data.visited.length}>
        {people(data.visited, 'No profile visits recorded.')}
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------- safety tab */

type SafetyData = {
  sosActivations: {
    id: string;
    latitude: number;
    longitude: number;
    addressText: string | null;
    city: string | null;
    scope: string;
    status: string;
    categoryLabel: string | null;
    contactsNotified: number;
    cancelledAt: string | null;
    createdAt: string;
  }[];
  safetyAlerts: {
    id: string;
    city: string | null;
    message: string;
    status: string;
    radiusKm: number;
    recipientCount: number;
    sentCount: number;
    createdAt: string;
    _count: { responders: number };
  }[];
  alertResponses: { at: string; id: string; city: string | null; message: string; status: string }[];
  emergencyContacts: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string | null;
    relationship: string | null;
    status: string;
    verifiedAt: string | null;
  }[];
  safetyCircleMemberships: {
    id: string;
    status: string;
    relationship: string | null;
    since: string;
    owner: PersonCard;
  }[];
  watchedPlaces: {
    id: string;
    label: string;
    category: string;
    latitude: number;
    longitude: number;
    addressText: string | null;
    radiusKm: number;
  }[];
  liveLocationShares: {
    id: string;
    latitude: number;
    longitude: number;
    accuracyM: number | null;
    pingedAt: string;
    endedAt: string | null;
    createdAt: string;
  }[];
  placeSearches: { id: string; label: string; addressText: string | null; searchedAt: string }[];
  incidentFollows: { at: string; id: string; publicId: string; title: string; status: string; city: string }[];
};

function SafetyTab({ data, base }: { data: SafetyData | null; base: string }) {
  if (!data) return <Unreachable />;

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="SOS activations"
        count={data.sosActivations.length}
        note="Every press-and-hold of the SOS control, with where it was raised and how many of their safety circle it reached."
      >
        <MiniTable
          head={['Raised', 'What', 'Where', 'Reach', 'Status']}
          empty="This account has never raised an SOS."
          rows={data.sosActivations.map((sos) => [
            <span key="d">{dateTime(sos.createdAt)}</span>,
            <span key="w">{sos.categoryLabel ?? words(sos.scope)}</span>,
            <span key="p">
              {sos.addressText ?? sos.city ?? coords(sos.latitude, sos.longitude)}
            </span>,
            <span key="r">{sos.contactsNotified} contacted</span>,
            <Pill key="s">{sos.cancelledAt ? 'cancelled' : sos.status}</Pill>
          ])}
        />
      </Section>

      <Section title="Area alerts raised" count={data.safetyAlerts.length}>
        <MiniTable
          head={['Raised', 'Message', 'Radius', 'Reached', 'Responders', 'Status']}
          empty="No area alerts."
          rows={data.safetyAlerts.map((alert) => [
            <span key="d">{dateTime(alert.createdAt)}</span>,
            <span key="m" className="block max-w-[300px]">{alert.message}</span>,
            <span key="r">{alert.radiusKm} km</span>,
            <span key="s">{num(alert.sentCount)} of {num(alert.recipientCount)}</span>,
            <span key="c">{num(alert._count.responders)}</span>,
            <Pill key="st">{alert.status}</Pill>
          ])}
        />
      </Section>

      <Section title="Alerts they answered" count={data.alertResponses.length}>
        <MiniTable
          head={['When', 'Alert', 'Where']}
          empty="They have not answered anyone else's alert."
          rows={data.alertResponses.map((row, i) => [
            <span key={`d${i}`}>{dateTime(row.at)}</span>,
            <span key={`m${i}`} className="block max-w-[380px]">{row.message}</span>,
            <span key={`c${i}`}>{row.city ?? '—'}</span>
          ])}
        />
      </Section>

      <Section
        title="Safety circle"
        count={data.emergencyContacts.length}
        note="Who this account calls in an emergency."
      >
        <MiniTable
          head={['Name', 'Phone', 'Relationship', 'Status']}
          empty="No emergency contacts added."
          rows={data.emergencyContacts.map((contact) => [
            <span key="n" className="text-gray-900">{contact.name}</span>,
            <span key="p">{contact.phoneNumber}</span>,
            <span key="r">{words(contact.relationship)}</span>,
            <Pill key="s">{contact.status}</Pill>
          ])}
        />
      </Section>

      <Section
        title="Whose circle they are in"
        count={data.safetyCircleMemberships.length}
        note="The other direction — the accounts whose emergency alerts reach this phone."
      >
        <MiniTable
          head={['Account', 'Relationship', 'Status', 'Since']}
          empty="Nobody has added this account as an emergency contact."
          rows={data.safetyCircleMemberships.map((row) => [
            <Person key="p" person={row.owner} base={base} />,
            <span key="r">{words(row.relationship)}</span>,
            <Pill key="s">{row.status}</Pill>,
            <span key="d">{day(row.since)}</span>
          ])}
        />
      </Section>

      <Section title="Saved places" count={data.watchedPlaces.length}>
        <MiniTable
          head={['Label', 'Kind', 'Where', 'Radius']}
          empty="No saved places."
          rows={data.watchedPlaces.map((place) => [
            <span key="l" className="text-gray-900">{place.label}</span>,
            <span key="c">{words(place.category)}</span>,
            <span key="w">{place.addressText ?? coords(place.latitude, place.longitude)}</span>,
            <span key="r">{place.radiusKm} km</span>
          ])}
        />
      </Section>

      <Section title="Live location shares" count={data.liveLocationShares.length}>
        <MiniTable
          head={['Started', 'Last ping', 'Position', 'Accuracy', 'State']}
          empty="No live location shares."
          rows={data.liveLocationShares.map((share) => [
            <span key="s">{dateTime(share.createdAt)}</span>,
            <span key="p">{ago(share.pingedAt)}</span>,
            <span key="c">{coords(share.latitude, share.longitude)}</span>,
            <span key="a">{share.accuracyM === null ? '—' : `±${Math.round(share.accuracyM)} m`}</span>,
            <Pill key="e">{share.endedAt ? 'ended' : 'active'}</Pill>
          ])}
        />
      </Section>

      <Section title="Reports followed" count={data.incidentFollows.length}>
        <MiniTable
          head={['Report', 'Where', 'Status', 'Followed']}
          empty="Not following any report."
          rows={data.incidentFollows.map((row, i) => [
            <Link
              key={`t${i}`}
              href={`${base}/incidents?id=${row.id}`}
              className="text-gray-900 underline"
            >
              {row.title}
            </Link>,
            <span key={`c${i}`}>{row.city}</span>,
            <Pill key={`s${i}`}>{row.status}</Pill>,
            <span key={`d${i}`}>{dateTime(row.at)}</span>
          ])}
        />
      </Section>

      <Section
        title="Place searches"
        count={data.placeSearches.length}
        note="What they looked up in the app's place search."
      >
        <MiniTable
          head={['Searched for', 'Address', 'When']}
          empty="No searches."
          rows={data.placeSearches.map((row) => [
            <span key="l" className="text-gray-900">{row.label}</span>,
            <span key="a">{row.addressText ?? '—'}</span>,
            <span key="d">{dateTime(row.searchedAt)}</span>
          ])}
        />
      </Section>
    </div>
  );
}

/* --------------------------------------------------------- moderation tab */

type ModerationData = {
  standing: {
    status: string;
    strikes: number;
    strikesToBan: number;
    bannedAt: string | null;
    trustScore: number;
    trustBreakdown: Record<string, number | null>;
  };
  reportsAgainst: {
    id: string;
    reason: string;
    details: string | null;
    hasEvidence: boolean;
    at: string;
    reporter: PersonCard;
  }[];
  reportsFiled: { id: string; reason: string; details: string | null; at: string; subject: PersonCard }[];
  postReports: {
    id: string;
    reason: string;
    details: string | null;
    at: string;
    post: { id: string; caption: string | null; status: string };
    reporter: PersonCard;
  }[];
  queue: {
    id: string;
    contentType: string;
    priority: string;
    reason: string;
    status: string;
    createdAt: string;
    resolvedAt: string | null;
    assignee: { fullName: string | null; email: string } | null;
    actions: { id: string; action: string; reason: string; createdAt: string; admin: { fullName: string | null; email: string } | null }[];
  }[];
  auditTrail: {
    id: string;
    action: string;
    beforeJson: unknown;
    afterJson: unknown;
    createdAt: string;
    admin: { fullName: string | null; email: string } | null;
  }[];
  adminMessages: {
    id: string;
    type: string;
    title: string;
    body: string;
    deliveryStatus: string;
    openedAt: string | null;
    createdAt: string;
  }[];
  declinedReports: { id: string; title: string; status: string; city: string; reportedAt: string }[];
};

function ModerationTab({ data, base }: { data: ModerationData | null; base: string }) {
  if (!data) return <Unreachable />;

  const { standing } = data;

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="Standing"
        note={`${standing.strikesToBan} more strike${
          standing.strikesToBan === 1 ? '' : 's'
        } would close this account automatically.`}
      >
        <Tiles
          tiles={[
            { label: 'Strikes', value: standing.strikes },
            { label: 'Trust score', value: Math.round(standing.trustScore * 100) },
            { label: 'Status', value: words(standing.status) },
            { label: 'Reported by others', value: data.reportsAgainst.length },
            { label: 'Posts reported', value: data.postReports.length },
            { label: 'Declined reports', value: data.declinedReports.length }
          ]}
        />
        <Rows
          rows={Object.entries(standing.trustBreakdown).map(([key, value]) => ({
            label: words(key),
            value: value === null ? 'No data yet' : String(value)
          }))}
        />
      </Section>

      <Section
        title="Reported by others"
        count={data.reportsAgainst.length}
        note="Complaints other people have made about this account."
      >
        <MiniTable
          head={['Reporter', 'Reason', 'Detail', 'Evidence', 'When']}
          empty="Nobody has reported this account."
          rows={data.reportsAgainst.map((report) => [
            <Person key="p" person={report.reporter} base={base} />,
            <Pill key="r">{report.reason}</Pill>,
            <span key="d" className="block max-w-[300px]">{report.details ?? '—'}</span>,
            <span key="e">{report.hasEvidence ? 'Screenshot attached' : '—'}</span>,
            <span key="w">{dateTime(report.at)}</span>
          ])}
        />
      </Section>

      <Section title="Posts of theirs that were reported" count={data.postReports.length}>
        <MiniTable
          head={['Post', 'Reason', 'Reporter', 'When']}
          empty="No posts reported."
          rows={data.postReports.map((report) => [
            <span key="c" className="block max-w-[300px]">{report.post.caption ?? '—'}</span>,
            <Pill key="r">{report.reason}</Pill>,
            <Person key="p" person={report.reporter} base={base} />,
            <span key="w">{dateTime(report.at)}</span>
          ])}
        />
      </Section>

      <Section
        title="Reports they filed"
        count={data.reportsFiled.length}
        note="Somebody who reports constantly and is never upheld is its own signal."
      >
        <MiniTable
          head={['About', 'Reason', 'Detail', 'When']}
          empty="They have reported nobody."
          rows={data.reportsFiled.map((report) => [
            <Person key="p" person={report.subject} base={base} />,
            <Pill key="r">{report.reason}</Pill>,
            <span key="d" className="block max-w-[300px]">{report.details ?? '—'}</span>,
            <span key="w">{dateTime(report.at)}</span>
          ])}
        />
      </Section>

      <Section title="Moderation queue" count={data.queue.length}>
        <MiniTable
          head={['Content', 'Reason', 'Priority', 'Status', 'Assigned', 'Raised']}
          empty="Nothing from this account has been queued for moderation."
          rows={data.queue.map((item) => [
            <span key="c">{words(item.contentType)}</span>,
            <span key="r" className="block max-w-[260px]">{item.reason}</span>,
            <Pill key="p">{item.priority}</Pill>,
            <Pill key="s">{item.status}</Pill>,
            <span key="a">{item.assignee?.fullName ?? item.assignee?.email ?? 'Unassigned'}</span>,
            <span key="d">{dateTime(item.createdAt)}</span>
          ])}
        />
      </Section>

      <Section title="Declined reports" count={data.declinedReports.length}>
        <MiniTable
          head={['Report', 'Where', 'Outcome', 'Filed']}
          empty="None of their reports has been declined."
          rows={data.declinedReports.map((report) => [
            <Link
              key="t"
              href={`${base}/incidents?id=${report.id}`}
              className="text-gray-900 underline"
            >
              {report.title}
            </Link>,
            <span key="c">{report.city}</span>,
            <Pill key="s">{report.status}</Pill>,
            <span key="d">{dateTime(report.reportedAt)}</span>
          ])}
        />
      </Section>

      <Section
        title="Warnings and messages sent"
        count={data.adminMessages.length}
        note="What the dashboard has said to this account, and whether they opened it."
      >
        <MiniTable
          head={['Kind', 'Subject', 'Message', 'Delivery', 'Sent']}
          empty="Nothing has been sent to this account."
          rows={data.adminMessages.map((message) => [
            <Pill key="k">{message.type === 'admin_warning' ? 'warning' : 'message'}</Pill>,
            <span key="s" className="text-gray-900">{message.title}</span>,
            <span key="b" className="block max-w-[280px]">{message.body}</span>,
            <span key="d">
              {message.openedAt ? `Opened ${ago(message.openedAt)}` : words(message.deliveryStatus)}
            </span>,
            <span key="w">{dateTime(message.createdAt)}</span>
          ])}
        />
      </Section>

      <Section
        title="Admin actions on this account"
        count={data.auditTrail.length}
        note="Every change the dashboard has made here, with what it changed from and to."
      >
        <MiniTable
          head={['Action', 'By', 'Before', 'After', 'When']}
          empty="No admin has touched this account."
          rows={data.auditTrail.map((entry) => [
            <span key="a" className="text-gray-900">{words(entry.action.replace(/^admin\./, ''))}</span>,
            <span key="b">{entry.admin?.fullName ?? entry.admin?.email ?? '—'}</span>,
            <code key="bj" className="block max-w-[220px] break-all text-xs text-gray-500">
              {entry.beforeJson ? JSON.stringify(entry.beforeJson) : '—'}
            </code>,
            <code key="aj" className="block max-w-[220px] break-all text-xs text-gray-500">
              {entry.afterJson ? JSON.stringify(entry.afterJson) : '—'}
            </code>,
            <span key="w">{dateTime(entry.createdAt)}</span>
          ])}
        />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------ devices tab */

type DevicesData = {
  devices: {
    id: string;
    platform: string;
    deviceId: string;
    appVersion: string | null;
    pushRegistered: boolean;
    lastLatitude: number | null;
    lastLongitude: number | null;
    locationUpdatedAt: string | null;
    lastSeenAt: string;
    createdAt: string;
    sessions: number;
  }[];
  sessions: {
    id: string;
    createdAt: string;
    expiresAt: string;
    revokedAt: string | null;
    active: boolean;
    device: { platform: string; deviceId: string; appVersion: string | null } | null;
  }[];
  activeSessions: number;
  identities: {
    id: string;
    provider: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    createdAt: string;
  }[];
  otpCodes: {
    id: string;
    purpose: string;
    phoneNumber: string | null;
    email: string | null;
    attempts: number;
    consumedAt: string | null;
    expiresAt: string;
    createdAt: string;
  }[];
};

function DevicesTab({ data }: { data: DevicesData | null }) {
  if (!data) return <Unreachable />;

  return (
    <div className="flex flex-col gap-10">
      <Tiles
        tiles={[
          { label: 'Devices', value: data.devices.length },
          { label: 'Active sessions', value: data.activeSessions },
          { label: 'Sessions ever', value: data.sessions.length },
          { label: 'Social logins', value: data.identities.length }
        ]}
      />

      <Section
        title="Devices"
        count={data.devices.length}
        note="Whether push can reach a phone is shown; the push token itself is not — anyone holding one can send to that handset."
      >
        <MiniTable
          head={['Platform', 'App', 'Push', 'Last position', 'Last seen', 'Registered']}
          empty="No device has ever registered on this account."
          rows={data.devices.map((device) => [
            <span key="p" className="text-gray-900">{words(device.platform)}</span>,
            <span key="v">{device.appVersion ?? '—'}</span>,
            <Pill key="pu">{device.pushRegistered ? 'registered' : 'none'}</Pill>,
            <span key="l">
              {device.lastLatitude === null
                ? '—'
                : `${coords(device.lastLatitude, device.lastLongitude)} · ${ago(
                    device.locationUpdatedAt
                  )}`}
            </span>,
            <span key="s">{ago(device.lastSeenAt)}</span>,
            <span key="c">{day(device.createdAt)}</span>
          ])}
        />
      </Section>

      <Section
        title="Sessions"
        count={data.sessions.length}
        note="One row per sign-in. A revoked session stays on the record — that a token was issued and then killed is part of what happened to the account."
      >
        <MiniTable
          head={['Signed in', 'Device', 'Expires', 'State']}
          empty="No sessions."
          rows={data.sessions.map((session) => [
            <span key="c">{dateTime(session.createdAt)}</span>,
            <span key="d">
              {session.device
                ? `${words(session.device.platform)}${
                    session.device.appVersion ? ` ${session.device.appVersion}` : ''
                  }`
                : '—'}
            </span>,
            <span key="e">{dateTime(session.expiresAt)}</span>,
            <Pill key="s">
              {session.revokedAt ? 'revoked' : session.active ? 'active' : 'expired'}
            </Pill>
          ])}
        />
      </Section>

      <Section title="Sign-in methods" count={data.identities.length}>
        <MiniTable
          head={['Provider', 'Email', 'Confirmed', 'Linked']}
          empty="No social sign-in linked — this account signs in by phone or password."
          rows={data.identities.map((identity) => [
            <span key="p" className="text-gray-900">{words(identity.provider)}</span>,
            <span key="e">{identity.email ?? '—'}</span>,
            <Pill key="v">{identity.emailVerified ? 'verified' : 'unverified'}</Pill>,
            <span key="d">{day(identity.createdAt)}</span>
          ])}
        />
      </Section>

      <Section
        title="Recent one-time codes"
        count={data.otpCodes.length}
        note="The last twenty codes sent, with where they went and whether they were used. The codes themselves are stored hashed and are not readable here."
      >
        <MiniTable
          head={['Purpose', 'Sent to', 'Attempts', 'Used', 'Sent']}
          empty="No codes on record."
          rows={data.otpCodes.map((code) => [
            <span key="p" className="text-gray-900">{words(code.purpose)}</span>,
            <span key="t">{code.phoneNumber ?? code.email ?? '—'}</span>,
            <span key="a">{code.attempts}</span>,
            <Pill key="u">{code.consumedAt ? 'used' : 'unused'}</Pill>,
            <span key="c">{dateTime(code.createdAt)}</span>
          ])}
        />
      </Section>
    </div>
  );
}

/* -------------------------------------------------------- preferences tab */

type PreferencesData = {
  settings: Record<string, string | number | boolean | null> | null;
  categoryAlerts: { category: string; enabled: boolean; minSeverity: string }[];
  channels: { channel: string; enabled: boolean; updatedAt: string }[];
};

function PreferencesTab({ data }: { data: PreferencesData | null }) {
  if (!data) return <Unreachable />;

  const s = data.settings;

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="Privacy"
        note={
          s
            ? undefined
            : 'This account has never opened Settings, so it has no settings row. The app is applying its own defaults — this is not "everything off".'
        }
      >
        {s ? (
          <div className="grid max-w-[720px] grid-cols-1 gap-3 sm:grid-cols-2">
            <Toggle on={Boolean(s.showExactLocation)} label="Show exact location on reports" />
            <Toggle on={Boolean(s.allowAnonymousReporting)} label="Allow anonymous reporting" />
            <Toggle on={Boolean(s.shareLiveLocation)} label="Share live location" />
            <Toggle on={Boolean(s.keepLocationHistory)} label="Keep location history" />
            <Toggle on={Boolean(s.profileVisible)} label="Profile visible" />
            <Toggle on={Boolean(s.showOnlineStatus)} label="Show online status" />
            <Toggle on={Boolean(s.shareActivity)} label="Share activity" />
            <Toggle on={Boolean(s.shareLiveHistory)} label="Share live broadcast history" />
            <Toggle on={Boolean(s.pushEnabled)} label="Push notifications" />
            <Toggle on={Boolean(s.smsEnabled)} label="SMS notifications" />
          </div>
        ) : null}
        {s ? (
          <Rows
            rows={[
              { label: 'Language', value: String(s.language ?? '—') },
              { label: 'Alert radius', value: `${s.alertRadiusKm ?? '—'} km` },
              { label: 'Who can see their location', value: words(String(s.locationAudience ?? '')) },
              {
                label: 'Quiet hours',
                value:
                  s.quietHoursStart && s.quietHoursEnd
                    ? `${String(s.quietHoursStart).slice(11, 16)} – ${String(
                        s.quietHoursEnd
                      ).slice(11, 16)}`
                    : 'Not set'
              },
              { label: 'Settings last changed', value: dateTime(s.updatedAt as string | null) }
            ]}
          />
        ) : null}
      </Section>

      <Section
        title="Category alerts"
        count={data.categoryAlerts.length}
        note="Which kinds of incident this account wants to hear about, and how serious it has to be."
      >
        <MiniTable
          head={['Category', 'On', 'Minimum severity']}
          empty="No per-category preferences set; every category is on by default."
          rows={data.categoryAlerts.map((pref) => [
            <span key="c" className="text-gray-900">{words(pref.category)}</span>,
            <Pill key="e">{pref.enabled ? 'on' : 'off'}</Pill>,
            <span key="s">{words(pref.minSeverity)}</span>
          ])}
        />
      </Section>

      <Section title="Notification channels" count={data.channels.length}>
        <MiniTable
          head={['Channel', 'On', 'Changed']}
          empty="No channel preferences set; the app's defaults apply."
          rows={data.channels.map((channel) => [
            <span key="c" className="text-gray-900">{words(channel.channel)}</span>,
            <Pill key="e">{channel.enabled ? 'on' : 'off'}</Pill>,
            <span key="d">{dateTime(channel.updatedAt)}</span>
          ])}
        />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------ support tab */

type SupportData = {
  tickets: {
    id: string;
    reference: string;
    kind: string;
    subject: string | null;
    body: string;
    status: string;
    priority: string;
    appVersion: string | null;
    platform: string | null;
    createdAt: string;
    assignedAdmin: { fullName: string | null; email: string } | null;
    replies: { id: string; body: string; createdAt: string; admin: { fullName: string | null; email: string } | null; userId: string | null }[];
  }[];
  dataExports: { id: string; sizeBytes: number; expiresAt: string; createdAt: string }[];
  assistantUsage: { periodStart: string; used: number; updatedAt: string }[];
  deletion: { purgeAfter: string; cancelledAt: string | null; purgedAt: string | null; createdAt: string } | null;
};

function SupportTab({ data, base }: { data: SupportData | null; base: string }) {
  if (!data) return <Unreachable />;

  return (
    <div className="flex flex-col gap-10">
      <Section title="Support tickets" count={data.tickets.length}>
        {data.tickets.length === 0 ? (
          <Empty>This account has never contacted support.</Empty>
        ) : (
          <div className="flex max-w-[820px] flex-col gap-3">
            {data.tickets.map((ticket) => (
              <div key={ticket.id} className="edge flex flex-col gap-3 rounded-[10px] px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`${base}/support?id=${ticket.id}`}
                    className="text-[15px] font-semibold leading-5 text-gray-900 underline"
                  >
                    {ticket.reference}
                  </Link>
                  <Pill>{ticket.status}</Pill>
                  <Pill>{ticket.priority}</Pill>
                  <span className="text-xs font-medium leading-[18px] text-gray-600">
                    {words(ticket.kind)}
                  </span>
                  <span className="text-[11px] font-normal leading-4 text-gray-500">
                    {dateTime(ticket.createdAt)}
                  </span>
                </div>
                {ticket.subject ? (
                  <span className="text-sm font-medium leading-5 text-gray-900">
                    {ticket.subject}
                  </span>
                ) : null}
                <p className="text-[13px] font-normal leading-[18px] text-gray-500">
                  {ticket.body}
                </p>
                {ticket.appVersion || ticket.platform ? (
                  <span className="text-xs font-normal leading-4 text-gray-400">
                    Sent from {ticket.platform ?? 'unknown platform'}{' '}
                    {ticket.appVersion ? `· app ${ticket.appVersion}` : ''}
                  </span>
                ) : null}
                {ticket.replies.length > 0 ? (
                  <div className="flex flex-col gap-2 border-t border-[#EAECF0] pt-3">
                    {ticket.replies.map((reply) => (
                      <div key={reply.id} className="flex flex-col gap-1">
                        <span className="text-xs font-semibold leading-4 text-gray-600">
                          {reply.admin
                            ? `${reply.admin.fullName ?? reply.admin.email} · SafeRoute`
                            : 'The reporter'}
                          {' · '}
                          {dateTime(reply.createdAt)}
                        </span>
                        <span className="text-[13px] font-normal leading-[18px] text-gray-500">
                          {reply.body}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Data exports"
        count={data.dataExports.length}
        note="Copies of their own data this account has asked for. The download links expire; only the fact and the size are kept."
      >
        <MiniTable
          head={['Requested', 'Size', 'Link expires']}
          empty="No data export requested."
          rows={data.dataExports.map((row) => [
            <span key="c">{dateTime(row.createdAt)}</span>,
            <span key="s">{bytes(row.sizeBytes)}</span>,
            <span key="e">{dateTime(row.expiresAt)}</span>
          ])}
        />
      </Section>

      <Section
        title="Assistant use"
        count={data.assistantUsage.length}
        note="Questions asked of the in-app assistant, per calendar month."
      >
        <MiniTable
          head={['Month', 'Questions asked', 'Last used']}
          empty="They have not used the assistant."
          rows={data.assistantUsage.map((row) => [
            <span key="p" className="text-gray-900">
              {new Date(row.periodStart).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric'
              })}
            </span>,
            <span key="u">{num(row.used)}</span>,
            <span key="d">{dateTime(row.updatedAt)}</span>
          ])}
        />
      </Section>

      <Section title="Deletion request">
        {data.deletion ? (
          <Rows
            rows={[
              { label: 'Requested', value: dateTime(data.deletion.createdAt) },
              { label: 'Erases on', value: dateTime(data.deletion.purgeAfter) },
              { label: 'Cancelled', value: dateTime(data.deletion.cancelledAt) },
              { label: 'Purged', value: dateTime(data.deletion.purgedAt) }
            ]}
          />
        ) : (
          <Empty>No deletion has been requested.</Empty>
        )}
      </Section>
    </div>
  );
}

/* ----------------------------------------------------------- messages tab */

type MessagesData = {
  messagesSent: number;
  conversations: {
    id: string;
    startedAt: string;
    lastMessageAt: string | null;
    messages: number;
    with: PersonCard;
  }[];
  note: string;
};

function MessagesTab({ data, base }: { data: MessagesData | null; base: string }) {
  if (!data) return <Unreachable />;

  return (
    <Section
      title="Conversations"
      count={data.conversations.length}
      note="Who this account talks to, how much, and when — but not what was said. Message bodies are deliberately not exposed to the dashboard; the evidence route for a complaint is the screenshot the reporter attaches, which is on the Trust & moderation tab."
    >
      <Tiles
        tiles={[
          { label: 'Messages sent', value: num(data.messagesSent) },
          { label: 'Conversations', value: data.conversations.length }
        ]}
      />
      <MiniTable
        head={['With', 'Messages', 'Started', 'Last message']}
        empty="No conversations."
        rows={data.conversations.map((row) => [
          <Person key="p" person={row.with} base={base} />,
          <span key="m">{num(row.messages)}</span>,
          <span key="s">{day(row.startedAt)}</span>,
          <span key="l">{row.lastMessageAt ? ago(row.lastMessageAt) : '—'}</span>
        ])}
      />
    </Section>
  );
}

/* ----------------------------------------------------------- location tab */

type LocationData = {
  lastKnown: {
    source: string;
    label: string;
    latitude: number;
    longitude: number;
    at: string;
    place: string | null;
  } | null;
  points: {
    source: string;
    label: string;
    latitude: number;
    longitude: number;
    at: string;
    id: string | null;
    place: string | null;
  }[];
};

function LocationTab({
  data,
  user
}: {
  data: LocationData | null;
  user: ApiUserDetail;
}) {
  if (!data) return <Unreachable />;

  return (
    <div className="flex flex-col gap-10">
      <Section
        title="Last known location"
        note="The newest coordinate this account has produced, whatever produced it — a device fix, an SOS, a report, a live share."
      >
        {data.lastKnown ? (
          <Rows
            rows={[
              { label: 'Where', value: data.lastKnown.place ?? coords(data.lastKnown.latitude, data.lastKnown.longitude) },
              { label: 'Coordinates', value: coords(data.lastKnown.latitude, data.lastKnown.longitude) },
              { label: 'From', value: SOURCE_LABEL[data.lastKnown.source] ?? words(data.lastKnown.source) },
              { label: 'When', value: `${dateTime(data.lastKnown.at)} (${ago(data.lastKnown.at)})` },
              { label: 'Home city on file', value: user.city ?? '—' }
            ]}
          />
        ) : (
          <Empty>
            Nothing on this account carries a coordinate — no device fix, report,
            SOS, saved place or search.
          </Empty>
        )}
      </Section>

      {data.points.length > 0 ? (
        <Section title="Everywhere on record" count={data.points.length}>
          <PointMap
            points={data.points.map((point, i) => ({
              id: point.id ?? String(i),
              latitude: point.latitude,
              longitude: point.longitude,
              label: point.label,
              source: point.source
            }))}
          />
          <MiniTable
            head={['Source', 'What', 'Where', 'Coordinates', 'When']}
            empty="No positions."
            rows={data.points.map((point, i) => [
              <span key={`s${i}`} className="text-gray-900">
                {SOURCE_LABEL[point.source] ?? words(point.source)}
              </span>,
              <span key={`l${i}`} className="block max-w-[260px]">{point.label}</span>,
              <span key={`p${i}`}>{point.place ?? '—'}</span>,
              <span key={`c${i}`}>{coords(point.latitude, point.longitude)}</span>,
              <span key={`d${i}`}>{dateTime(point.at)}</span>
            ])}
          />
        </Section>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- utilities */

async function firstIdOfKind(kind: 'agency' | 'community') {
  const list = await officeFetch<{ rows: { id: string }[] }>(
    `/admin/users?tab=${kind === 'agency' ? 'officials' : 'regular'}&page=1`
  );
  return list?.rows[0]?.id;
}

function format(value: number | null): string {
  return value === null ? '—' : new Intl.NumberFormat('en-NG').format(value);
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
