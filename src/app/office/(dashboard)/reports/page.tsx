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
    avgResponseSeconds: number | null;
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
    // No response-time aggregate exists yet.
    { label: 'Avg Response Time', value: '—' },
    { label: 'Crime reports', value: NUMBER.format(m?.crimeReports ?? 0) },
    { label: 'Traffic reports', value: NUMBER.format(m?.trafficReports ?? 0) },
    // App installs are not something this database sees.
    { label: 'App downloads', value: '—' },
    { label: 'Emergency alerts', value: NUMBER.format(m?.emergencyAlerts ?? 0) },
    { label: 'Revenue', value: '—' }
  ];

  const response: ResponseStat[] = [
    { label: 'Average Response Time', value: '—', delta: null },
    { label: 'Average Resolution Time', value: '—', delta: null },
    { label: 'SOS Response Rate', value: '—', delta: null }
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
