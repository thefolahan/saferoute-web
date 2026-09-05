'use client';

import { useMemo, useState } from 'react';
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
import { ComposeField, ComposeModal } from '../../_components/compose-modal';
import { useAction } from '../../_components/use-action';
import { bulkNotify, bulkUserStatus } from '../../_lib/actions';

/* Figma 907:14078 "Users" / 907:14388 (Officials & Agency tab).
   Column widths 300/142/129/136/133/153/197 sum to the 1190 content area. */

/**
 * The two tabs are two different tables in the design, not one table filtered.
 *
 * Regular users (907:14078) is about the person — type, KYC, city. Officials
 * (907:14388) is about the organisation — its jurisdiction and how many
 * officials are registered under it. Both column sets sum to the 1190 content
 * area, which is what keeps them aligned with the rest of the dashboard.
 */
const REGULAR_COLUMNS: Column[] = [
  { key: 'name', label: 'NAME', width: 268, pad: 32 },
  { key: 'type', label: 'TYPE', width: 130 },
  { key: 'kyc', label: 'KYC STATUS', width: 122 },
  { key: 'city', label: 'CITY', width: 120 },
  /*
    Strikes was not on the designer's table and belongs there: it is the one
    column that says "look at this account", and finding it otherwise means
    opening every detail page in turn. Ten closes an account automatically.
  */
  { key: 'strikes', label: 'STRIKES', width: 96 },
  { key: 'active', label: 'LAST ACTIVE', width: 126 },
  { key: 'credit', label: 'ACCOUNT', width: 140 },
  { key: 'actions', label: '', width: 188, pad: 32, align: 'right' }
];

const OFFICIAL_COLUMNS: Column[] = [
  { key: 'name', label: 'OFFICIALS/ AGENCY', width: 313, pad: 32 },
  { key: 'type', label: 'VERIFICATION', width: 138 },
  { key: 'registered', label: 'REGISTERED OFFICIALS', width: 186, align: 'right' },
  { key: 'jurisdiction', label: 'JURISDICTION', width: 147 },
  { key: 'status', label: 'STATUS', width: 128 },
  { key: 'active', label: 'LAST ACTIVE', width: 133 },
  { key: 'actions', label: '', width: 145, pad: 32, align: 'right' }
];

/** `Not required` is the state the design has no chip for — most accounts. */
export type Kyc = 'Approved' | 'Pending' | 'Rejected' | 'Not required';

