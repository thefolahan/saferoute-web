'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shell } from '../../_components/shell';
import { useAction } from '../../_components/use-action';
import { replyToTicket, setTicketStatus } from '../../_lib/actions';
import { officeHref, useOfficeBase } from '../../_lib/office-path';
import { Tabs } from '../../_components/tabs';
import { RANGES, Select } from '../../_components/ui';
import { CustomerServiceIcon, SearchLgIcon, UserSolidIcon } from '../../_components/icons';
import { AttachButton, ComposeField, ComposeModal } from '../../_components/compose-modal';

/* Figma 907:17993 "Support" — 471 ticket list + 719 conversation panel. */


export type Ticket = {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  reporter: string;
};

export type TicketDetail = {
  id: string;
  reference: string;
  subject: string;
  body: string;
  status: string;
  submitted: string;
  reporter: { name: string; email: string | null };
  replies: {
    id: string;
    body: string;
    from: 'admin' | 'user';
    author: string;
    at: string;
  }[];
};

const PRIORITY_TONE: Record<string, string> = {
  low: 'bg-success-50 text-success-700',
  medium: 'bg-warning-50 text-warning-600',
  high: 'bg-warning-50 text-warning-700',
  critical: 'bg-error-50 text-error-600'
};

const STATUS_TONE: Record<string, string> = {
  pending: 'bg-hairline text-gray-600',
  in_progress: 'bg-warning-50 text-warning-600',
  escalated: 'bg-error-50 text-error-600',
  resolved: 'bg-success-50 text-success-700',
  deferred: 'bg-hairline text-gray-600'
};

