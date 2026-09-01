'use client';

import { useState } from 'react';
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

type Kyc = 'Approved' | 'Pending' | 'Rejected';

type UserRow = {
  id: string;
  name: string;
  code: string;
  type: string;
  kyc: Kyc;
  city: string;
  active: string;
  credit: string;
};

const KYC_TONE: Record<Kyc, string> = {
  Approved: 'bg-success-50 text-success-700',
  Pending: 'bg-warning-50 text-warning-700',
  Rejected: 'bg-error-50 text-error-700'
};

const mk = (i: number, kyc: Kyc, city: string, active: string): UserRow => ({
  id: `u${i}`,
  name: 'Oluwatomison Jumoke',
  code: 'USR-02728',
  type: 'ID Verified',
  kyc,
  city,
  active,
  credit: '0 credits left'
});

const USERS: UserRow[] = [
  mk(1, 'Approved', 'Lagos', '12 min '),
  mk(2, 'Approved', 'Calabar', 'Jun 24'),
  mk(3, 'Approved', 'Ghana', 'Jun 24'),
  mk(4, 'Pending', 'Ogun', 'Jun 24'),
  mk(5, 'Rejected', 'Abeokuta', 'Jun 24'),
  mk(6, 'Pending', 'Abuja', 'Jun 24'),
  mk(7, 'Pending', 'Abuja', '12 min '),
  mk(8, 'Approved', 'Calabar', '12 min '),
  mk(9, 'Pending', 'Imo', '12 min ')
];

const TABS = [
  { id: 'regular', label: 'Regular Users' },
  { id: 'officials', label: 'Officials & Agency' }
];

export default function UsersPage() {
  const [tab, setTab] = useState('regular');
  const base = useOfficeBase();

  return (
    <Shell title="User details">
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-[10px] px-8 py-[15px]">
            <Tabs tabs={TABS} active={tab} onChange={setTab} />
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
            rows={USERS}
            rowKey={(r) => r.id}
            cell={(row, key) => {
              switch (key) {
                case 'name':
                  return <CellUser initials="OJ" name={row.name} sub={row.code} />;
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
                      href={officeHref(base, tab === 'officials' ? 'users/agency' : 'users/community')}
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
          <Pagination label="Showing&nbsp;1–15&nbsp;of&nbsp;35" />
        </div>
      </div>
    </Shell>
  );
}
