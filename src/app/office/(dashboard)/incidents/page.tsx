import { officeFetch } from '../../_lib/session';
import { IncidentsView, type IncidentDetail, type IncidentRow } from './incidents-view';

export const dynamic = 'force-dynamic';

type Creator = {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatarUrl: string | null;
  accountType: 'community' | 'official' | 'news_outlet';
} | null;

type ApiIncident = {
  id: string;
  publicId: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  verificationStatus: string;
  city: string;
  addressText: string | null;
  latitude: number;
  longitude: number;
  reportedAt: string;
  creator?: Creator;
  /** True where a live broadcast was started from this report. */
  wasLive?: boolean;
  _count?: { reports: number; confirmations: number };
};

type ApiDetail = ApiIncident & {
  media: { id: string; type: string; url: string | null }[];
};

/**
 * The design tags each row by where the report came from.
 *
 * There is no source column; it is the reporter's account type, which is what
 * the four chips actually distinguish. A report with no account behind it —
 * the creator is nullable, an incident can outlive the person who filed it —
 * counts as Community, which is where an anonymous report belongs.
 */
function sourceFor(incident: ApiIncident): IncidentRow['source'] {
  // Live wins: a broadcast is how the report arrived, whoever filed it.
  if (incident.wasLive) return 'Live';
  if (incident.creator?.accountType === 'official') return 'Officials';
  if (incident.creator?.accountType === 'news_outlet') return 'News Outlet';
  return 'Community';
}

/** The chip ids the view puts in `?source=`. */
const SOURCE_OF_FILTER: Record<string, IncidentRow['source']> = {
  community: 'Community',
  live: 'Live',
  officials: 'Officials',
  news: 'News Outlet'
};

function reporterName(incident: ApiIncident): string {
  const creator = incident.creator;
  if (!creator) return 'Anonymous report';

  const joined = [creator.firstName, creator.lastName].filter(Boolean).join(' ');
  return creator.displayName || joined || creator.username || 'Anonymous report';
}

export default async function IncidentsPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string; source?: string }>;
}) {
  const params = await searchParams;
  const all = (await officeFetch<ApiIncident[]>('/admin/incidents')) ?? [];

  const wanted = params.source ? SOURCE_OF_FILTER[params.source] : undefined;
  const incidents = wanted
    ? all.filter((incident) => sourceFor(incident) === wanted)
    : all;

  // The panel opens on the requested report, otherwise the top of the list —
  // but only if that report survived the filter, or the chip would show one
  // list beside another list's detail.
  const selectedId =
    params.id && incidents.some((incident) => incident.id === params.id)
      ? params.id
      : incidents[0]?.id;

  /**
   * The detail is its own call rather than a row from the list: only
   * `/admin/incidents/:id` carries the photographs, and their signed URLs
   * expire in five minutes, so minting a hundred of them per page render to
   * show at most three would be wasteful and mostly wrong by the time anyone
   * clicked.
   */
  const detail = selectedId
    ? await officeFetch<ApiDetail>(`/admin/incidents/${selectedId}`).catch(
        () => null
      )
    : null;

  return (
    <IncidentsView
      total={incidents.length}
      incidents={incidents.map((incident): IncidentRow => ({
        id: incident.id,
        name: reporterName(incident),
        severity: incident.severity.replace(/^./, (c) => c.toUpperCase()),
        source: sourceFor(incident),
        avatarUrl: incident.creator?.avatarUrl ?? null,
        verified: incident.verificationStatus !== 'unverified'
      }))}
      detail={
        detail
          ? ({
              id: detail.id,
              title: detail.title,
              description: detail.description,
              severity: detail.severity,
              status: detail.status,
              place: detail.addressText ?? detail.city,
              reportedAt: relative(detail.reportedAt),
              confirmations: detail._count?.confirmations ?? 0,
              reportCount: detail._count?.reports ?? 0,
              media: (detail.media ?? [])
                .map((item) => item.url)
                .filter((url): url is string => Boolean(url)),
              reporterId: detail.creator?.id ?? null,
              latitude: detail.latitude,
              longitude: detail.longitude
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
