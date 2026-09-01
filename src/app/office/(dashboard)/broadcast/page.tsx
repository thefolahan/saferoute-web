import type { ActionRowData } from '../../_components/action-row';
import { officeFetch } from '../../_lib/session';
import { BroadcastView } from './broadcast-view';

export const dynamic = 'force-dynamic';

type ApiBroadcast = {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  city: string | null;
  status: 'scheduled' | 'active' | 'cancelled' | 'expired';
  channels: string[];
  radiusKm: number | null;
  recipientCount: number;
  sentCount: number;
  suppressedCount: number;
  createdBy: string;
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
  expiresAt: string;
};

type ApiResponse = { counts: Record<string, number>; rows: ApiBroadcast[] };

const CHANNEL_LABEL: Record<string, string> = {
  push: 'Push',
  in_app: 'In-app',
  sms: 'SMS',
  email: 'Email'
};

/** The four tabs, and which stored status each one holds. */
const TABS = [
  { id: 'active', label: 'Active Message', status: 'active' },
  { id: 'scheduled', label: 'Scheduled Message', status: 'scheduled' },
  { id: 'expired', label: 'Expired Message', status: 'expired' },
  { id: 'cancelled', label: 'Cancelled Message', status: 'cancelled' }
] as const;

export default async function BroadcastPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = TABS.find((entry) => entry.id === params.tab) ?? TABS[0];

  const [data, me] = await Promise.all([
    // One call for every status: the tab counts have to be real, and the whole
    // table is capped at 50 rows anyway.
    officeFetch<ApiResponse>('/admin/broadcasts?status=all'),
    officeFetch<{ fullName: string | null; email: string }>('/admin/auth/me')
  ]);

  const all = data?.rows ?? [];
  const counts = data?.counts ?? {};
  const rows = all.filter((row) => row.status === tab.status);

  return (
    <BroadcastView
      active={tab.id}
      adminName={me?.fullName ?? me?.email.split('@')[0] ?? 'there'}
      tabs={TABS.map((entry) => ({
        id: entry.id,
        label: entry.label,
        count: String(counts[entry.status] ?? 0)
      }))}
      rows={rows.map((broadcast): ActionRowData => ({
        id: broadcast.id,
        badges: [
          { text: severityLabel(broadcast.severity), tone: severityTone(broadcast.severity) },
          { text: statusLabel(broadcast.status), tone: statusTone(broadcast.status) }
        ],
        lead: broadcast.title,
        rest: ` — ${broadcast.message}`,
        meta: [
          broadcast.city ?? 'Everyone',
          broadcast.channels.length
            ? broadcast.channels.map((c) => CHANNEL_LABEL[c] ?? c).join(' + ')
            : 'No channel',
          // A scheduled broadcast has no delivery to report yet.
          broadcast.sentAt
            ? `${broadcast.sentCount}/${broadcast.recipientCount} pushed`
            : 'Not sent yet',
          when(broadcast)
        ],
        cancellable: broadcast.status === 'active' || broadcast.status === 'scheduled'
      }))}
    />
  );
}

function when(broadcast: ApiBroadcast): string {
  const iso = broadcast.scheduledFor ?? broadcast.sentAt ?? broadcast.createdAt;
  return new Date(iso).toLocaleString('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function severityLabel(severity: ApiBroadcast['severity']): string {
  if (severity === 'medium') return 'Moderate';
  return severity.replace(/^./, (c) => c.toUpperCase());
}

function severityTone(severity: ApiBroadcast['severity']): ActionRowData['badges'][number]['tone'] {
  if (severity === 'high' || severity === 'critical') return 'error';
  if (severity === 'medium') return 'warning';
  return 'gray';
}

function statusLabel(status: ApiBroadcast['status']): string {
  return status.replace(/^./, (c) => c.toUpperCase());
}

function statusTone(status: ApiBroadcast['status']): ActionRowData['badges'][number]['tone'] {
  if (status === 'active') return 'success';
  if (status === 'scheduled') return 'warning';
  return 'gray';
}