export function label(value: string): string {
  return value.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

export function SupportView({
  tickets,
  detail,
  tabs
}: {
  tickets: Ticket[];
  detail: TicketDetail | null;
  tabs: { id: string; label: string; count: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const base = useOfficeBase();
  const { pending, error, run } = useAction();

  /**
   * The queue and the open ticket live in the URL.
   *
   * Both are server-fetched — the tab decides which queue the API returns, and
   * the conversation panel is a second call keyed on `?id` — so holding either
   * in local state meant the list and the panel could disagree. They did:
   * clicking any ticket showed the first one's conversation, and switching to
   * Resolved re-rendered the same pending rows.
   */
  const tab = params.get('status') === 'resolved' ? 'resolved' : 'pending';
  const selected = detail?.id ?? null;

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [query, setQuery] = useState('');

  // The tickets endpoint takes no search term, and the queue is capped at 50
  // rows, so the box filters what is already on the page.
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? tickets.filter((ticket) =>
        [ticket.reference, ticket.subject, ticket.reporter]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      )
    : tickets;

  function navigate(next: { status?: string; id?: string }) {
    const query = new URLSearchParams();
    const status = next.status ?? tab;
    if (status === 'resolved') query.set('status', 'resolved');

    // A ticket id from one queue is meaningless in the other, so switching
    // tabs drops it and the page opens the top of the new queue.
    const id = next.status ? undefined : (next.id ?? selected ?? undefined);
    if (id) query.set('id', id);

    const search = query.toString();
    router.replace(
      `${officeHref(base, 'support')}${search ? `?${search}` : ''}`,
      { scroll: false }
    );
  }

  return (
    <Shell title="Support">
      <div className="flex flex-1 flex-col xl:flex-row">
        {/* Ticket list — 471 wide */}
        <div className="flex w-full flex-col bg-white xl:w-[471px] xl:shrink-0">
          <div className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
            {/* 907:18000 puts the tabs and the picker on one row. Wrapping
                added a band of whitespace and pushed the search down. */}
            <div className="flex items-center justify-between gap-[15px]">
              <Tabs
                tabs={tabs}
                active={tab}
                onChange={(id) => navigate({ status: id })}
              />
              <Select
                label="Any date"
                weight="semibold"
                className="w-[132px] shrink-0"
                param="range"
                options={RANGES}
              />
            </div>
          </div>

          <div className="flex items-center border-b border-[#EAECF0] bg-[#FCFCFD] px-4 py-3 sm:px-6 lg:px-8">
            <div className="edge-gray200 flex h-11 flex-1 items-center gap-2 rounded-lg bg-[#F6F6F6] px-[14px] py-[10px]">
              <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-500" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tickets, ID, user"
                aria-label="Search tickets"
                className="w-full flex-1 border-0 bg-transparent p-0 text-sm font-normal leading-6 text-gray-900 outline-none placeholder:text-gray-700"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="px-8 py-16 text-center text-sm leading-6 text-gray-500">
              {needle
                ? `Nothing in this queue matches “${query.trim()}”.`
                : 'No tickets in this queue. Reports filed from the app land here.'}
            </p>
          ) : null}

          {visible.map((t) => {
            const isSelected = t.id === selected;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => navigate({ id: t.id })}
                className={`flex min-h-[124px] items-center border-b border-[#EAECF0] px-4 py-5 text-left sm:px-6 lg:px-8 ${
                  isSelected ? 'bg-error-50' : 'bg-white'
                }`}
              >
                <div className="flex flex-1 flex-col justify-center gap-[13px]">
                  <div className="flex gap-[9px]">
                    <span className="inline-flex items-center justify-center rounded-2xl bg-bluelight-50 px-3 py-1 text-xs font-medium leading-[18px] text-secondary">
                      Support
                    </span>
                    <span
                      className={`inline-flex items-center rounded-2xl py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] ${
                        PRIORITY_TONE[t.priority] ?? PRIORITY_TONE.medium
                      }`}
                    >
                      {label(t.priority)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-2xl py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] ${
                        STATUS_TONE[t.status] ?? STATUS_TONE.pending
                      }`}
                    >
                      {label(t.status)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <div className="flex gap-5">
                      <span className="text-sm font-bold leading-5 text-[#2F3037]">
                        #{t.reference}
                      </span>
                      <span className="line-clamp-1 text-sm font-medium leading-5 text-gray-700">
                        {t.subject}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-normal leading-5 text-gray-500">
                      <UserSolidIcon className="h-4 w-4 shrink-0 text-gray-500" />
                      by {t.reporter}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation panel — Grey/Grey 25 field, pad 25/24, gap 36 */}
        {/* `self-start` collapsed the panel to its content; the design's grey
            column runs the height of the screen. */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-9 self-stretch bg-[#F8FAFB] px-6 py-[25px]">
          {!detail ? (
            <p className="py-24 text-center text-sm leading-6 text-gray-500">
              Select a ticket to read the conversation.
            </p>
          ) : null}

          {detail ? (
          <div className="flex w-full flex-col gap-[15px]">
            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col gap-[15px]">
                <div className="flex flex-wrap items-center gap-6">
                  <Field
                    label="Ticket ID"
                    value={detail.reference}
                    className="w-[195px] shrink-0"
                  />
                  <Field label="From" value={detail.reporter.name} className="flex-1" />
                  <span
                    className={`inline-flex items-center rounded py-1 pl-[9px] pr-3 text-sm font-semibold leading-[18px] ${
                      STATUS_TONE[detail.status] ?? STATUS_TONE.pending
                    }`}
                  >
                    {label(detail.status)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-6">
                  <Field
                    label="Submitted"
                    value={detail.submitted}
                    className="w-[194px] shrink-0"
                  />
                  <Field label="Subject" value={detail.subject} className="flex-1" />
                </div>
              </div>

              <div className="flex flex-col gap-[15px] rounded-[17px] bg-surface-muted px-4 py-5">
                <Bubble title="Ticket Issue" body={detail.body} />

                {detail.replies.map((reply) =>
                  reply.from === 'admin' ? (
                    <div
                      key={reply.id}
                      className="edge-grey50 flex flex-col gap-[14px] rounded-xl bg-success-50 p-6"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full p-1">
                          <CustomerServiceIcon className="h-6 w-6" />
                        </span>
                        <span className="text-base font-bold leading-6 text-[#061B2E]">
                          {reply.author}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-normal leading-6 text-[#061B2E]">
                          {reply.body}
                        </p>
                        <p className="text-right text-sm font-normal leading-6 text-gray-400">
                          {reply.at}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Bubble key={reply.id} title={reply.author} body={reply.body} />
                  )
                )}

                {detail.status === 'resolved' || detail.status === 'deferred' ? (
                  <div className="flex flex-col items-center gap-[9px]">
                    <Note>
                      {detail.status === 'resolved'
                        ? 'This ticket has been solved.'
                        : 'This ticket is deferred.'}
                    </Note>
                  </div>
                ) : null}
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-[15px]">
              <ActionButton
                className="bg-black text-[#F7F7F7]"
                onClick={() => setReplyOpen(true)}
              >
                Reply
              </ActionButton>
              <ActionButton
                className="bg-[#EAEEF4] text-[#061B2E]"
                disabled={pending || detail.status === 'resolved'}
                onClick={() => run(() => setTicketStatus(detail.id, 'resolved'))}
              >
                {detail.status === 'resolved' ? 'Resolved' : 'Mark as resolved'}
              </ActionButton>
              <ActionButton
                className="bg-[#EAEEF4] text-[#061B2E]"
                disabled={pending || detail.status === 'escalated'}
                onClick={() => run(() => setTicketStatus(detail.id, 'escalated'))}
              >
                {detail.status === 'escalated' ? 'Escalated' : 'Escalate'}
              </ActionButton>
            </div>
          </div>
          ) : null}
        </div>
      </div>

      {/* Figma 907:18217 "Reply" */}
      <ComposeModal
        open={replyOpen}
        onClose={() => {
          setReplyOpen(false);
          setReplyBody('');
        }}
        title={detail ? `Reply to ${detail.reporter.name}` : 'Reply'}
        width={741}
        cta="Send reply"
        pending={pending}
        error={error}
        disabled={!replyBody.trim()}
        onSubmit={() =>
          run(() => replyToTicket(detail!.id, replyBody), () => {
            setReplyOpen(false);
            setReplyBody('');
          })
        }
      >
        <div className="flex flex-col gap-3">
          <ComposeField
            label=""
            placeholder="Write your response...."
            height={165}
            labelWidth={0}
            gutter={0}
            value={replyBody}
            onChange={setReplyBody}
          />
          <AttachButton />
        </div>
      </ComposeModal>
    </Shell>
  );
}

function Field({
  label,
  value,
  className = ''
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col justify-center gap-1 ${className}`}>
      <span className="text-base font-normal leading-6 text-[#7E92A2]">{label}</span>
      <span className="text-base font-bold leading-6 text-[#061B2E]">{value}</span>
    </div>
  );
}

function Bubble({ title, body }: { title: string; body: string }) {
  return (
    <div className="edge-grey50 flex justify-center gap-6 rounded-xl bg-white p-6">
      <div className="flex flex-1 flex-col gap-2">
        <span className="text-base font-normal leading-6 text-[#7E92A2]">{title}</span>
        <p className="text-base font-normal leading-6 text-[#061B2E]">{body}</p>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <span className="edge-grey50 flex h-[50px] items-center justify-center gap-4 rounded-lg bg-rule px-6 py-[10px] text-sm font-medium leading-[30px] text-[#061B2E]">
      {children}
    </span>
  );
}

function ActionButton({
  children,
  className = '',
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`edge-grey50 flex h-[50px] items-center justify-center gap-4 rounded-lg px-6 py-[10px] text-sm font-bold leading-[30px] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
