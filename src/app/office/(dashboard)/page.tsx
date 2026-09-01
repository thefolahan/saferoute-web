import type { ActionRowData } from '../_components/action-row';
import { officeBase, officeFetch } from '../_lib/session';
import { DashboardView, type GrowthBar, type Kpi } from './dashboard-view';

export const dynamic = 'force-dynamic';

type Overview = {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    onlineUsers: number;
    liveIncidents: number;
    sosRequests: number;
    crimeReports: number;
    trafficReports: number;
    roadClosureReports: number;
    emergencyAlerts: number;
    awaitingReview: number;
  };
};

type NeedsActionRow = {
  id: string;
  kind: 'incident' | 'user';
  publicId: string | null;
  category: string | null;
  status: string;
  reporter: string;
  title: string;
  city: string | null;
  reportCount: number | null;
  accountType?: string;
};

type GrowthPoint = { label: string; count: number };

const NUMBER = new Intl.NumberFormat('en-NG');

const RANGES = ['today', 'week', 'month', 'all'] as const;

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ range?: string; months?: string }>;
}) {
  const params = await searchParams;
  const base = await officeBase();

  // Both pickers on this screen map onto real query parameters, so they are
  // read here rather than being fixed at today/7.
  const range = RANGES.find((value) => value === params.range) ?? 'today';
  const months = ['3', '7', '12'].includes(params.months ?? '')
    ? params.months
    : '7';

  const [overview, needsAction, growth, me] = await Promise.all([
    officeFetch<Overview>(`/admin/overview?range=${range}`),
    officeFetch<{ rows: NeedsActionRow[] }>('/admin/needs-action?status=pending'),
    officeFetch<GrowthPoint[]>(`/admin/user-growth?months=${months}`),
    officeFetch<{ fullName: string | null; email: string }>('/admin/auth/me')
  ]);

  const m = overview?.metrics;
  const kpis: Kpi[] = [
    { label: 'Total users', value: NUMBER.format(m?.totalUsers ?? 0) },
    { label: 'Active users', value: NUMBER.format(m?.activeUsers ?? 0) },
    { label: 'Online users', value: NUMBER.format(m?.onlineUsers ?? 0) },
    { label: 'Live incident count', value: NUMBER.format(m?.liveIncidents ?? 0) },
    { label: 'SOS requests', value: NUMBER.format(m?.sosRequests ?? 0) },
    { label: 'Crime reports', value: NUMBER.format(m?.crimeReports ?? 0) },
    { label: 'Traffic reports', value: NUMBER.format(m?.trafficReports ?? 0) },
    {
      label: 'Road closure reports',
      value: NUMBER.format(m?.roadClosureReports ?? 0),
      // The design tints this sparkline red; keep that as "this one is rising".
      down: true
    },
    { label: 'Emergency alerts', value: NUMBER.format(m?.emergencyAlerts ?? 0) },
    { label: 'Reports awaiting review', value: NUMBER.format(m?.awaitingReview ?? 0) }
  ];

  return (
    <DashboardView
      adminName={me?.fullName ?? me?.email.split('@')[0] ?? 'there'}
      kpis={kpis}
      actions={(needsAction?.rows ?? [])
        .slice(0, 4)
        .map((row) => toActionRow(row, base))}
      growth={toGrowthBars(growth ?? [])}
    />
  );
}

/** Map an API row onto the Needs-Action row the design draws. */
/** "Investigate" opens the incident, or the account, that needs the decision. */
function toActionRow(row: NeedsActionRow, base: string): ActionRowData {
  const badges: ActionRowData['badges'] =
    row.kind === 'user'
      ? [{ text: 'Pending', tone: 'warning' }]
      : [
          { text: categoryLabel(row.category), tone: 'error' },
          { text: statusLabel(row.status), tone: 'gray' }
        ];

  const meta =
    row.kind === 'user'
      ? [accountTypeLabel(row.accountType), row.city ?? 'Unknown']
      : [
          row.publicId ?? '—',
          row.city ?? 'Unknown',
          `${row.reportCount ?? 0} ${row.reportCount === 1 ? 'report' : 'reports'}`
        ];

  return {
    id: row.id,
    href:
      row.kind === 'user'
        ? `${base}/users/${row.accountType === 'community' ? 'community' : 'agency'}?id=${row.id}`
        : `${base}/incidents?id=${row.id}`,
    badges,
    lead:
      row.kind === 'user'
        ? row.title
        : `Incident reported by ${row.reporter} -`,
    rest: row.kind === 'user' ? undefined : ` ${row.title}`,
    meta
  };
}

/**
 * The chart draws a 132px track with the filled part pinned to the bottom, so
 * a bar is expressed as the empty space above it. Scaled against the busiest
 * month rather than a fixed ceiling, so a quiet dataset still reads.
 */
function toGrowthBars(points: GrowthPoint[]): GrowthBar[] {
  const peak = Math.max(1, ...points.map((point) => point.count));
  return points.map((point) => ({
    label: point.label,
    pad: Math.round(132 - (point.count / peak) * 110)
  }));
}

function categoryLabel(category: string | null): string {
  if (!category) return 'Report';
  return `${category.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())} report`;
}

function statusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function accountTypeLabel(accountType?: string): string {
  if (accountType === 'official') return 'Official';
  if (accountType === 'news_outlet') return 'News Outlet';
  return 'Community Member';
}
