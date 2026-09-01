import { officeFetch } from '../../_lib/session';
import { IncidentsView, type IncidentDetail, type IncidentRow } from './incidents-view';

export const dynamic = 'force-dynamic';

type ApiIncident = {
  id: string;
  publicId: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  city: string;
  addressText: string | null;
  reportedAt: string;
  creator?: { displayName: string | null } | null;
  _count?: { reports: number; confirmations: number };
};

/**
 * The design tags each row by where the report came from. The schema has no
 * source column, so it is derived from the reporter's account type where we
 * have one, and falls back to Community.
 */
function sourceFor(incident: ApiIncident): IncidentRow['source'] {
  if (incident.status === 'verified') return 'Officials';
  if (incident.category === 'protest_civil_unrest') return 'News Outlet';
  return 'Community';
}

export default async function IncidentsPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const incidents =
    (await officeFetch<ApiIncident[]>('/admin/incidents')) ?? [];

  const selectedId = params.id ?? incidents[0]?.id;
  const selected = incidents.find((incident) => incident.id === selectedId);

  return (
    <IncidentsView
      total={incidents.length}
      incidents={incidents.map((incident): IncidentRow => ({
        id: incident.id,
        name: incident.creator?.displayName ?? incident.title,
        severity: incident.severity.replace(/^./, (c) => c.toUpperCase()),
        source: sourceFor(incident)
      }))}
      detail={
        selected
          ? ({
              id: selected.id,
              title: selected.title,
              description: selected.description,
              severity: selected.severity,
              status: selected.status,
              place: selected.addressText ?? selected.city,
              reportedAt: relative(selected.reportedAt),
              confirmations: selected._count?.confirmations ?? 0,
              reportCount: selected._count?.reports ?? 0
            } satisfies IncidentDetail)
          : null
      }
    />
  );
}

function relative(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)} mins`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} hrs`;
  return `${Math.floor(minutes / (60 * 24))} days`;
}
