'use client';

import { useState } from 'react';
import { Shell } from '../../_components/shell';
import { Tabs } from '../../_components/tabs';
import { RANGES, Select } from '../../_components/ui';
import { DataTable, Pagination, type Column } from '../../_components/table';
import { Avatar } from '../../_components/avatar';
import {
  VerificationModal,
  type VerificationSubject
} from '../../_components/verification-modal';

/* Figma 907:19228 "Verification center".
   Stat tiles 274 wide, then a tabbed table (778/119/127/166 = 1190). */



const COLUMNS: Column[] = [
  { key: 'applicant', label: 'APPLICANT', width: 778, pad: 32 },
  { key: 'status', label: 'STATUS', width: 119 },
  { key: 'submitted', label: 'SUBMITTED', width: 127 },
  { key: 'actions', label: '', width: 166, pad: 32, align: 'right' }
];

export type Applicant =
  | { kind: 'person'; name: string; role: string; city: string }
  | { kind: 'org'; name: string; role: string };

export type VerificationRow = {
  id: string;
  applicant: Applicant;
  status: string;
  submitted: string;
  /** Which tab the row belongs to, so the tabs actually filter. */
  group: 'community' | 'agencies' | 'news';
  subject: VerificationSubject;
};

export type Stat = { label: string; value: string; note: string; color: string };


export function VerificationView({
  stats,
  rows,
  tabs,
  pageLabel
}: {
  stats: Stat[];
  rows: VerificationRow[];
  tabs: { id: string; label: string; count: string }[];
  pageLabel: string;
}) {
  const [tab, setTab] = useState('all');
  const [reviewing, setReviewing] = useState<VerificationSubject | null>(null);

  // Every request is already on the page, so the tabs filter here rather than
  // making a round trip per tab.
  const visible = tab === 'all' ? rows : rows.filter((row) => row.group === tab);

  return (
    <Shell title="Verification center">
      <div className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-[10px] py-[25px] sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="edge flex flex-col gap-[23px] rounded-[15px] px-[19px] py-[23px]"
            >
              <span className="text-sm font-normal leading-[17px] text-gray-700">{s.label}</span>
              <div className="flex flex-col gap-[5px]">
                <span className={`text-2xl font-bold leading-[29px] ${s.color}`}>{s.value}</span>
                <span className="text-xs font-normal leading-[15px] text-gray-500">{s.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-[15px]">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
          {/* Filters on when the ID was submitted, not when the account was made. */}
          <Select
            label="Any date"
            className="shrink-0"
            param="range"
            options={RANGES}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <DataTable
          columns={COLUMNS}
          rows={visible}
          rowKey={(r) => r.id}
          empty="Nothing is waiting on a verification decision."
          cell={(row, key) => {
            switch (key) {
              case 'applicant':
                return row.applicant.kind === 'person' ? (
                  <span className="flex items-center gap-2">
                    <Avatar
                      src={row.subject.avatarUrl}
                      name={row.applicant.name}
                      size={35}
                    />
                    <span className="flex flex-col justify-center gap-[2px]">
                      <span className="text-sm font-semibold leading-5 text-[#2F3037]">
                        {row.applicant.name}
                      </span>
                      <span className="flex gap-[6px] text-xs font-normal leading-5 text-[#767B8C]">
                        <span>{row.applicant.role}</span>
                        <span aria-hidden>•</span>
                        <span>{row.applicant.city}</span>
                      </span>
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {/* An organisation gets a rounded square, not a circle. */}
                    <Avatar
                      src={row.subject.avatarUrl}
                      name={row.applicant.name}
                      size={35}
                      rounded="8px"
                    />
                    <span className="flex flex-col justify-center gap-1">
                      <span className="text-sm font-semibold leading-[17px] text-gray-900">
                        {row.applicant.name}
                      </span>
                      <span className="text-xs font-normal leading-5 text-[#767B8C]">
                        {row.applicant.role}
                      </span>
                    </span>
                  </span>
                );
              case 'status':
                return (
                  <span
                    className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium leading-[18px] ${
                      row.status === 'Rejected'
                        ? 'bg-error-50 text-error-700'
                        : 'bg-warning-50 text-warning-700'
                    }`}
                  >
                    {row.status}
                  </span>
                );
              case 'submitted':
                return (
                  <span className="text-sm font-normal leading-5 text-gray-700">
                    {row.submitted}
                  </span>
                );
              case 'actions':
                return (
                  <button
                    type="button"
                    onClick={() => setReviewing(row.subject)}
                    className="text-sm font-medium leading-5 text-gray-700"
                  >
                    Review
                  </button>
                );
              default:
                return null;
            }
          }}
        />
        {/* The queue endpoint returns its most recent 25 in one page. */}
        <Pagination label={pageLabel} page={1} pageCount={1} />
      </div>

      <VerificationModal
        open={reviewing !== null}
        subject={reviewing}
        onClose={() => setReviewing(null)}
      />
    </Shell>
  );
}

