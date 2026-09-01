'use client';


import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shell } from '../../_components/shell';
import { Avatar } from '../../_components/avatar';
import { useAction } from '../../_components/use-action';
import { decideIncident } from '../../_lib/actions';
import {
  AdjustmentsIcon,
  CarIcon,
  CheckIcon,
  DistanceIcon,
  MapPinIcon,
  NewspaperIcon,
  ShieldOutlineIcon,
  SignalOutlineIcon,
  UserGroupIcon,
  VerifiedBadgeIcon,
  XMarkIcon
} from '../../_components/icons';
import { officeHref, useOfficeBase } from '../../_lib/office-path';

/* Figma 907:16154 (list) and 907:16293 / 907:16520 / 907:16747 (list + detail).
   Split view: 592 list column + 598 detail panel inside the 1190 content area. */

type Source = 'Community' | 'Live' | 'Officials' | 'News Outlet';

const SOURCE_ICON = {
  Community: UserGroupIcon,
  Live: SignalOutlineIcon,
  Officials: ShieldOutlineIcon,
  'News Outlet': NewspaperIcon
} as const;

/* Only the icon is tinted per source; the label stays Gray/500. */
const SOURCE_COLOR: Record<Source, string> = {
  Community: '#717680',
  Live: '#F04438',
  Officials: '#0BA5EC',
  'News Outlet': '#AF52DE'
};

const FILTERS = [
  { id: 'all', label: 'All', icon: AdjustmentsIcon, color: '#F5F5F5' },
  { id: 'community', label: 'Community', icon: UserGroupIcon, color: '#717680' },
  { id: 'live', label: 'Live', icon: SignalOutlineIcon, color: '#F04438' },
  { id: 'officials', label: 'Officials', icon: ShieldOutlineIcon, color: '#0BA5EC' },
  { id: 'news', label: 'News Outlets', icon: NewspaperIcon, color: '#AF52DE' }
];

export type IncidentRow = {
  id: string;
  name: string;
  severity: string;
  source: Source;
  avatarUrl: string | null;
  verified: boolean;
};

export type IncidentDetail = {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  place: string;
  reportedAt: string;
  confirmations: number;
  reportCount: number;
  /** Signed URLs from the API; empty when the report carried no photographs. */
  media: string[];
  reporterId: string | null;
  /** For the "Navigate map" button. */
  latitude: number;
  longitude: number;
};

