'use client';

import { useState, type ReactNode } from 'react';
import { Shell } from './shell';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageIcon, ShieldOutlineIcon, UserGroupIcon } from './icons';
import { ArrowRightIcon } from './ui';
import Link from 'next/link';
import { ComposeField, ComposeModal } from './compose-modal';
import { officeHref, useOfficeBase } from '../_lib/office-path';
import { Avatar } from './avatar';
import { useAction } from './use-action';
import { notifyUser, revokeUserSessions, setUserStatus } from '../_lib/actions';

/* Figma 907:14716 (agency) and 907:15289 (community member) — one detail
   screen with two subject types and a tab strip whose set differs per type.
   Hero card 1119x198 pad 10 radius 15, stat row 103 tall, tabs 49 tall. */

export type Stat = { value: string; label: string };

export type DetailSubject = {
  id: string;
  breadcrumb: string[];
  idLabel: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  /** `active`, `suspended` or `deleted`, straight from the account. */
  status: string;
  kind: string;
  score: string;
  avatar: 'agency' | 'person';
  /** Only agencies carry the blue "Official" badge (Figma 907:14750). */
  official: boolean;
  /** Gauge palette: Success/500 on a #ECFDF3 track, or #FFCD71 on #FFF7E8. */
  gauge: 'green' | 'amber';
  /** The band the score falls in, and where they sit against everyone else. */
  scoreBand: string | null;
  scoreNote: string | null;
  stats: Stat[];
  tabs: { id: string; label: string }[];
};

