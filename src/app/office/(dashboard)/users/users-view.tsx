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

/** `Not required` is the state the design has no chip for — most accounts. */
export type Kyc = 'Approved' | 'Pending' | 'Rejected' | 'Not required';

export type UserRow = {
  id: string;
  name: string;
  avatarUrl: string | null;
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
  Rejected: 'bg-error-50 text-error-700',
  'Not required': 'bg-rule text-gray-600'
};

const TABS = [
  { id: 'regular', label: 'Regular Users' },
  { id: 'officials', label: 'Officials & Agency' }
];

export function UsersView({
  rows,
  tab,
  cities,
  page,
  pageCount,
  pageLabel
}: {
  rows: UserRow[];
  tab: string;
  /** The cities that actually have users, for the City filter. */
  cities: string[];
  page: number;
  pageCount: number;
  pageLabel: string;
}) {
  const base = useOfficeBase();
  const router = useRouter();

  return (
    <Shell title="User details">
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-[10px] overflow-x-auto px-4 py-[15px] sm:px-6 lg:px-8">
            <Tabs
              tabs={TABS}
              active={tab}
              onChange={(next) => router.push(`${officeHref(base, 'users')}?tab=${next}`)}
            />
          </div>

          {/* Bound to the same parameters /admin/users reads. */}
          <FilterBar>
            <FilterField placeholder="Search users" param="q" width={406} search />
            <FilterField
              placeholder="Type"
              param="type"
              width={230}
              options={[
                { value: 'community', label: 'Community' },
                { value: 'official', label: 'Official' },
                { value: 'news_outlet', label: 'News Outlet' }
              ]}
            />
            <FilterField
              placeholder="Status"
              param="status"
              width={230}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'deleted', label: 'Deleted' }
              ]}
            />
            <FilterField
              placeholder="City"
              param="city"
              width={230}
              options={cities.map((city) => ({ value: city, label: city }))}
            />
          </FilterBar>
        </div>

        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(r) => r.id}
            empty="No accounts match these filters."
            cell={(row, key) => {
              switch (key) {
                case 'name':
                  return (
                    <CellUser
                      name={row.name}
                      sub={row.code}
                      avatarUrl={row.avatarUrl}
                    />
                  );
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
          <Pagination label={pageLabel} page={page} pageCount={pageCount} />
        </div>
      </div>
    </Shell>
  );
}
