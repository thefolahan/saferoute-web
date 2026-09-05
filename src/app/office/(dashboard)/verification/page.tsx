import { officeFetch } from '../../_lib/session';
import { rangeToDates } from '../../_lib/ranges';
import {
  VerificationView,
  type Stat,
  type VerificationRow
} from './verification-view';

export const dynamic = 'force-dynamic';

type Stats = {
  pending: number;
  approved: number;
  rejected: number;
  notRequired: number;
  newToday: number;
  waiting: number;
};

type ApiRequest = {
  id: string;
  reference: string;
  name: string;
  isOrganisation: boolean;
  accountType: string;
  avatarUrl: string | null;
  city: string | null;
  documentType: string | null;
  documents: string[];
  status: 'pending' | 'rejected';
  submittedAt: string;
};

export default async function VerificationPage({
  searchParams
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;

  /** The preset becomes the from/to the endpoint takes. */
  const dates = rangeToDates(range);
  const query = new URLSearchParams({ tab: 'all' });
  if (dates.from) query.set('from', dates.from);
  if (dates.to) query.set('to', dates.to);

  const [stats, requests] = await Promise.all([
    officeFetch<Stats>('/admin/verification/stats'),
    officeFetch<{ rows: ApiRequest[] }>(
      `/admin/verification/requests?${query.toString()}`
    )
  ]);

  const rows = requests?.rows ?? [];

  const tiles: Stat[] = [
    {
      label: 'Pending Review',
      value: String(stats?.pending ?? 0),
      note: `${stats?.newToday ?? 0} new today`,
      color: 'text-navy'
    },
    {
      /*
        The design reads "+142 this month". Nothing records WHEN a decision was
        taken — `id_verification_status` has no companion timestamp — so the
        month cannot be counted, and the running total is what is true.
      */
      label: 'Verified',
      value: String(stats?.approved ?? 0),
      note: 'Approved to date',
      color: 'text-success-500'
    },
    {
      // The design's number has no definition. This is the one that earns the
      // name: still pending after a week.
      label: 'Needs Attention',
      value: String(stats?.waiting ?? 0),
      note: 'Requires action',
      color: 'text-[#FF8D28]'
    },
    {
      label: 'Rejected',
      value: String(stats?.rejected ?? 0),
      note: 'Declined to date',
      color: 'text-error-600'
    }
  ];

  return (
    <VerificationView
      stats={tiles}
      pageLabel={rows.length ? `Showing 1–${rows.length} of ${rows.length}` : 'No requests yet'}
      tabs={[
        { id: 'all', label: 'All Request', count: String(rows.length) },
        {
          id: 'community',
          label: 'Community members',
          count: String(rows.filter((r) => r.accountType === 'community').length)
        },
        {
          id: 'agencies',
          label: 'Agencies & organization',
          count: String(rows.filter((r) => r.accountType === 'official').length)
        },
        {
          id: 'news',
          label: 'News Outlet',
          count: String(rows.filter((r) => r.accountType === 'news_outlet').length)
        }
      ]}
      rows={rows.map((request): VerificationRow => {
        const status = request.status === 'pending' ? 'Pending' : 'Rejected';
        const submitted = new Date(request.submittedAt).toLocaleDateString('en', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return {
          id: request.id,
          status,
          submitted,
          group: groupFor(request.accountType),
          applicant: request.isOrganisation
            ? { kind: 'org', name: request.name, role: roleLabel(request.accountType) }
            : {
                kind: 'person',
                name: request.name,
                role: roleLabel(request.accountType),
                city: request.city ?? '—'
              },
          subject: {
            id: request.id,
            reference: request.reference,
            name: request.name,
            kind: roleLabel(request.accountType),
            status: status === 'Pending' ? 'Pending Review' : 'Rejected',
            submitted,
            city: request.city,
            documentType: request.documentType,
            avatarUrl: request.avatarUrl,
            documents: request.documents ?? []
          }
        };
      })}
    />
  );
}

/** Which tab a request sits under — the tab ids the view filters on. */
function groupFor(accountType: string): 'community' | 'agencies' | 'news' {
  if (accountType === 'official') return 'agencies';
  if (accountType === 'news_outlet') return 'news';
  return 'community';
}

function roleLabel(accountType: string): string {
  if (accountType === 'official') return 'Agency';
  if (accountType === 'news_outlet') return 'News Outlet';
  return 'Individual';
}