export function UserDetail({
  subject,
  activeTab,
  panel
}: {
  subject: DetailSubject;
  /** Which tab the URL asks for; the page has already fetched only its data. */
  activeTab: string;
  panel: ReactNode;
}) {
  const { pending, error, run } = useAction();
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * The tab is a link, not local state.
   *
   * Each tab is a different query against the API, and the fetch happens in
   * the server page — so a tab held in `useState` could only ever show data
   * the page had already loaded, which is why every tab but the first was
   * either empty or a repeat. Putting it in the URL also means a tab can be
   * linked to and survives a refresh. Same shape as the `?id` fix on the
   * detail panels; see the note in the office write-up.
   */
  function tabHref(id: string) {
    const next = new URLSearchParams(params.toString());
    next.set('tab', id);
    return `${pathname}?${next.toString()}`;
  }

  /** One sheet, two purposes — the design draws the same form for both. */
  const [compose, setCompose] = useState<'message' | 'warning' | null>(null);
  const [subjectLine, setSubjectLine] = useState('');
  const [body, setBody] = useState('');

  const suspended = subject.status === 'suspended';
  /** Confirmation for the two actions that are not one click's worth of harm. */
  const [confirm, setConfirm] = useState<'revoke' | null>(null);

  function openCompose(kind: 'message' | 'warning') {
    setSubjectLine(kind === 'warning' ? 'A warning about your SafeRoute account' : '');
    setBody('');
    setCompose(kind);
  }

  return (
    <Shell title="User details">
      <div className="flex px-4 sm:px-6 lg:pl-8 lg:pr-0">
        <div className="flex min-w-0 flex-1 flex-col gap-[34px] pt-[17px] lg:pr-[39px]">
          <div className="flex flex-col gap-[25px]">
            <nav className="flex flex-wrap items-center gap-2 text-base leading-6">
              {subject.breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 ? <ArrowRightIcon className="h-4 w-4 text-gray-400" /> : null}
                  <span
                    className={
                      i === subject.breadcrumb.length - 1
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-500'
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>

            <div className="flex flex-col gap-[10px]">
              {/* Hero card */}
              <div className="edge flex flex-col items-center gap-[23px] rounded-[15px] p-[10px] xl:flex-row">
                <div className="flex h-[178px] w-[188px] shrink-0 items-center justify-center rounded-lg p-[10px] shadow-[inset_0_0_0_1px_rgba(238,238,238,0.65)]">
                  <Avatar
                    src={subject.avatarUrl}
                    name={subject.name}
                    size={158}
                    rounded={subject.avatar === 'agency' ? '8px' : '50%'}
                  />
                </div>

                <div className="flex w-full flex-col justify-center gap-[25px] xl:w-[577px] xl:shrink-0">
                  <div className="flex flex-col justify-center gap-[9px]">
                    <span className="text-sm font-medium leading-[17px] text-gray-500">
                      {subject.idLabel}
                    </span>
                    <h2 className="text-2xl font-semibold leading-[29px] text-black">
                      {subject.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-[9px]">
                      {subject.official ? (
                        <span className="inline-flex items-center justify-center rounded-[5px] bg-[#F2F4F7] px-[11px] py-[7px] text-sm font-medium leading-[17px] text-gray-500">
                          {subject.kind}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-rule px-3 py-1">
                          <UserGroupIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium leading-5 tracking-[-0.28px] text-gray-500">
                            {subject.kind}
                          </span>
                        </span>
                      )}
                      {subject.official ? (
                        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-[#0BA5EC]/[0.13] px-3 py-1">
                          <ShieldOutlineIcon className="h-4 w-4 text-[#0BA5EC]" />
                          <span className="text-xs font-medium leading-5 tracking-[-0.24px] text-[#0BA5EC]">
                            Official
                          </span>
                        </span>
                      ) : null}
                      <span
                        className={`inline-flex items-center rounded-2xl py-1 pl-[9px] pr-3 text-xs font-semibold capitalize leading-[18px] ${
                          subject.status === 'active'
                            ? 'bg-success-50 text-success-700'
                            : 'bg-error-50 text-error-700'
                        }`}
                      >
                        {subject.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-[13px]">
                      <button
                        type="button"
                        onClick={() => openCompose('message')}
                        className="edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
                      >
                        <MessageIcon className="h-4 w-4 text-gray-700" />
                        Send Message
                      </button>
                      <button
                        type="button"
                        onClick={() => openCompose('warning')}
                        className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
                      >
                        Send a warning
                      </button>
                      {/*
                        Ends every session on every phone. Separate from
                        suspending: a stolen handset needs the sessions gone
                        and the account left working, and a compromised account
                        needs both — so they are two buttons, not one.
                      */}
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirm('revoke')}
                        className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700 disabled:opacity-50"
                      >
                        Sign out everywhere
                      </button>
                      {/*
                        The whole record as JSON. Proxied through the site so
                        the admin session stays an httpOnly cookie — the API
                        wants a bearer token the browser must never hold.
                      */}
                      <a
                        href={`/api/office/users/${subject.id}/export`}
                        className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
                      >
                        Export record
                      </a>
                      <button
                        type="button"
                        disabled={pending || subject.status === 'deleted'}
                        onClick={() =>
                          run(() =>
                            setUserStatus(
                              subject.id,
                              suspended ? 'active' : 'suspended'
                            )
                          )
                        }
                        className={`flex h-11 items-center rounded-lg px-[14px] py-[10px] text-sm font-medium leading-6 disabled:opacity-50 ${
                          suspended
                            ? 'bg-success-800 text-gray-25'
                            : 'bg-error-400 text-gray-50'
                        }`}
                      >
                        {suspended ? 'Restore access' : 'Suspend User'}
                      </button>
                    </div>

                    {error ? (
                      <p
                        role="alert"
                        className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
                      >
                        {error}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex w-[171px] shrink-0 flex-col items-center justify-center">
                  <div className="relative flex h-[83px] w-[171px] items-end justify-center">
                    <Gauge tone={subject.gauge} />
                    <span className="relative pb-1 text-[26px] font-medium leading-8 tracking-[-1.3px] text-[#131313]">
                      {subject.score}
                    </span>
                  </div>
                  {/*
                    The band and the percentile are this account's own —
                    `users.trust_score` and TrustBreakdownService.topPercentile,
                    both of which existed while this printed a fixed
                    "Excellent / Top 5% of SafeRoute users" over an em dash.
                  */}
                  <div className="flex flex-col items-center justify-center gap-[6px] text-center">
                    {subject.scoreBand ? (
                      <span
                        className={`rounded-[20px] px-4 py-2 text-xs font-bold uppercase leading-[15px] ${
                          subject.gauge === 'green'
                            ? 'bg-[#E8F5E9] text-[#4CAF50]'
                            : 'bg-[#FFF7E8] text-[#B54708]'
                        }`}
                      >
                        {subject.scoreBand}
                      </span>
                    ) : null}
                    {subject.scoreNote ? (
                      <span className="text-xs font-normal leading-[15px] text-[#9CA3AF]">
                        {subject.scoreNote}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-2 gap-3 py-[11px] md:grid-cols-3 xl:grid-cols-6">
                {subject.stats.map((s) => (
                  <div
                    key={s.label}
                    className="edge flex flex-col items-center justify-center gap-1 rounded-[10px] bg-[#FCFCFD] px-4 py-[14px]"
                  >
                    <span className="text-2xl font-bold leading-[29px] text-gray-900">
                      {s.value}
                    </span>
                    <span className="text-sm font-normal leading-[17px] text-gray-500">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[18px] pb-10">
            <div className="edge-bottom flex max-w-full items-center overflow-x-auto">
              {subject.tabs.map((t) => (
                <Link
                  key={t.id}
                  href={tabHref(t.id)}
                  scroll={false}
                  className={`flex h-[49px] shrink-0 items-center justify-center px-[22px] text-base font-semibold leading-[19px] ${
                    t.id === activeTab
                      ? 'text-black shadow-[inset_0_-3px_0_0_#000000]'
                      : 'text-gray-600'
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </div>

            {panel}
          </div>
        </div>
      </div>

      {/*
        Signing an account out is not undoable from here — the person has to
        sign in again on every device — so it asks first, and says how many
        sessions it will end where the API has told us.
      */}
      <ComposeModal
        open={confirm === 'revoke'}
        onClose={() => setConfirm(null)}
        title="Sign out everywhere"
        subtitle={`Ends every active session on ${subject.name}'s devices. They stay signed up and can sign in again; anyone holding a stolen phone cannot.`}
        width={520}
        cta="Sign out everywhere"
        pending={pending}
        error={error}
        onSubmit={() =>
          run(
            () => revokeUserSessions(subject.id),
            () => setConfirm(null)
          )
        }
      >
        <span className="sr-only">No further input is needed.</span>
      </ComposeModal>

      {/* Figma 907:16106 "Send message", reused for the warning */}
      <ComposeModal
        open={compose !== null}
        onClose={() => setCompose(null)}
        title={compose === 'warning' ? 'Send a warning' : 'Send message'}
        subtitle={
          compose === 'warning'
            ? 'A formal warning, recorded against this account.'
            : 'Send a quick message to SafeRoute users.'
        }
        width={587}
        gradient
        cta={compose === 'warning' ? 'Send warning' : 'Send message'}
        pending={pending}
        error={error}
        disabled={!subjectLine.trim() || !body.trim()}
        onSubmit={() =>
          run(
            () =>
              notifyUser(subject.id, {
                title: subjectLine,
                body,
                kind: compose ?? 'message'
              }),
            () => setCompose(null)
          )
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-[77px]">
          <span className="w-[57px] shrink-0 text-sm font-medium leading-[17px] tracking-[0.14px] text-gray-700">
            Send to:
          </span>
          <div className="flex items-center gap-[7px]">
            <Avatar src={subject.avatarUrl} name={subject.name} size={76} />
            <span className="flex flex-col gap-[3px]">
              <span className="text-base font-semibold leading-[19px] text-gray-900">
                {subject.name}
              </span>
              <span className="text-sm font-normal leading-[17px] text-gray-600">
                {subject.email ?? 'No email on this account'}
              </span>
            </span>
          </div>
        </div>

        <ComposeField
          label="Subject"
          placeholder="eg. important safety update"
          height={52}
          labelWidth={52}
          gutter={79}
          value={subjectLine}
          onChange={setSubjectLine}
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

        {/*
          It arrives as a notification, not a chat message — an admin has no
          user account to send a direct message from. Said here so nobody
          expects a reply thread.
        */}
        <p className="text-xs font-normal leading-[15px] text-gray-500">
          Delivered to their SafeRoute notifications, and pushed to their phone
          where push is available. They cannot reply to it.
        </p>
      </ComposeModal>
    </Shell>
  );
}

/* Figma 907:14775 (agency) / 907:15345 (community) — a 171x83 half-donut with
   a 13px ring, drawn as two arcs rather than the exported art (which bakes the
   percentage in as text).

   NOTE: the designer drew BOTH gauges with the same 143deg sweep — 79.4% of the
   half circle — even though one reads 94% and the other 84%, so the arc does
   not track the number. `sweep` reproduces the file exactly; pass
   `parseFloat(score) / 100` to make it follow the score instead.

   Caps match the file: the track is flat at both ends, and the value arc's
   start cap is clipped flat by the viewBox while its end stays round. */
function Gauge({
  tone,
  sweep = 0.794
}: {
  tone: 'green' | 'amber';
  sweep?: number;
}) {
  const track = tone === 'green' ? '#ECFDF3' : '#FFF7E8';
  const fill = tone === 'green' ? '#17B26A' : '#FFCD71';
  const len = Math.PI * 79;
  const d = 'M 6.5 83 A 79 79 0 0 1 164.5 83';

  return (
    <svg
      className="absolute inset-0"
      width={171}
      height={83}
      viewBox="0 0 171 83"
      fill="none"
      aria-hidden
    >
      <path d={d} stroke={track} strokeWidth={13} strokeLinecap="butt" />
      <path
        d={d}
        stroke={fill}
        strokeWidth={13}
        strokeLinecap="round"
        strokeDasharray={`${len * Math.min(1, Math.max(0, sweep))} ${len}`}
      />
    </svg>
  );
}

/* ------------------------------ panels ------------------------------ */

/** "Agency Information" / "Personal information" — label 180 + value rows. */
export function InfoPanel({
  title,
  rows
}: {
  title: string;
  rows: { label: string; value: string; reveal?: boolean }[];
}) {
  return (
    <div className="flex w-full max-w-[504px] flex-col gap-5">
      <h3 className="text-lg font-semibold leading-[22px] text-black">{title}</h3>
      <div className="flex flex-col gap-5 py-[10px]">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-[85px]">
            <span className="w-full text-base sm:w-[175px] sm:shrink-0 font-normal leading-[19px] text-black/50">
              {r.label}
            </span>
            <span className="flex items-center gap-3 text-base font-normal leading-[19px] text-black">
              {r.value}
              {/*
                The design pairs a lock with a "Reveal" link, implying the
                value is masked until asked for. It is not — the API returns
                it and it is printed right there — so a Reveal button would do
                nothing. The lock alone marks the field as sensitive, which is
                what it actually is.
              */}
              {r.reveal ? <LockGlyph /> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LockGlyph() {
  return (
    <svg width={14} height={16} viewBox="0 0 14 16" fill="none" aria-hidden>
      <rect x="1" y="6.5" width="12" height="8.5" rx="2" stroke="#9CA3AF" strokeWidth="1.4" />
      <path d="M3.8 6.5V4.4a3.2 3.2 0 0 1 6.4 0v2.1" stroke="#9CA3AF" strokeWidth="1.4" />
    </svg>
  );
}

export type ReportItem = {
  /** The incident this report is about, so the row can open it. */
  id: string;
  title: string;
  place: string;
  when: string;
  body: string;
  verifications: string;
};

export function ReportsPanel({ count, items }: { count: string; items: ReportItem[] }) {
  const base = useOfficeBase();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold leading-[22px] text-black">Reports</h3>
        <span className="text-sm font-semibold leading-5 text-[#0BA5EC]">{count}</span>
      </div>

      <div className="flex max-w-[900px] flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-sm leading-6 text-gray-500">
            This account has not submitted a report.
          </p>
        ) : null}
        {items.map((r, i) => (
          <div key={i} className="edge flex flex-col gap-2 rounded-[10px] px-5 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[15px] font-semibold leading-5 text-gray-900">{r.title}</span>
              <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] text-success-700">
                Active
              </span>
              <span className="text-xs font-medium leading-[18px] text-gray-600">{r.place}</span>
              <span className="text-[11px] font-normal leading-4 text-gray-500">{r.when}</span>
            </div>
            <p className="text-[13px] font-normal leading-[18px] text-gray-500">{r.body}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium leading-[18px] text-gray-500">
                {r.verifications}
              </span>
              <Link
                href={`${officeHref(base, 'incidents')}?id=${r.id}`}
                className="text-[13px] font-semibold leading-[18px] text-secondary"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type SubscriptionData = {
  planId: string;
  status: string;
  priceMinor: number;
  currency: string;
  startedAt: string;
  currentPeriodEnd: string;
  provider: string;
} | null;

export function SubscriptionPanel({
  subscription
}: {
  subscription: SubscriptionData;
}) {
  if (!subscription) {
    return (
      <div className="flex w-[504px] max-w-full flex-col gap-5">
        <h3 className="text-lg font-semibold leading-[27px] text-[#232323]">
          Subscription Status
        </h3>
        <p className="text-sm leading-6 text-gray-500">
          This account is on the free tier — no subscription on record.
        </p>
      </div>
    );
  }

  const money = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: subscription.currency,
    maximumFractionDigits: 0
  }).format(subscription.priceMinor / 100);

  const day = (iso: string) =>
    new Date(iso).toLocaleDateString('en', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

  const rows: { label: string; value: string; badge?: boolean }[] = [
    { label: 'Plan Name:', value: subscription.planId },
    { label: 'Status:', value: subscription.status, badge: true },
    { label: 'Cost: ', value: money },
    { label: 'Payment method: ', value: subscription.provider },
    { label: 'Start date', value: day(subscription.startedAt) },
    { label: 'Next Billing Date:  ', value: day(subscription.currentPeriodEnd) }
  ];

  return (
    <div className="flex w-full max-w-[504px] flex-col gap-5">
      <h3 className="text-lg font-semibold leading-[27px] text-[#232323]">Subscription Status</h3>
      <div className="flex flex-col gap-5 py-[10px]">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-[85px]">
            <span className="w-full text-sm sm:w-[175px] sm:shrink-0 font-normal leading-[17px] text-[#64748B]">
              {r.label}
            </span>
            {r.badge ? (
              <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] text-success-700">
                {r.value}
              </span>
            ) : (
              <span className="text-base font-normal leading-6 text-black">{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LocationPanel({
  city,
  lastActiveAt,
  latitude = null,
  longitude = null
}: {
  city: string | null;
  lastActiveAt: string | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  const base = useOfficeBase();

  return (
    <div className="flex w-full max-w-[504px] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-medium leading-[19px] text-black">Last Known location</h3>
          <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] text-success-700">
            Active
          </span>
        </div>
        <span className="text-sm font-normal leading-[17px] text-[#64748B]">
          {city ?? 'No location on record'}
        </span>
        <span className="text-sm font-normal leading-[17px] text-[#64748B]">
          {lastActiveAt
            ? `Updated ${new Date(lastActiveAt).toLocaleString('en', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}`
            : 'Never seen'}
        </span>
      </div>
      {latitude !== null && longitude !== null ? (
        <Link
          href={`${officeHref(base, 'map')}?lat=${latitude}&lng=${longitude}`}
          className="edge-gray200 flex h-11 w-fit items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
        >
          View on map
        </Link>
      ) : (
        // Nothing on the account carries a coordinate, so there is no point to
        // open. Said rather than offering a button that goes nowhere.
        <span className="text-sm font-normal leading-6 text-gray-500">
          No location recorded for this account.
        </span>
      )}
    </div>
  );
}

export function ActivityPanel({
  groups
}: {
  groups: { day: string; items: { title: string; body: string; time: string }[] }[];
}) {
  return (
    <div className="flex w-full max-w-[700px] flex-col gap-5">
      <h3 className="text-lg font-semibold leading-[22px] text-black">Activity</h3>
      {groups.length === 0 ? (
        <p className="text-sm leading-6 text-gray-500">
          No activity feed yet — this needs an activity log the API does not
          keep.
        </p>
      ) : null}
      {groups.map((g) => (
        <div key={g.day} className="flex flex-col gap-5 py-[10px]">
          <span className="text-sm font-medium leading-[17px] text-gray-600">{g.day}</span>
          {g.items.map((it, i) => (
            <div key={i} className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-base font-normal leading-[19px] text-black">{it.title}</span>
                <span className="text-sm font-normal leading-[17px] text-gray-500">{it.body}</span>
              </div>
              <span className="shrink-0 text-sm font-normal leading-[17px] text-gray-500">
                {it.time}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ContactsPanel({
  contacts
}: {
  contacts: { name: string; phone: string; relation: string }[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-semibold leading-[22px] text-black">Emergency contacts</h3>
      {contacts.length === 0 ? (
        <p className="text-sm leading-6 text-gray-500">
          This account has not added an emergency contact.
        </p>
      ) : null}
      <div className="grid max-w-[900px] grid-cols-1 gap-4 md:grid-cols-2">
        {contacts.map((c, i) => (
          <div key={i} className="edge flex items-center gap-3 rounded-[10px] px-5 py-4">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold leading-[34px] text-[#2F3037]">
              OJ
            </span>
            <span className="flex flex-1 flex-col gap-1">
              <span className="text-[15px] font-medium leading-5 text-[#2F3037]">{c.name}</span>
              <span className="text-xs font-normal leading-5 text-[#767B8C]">{c.phone}</span>
            </span>
            <span className="rounded-2xl bg-gray-900 px-3 py-1 text-xs font-semibold leading-[18px] text-[#F7F7F7]">
              {c.relation}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
