'use client';

import { useState } from 'react';
import { Shell } from '../_components/shell';
import { Tabs } from '../_components/tabs';
import { Select } from '../_components/ui';
import { CustomerServiceIcon, SearchLgIcon, UserSolidIcon } from '../_components/icons';
import { AttachButton, ComposeField, ComposeModal } from '../_components/compose-modal';

/* Figma 907:17993 "Support" — 471 ticket list + 719 conversation panel. */

const TABS = [
  { id: 'pending', label: 'Pending', count: '4' },
  { id: 'resolved', label: 'Resloved', count: '5' }
];

type Priority = { text: 'In Progress' | 'Critical'; tone: string };

const IN_PROGRESS: Priority = { text: 'In Progress', tone: 'bg-warning-50 text-warning-600' };
const CRITICAL: Priority = { text: 'Critical', tone: 'bg-error-50 text-error-600' };

const TICKETS = [
  { id: 't1', priority: IN_PROGRESS, selected: true },
  { id: 't2', priority: CRITICAL, selected: false },
  { id: 't3', priority: IN_PROGRESS, selected: false },
  { id: 't4', priority: IN_PROGRESS, selected: false },
  { id: 't5', priority: IN_PROGRESS, selected: false },
  { id: 't6', priority: IN_PROGRESS, selected: false },
  { id: 't7', priority: IN_PROGRESS, selected: false },
  { id: 't8', priority: IN_PROGRESS, selected: false }
];

const ISSUE =
  'Hi, I can’t seem to update the app. It says “Error checking updates” when I tried to update the app via Google Play. Pls help.';

export default function SupportPage() {
  const [tab, setTab] = useState('pending');
  const [selected, setSelected] = useState('t1');
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <Shell title="Support">
      <div className="flex flex-1">
        {/* Ticket list — 471 wide */}
        <div className="flex w-[471px] shrink-0 flex-col bg-white">
          <div className="flex flex-col gap-[15px] px-8 py-[19px]">
            <div className="flex items-center justify-between gap-[15px]">
              <Tabs tabs={TABS} active={tab} onChange={setTab} />
              <Select label="Today" weight="semibold" className="w-[97px] shrink-0" />
            </div>
          </div>

          <div className="flex items-center border-b border-[#EAECF0] bg-[#FCFCFD] px-8 py-3">
            <div className="edge-gray200 flex h-11 flex-1 items-center gap-2 rounded-lg bg-[#F6F6F6] px-[14px] py-[10px]">
              <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-500" />
              <span className="flex-1 text-sm font-normal leading-6 text-gray-700">
                Search tickets, ID, user
              </span>
            </div>
          </div>

          {TICKETS.map((t) => {
            const isSelected = t.id === selected;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelected(t.id)}
                className={`flex h-[124px] items-center border-b border-[#EAECF0] px-8 py-5 text-left ${
                  isSelected ? 'bg-error-50' : 'bg-white'
                }`}
              >
                <div className="flex flex-1 flex-col justify-center gap-[13px]">
                  <div className="flex gap-[9px]">
                    <span className="inline-flex items-center justify-center rounded-2xl bg-bluelight-50 px-3 py-1 text-xs font-medium leading-[18px] text-secondary">
                      Emergency
                    </span>
                    <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] text-success-700">
                      Low
                    </span>
                    <span
                      className={`inline-flex items-center rounded-2xl py-1 pl-[9px] pr-3 text-xs font-semibold leading-[18px] ${t.priority.tone}`}
                    >
                      {t.priority.text}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <div className="flex gap-5">
                      <span className="text-sm font-bold leading-5 text-[#2F3037]">#SR-10482</span>
                      <span className="text-sm font-medium leading-5 text-gray-700">
                        SOS alert was triggered by mistake.....
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-normal leading-5 text-gray-500">
                      <UserSolidIcon className="h-4 w-4 shrink-0 text-gray-500" />
                      by Chief Okafor
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation panel — Grey/Grey 25 field, pad 25/24, gap 36 */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-9 self-start bg-[#F8FAFB] px-6 py-[25px]">
          <div className="flex w-full flex-col gap-[15px]">
            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col gap-[15px]">
                <div className="flex items-center gap-6">
                  <Field label="Ticket ID" value="1234867970-80" className="w-[195px] shrink-0" />
                  <Field label="From" value="Oluwasegun Jhon" className="flex-1" />
                  <span className="inline-flex items-center rounded bg-success-100 py-1 pl-[9px] pr-3 text-sm font-semibold leading-[18px] text-success-600">
                    Resolved
                  </span>
                </div>
                <div className="flex gap-6">
                  <Field label="Submitted" value="Nov 14, 2021 08:00" className="w-[194px] shrink-0" />
                  <Field label="Subject" value="Password reset not working" className="flex-1" />
                </div>
              </div>

              <div className="flex flex-col gap-[15px] rounded-[17px] bg-surface-muted px-4 py-5">
                <Bubble title="Ticket Issue" body={ISSUE} />

                <div className="edge-grey50 flex flex-col gap-[14px] rounded-xl bg-success-50 p-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full p-1">
                      <CustomerServiceIcon className="h-6 w-6" />
                    </span>
                    <span className="text-base font-bold leading-6 text-[#061B2E]">
                      Admin reply
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-normal leading-6 text-[#061B2E]">
                      Have you tried turning your phone off and on again?
                    </p>
                    <p className="text-right text-sm font-normal leading-6 text-gray-400">20:00</p>
                  </div>
                </div>

                <Bubble title="Ticket Issue" body={ISSUE} />

                <div className="flex flex-col items-center gap-[9px]">
                  <Note>This ticket has been solved.</Note>
                  <Note>This ticket is deferred.</Note>
                </div>
              </div>
            </div>

            <div className="flex gap-[15px]">
              <ActionButton className="bg-black text-[#F7F7F7]" onClick={() => setReplyOpen(true)}>
                Reply
              </ActionButton>
              <ActionButton className="bg-[#EAEEF4] text-[#061B2E]">Mark as resolved</ActionButton>
              <ActionButton className="bg-[#EAEEF4] text-[#061B2E]">Escalate</ActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* Figma 907:18217 "Reply" */}
      <ComposeModal
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        title="Reply to Tobi Olusegun             │"
        width={741}
        cta="Send reply"
      >
        <div className="flex flex-col gap-3">
          <ComposeField label="" placeholder="Write your response...." height={165} labelWidth={0} gutter={0} />
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
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`edge-grey50 flex h-[50px] items-center justify-center gap-4 rounded-lg px-6 py-[10px] text-sm font-bold leading-[30px] ${className}`}
    >
      {children}
    </button>
  );
}