export function IncidentsView({
  incidents,
  detail,
  total
}: {
  incidents: IncidentRow[];
  detail: IncidentDetail | null;
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const base = useOfficeBase();
  const filter = params.get('source') ?? 'all';
  const selected = detail?.id ?? null;

  /**
   * Both the source filter and the open report live in the URL, not in state.
   *
   * The detail panel is rendered from a server fetch keyed on `?id`, so a
   * local `selected` could point at one report while the panel showed
   * another — which is exactly what it did: clicking the second row opened the
   * first one's detail. Same for the filter, whose chips set state that
   * nothing read, so every chip showed the same unfiltered list.
   */
  function navigate(next: { source?: string; id?: string | null }) {
    const query = new URLSearchParams(params.toString());

    if (next.source !== undefined) {
      if (next.source === 'all') query.delete('source');
      else query.set('source', next.source);
    }

    if (next.id !== undefined) {
      if (next.id === null) query.delete('id');
      else query.set('id', next.id);
    }

    const search = query.toString();
    router.replace(
      `${officeHref(base, 'incidents')}${search ? `?${search}` : ''}`,
      { scroll: false }
    );
  }

  return (
    <Shell title="Incidents">
      <div className="flex flex-1 flex-col shadow-[inset_0_1px_0_0_#EEEEEE] xl:flex-row">
        {/* List column — 592 when the panel is open, otherwise the full 1190 */}
        <div
          className={`flex flex-col ${
            selected ? 'xl:w-[592px] xl:shrink-0 xl:border-r xl:border-rule' : 'flex-1'
          } border-b border-rule`}
        >
          <div className="flex flex-col gap-[30px] px-4 py-[25px] sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 py-[10px]">
              {FILTERS.map((f) => {
                const Icon = f.icon;
                const isActive = f.id === filter;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => navigate({ source: f.id, id: null })}
                    className={`flex h-9 items-center justify-center gap-1 rounded-full px-3 py-2 ${
                      isActive ? 'bg-gray-950' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color: isActive ? '#F5F5F5' : f.color }}
                    />
                    <span
                      className={`text-sm font-medium leading-5 ${
                        isActive ? 'text-gray-100' : 'text-gray-500'
                      }`}
                    >
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[15px] font-semibold leading-[18px] text-[#1A1A1A]">
              {total} incident{total === 1 ? '' : 's'} reported
            </p>
          </div>

          {incidents.map((inc) => {
            const Icon = SOURCE_ICON[inc.source];
            const isSelected = inc.id === selected;
            return (
              <button
                key={inc.id}
                type="button"
                onClick={() => navigate({ id: isSelected ? null : inc.id })}
                className={`flex h-[100px] w-full items-center px-4 py-[11px] text-left sm:px-6 lg:px-8 ${
                  isSelected
                    ? 'bg-error-50 shadow-[inset_-8px_0_0_0_#F04438]'
                    : 'bg-white shadow-[0_0_0_1px_#E9EAEB]'
                }`}
              >
                <div className="flex flex-1 items-center justify-between gap-[10px] py-[6px]">
                  <div className="flex items-center gap-[17px]">
                    <Avatar src={inc.avatarUrl} name={inc.name} size={54} />
                    <div className="flex flex-col justify-center gap-[7px]">
                      <div className="flex items-center gap-1">
                        <span className="line-clamp-2 text-sm font-semibold leading-[14px] text-gray-900">
                          {inc.name}
                        </span>
                        {inc.verified ? (
                          <VerifiedBadgeIcon className="h-3 w-3 shrink-0" />
                        ) : null}
                      </div>
                      <span className="inline-flex w-fit items-center justify-center rounded-2xl bg-error-50 px-3 py-1 text-xs font-medium leading-[18px] text-error-700">
                        {inc.severity}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`flex h-9 items-center justify-center gap-1 rounded-full px-3 py-2 ${
                      isSelected ? 'bg-white' : 'bg-white'
                    }`}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color: SOURCE_COLOR[inc.source] }}
                    />
                    <span className="text-xs font-medium leading-5 tracking-[-0.24px] text-gray-500">
                      {inc.source}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selected && detail ? (
          <IncidentDetailPanel detail={detail} base={base} />
        ) : null}
      </div>
    </Shell>
  );
}

/* Figma 907:16432 — the 598-wide detail panel. */
function IncidentDetailPanel({
  detail,
  base
}: {
  detail: IncidentDetail;
  base: string;
}) {
  const { pending, error, run } = useAction();
  const decided = detail.status === 'verified' || detail.status === 'rejected';

  return (
    <div className="flex min-w-0 flex-1 flex-col border-b border-rule bg-white pb-[26px] xl:border-l">
      <div className="flex items-center justify-between gap-[10px] px-5 py-[14px]">
        <div className="flex gap-[10px]">
          <span className="inline-flex items-center justify-center rounded-2xl bg-error-50 px-3 py-1 text-xs font-semibold leading-[18px] text-error-700 capitalize">
            {detail.severity}
          </span>
          <span className="inline-flex items-center justify-center rounded-2xl bg-warning-50 px-3 py-1 text-xs font-semibold leading-[18px] text-warning-700">
            {detail.status.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="text-sm font-normal leading-[18px] tracking-[-0.42px] text-gray-500">
          {detail.reportedAt}
        </span>
      </div>

      {/* Media strip — 358x274 shots, clipped by the panel */}
      {detail.media.length === 0 ? (
        <div className="flex h-[120px] items-center justify-center bg-[#EFEFEF] px-5 text-sm leading-6 text-gray-500">
          No photographs were filed with this report.
        </div>
      ) : (
        <div className="no-scrollbar flex h-[298px] gap-[10px] overflow-x-auto bg-[#EFEFEF] px-5 py-3">
          {detail.media.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt=""
              className="h-[274px] w-[358px] shrink-0 rounded object-cover"
            />
          ))}
        </div>
      )}

      <div className="flex flex-col items-center px-5 pt-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
        <div className="flex w-full items-center gap-[18px] py-[5px]">
          <h2 className="text-base font-semibold leading-6 text-gray-900">Incident Detail</h2>
        </div>

        <div className="flex w-full flex-col gap-[7px] py-1">
          <div className="flex gap-5 py-2">
            <div className="flex h-[49px] w-[49px] shrink-0 items-center justify-center rounded-[35px] bg-rule px-[3px] py-[7px]">
              <CarIcon className="h-[35px] w-[43px]" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                {detail.title}
              </h3>
              <p className="text-[15px] font-normal leading-5 tracking-[-0.3px] text-gray-500">
                {detail.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 px-[47px] py-[5px]">
            <span className="flex items-center justify-center gap-1 py-1">
              <MapPinIcon className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-sm font-normal leading-5 text-gray-400">{detail.place}</span>
            </span>
            <span className="flex items-center justify-center gap-1 py-1">
              <DistanceIcon className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-sm font-normal leading-5 text-gray-400">
                {detail.reportCount} report{detail.reportCount === 1 ? '' : 's'}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 py-2">
            <div className="flex items-center gap-1 py-1">
              {/*
                The design stacks avatars of who confirmed. The count is real;
                which accounts they belong to is not exposed by the API, and
                drawing three stock faces plus a fixed "+5" over a live number
                said five people had confirmed a report that one had.
              */}
              <span className="text-xs font-normal leading-[18px] text-gray-500">
                {detail.confirmations} signal{detail.confirmations === 1 ? '' : 's'}
              </span>
            </div>
            {/* Figma 907:16496 — a 24px Gray/200 rule between the two halves */}
            <span className="h-6 w-px shrink-0 bg-gray-200" />
            <span className="flex flex-1 items-center justify-end gap-1">
              <span className="text-xs font-normal leading-[18px] tracking-[-0.36px] text-gray-500">
                Severity
              </span>
              <span className="text-xs font-medium capitalize leading-[18px] tracking-[-0.24px] text-warning-500">
                {detail.severity}
              </span>
            </span>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mx-5 w-full rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
          >
            {error}
          </p>
        ) : null}

        <div className="flex w-full items-center justify-center gap-[10px] px-5 py-3 shadow-[inset_0_-1px_0_0_#EEEEEE]">
          <div className="flex flex-1 flex-wrap items-center justify-center gap-[10px] py-[6px]">
            {detail.reporterId ? (
              <Link
                href={`${officeHref(base, 'users/community')}?id=${detail.reporterId}`}
                className="flex h-8 items-center justify-center gap-[3px] rounded-lg bg-black px-4 py-1 text-sm font-semibold leading-6 text-gray-25"
              >
                View profile
              </Link>
            ) : null}
            <button
              type="button"
              disabled={pending || decided}
              onClick={() => run(() => decideIncident(detail.id, 'approve'))}
              className="flex h-8 items-center justify-center gap-[3px] rounded-lg bg-success-800 py-1 pl-[6px] pr-4 text-sm font-semibold leading-6 text-gray-25 disabled:opacity-50"
            >
              <CheckIcon className="h-5 w-5 text-gray-25" />
              {detail.status === 'verified' ? 'Approved' : 'Approve'}
            </button>
            <button
              type="button"
              disabled={pending || decided}
              onClick={() => run(() => decideIncident(detail.id, 'reject'))}
              className="flex h-8 items-center justify-center gap-[3px] rounded-lg bg-error-500 py-1 pl-[6px] pr-4 text-sm font-semibold leading-6 text-white disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
              {detail.status === 'rejected' ? 'Rejected' : 'Reject'}
            </button>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-5 py-[18px] xl:px-[186px]">
          <Link
            href={`${officeHref(base, 'map')}?lat=${detail.latitude}&lng=${detail.longitude}&id=${detail.id}`}
            className="edge flex h-[54px] w-full items-center justify-center rounded-lg px-8 py-[15px] text-base font-semibold leading-6 text-black shadow-[0_1px_9px_rgba(0,0,0,0.13)]"
          >
            Navigate map
          </Link>
        </div>
      </div>
    </div>
  );
}
