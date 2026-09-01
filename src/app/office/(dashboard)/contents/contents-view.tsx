'use client';

import { useState } from 'react';
import { Shell } from '../../_components/shell';
import { FilterBar, FilterField } from '../../_components/filter-bar';
import { DataTable, Pagination, type Column } from '../../_components/table';
import { ImageIcon, LocationIcon, UserSolidIcon } from '../../_components/icons';
import { ContentModal, type ContentDetail } from '../../_components/content-modal';
import { useAction } from '../../_components/use-action';
import { setContentStatus } from '../../_lib/actions';

/* Figma 907:16950 "Contents". Columns 778 / 165 / 247 = 1190. */

const COLUMNS: Column[] = [
  { key: 'content', label: 'CONTENTS', width: 778, pad: 32 },
  { key: 'status', label: 'STATUS', width: 165 },
  { key: 'actions', label: '', width: 247, pad: 32, align: 'right' }
];

export type Status = 'Verified' | 'Needs evidence' | 'Rejected' | 'Pending review';

export type ContentRow = {
  id: string;
  title: string;
  author: string;
  place: string;
  images: string;
  posted: string;
  status: Status;
};

const STATUS_TONE: Record<Status, string> = {
  Verified: 'bg-success-50 text-success-700',
  'Needs evidence': 'bg-warning-50 text-warning-700',
  Rejected: 'bg-error-50 text-error-700',
  'Pending review': 'bg-hairline text-gray-600'
};

export function ContentsView({
  rows,
  cities,
  page,
  pageCount,
  pageLabel,
  loadDetail
}: {
  rows: ContentRow[];
  /** The cities that actually have posts, for the City filter. */
  cities: string[];
  page: number;
  pageCount: number;
  pageLabel: string;
  /** Server action — the sheet's media are signed URLs fetched on demand. */
  loadDetail: (id: string) => Promise<ContentDetail | null>;
}) {
  const [detail, setDetail] = useState<ContentDetail | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const { pending, error, run } = useAction();

  async function open(id: string) {
    setOpening(id);
    try {
      setDetail(await loadDetail(id));
    } finally {
      setOpening(null);
    }
  }

  return (
    <Shell title="Contents">
      <div className="flex flex-col gap-[15px]">
        {/* Bound to the same parameters /admin/contents reads. */}
        <FilterBar>
          <FilterField placeholder="Search captions" param="q" width={406} search />
          <FilterField
            placeholder="Status"
            param="status"
            width={230}
            options={[
              { value: 'pending_review', label: 'Pending review' },
              { value: 'published', label: 'Verified' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'removed', label: 'Taken down' }
            ]}
          />
          <FilterField
            placeholder="City"
            param="city"
            width={230}
            options={cities.map((city) => ({ value: city, label: city }))}
          />
        </FilterBar>

        {error ? (
          <p
            role="alert"
            className="mx-4 rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700 sm:mx-6 lg:mx-8"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(r) => r.id}
            empty="No posts match these filters. Posts from the app land here for review."
            cell={(row, key) => {
              switch (key) {
                case 'content':
                  return (
                    <span className="flex flex-col justify-center gap-[5px]">
                      <span className="line-clamp-2 max-w-[437px] text-sm font-medium leading-5 text-[#2F3037]">
                        {row.title}
                      </span>
                      <span className="flex flex-wrap items-center gap-x-[18px] gap-y-1 text-xs font-normal leading-5 text-gray-500">
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
                    <span className="flex items-center justify-end gap-[21px]">
                      {row.status === 'Pending review' ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => run(() => setContentStatus(row.id, 'published'))}
                          className="text-sm font-medium leading-5 text-success-700 disabled:opacity-50"
                        >
                          Verify
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={opening === row.id}
                        onClick={() => open(row.id)}
                        className="text-sm font-medium leading-5 text-gray-700 disabled:opacity-50"
                      >
                        {opening === row.id ? 'Opening…' : 'View Details'}
                      </button>
                    </span>
                  );
                default:
                  return null;
              }
            }}
          />
          <Pagination label={pageLabel} page={page} pageCount={pageCount} />
        </div>
      </div>

      <ContentModal
        open={detail !== null}
        detail={detail}
        onClose={() => setDetail(null)}
      />
    </Shell>
  );
}
