'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shell } from '../../_components/shell';
import { officeHref, useOfficeBase } from '../../_lib/office-path';
import { Tabs } from '../../_components/tabs';
import { ActionRowList, type ActionRowData } from '../../_components/action-row';
import { Card, FIELD_TEXT, fieldShell } from '../../_components/ui';
import {
  CalendarIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchLgIcon,
  XMarkIcon
} from '../../_components/icons';
import { useAction } from '../../_components/use-action';
import { cancelBroadcast } from '../../_lib/actions';

/* Figma 907:13337 "Broadcast message". Same page shell as the Dashboard's
   welcome block, then a tabbed card of broadcast rows (no red rail). */


const CANCEL = {
  label: 'Cancel',
  icon: <XMarkIcon className="h-4 w-4 text-gray-700" />
};

export function BroadcastView({
  rows,
  tabs,
  active,
  adminName
}: {
  rows: ActionRowData[];
  tabs: { id: string; label: string; count: string }[];
  active: string;
  adminName: string;
}) {
  const base = useOfficeBase();
  const router = useRouter();
  const { pending, error, run } = useAction();
  const [query, setQuery] = useState('');
  /**
   * The date chip was a `div` with a chevron and no handler — decorative, and
   * missed by the sweep that fixed the other dead pickers because it was not
   * built from `Select`. It filters here rather than server-side for the same
   * reason the search box does: the list is capped at 50 and already loaded.
   */
  const [days, setDays] = useState('0');

  // The broadcast list takes no search term and is capped at 50 rows, so the
  // box filters what is already here.
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? rows.filter((row) =>
        `${row.lead} ${row.rest ?? ''} ${row.meta.join(' ')}`
          .toLowerCase()
          .includes(needle)
      )
    : rows;

  const since =
    days === '0' ? null : Date.now() - Number(days) * 24 * 60 * 60 * 1000;
  const visibleRows = since
    ? visible.filter((row) => row.at && new Date(row.at).getTime() >= since)
    : visible;


  return (
    /*
      No region/state pickers here: `admin_broadcasts` carries a city and no
      state, so neither could be honoured. Absent rather than disabled — a
      control that can never work is not worth the space.
    */
    <Shell title="Broadcast message">
      <div className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-[15px]">
          <div className="flex flex-col justify-center gap-[10px]">
            <h2 className="text-2xl font-medium leading-8 text-gray-500 sm:text-[32px] sm:leading-[39px]">
              Welcome back, <span className="text-gray-900">{adminName}</span> 👋
            </h2>
            <p className="text-base font-normal leading-6 text-gray-500">
              Here&apos;s what&apos;s happening across SafeRoute today.
            </p>
          </div>

          <Link
            href={officeHref(base, 'broadcast/new')}
            className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px]"
          >
            <PlusIcon className="h-4 w-4 text-gray-50" />
            <span className="text-sm font-medium leading-5 text-gray-50">
              Create New broadcast
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-3 py-[15px] sm:flex-row sm:items-center sm:justify-between">
          <div className={fieldShell('filter', 'w-full sm:w-[302px]')}>
            <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Broadcast"
              aria-label="Search broadcasts"
              className={`w-full flex-1 border-0 bg-transparent p-0 outline-none ${FIELD_TEXT} placeholder:text-gray-400`}
            />
          </div>

          <span className={fieldShell('filter', 'w-[210px]')}>
            <CalendarIcon className="h-4 w-4 shrink-0 text-gray-700" />
            <select
              value={days}
              aria-label="Period"
              onChange={(event) => setDays(event.target.value)}
              className={`flex-1 cursor-pointer appearance-none bg-transparent outline-none ${FIELD_TEXT}`}
            >
              <option value="0">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-900" />
          </span>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
          >
            {error}
          </p>
        ) : null}

        <Card>
          <div className="edge-bottom flex items-center px-5 py-[18px]">
            <Tabs
              tabs={tabs}
              active={active}
              onChange={(id) =>
                router.replace(`${officeHref(base, 'broadcast')}?tab=${id}`, {
                  scroll: false
                })
              }
            />
          </div>
          {visible.length ? (
            <ActionRowList
              rail={false}
              pending={pending}
              /*
                A sent broadcast cannot be edited — it is already on people's
                phones — so the trailing control cancels the ones that can
                still be pulled back and is absent on the rest.
              */
              onAction={(row) => run(() => cancelBroadcast(row.id))}
              rows={visibleRows.map((row) =>
                row.cancellable ? { ...row, action: CANCEL } : row
              )}
            />
          ) : (
            <p className="bg-surface-muted px-[19px] py-16 text-center text-sm text-gray-500">
              {needle
                ? `No broadcast here matches “${query.trim()}”.`
                : 'No broadcasts in this state yet.'}
            </p>
          )}
        </Card>
      </div>
    </Shell>
  );
}
