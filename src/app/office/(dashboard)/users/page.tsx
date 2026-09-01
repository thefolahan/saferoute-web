import { officeBase, officeFetch } from '../../_lib/session';
import { UsersView, type Kyc, type UserRow } from './users-view';

export const dynamic = 'force-dynamic';

type ApiUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
  trustScore: number | null;
  reference: string;
  accountType: 'community' | 'official' | 'news_outlet';
  verificationStatus: string;
  kycStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  city: string | null;
  status: string;
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
  searchParams: Promise<{
    tab?: string;
    page?: string;
    q?: string;
    type?: string;
    status?: string;
    city?: string;
  }>;
}) {
  const params = await searchParams;
  const tab = params.tab === 'officials' ? 'officials' : 'regular';
  const page = Number.parseInt(params.page ?? '1', 10) || 1;
  const base = await officeBase();

  const query = new URLSearchParams({ tab, page: String(page) });
  for (const key of ['q', 'type', 'status', 'city'] as const) {
    const value = params[key];
    if (value) query.set(key, value);
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
      rows={rows.map((user): UserRow => ({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        code: user.reference,
        type: verificationLabel(user.verificationStatus),
        kyc: KYC_LABEL[user.kycStatus] ?? 'Not required',
        city: user.city ?? '—',
        active: relativeTime(user.lastActiveAt),
        credit: TYPE_LABEL[user.accountType],
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