export type UserRow = {
  id: string;
  name: string;
  avatarUrl: string | null;
  code: string;
  /** Officials tab only. */
  jurisdiction: string;
  status: string;
  type: string;
  kyc: Kyc;
  city: string;
  active: string;
  credit: string;
  /** Lifetime reports declined at moderation. Ten is an automatic ban. */
  strikes: number;
  /** A seeded demonstration row rather than a person. */
  seeded: boolean;
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
  pageLabel,
  exportHref
}: {
  rows: UserRow[];
  tab: string;
  /** The cities that actually have users, for the City filter. */
  cities: string[];
  page: number;
  pageCount: number;
  pageLabel: string;
  /** The CSV of exactly this filter, proxied so the session stays httpOnly. */
  exportHref: string;
}) {
  const base = useOfficeBase();
  const router = useRouter();
  const { pending, error, run } = useAction();

  /**
   * The selection is page-local on purpose.
   *
   * Carrying it across pages would mean a "Suspend 40 accounts" button whose
   * 40 the moderator can no longer see — and the one they would want to check
   * is always the one three pages back.
   */
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sheet, setSheet] = useState<'message' | 'warning' | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const ids = useMemo(() => [...selected], [selected]);
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((current) =>
      rows.every((row) => current.has(row.id))
        ? new Set()
        : new Set(rows.map((row) => row.id))
    );
  }

  function clear() {
    setSelected(new Set());
    setSheet(null);
  }

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
            <FilterField
              placeholder="Verification"
              param="verification"
              width={200}
              options={[
                { value: 'unverified', label: 'Unverified' },
                { value: 'phone_verified', label: 'Phone verified' },
                { value: 'id_verified', label: 'ID verified' },
                { value: 'trusted', label: 'Trusted' }
              ]}
            />
            <FilterField
              placeholder="KYC"
              param="kyc"
              width={180}
              options={[
                { value: 'not_required', label: 'Not required' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
            />
            {/*
              Seeded accounts are simulated activity, not people. A user count
              that silently includes them is not a user count, so the table can
              be asked to leave them out — or to show only them.
            */}
            <FilterField
              placeholder="Seeded accounts"
              param="seeded"
              width={200}
              options={[
                { value: 'exclude', label: 'Real accounts only' },
                { value: 'only', label: 'Seeded only' }
              ]}
            />
            <FilterField
              placeholder="Sort by"
              param="sort"
              width={180}
              options={[
                { value: 'created', label: 'Newest' },
                { value: 'active', label: 'Last active' },
                { value: 'trust', label: 'Trust score' },
                { value: 'reports', label: 'Most reports' },
                { value: 'name', label: 'Name' }
              ]}
            />
            {/*
              Downloads the filtered set, not the page. Through the site rather
              than straight at the API: the admin session is an httpOnly cookie
              and the API wants a bearer token.
            */}
            <a
              href={exportHref}
              className="edge-gray200 flex h-11 shrink-0 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-700"
            >
              Export CSV
            </a>
          </FilterBar>
        </div>

        {selected.size > 0 ? (
          <div className="mx-4 flex flex-col gap-3 rounded-[10px] bg-[#F9FAFB] px-5 py-4 sm:mx-6 sm:flex-row sm:items-center lg:mx-8">
            <span className="flex-1 text-sm font-medium leading-5 text-gray-700">
              {selected.size} account{selected.size === 1 ? '' : 's'} selected
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubject('');
                  setBody('');
                  setSheet('message');
                }}
                className="edge-gray200 flex h-10 items-center rounded-lg bg-white px-[14px] text-sm font-medium leading-5 text-gray-700"
              >
                Send message
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => bulkUserStatus(ids, 'suspended'), clear)}
                className="flex h-10 items-center rounded-lg bg-error-400 px-[14px] text-sm font-medium leading-5 text-gray-50 disabled:opacity-50"
              >
                Suspend
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => bulkUserStatus(ids, 'active'), clear)}
                className="flex h-10 items-center rounded-lg bg-success-800 px-[14px] text-sm font-medium leading-5 text-gray-25 disabled:opacity-50"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={clear}
                className="flex h-10 items-center px-2 text-sm font-medium leading-5 text-gray-500"
              >
                Clear
              </button>
            </div>
          </div>
        ) : null}

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
            columns={tab === 'officials' ? OFFICIAL_COLUMNS : REGULAR_COLUMNS}
            rows={rows}
            rowKey={(r) => r.id}
            selection={{
              selected,
              onToggle: toggle,
              onToggleAll: toggleAll,
              allSelected
            }}
            empty="No accounts match these filters."
            cell={(row, key) => {
              switch (key) {
                case 'name':
                  return (
                    <CellUser
                      name={row.name}
                      sub={row.seeded ? `${row.code} · seeded` : row.code}
                      avatarUrl={row.avatarUrl}
                    />
                  );
                case 'strikes':
                  return row.strikes === 0 ? (
                    <CellText>—</CellText>
                  ) : (
                    <span
                      className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-semibold leading-4 ${
                        row.strikes >= 7
                          ? 'bg-error-50 text-error-700'
                          : 'bg-warning-50 text-warning-700'
                      }`}
                    >
                      {row.strikes} / 10
                    </span>
                  );
                case 'type':
                  return <CellChip>{row.type}</CellChip>;
                case 'kyc':
                  return (
                    <span
                      className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium leading-4 ${KYC_TONE[row.kyc]}`}
                    >
                      {row.kyc}
                    </span>
                  );
                case 'city':
                  return <CellText>{row.city}</CellText>;
                case 'jurisdiction':
                  return <CellText>{row.jurisdiction}</CellText>;
                case 'status':
                  return (
                    <span
                      className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium capitalize leading-4 ${
                        row.status === 'active'
                          ? 'bg-success-50 text-success-700'
                          : 'bg-rule text-gray-600'
                      }`}
                    >
                      {row.status}
                    </span>
                  );
                case 'registered':
                  /*
                    The design counts officials registered under an agency.
                    Nothing links a person to an organisation in the schema —
                    `organization_name` is a free-text field on the account
                    itself — so there is no count to make.
                  */
                  return <CellText>—</CellText>;
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

      {/*
        One message to everyone selected. Seeded demonstration accounts and
        deleted ones are dropped by the API rather than here — the count that
        comes back is what actually went out.
      */}
      <ComposeModal
        open={sheet !== null}
        onClose={() => setSheet(null)}
        title={`Message ${selected.size} account${selected.size === 1 ? '' : 's'}`}
        subtitle="Delivered to their SafeRoute notifications, and pushed where push is available. They cannot reply to it."
        width={587}
        gradient
        cta="Send"
        pending={pending}
        error={error}
        disabled={!subject.trim() || !body.trim()}
        onSubmit={() =>
          run(
            () =>
              bulkNotify(ids, {
                title: subject,
                body,
                kind: sheet ?? 'message'
              }),
            clear
          )
        }
      >
        <ComposeField
          label="Subject"
          placeholder="eg. important safety update"
          height={52}
          labelWidth={52}
          gutter={79}
          value={subject}
          onChange={setSubject}
        />
        <ComposeField
          label="Message"
          placeholder="Write your message...."
          height={165}
          labelWidth={62}
          gutter={71}
          value={body}
          onChange={setBody}
        />
      </ComposeModal>
    </Shell>
  );
}
