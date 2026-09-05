import { officeBase, officeFetch } from '../../_lib/session';
import { UsersView, type Kyc, type UserRow } from './users-view';

export const dynamic = 'force-dynamic';

type ApiUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
  trustScore: number | null;
  organizationName: string | null;
  organizationState: string | null;
  organizationUnit: string | null;
  reference: string;
  accountType: 'community' | 'official' | 'news_outlet';
  verificationStatus: string;
  kycStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  city: string | null;
  status: string;
  strikes: number;
  seededBot: boolean;
  lastActiveAt: string | null;
};

type ApiPage = {
  page: number;
  pageSize: number;
  total: number;
  /** Every city with a user in it, for the City filter's options. */
  cities: string[];
  rows: ApiUser[];
};

const KYC_LABEL: Record<ApiUser['kycStatus'], Kyc | null> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  // Nobody has been asked for ID, so there is no KYC verdict to show.
  not_required: null
};

const TYPE_LABEL: Record<ApiUser['accountType'], string> = {
  community: 'Community',
  official: 'Official',
  news_outlet: 'News Outlet'
};

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const tab = params.tab === 'officials' ? 'officials' : 'regular';
  const page = Number.parseInt(params.page ?? '1', 10) || 1;
  const base = await officeBase();

  /**
   * Every filter the API takes, forwarded verbatim.
   *
   * Listed rather than spread so a stray parameter in the URL cannot become a
   * query the API was not asked to run — and so this list and the CSV proxy's
   * are visibly the same set.
   */
  const FILTERS = [
    'q',
    'type',
    'status',
    'city',
    'verification',
    'kyc',
    'seeded',
    'joinedFrom',
    'joinedTo',
    'sort',
    'direction'
  ] as const;

  const query = new URLSearchParams({ tab, page: String(page) });
  for (const key of FILTERS) {
    const value = params[key];
    if (value) query.set(key, value);
  }

  /** The same filter, minus the page — an export is of the set, not the page. */
  const exportQuery = new URLSearchParams({ tab });
  for (const key of FILTERS) {
    const value = params[key];
    if (value) exportQuery.set(key, value);
  }

  const data = await officeFetch<ApiPage>(`/admin/users?${query.toString()}`);
  const rows = data?.rows ?? [];

  return (
    <UsersView
      tab={tab}
      cities={data?.cities ?? []}
      page={data?.page ?? 1}
      pageCount={pageCount(data)}
      pageLabel={pageLabel(data)}
      exportHref={`/api/office/users/export?${exportQuery.toString()}`}
      rows={rows.map((user): UserRow => ({
        id: user.id,
        // The officials table is headed by the organisation, not the person.
        name:
          tab === 'officials' ? user.organizationName ?? user.name : user.name,
        avatarUrl: user.avatarUrl,
        code: user.reference,
        jurisdiction: user.organizationState ?? user.organizationUnit ?? '—',
        status: user.status,
        type: verificationLabel(user.verificationStatus),
        kyc: KYC_LABEL[user.kycStatus] ?? 'Not required',
        city: user.city ?? '—',
        active: relativeTime(user.lastActiveAt),
        credit: TYPE_LABEL[user.accountType],
        strikes: user.strikes ?? 0,
        seeded: user.seededBot ?? false,
        detailHref: `${base}/users/${user.accountType === 'community' ? 'community' : 'agency'}?id=${user.id}`
      }))}
    />
  );
}

function pageCount(data: ApiPage | null): number {
  if (!data || data.total === 0) return 1;
  return Math.max(1, Math.ceil(data.total / data.pageSize));
}

function pageLabel(data: ApiPage | null): string {
  if (!data || data.total === 0) return 'No users yet';
  const first = (data.page - 1) * data.pageSize + 1;
  const last = Math.min(data.page * data.pageSize, data.total);
  return `Showing ${first}–${last} of ${data.total}`;
}

function verificationLabel(status: string): string {
  if (status === 'id_verified') return 'ID Verified';
  if (status === 'phone_verified') return 'Phone Verified';
  if (status === 'trusted') return 'Trusted';
  return 'Unverified';
}

/** "12 min", "Jun 24" — matches how the design shows last activity. */
function relativeTime(iso: string | null): string {
  if (!iso) return '—';
  const then = new Date(iso);
  const minutes = Math.floor((Date.now() - then.getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} hr`;
  return then.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
