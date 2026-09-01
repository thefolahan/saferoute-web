'use client';

import { useState } from 'react';
import { Shell } from '../../_components/shell';
import { Tabs } from '../../_components/tabs';
import { Select } from '../../_components/ui';
import { DataTable, Pagination, type Column } from '../../_components/table';
import { PHOTO } from '../../_lib/assets';
import { VerificationModal } from '../../_components/verification-modal';

/* Figma 907:19228 "Verification center".
   Stat tiles 274 wide, then a tabbed table (778/119/127/166 = 1190). */

const STATS = [
  { label: 'Pending Review', value: '167', note: '18 new today', color: 'text-navy' },
  { label: 'Verified', value: '5,022', note: '+142 this month', color: 'text-success-500' },
  { label: 'Needs Attention', value: '14,672', note: 'Requires action', color: 'text-[#FF8D28]' },
  { label: 'Rejected', value: '12,647', note: 'This month', color: 'text-error-600' }
];

const TABS = [
  { id: 'all', label: 'All Request', count: '4' },
  { id: 'community', label: 'Community members', count: '5' },
  { id: 'agencies', label: 'Agencies & organization', count: '10' },
  { id: 'news', label: 'News Outlet', count: '6' }
];

const COLUMNS: Column[] = [
  { key: 'applicant', label: 'APPLICANT', width: 778, pad: 32 },
  { key: 'status', label: 'STATUS', width: 119 },
  { key: 'submitted', label: 'SUBMITTED', width: 127 },
  { key: 'actions', label: '', width: 166, pad: 32, align: 'right' }
];

type Applicant =
  | { kind: 'person'; name: string; role: string; city: string }
  | { kind: 'org'; name: string; role: string };

const ROWS: { id: string; applicant: Applicant }[] = [
  { id: 'v1', applicant: { kind: 'person', name: 'Oluwatomison Jumoke', role: 'Individual', city: 'Lagos' } },
  { id: 'v2', applicant: { kind: 'org', name: 'Federal Road Safety Corps', role: 'Agency' } },
  { id: 'v3', applicant: { kind: 'person', name: 'Oluwatomison Jumoke', role: 'Individual', city: 'Lagos' } },
  { id: 'v4', applicant: { kind: 'org', name: 'Federal Road Safety Corps', role: 'Public safety official' } },
  { id: 'v5', applicant: { kind: 'person', name: 'Oluwatomison Jumoke', role: 'Journalist', city: 'Lagos' } },
  { id: 'v6', applicant: { kind: 'org', name: 'Federal Road Safety Corps', role: 'Agency' } },
  { id: 'v7', applicant: { kind: 'person', name: 'Oluwatomison Jumoke', role: 'Journalist', city: 'Lagos' } },
  { id: 'v8', applicant: { kind: 'person', name: 'Oluwatomison Jumoke', role: 'Individual', city: 'Lagos' } },
  { id: 'v9', applicant: { kind: 'org', name: 'Federal Road Safety Corps', role: 'Agency' } }
];

export default function VerificationPage() {
  const [tab, setTab] = useState('all');
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <Shell title="Verification center">
      <div className="flex flex-col gap-[15px] px-8 py-[19px]">
        <div className="flex gap-[10px] py-[25px]">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="edge flex flex-1 flex-col gap-[23px] rounded-[15px] px-[19px] py-[23px]"
            >
              <span className="text-sm font-normal leading-[17px] text-gray-700">{s.label}</span>
              <div className="flex flex-col gap-[5px]">
                <span className={`text-2xl font-bold leading-[29px] ${s.color}`}>{s.value}</span>
                <span className="text-xs font-normal leading-[15px] text-gray-500">{s.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-[15px]">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
          <Select label="Today" weight="semibold" className="w-[97px] shrink-0" />
        </div>
      </div>

      <div className="flex flex-col">
        <DataTable
          columns={COLUMNS}
          rows={ROWS}
          rowKey={(r) => r.id}
          cell={(row, key) => {
            switch (key) {
              case 'applicant':
                return row.applicant.kind === 'person' ? (
                  <span className="flex items-center gap-2">
                    <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-[18px] bg-gray-100 text-base font-semibold leading-[22px] text-[#2F3037]">
                      OJ
                    </span>
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTO.incident}
                      alt=""
                      className="h-8 w-[35px] shrink-0 rounded-[47px] object-cover"
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
                  <span className="inline-flex items-center justify-center rounded-2xl bg-warning-50 px-3 py-1 text-xs font-medium leading-[18px] text-warning-700">
                    Pending
                  </span>
                );
              case 'submitted':
                return (
                  <span className="text-sm font-normal leading-5 text-gray-700">Aug 7, 2026</span>
                );
              case 'actions':
                return (
                  <button
                    type="button"
                    onClick={() => setReviewOpen(true)}
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
        <Pagination label="Showing&nbsp;1–15&nbsp;of&nbsp;35" />
      </div>

      <VerificationModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </Shell>
  );
}
