'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shell } from '../../_components/shell';
import { officeHref, useOfficeBase } from '../../_lib/office-path';
import { Tabs } from '../../_components/tabs';
import { ActionRowList, type ActionRowData } from '../../_components/action-row';
import { Card } from '../../_components/ui';
import { CalendarIcon, ChevronDownIcon, PencilIcon, PlusIcon, SearchLgIcon } from '../../_components/icons';

/* Figma 907:13337 "Broadcast message". Same page shell as the Dashboard's
   welcome block, then a tabbed card of broadcast rows (no red rail). */


const EDIT = { label: 'Edit', icon: <PencilIcon className="h-4 w-4 text-gray-700" /> };

export function BroadcastView({
  rows,
  tabs,
  adminName
}: {
  rows: ActionRowData[];
  tabs: { id: string; label: string; count: string }[];
  adminName: string;
}) {
  const [tab, setTab] = useState('active');
  const base = useOfficeBase();

  return (
    <Shell title="Broadcast message" filters>
      <div className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-[15px]">
          <div className="flex flex-col justify-center gap-[10px]">
            <h2 className="text-2xl font-medium leading-tight text-gray-500 sm:text-[32px] sm:leading-[39px]">
              Welcome back, <span className="text-gray-900">{adminName}</span> 👋
            </h2>
            <p className="text-base font-normal leading-[19px] text-gray-500">
              Here&apos;s what&apos;s happening across SafeRoute today.
            </p>
          </div>

          <Link
            href={officeHref(base, 'broadcast/new')}
            className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px]"
          >
            <PlusIcon className="h-4 w-4 text-gray-50" />
            <span className="text-sm font-medium leading-6 text-gray-50">
              Create New broadcast
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-3 py-[15px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-11 w-full items-center gap-2 sm:w-[302px] rounded-lg bg-[#F7F7F7] px-[14px] py-[10px]">
            <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-400" />
            <span className="flex-1 text-base font-medium leading-6 text-gray-400">
              Search Broadcast
            </span>
          </div>

          <div className="edge-gray200 flex h-11 w-[193px] items-center gap-2 rounded-lg bg-[#F7F7F7] px-[14px] py-[10px]">
            <CalendarIcon className="h-4 w-4 shrink-0 text-gray-700" />
            <span className="flex-1 text-base font-normal leading-6 text-gray-700">
              Last 7 days
            </span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-900" />
          </div>
        </div>

        <Card>
          <div className="edge-bottom flex items-center px-5 py-[18px]">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />
          </div>
          {rows.length ? (
            <ActionRowList rows={rows.map((row) => ({ ...row, action: EDIT }))} rail={false} />
          ) : (
            <p className="bg-surface-muted px-[19px] py-16 text-center text-sm text-gray-500">
              No broadcasts in this state yet.
            </p>
          )}
        </Card>
      </div>
    </Shell>
  );
}
