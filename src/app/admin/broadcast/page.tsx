'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shell } from '../_components/shell';
import { Tabs } from '../_components/tabs';
import { ActionRowList, type ActionRowData } from '../_components/action-row';
import { Card } from '../_components/ui';
import { CalendarIcon, ChevronDownIcon, PencilIcon, PlusIcon, SearchLgIcon } from '../_components/icons';

/* Figma 907:13337 "Broadcast message". Same page shell as the Dashboard's
   welcome block, then a tabbed card of broadcast rows (no red rail). */

const TABS = [
  { id: 'active', label: 'Active Message', count: '6' },
  { id: 'pending', label: 'Pending Message', count: '10' },
  { id: 'draft', label: 'Draft Message', count: '0' },
  { id: 'scheduled', label: 'Scheduled Message', count: '0' }
];

const EDIT = { label: 'Edit', icon: <PencilIcon className="h-4 w-4 text-gray-700" /> };

const META = ['Push + SMS', 'Lekki, Lagos', '24.5K', '10:32 AM'];

const ROWS: ActionRowData[] = [
  {
    id: 'b1',
    badges: [
      { text: 'Emergency', tone: 'error' },
      { text: 'Active', tone: 'success' }
    ],
    lead: 'Flood Warning – Lekki - ',
    rest: 'Heavy flooding has been reported around Admiralty.....',
    meta: META,
    action: EDIT
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `b${i + 2}`,
    badges: [
      { text: 'Emergency', tone: 'error' as const },
      { text: 'Active', tone: 'success' as const }
    ],
    lead: 'Flood Warning – Lekki -',
    rest: ' Fire Outbreak at Gbagada express road...',
    meta: META,
    action: EDIT
  }))
];

export default function BroadcastPage() {
  const [tab, setTab] = useState('active');

  return (
    <Shell title="Broadcast message" filters>
      <div className="flex flex-col gap-[15px] px-8 py-[19px]">
        <div className="flex items-center justify-between gap-[15px]">
          <div className="flex flex-col justify-center gap-[10px]">
            <h2 className="text-[32px] font-medium leading-[39px] text-gray-500">
              Welcome back, <span className="text-gray-900">Tobi Olusegun</span> 👋
            </h2>
            <p className="text-base font-normal leading-[19px] text-gray-500">
              Here&apos;s what&apos;s happening across SafeRoute today.
            </p>
          </div>

          <Link
            href="/admin/broadcast/new"
            className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px]"
          >
            <PlusIcon className="h-4 w-4 text-gray-50" />
            <span className="text-sm font-medium leading-6 text-gray-50">
              Create New broadcast
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-[10px] py-[15px]">
          <div className="flex h-11 w-[302px] items-center gap-2 rounded-lg bg-[#F7F7F7] px-[14px] py-[10px]">
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
            <Tabs tabs={TABS} active={tab} onChange={setTab} />
          </div>
          <ActionRowList rows={ROWS} rail={false} />
        </Card>
      </div>
    </Shell>
  );
}
