import { officeFetch } from '../../_lib/session';
import {
  AnalyticsView,
  type ActivityPoint,
  type Kpi,
  type ResponseStat,
  type SeverityBar,
  type Stat
} from './analytics-view';

export const dynamic = 'force-dynamic';

type Analytics = {
  metrics: {
    totalIncidents: number;
    activeUsers: number;
    sosRequests: number;
    liveIncidents: number;
    crimeReports: number;
    trafficReports: number;
    emergencyAlerts: number;
    revenueMinor: number | null;
    revenueCurrency: string;
    avgResponseSeconds: number | null;
    avgResolutionSeconds: number | null;
    /** 0-1 share of SOS activations that reached a Safety Circle contact. */
    sosReachRate: number | null;
    appDownloads: number | null;
  };
  severity: { severity: string; count: number; share: number }[];
};

type Activity = { label: string; reported: number; resolved: number }[];

/** Figma tints these four bars; the widths come from the real distribution. */
const SEVERITY_COLOR: Record<string, string> = {
  critical: 'bg-error-400',
  high: 'bg-warning-300',
  medium: 'bg-warning-500',
  low: 'bg-success-500'
};

const NUMBER = new Intl.NumberFormat('en-NG');

export default async function AnalyticsPage() {
  const [analytics, activity, contents] = await Promise.all([
    officeFetch<Analytics>('/admin/analytics'),
    officeFetch<Activity>('/admin/incident-activity?days=9'),
    officeFetch<{ total: number }>('/admin/contents?page=1')
  ]);

  const m = analytics?.metrics;

  const kpis: Kpi[] = [
    { label: 'Total Incidents', value: NUMBER.format(m?.totalIncidents ?? 0) },
    { label: 'Active users', value: NUMBER.format(m?.activeUsers ?? 0) },
    { label: 'SOS request', value: NUMBER.format(m?.sosRequests ?? 0) },
    { label: 'Live incident count', value: NUMBER.format(m?.liveIncidents ?? 0) },
    { label: 'Avg Response Time', value: duration(m?.avgResponseSeconds) },
    { label: 'Crime reports', value: NUMBER.format(m?.crimeReports ?? 0) },
    { label: 'Traffic reports', value: NUMBER.format(m?.trafficReports ?? 0) },
    // App installs are not something this database sees — the stores are not
    // connected, and counting sign-ups instead would be a different number.
    { label: 'App downloads', value: '—' },
    { label: 'Emergency alerts', value: NUMBER.format(m?.emergencyAlerts ?? 0) },
    { label: 'Revenue', value: money(m?.revenueMinor, m?.revenueCurrency) }
  ];

  const response: ResponseStat[] = [
    {
      label: 'Average Response Time',
      value: duration(m?.avgResponseSeconds),
      delta: null
    },
    {
      label: 'Average Resolution Time',
      value: duration(m?.avgResolutionSeconds),
      delta: null
    },
    {
      label: 'SOS Response Rate',
      value:
        m?.sosReachRate === null || m?.sosReachRate === undefined
          ? '—'
          : `${Math.round(m.sosReachRate * 100)}%`,
      delta: null
    }
  ];

  const severityOrder = ['critical', 'high', 'medium', 'low'];
  const severity: SeverityBar[] = severityOrder.map((key) => {
    const row = analytics?.severity.find((entry) => entry.severity === key);
    const share = row?.share ?? 0;
    return {
      label: key.replace(/^./, (c) => c.toUpperCase()),
      // The design's track is 334px wide.
      width: Math.max(8, Math.round(share * 334)),
      color: SEVERITY_COLOR[key] ?? 'bg-gray-300',
      pct: row ? `${row.count} (${Math.round(share * 100)}%)` : '0 (0%)',
      count: row?.count ?? 0
    };
  });

  const communityStats: Stat[] = [
    { label: 'Reports submitted', value: NUMBER.format(m?.totalIncidents ?? 0) },
    { label: 'Reports verified', value: NUMBER.format(m?.liveIncidents ?? 0) },
    {
      label: 'Reports rejected',
      value: NUMBER.format(
        Math.max(0, (m?.totalIncidents ?? 0) - (m?.liveIncidents ?? 0))
      )
    },
    { label: 'Posts published', value: NUMBER.format(contents?.total ?? 0) }
  ];

  return (
    <AnalyticsView
      kpis={kpis}
      response={response}
      severity={severity}
      communityStats={communityStats}
      activity={(activity ?? []) as ActivityPoint[]}
    />
  );
}

/** Seconds as the largest sensible unit; an em dash when nothing was measured. */
function duration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

/** Monthly recurring revenue. `priceMinor` is kobo, so divide by 100. */
function money(minor: number | null | undefined, currency = 'NGN'): string {
  if (minor === null || minor === undefined) return '—';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(minor / 100);
}
