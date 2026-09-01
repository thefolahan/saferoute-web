import type { ActionRowData } from '../_components/action-row';
import { officeFetch } from '../_lib/session';
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

export default async function DashboardPage() {
  const [overview, needsAction, growth] = await Promise.all([
    officeFetch<Overview>('/admin/overview?range=today'),
    officeFetch<{ rows: NeedsActionRow[] }>('/admin/needs-action?status=pending'),
    officeFetch<GrowthPoint[]>('/admin/user-growth?months=7')
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
      kpis={kpis}
      actions={(needsAction?.rows ?? []).slice(0, 4).map(toActionRow)}
      growth={toGrowthBars(growth ?? [])}
    />
  );
}

/** Map an API row onto the Needs-Action row the design draws. */
function toActionRow(row: NeedsActionRow): ActionRowData {
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
