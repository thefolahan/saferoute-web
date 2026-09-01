'use client';

import { useState } from 'react';
import { Shell } from '../../_components/shell';
import { FilterBar, FilterField } from '../../_components/filter-bar';
import { DataTable, Pagination, type Column } from '../../_components/table';
import { ImageIcon, LocationIcon, UserSolidIcon } from '../../_components/icons';
import { ContentModal } from '../../_components/content-modal';

/* Figma 907:16950 "Contents". Columns 778 / 165 / 247 = 1190. */

const COLUMNS: Column[] = [
  { key: 'content', label: 'CONTENTS', width: 778, pad: 32 },
  { key: 'status', label: 'STATUS', width: 165 },
  { key: 'actions', label: '', width: 247, pad: 32, align: 'right' }
];

type Status = 'Verified' | 'Needs evidence' | 'Rejected';

const STATUS_TONE: Record<Status, string> = {
  Verified: 'bg-success-50 text-success-700',
  'Needs evidence': 'bg-warning-50 text-warning-700',
  Rejected: 'bg-error-50 text-error-700'
};

const STATUSES: Status[] = [
  'Verified',
  'Verified',
  'Verified',
  'Needs evidence',
  'Rejected',
  'Needs evidence',
  'Needs evidence',
  'Verified',
  'Needs evidence'
];

const ROWS = STATUSES.map((status, i) => ({
  id: `c${i}`,
  title: 'Major accident on Third Mainland Bridge, avoid this route......',
  author: 'by Chief Okafor',
  place: 'Gbagada road, Lagos Nigeria',
  images: '6 images',
  posted: 'Posted - 08-03  22:36 ',
  status
}));

export default function ContentsPage() {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <Shell title="Contents">
      <div className="flex flex-col gap-[15px]">
        <FilterBar>
          <FilterField placeholder="Search users" width={406} search />
          <FilterField placeholder="Type" width={230} />
          <FilterField placeholder="Status" width={230} />
          <FilterField placeholder="City" width={230} />
        </FilterBar>

        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={ROWS}
            rowKey={(r) => r.id}
            cell={(row, key) => {
              switch (key) {
                case 'content':
                  return (
                    <span className="flex flex-col justify-center gap-[5px]">
                      <span className="w-[437px] text-sm font-medium leading-5 text-[#2F3037]">
                        {row.title}
                      </span>
                      <span className="flex items-center gap-[18px] text-xs font-normal leading-5 text-gray-500">
                        <span className="flex items-center gap-1">
                          <UserSolidIcon className="h-4 w-4 shrink-0 text-gray-500" />
                          {row.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <LocationIcon className="h-4 w-4 shrink-0 text-gray-500" />
                          {row.place}
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4 shrink-0 text-gray-500" />
                          {row.images}
                        </span>
                        <span>{row.posted}</span>
                      </span>
                    </span>
                  );
                case 'status':
                  return (
                    <span
                      className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium leading-[18px] ${STATUS_TONE[row.status]}`}
                    >
                      {row.status}
                    </span>
                  );
                case 'actions':
                  return (
                    <button
                      type="button"
                      onClick={() => setDetailOpen(true)}
                      className="text-sm font-medium leading-5 text-gray-700"
                    >
                      View Details
                    </button>
                  );
                default:
                  return null;
              }
            }}
          />
          <Pagination label="Showing&nbsp;1–15&nbsp;of&nbsp;35" />
        </div>
      </div>

      <ContentModal open={detailOpen} onClose={() => setDetailOpen(false)} />
    </Shell>
  );
}
