'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { officeHref, useOfficeBase } from '../../_lib/office-path';
import { Shell } from '../../_components/shell';
import { Tabs } from '../../_components/tabs';
import { FilterBar, FilterField } from '../../_components/filter-bar';
import {
  CellChip,
  CellText,
  CellUser,
  DataTable,
  Pagination,
  type Column
} from '../../_components/table';

/* Figma 907:14078 "Users" / 907:14388 (Officials & Agency tab).
   Column widths 300/142/129/136/133/153/197 sum to the 1190 content area. */

const COLUMNS: Column[] = [
  { key: 'name', label: 'NAME', width: 300, pad: 32 },
  { key: 'type', label: 'TYPE', width: 142 },
  { key: 'kyc', label: 'KYC STATUS', width: 129 },
  { key: 'city', label: 'CITY', width: 136 },
  { key: 'active', label: 'LAST ACTIVE', width: 133 },
  { key: 'credit', label: 'CREDIT USUAGE', width: 153 },
  { key: 'actions', label: '', width: 197, pad: 32, align: 'right' }
];

export type Kyc = 'Approved' | 'Pending' | 'Rejected';

export type UserRow = {
  id: string;
  name: string;
  code: string;
  type: string;
  kyc: Kyc;
  city: string;
  active: string;
  credit: string;
  detailHref: string;
};

const KYC_TONE: Record<Kyc, string> = {
  Approved: 'bg-success-50 text-success-700',
  Pending: 'bg-warning-50 text-warning-700',
  Rejected: 'bg-error-50 text-error-700'
};

const TABS = [
  { id: 'regular', label: 'Regular Users' },
  { id: 'officials', label: 'Officials & Agency' }
];

export function UsersView({
  rows,
  tab,
  pageLabel
}: {
  rows: UserRow[];
  tab: string;
  pageLabel: string;
}) {
  const base = useOfficeBase();
  const router = useRouter();

  return (
    <Shell title="User details">
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-[10px] px-8 py-[15px]">
            <Tabs
              tabs={TABS}
              active={tab}
              onChange={(next) => router.push(`${officeHref(base, 'users')}?tab=${next}`)}
            />
          </div>

          <FilterBar>
            <FilterField placeholder="Search users" width={406} search />
            <FilterField placeholder="Type" width={230} />
            <FilterField placeholder="Status" width={230} />
            <FilterField placeholder="City" width={230} />
          </FilterBar>
        </div>

        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(r) => r.id}
            cell={(row, key) => {
              switch (key) {
                case 'name':
                  return <CellUser initials={initials(row.name)} name={row.name} sub={row.code} />;
                case 'type':
                  return <CellChip>{row.type}</CellChip>;
                case 'kyc':
                  return (
                    <span
                      className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium leading-[18px] ${KYC_TONE[row.kyc]}`}
                    >
                      {row.kyc}
                    </span>
                  );
                case 'city':
                  return <CellText>{row.city}</CellText>;
                case 'active':
                  return <CellText>{row.active}</CellText>;
                case 'credit':
                  return <CellText>{row.credit}</CellText>;
                case 'actions':
                  return (
                    <Link
                      href={row.detailHref}
                      className="text-sm font-medium leading-5 text-gray-700"
                    >
                      View Details
                    </Link>
                  );
                default:
                  return null;
              }
            }}
          />
          <Pagination label={pageLabel} />
        </div>
      </div>
    </Shell>
  );
}

/** Two letters from a display name, for the table's avatar circle. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0] ?? '');
  return (letters.join('') || '?').toUpperCase();
}
