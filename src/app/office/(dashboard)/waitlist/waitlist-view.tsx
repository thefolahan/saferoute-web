'use client';

import Link from 'next/link';
import { Shell } from '../../_components/shell';
import { FilterBar, FilterField } from '../../_components/filter-bar';
import { CellText, DataTable, Pagination, type Column } from '../../_components/table';
import { officeHref, useOfficeBase } from '../../_lib/office-path';

/**
 * Who has asked to be told when SafeRoute launches.
 *
 * `waitlist_signups` has been collecting addresses from seven public pages
 * since the site went up and nothing could read one back — the dashboard did
 * not know anybody had signed up. This is the whole of it.
 *
 * The page a signup came from is kept because it is the only thing that
 * separates the segments: somebody on /enterprise asked for a demo, somebody
 * on /download wants the app, and mailing them the same thing would be wrong
 * for both.
 */

const COLUMNS: Column[] = [
  { key: 'email', label: 'EMAIL', width: 420, pad: 32 },
  { key: 'source', label: 'SIGNED UP FROM', width: 240 },
  { key: 'account', label: 'HAS AN ACCOUNT', width: 260 },
  { key: 'when', label: 'WHEN', width: 270, pad: 32, align: 'right' }
];

/** The public pages, in the words the site uses rather than the slug's. */
const SOURCE_LABEL: Record<string, string> = {
  website: 'Home page',
  enterprise: 'Enterprise',
  'government-officials': 'Government & officials',
  'news-outlets': 'News outlets',
  journalist: 'News outlets (old /journalist link)',
  'coming-soon': 'Coming soon',
  download: 'Download the app',
  'help-center': 'Help centre',
  careers: 'Careers'
};

export type WaitlistRow = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
  account: { id: string; status: string; joinedAt: string } | null;
};

export function WaitlistView({
  rows,
  sources,
  bySource,
  totals,
  page,
  pageCount,
  pageLabel,
  exportHref
}: {
  rows: WaitlistRow[];
  sources: string[];
  bySource: { source: string; count: number }[];
  totals: { all: number; thisWeek: number };
  page: number;
  pageCount: number;
  pageLabel: string;
  exportHref: string;
}) {
  const base = useOfficeBase();

  return (
    <Shell title="Waitlist">
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 px-4 pt-[17px] sm:px-6 lg:px-8">
            <p className="max-w-[760px] text-sm font-normal leading-6 text-gray-500">
              Everyone who has left an address on the public site. Grouped by the
              page they signed up from, because that is the only thing that
              separates somebody asking for a demo from somebody waiting for the
              app.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              <Tile label="Total signups" value={totals.all} />
              <Tile label="In the last 7 days" value={totals.thisWeek} />
              {bySource.slice(0, 3).map((entry) => (
                <Tile
                  key={entry.source}
                  label={SOURCE_LABEL[entry.source] ?? entry.source}
                  value={entry.count}
                />
              ))}
            </div>
          </div>

          <FilterBar>
            <FilterField placeholder="Search by email" param="q" width={360} search />
            <FilterField
              placeholder="Signed up from"
              param="source"
              width={280}
              options={sources.map((source) => ({
                value: source,
                label: SOURCE_LABEL[source] ?? source
              }))}
            />
            {/*
              The addresses, so they can be pasted into whatever sends the
              email. The stored IP hash is never included — it is kept for
              abuse triage and is not a fact that belongs in a mailing list.
            */}
            <a
              href={exportHref}
              className="edge-gray200 flex h-11 shrink-0 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
            >
              Export CSV
            </a>
          </FilterBar>
        </div>

        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(row) => row.id}
            empty="Nobody has joined the waitlist yet."
            cell={(row, key) => {
              switch (key) {
                case 'email':
                  return (
                    <span className="text-sm font-medium leading-5 text-[#2F3037]">
                      {row.email}
                    </span>
                  );
                case 'source':
                  return (
                    <span className="inline-flex items-center justify-center rounded-[5px] bg-[#F2F4F7] px-[11px] py-[7px] text-sm font-medium leading-[18px] text-gray-700">
                      {SOURCE_LABEL[row.source] ?? row.source}
                    </span>
                  );
                case 'account':
                  /*
                    The question the list is for. A waitlist is a list of people
                    still waiting; somebody who signed up and then joined is
                    neither waiting nor worth emailing about the launch.
                  */
                  return row.account ? (
                    <Link
                      href={`${officeHref(base, 'users/community')}?id=${row.account.id}`}
                      className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] text-success-700"
                    >
                      Joined {day(row.account.joinedAt)}
                    </Link>
                  ) : (
                    <CellText>Still waiting</CellText>
                  );
                case 'when':
                  return <CellText>{dateTime(row.createdAt)}</CellText>;
                default:
                  return null;
              }
            }}
          />
          <Pagination label={pageLabel} page={page} pageCount={pageCount} />
        </div>
      </div>
    </Shell>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="edge flex flex-col gap-1 rounded-[10px] bg-[#FCFCFD] px-4 py-3">
      <span className="text-2xl font-bold leading-[29px] text-gray-900">
        {new Intl.NumberFormat('en-NG').format(value)}
      </span>
      <span className="text-xs font-normal leading-4 text-gray-500">{label}</span>
    </div>
  );
}

function dateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function day(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
