import { redirect } from 'next/navigation';
import type { ActionRowData } from '../../_components/action-row';
import { officeBase, officeFetch } from '../../_lib/session';
import { NeedsActionView } from './needs-action-view';

export const dynamic = 'force-dynamic';

type Row = {
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

const TABS = [
  { id: 'pending', label: 'Pendings action' },
  { id: 'verified', label: 'Verified reports' },
  { id: 'rejected', label: 'Rejected reports' }
] as const;

export default async function NeedsActionPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const active =
    TABS.find((tab) => tab.id === params.status)?.id ?? 'pending';
  const base = await officeBase();

  // Counts come from one call per tab so the badges are real, not guesses.
  const [pending, verified, rejected] = await Promise.all([
    officeFetch<{ rows: Row[] }>('/admin/needs-action?status=pending'),
    officeFetch<{ rows: Row[] }>('/admin/needs-action?status=verified'),
    officeFetch<{ rows: Row[] }>('/admin/needs-action?status=rejected')
  ]);

  const byTab = {
    pending: pending?.rows ?? [],
    verified: verified?.rows ?? [],
    rejected: rejected?.rows ?? []
  };

  async function select(id: string) {
    'use server';
    redirect(`${base}/needs-action?status=${id}`);
  }

  return (
    <NeedsActionView
      active={active}
      onSelect={select}
      tabs={TABS.map((tab) => ({
        id: tab.id,
        label: tab.label,
        count: String(byTab[tab.id].length)
      }))}
      rows={byTab[active].map((row) => toActionRow(row, base))}
    />
  );
}

/**
 * "Investigate" needs somewhere to go. An incident opens on the Incidents
 * screen with its panel already showing; a pending account opens on the user's
 * own detail screen, which is where the decision about it is taken.
 */
function toActionRow(row: Row, base: string): ActionRowData {
  const badges: ActionRowData['badges'] =
    row.kind === 'user'
      ? [{ text: 'Pending', tone: 'warning' }]
      : [
          { text: label(row.category ?? 'report'), tone: 'error' },
          { text: label(row.status), tone: 'gray' }
        ];

  return {
    id: row.id,
    href:
      row.kind === 'user'
        ? `${base}/users/${row.accountType === 'community' ? 'community' : 'agency'}?id=${row.id}`
        : `${base}/incidents?id=${row.id}`,
    badges,
    lead:
      row.kind === 'user' ? row.title : `Incident reported by ${row.reporter} -`,
    rest: row.kind === 'user' ? undefined : ` ${row.title}`,
    meta:
      row.kind === 'user'
        ? [accountTypeLabel(row.accountType), row.city ?? 'Unknown']
        : [
            row.publicId ?? '—',
            row.city ?? 'Unknown',
            `${row.reportCount ?? 0} ${row.reportCount === 1 ? 'report' : 'reports'}`
          ]
  };
}

function label(value: string): string {
  return value.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

function accountTypeLabel(accountType?: string): string {
  if (accountType === 'official') return 'Official';
  if (accountType === 'news_outlet') return 'News Outlet';
  return 'Community Member';
}
