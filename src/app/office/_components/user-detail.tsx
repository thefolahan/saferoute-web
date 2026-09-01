'use client';

import { useState, type ReactNode } from 'react';
import { Shell } from './shell';
import { MessageIcon, ShieldOutlineIcon, UserGroupIcon } from './icons';
import { ArrowRightIcon } from './ui';
import { AVATAR, PHOTO } from '../_lib/assets';
import { ComposeField, ComposeModal } from './compose-modal';

/* Figma 907:14716 (agency) and 907:15289 (community member) — one detail
   screen with two subject types and a tab strip whose set differs per type.
   Hero card 1119x198 pad 10 radius 15, stat row 103 tall, tabs 49 tall. */

export type Stat = { value: string; label: string };

export type DetailSubject = {
  breadcrumb: string[];
  idLabel: string;
  name: string;
  kind: string;
  score: string;
  avatar: 'agency' | 'person';
  /** Only agencies carry the blue "Official" badge (Figma 907:14750). */
  official: boolean;
  /** Gauge palette: Success/500 on a #ECFDF3 track, or #FFCD71 on #FFF7E8. */
  gauge: 'green' | 'amber';
  stats: Stat[];
  tabs: { id: string; label: string }[];
};

export function UserDetail({
  subject,
  panels
}: {
  subject: DetailSubject;
  panels: Record<string, ReactNode>;
}) {
  const [tab, setTab] = useState(subject.tabs[0]!.id);
  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <Shell title="User details">
      <div className="flex pl-8">
        <div className="flex flex-1 flex-col gap-[34px] pr-[39px] pt-[17px]">
          <div className="flex flex-col gap-[25px]">
            <nav className="flex items-center gap-2 text-base leading-6">
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
              <div className="edge flex items-center gap-[23px] rounded-[15px] p-[10px]">
                <div className="flex h-[178px] w-[188px] shrink-0 items-center justify-center rounded-lg p-[10px] shadow-[inset_0_0_0_1px_rgba(238,238,238,0.65)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={subject.avatar === 'agency' ? PHOTO.agencyLogo : PHOTO.incidentAlt}
                    alt=""
                    className={
                      subject.avatar === 'agency'
                        ? 'max-h-full max-w-full object-contain'
                        : 'h-[159px] w-[168px] rounded-[5px] object-cover'
                    }
                  />
                </div>

                <div className="flex w-[577px] shrink-0 flex-col justify-center gap-[25px]">
                  <div className="flex flex-col justify-center gap-[9px]">
                    <span className="text-sm font-medium leading-[17px] text-gray-500">
                      {subject.idLabel}
                    </span>
                    <h2 className="text-2xl font-semibold leading-[29px] text-black">
                      {subject.name}
                    </h2>
                    <div className="flex items-center gap-[9px]">
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
                      <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] text-success-700">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-[13px]">
                    <button
                      type="button"
                      onClick={() => setMessageOpen(true)}
                      className="edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
                    >
                      <MessageIcon className="h-4 w-4 text-gray-700" />
                      Send Message
                    </button>
                    <button
                      type="button"
                      className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
                    >
                      Send a warning
                    </button>
                    <button
                      type="button"
                      className="flex h-11 items-center rounded-lg bg-error-400 px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-50"
                    >
                      Suspend User
                    </button>
                  </div>
                </div>

                <div className="flex w-[171px] shrink-0 flex-col items-center justify-center">
                  <div className="relative flex h-[83px] w-[171px] items-end justify-center">
                    <Gauge tone={subject.gauge} />
                    <span className="relative pb-1 text-[26px] font-medium leading-8 tracking-[-1.3px] text-[#131313]">
                      {subject.score}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-[6px]">
                    <span className="rounded-[20px] bg-[#E8F5E9] px-4 py-2 text-xs font-bold uppercase leading-[15px] text-[#4CAF50]">
                      Excellent
                    </span>
                    <span className="text-xs font-normal leading-[15px] text-[#9CA3AF]">
                      Top 5% of SafeRoute users
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat row */}
              <div className="flex gap-3 py-[11px]">
                {subject.stats.map((s) => (
                  <div
                    key={s.label}
                    className="edge flex flex-1 flex-col items-center justify-center gap-1 rounded-[10px] bg-[#FCFCFD] px-4 py-[14px]"
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
            <div className="edge-bottom flex items-center">
              {subject.tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex h-[49px] items-center justify-center px-[22px] text-base font-semibold leading-[19px] ${
                    t.id === tab
                      ? 'text-black shadow-[inset_0_-3px_0_0_#000000]'
                      : 'text-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {panels[tab]}
          </div>
        </div>
      </div>

      {/* Figma 907:16106 "Send message" */}
      <ComposeModal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        title="Send message"
        subtitle="Send a quick message to SafeRoute users."
        width={587}
        gradient
        cta="Send message"
      >
        <div className="flex gap-[77px]">
          <span className="w-[57px] shrink-0 text-sm font-medium leading-[17px] tracking-[0.14px] text-gray-700">
            Send to:
          </span>
          <div className="flex items-center gap-[7px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AVATAR.user} alt="" className="h-[76px] w-[76px] rounded-full object-cover" />
            <span className="flex flex-col gap-[3px]">
              <span className="text-base font-semibold leading-[19px] text-gray-900">
                {subject.name}
              </span>
              <span className="text-sm font-normal leading-[17px] text-gray-600">
                tobi.olusegun@email.com          │{' '}
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
        />
        <ComposeField
          label="Message"
          placeholder="Write your message...."
          height={165}
          labelWidth={62}
          gutter={71}
        />
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
    <div className="flex w-[504px] flex-col gap-5">
      <h3 className="text-lg font-semibold leading-[22px] text-black">{title}</h3>
      <div className="flex flex-col gap-5 py-[10px]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-[85px]">
            <span className="w-[175px] shrink-0 text-base font-normal leading-[19px] text-black/50">
              {r.label}
            </span>
            <span className="flex items-center gap-3 text-base font-normal leading-[19px] text-black">
              {r.value}
              {r.reveal ? (
                <>
                  <LockGlyph />
                  <button
                    type="button"
                    className="text-sm font-medium leading-[17px] text-secondary underline"
                  >
                    Reveal
                  </button>
                </>
              ) : null}
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
  title: string;
  place: string;
  when: string;
  body: string;
  verifications: string;
};

export function ReportsPanel({ count, items }: { count: string; items: ReportItem[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
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
              <button
                type="button"
                className="text-[13px] font-semibold leading-[18px] text-secondary"
              >
                View Details
              </button>
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
    <div className="flex w-[504px] flex-col gap-5">
      <h3 className="text-lg font-semibold leading-[27px] text-[#232323]">Subscription Status</h3>
      <div className="flex flex-col gap-5 py-[10px]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-[85px]">
            <span className="w-[175px] shrink-0 text-sm font-normal leading-[17px] text-[#64748B]">
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
  lastActiveAt
}: {
  city: string | null;
  lastActiveAt: string | null;
}) {
  return (
    <div className="flex w-[504px] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
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
      <button
        type="button"
        className="edge-gray200 flex h-11 w-fit items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
      >
        View on map
      </button>
    </div>
  );
}

export function ActivityPanel({
  groups
}: {
  groups: { day: string; items: { title: string; body: string; time: string }[] }[];
}) {
  return (
    <div className="flex w-[700px] flex-col gap-5">
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
      <div className="grid max-w-[900px] grid-cols-2 gap-4">
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
