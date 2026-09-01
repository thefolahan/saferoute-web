import type { ActionRowData } from '../../_components/action-row';
import { officeFetch } from '../../_lib/session';
import { BroadcastView } from './broadcast-view';

export const dynamic = 'force-dynamic';

type ApiBroadcast = {
  id: string;
  message: string;
  city: string | null;
  status: 'active' | 'cancelled' | 'expired';
  radiusKm: number;
  recipientCount: number;
  sentCount: number;
  createdBy: string;
  createdAt: string;
};

type ApiResponse = { counts: Record<string, number>; rows: ApiBroadcast[] };

export default async function BroadcastPage() {
  const [data, me] = await Promise.all([
    officeFetch<ApiResponse>('/admin/broadcasts?status=active'),
    officeFetch<{ fullName: string | null; email: string }>('/admin/auth/me')
  ]);

  const rows = data?.rows ?? [];
  const counts = data?.counts ?? {};

  return (
    <BroadcastView
      adminName={me?.fullName ?? me?.email.split('@')[0] ?? 'there'}
      tabs={[
        { id: 'active', label: 'Active Message', count: String(counts.active ?? 0) },
        { id: 'pending', label: 'Pending Message', count: '0' },
        { id: 'draft', label: 'Draft Message', count: '0' },
        { id: 'scheduled', label: 'Scheduled Message', count: String(counts.expired ?? 0) }
      ]}
      rows={rows.map((alert): ActionRowData => ({
        id: alert.id,
        badges: [
          { text: 'Emergency', tone: 'error' },
          {
            text: alert.status === 'active' ? 'Active' : 'Cancelled',
            tone: alert.status === 'active' ? 'success' : 'gray'
          }
        ],
        lead: `${alert.city ?? 'Nationwide'} — `,
        rest: alert.message,
        meta: [
          'Push + SMS',
          `${alert.radiusKm}km radius`,
          `${alert.sentCount}/${alert.recipientCount} sent`,
          new Date(alert.createdAt).toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit'
          })
        ]
      }))}
    />
  );
}
