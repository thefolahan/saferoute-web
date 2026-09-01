'use client';

import { useState } from 'react';
import { Shell } from '../_components/shell';
import { Tabs } from '../_components/tabs';
import { CellUser, DataTable, Pagination, type Column } from '../_components/table';
import { PlusIcon } from '../_components/icons';
import { Modal, ModalAction, ModalCancel, ModalField, ModalNotice } from '../_components/modal';

/* Figma 907:18320 (Team members), 907:18592 (Roles & permissions) and the
   dialogs 907:18749 (Edit member), 907:18791 (Remove), 907:18815 (Invite). */

const TABS = [
  { id: 'members', label: 'Team members', count: '10' },
  { id: 'roles', label: 'Roles & permissions' }
];

const COLUMNS: Column[] = [
  { key: 'name', label: 'NAME', width: 373, pad: 32 },
  { key: 'role', label: 'ROLE', width: 262 },
  { key: 'status', label: 'STATUS', width: 106 },
  { key: 'login', label: 'LAST LOGIN', width: 173 },
  { key: 'actions', label: '', width: 276, pad: 32, align: 'right' }
];

const ROLES = [
  'Super Admin',
  'Admin',
  'Moderator Admin',
  'Operation Admin',
  'Agency Partner',
  'Moderator Admin',
  'Moderator Admin',
  'Admin',
  'Moderator Admin'
];

const ROWS = ROLES.map((role, i) => ({
  id: `m${i}`,
  name: 'Oluwatomison Jumoke',
  email: 'Oluwatomisonjumo@example.com',
  role,
  login: '2026-08-05 08:49'
}));

/* Figma 907:18617 … — a role card holds a 2-column grid of permission toggles. */
const ROLE_CARDS = [
  {
    title: 'Operations Manager                                         │',
    subtitle:
      "Manages SafeRoute's daily safety operations and emergency response. │ │",
    permissions: [
      { title: 'Live Operations', hint: 'Get notified about urgent safety events.' },
      { title: 'Incident Management', hint: 'Review incidents' },
      { title: 'SOS & Emergency', hint: 'Manage SOS alerts' },
      { title: 'Reports', hint: 'View & export' }
    ]
  },
  {
    title: 'Moderator',
    subtitle: '',
    permissions: [
      { title: 'Incident Review', hint: 'Review reports' },
      { title: 'Content Moderation', hint: 'Review posts' },
      { title: 'Community', hint: 'Manage content' },
      { title: 'User Reports', hint: 'Review flags' }
    ]
  },
  {
    title: 'Trust & Safety',
    subtitle: '',
    permissions: [
      { title: 'Verification', hint: 'Get notified about urgent safety events.' },
      { title: 'User Safety', hint: 'Manage reports' },
      { title: 'Appeals', hint: 'Review appeals' },
      { title: 'Moderation', hint: 'Escalate cases' }
    ]
  }
];

export default function AccessControlPage() {
  const [tab, setTab] = useState('members');
  const [dialog, setDialog] = useState<'edit' | 'remove' | 'invite' | null>(null);
  const close = () => setDialog(null);

  return (
    <Shell title="Access control">
      <div className="flex flex-col gap-[15px] px-8 py-[19px]">
        <div className="flex items-center justify-between gap-[15px]">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
          <button
            type="button"
            onClick={() => setDialog('invite')}
            className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px]"
          >
            <PlusIcon className="h-4 w-4 text-gray-50" />
            <span className="text-sm font-medium leading-6 text-gray-50">Invite member</span>
          </button>
        </div>
      </div>

      {tab === 'members' ? (
        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={ROWS}
            rowKey={(r) => r.id}
            cell={(row, key) => {
              switch (key) {
                case 'name':
                  return <CellUser initials="OJ" name={row.name} sub={row.email} />;
                case 'role':
                  return (
                    <span className="text-sm font-normal leading-5 text-gray-700">{row.role}</span>
                  );
                case 'status':
                  return (
                    <span className="inline-flex items-center justify-center rounded-2xl bg-success-50 px-3 py-1 text-xs font-medium leading-[18px] text-success-700">
                      Active
                    </span>
                  );
                case 'login':
                  return (
                    <span className="text-sm font-normal leading-5 text-gray-700">{row.login}</span>
                  );
                case 'actions':
                  return (
                    <span className="flex items-center justify-end gap-[21px]">
                      <button
                        type="button"
                        onClick={() => setDialog('remove')}
                        className="text-sm font-medium leading-5 text-error-400"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialog('edit')}
                        className="text-sm font-medium leading-5 text-gray-700"
                      >
                        Edit
                      </button>
                    </span>
                  );
                default:
                  return null;
              }
            }}
          />
          <Pagination label="Showing&nbsp;1–15&nbsp;of&nbsp;35" />
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-8 py-3">
          {ROLE_CARDS.map((card) => (
            <div
              key={card.title}
              className="edge flex flex-col gap-[23px] rounded-[15px] bg-[#F7F7F7] px-[19px] py-5"
            >
              <div className="flex flex-col gap-5 py-5">
                <div className="flex justify-between gap-5">
                  <div className="flex w-[509px] flex-col justify-center gap-1">
                    <span className="whitespace-pre text-base font-semibold leading-[19px] tracking-[0.16px] text-gray-700">
                      {card.title}
                    </span>
                    {card.subtitle ? (
                      <span className="text-sm font-normal leading-[17px] text-gray-600">
                        {card.subtitle}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-[13px] py-[10px]">
                    <span className="text-sm font-semibold leading-[17px] text-gray-500">
                      Enable all
                    </span>
                    <Toggle />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-[73px]">
                  {card.permissions.map((p, i) => (
                    <div
                      key={p.title}
                      className={`flex flex-col gap-5 py-[11px] ${i < 2 ? 'edge-bottom' : ''}`}
                    >
                      <div className="flex w-[328px] flex-col gap-5 py-[10px]">
                        <Toggle />
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-gray-700">
                            {p.title}
                          </span>
                          <span className="text-sm font-normal leading-[17px] text-gray-600">
                            {p.hint}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={dialog === 'edit'}
        onClose={close}
        title="Edit member"
        width={457}
        footer={
          <>
            <ModalCancel onClick={close} />
            <ModalAction onClick={close}>Save changes</ModalAction>
          </>
        }
      >
        <ModalField label="Full Name" value="Sarah Anderson" />
        <ModalField label="Email address" value="Sarah3728@example.com" />
        <ModalField label="Role" value="Operation Admin" chevron />
      </Modal>

      <Modal
        open={dialog === 'remove'}
        onClose={close}
        title="Remove team member?"
        width={457}
        footer={
          <>
            <ModalCancel onClick={close} />
            <ModalAction tone="danger" onClick={close}>
              Remove member
            </ModalAction>
          </>
        }
      >
        <div className="flex flex-col justify-center gap-[19px] py-[18px]">
          <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-gray-700">
            Are you sure you want to remove Tobi Olusegun?{' '}
          </span>
          <span className="text-sm font-normal leading-[22px] text-gray-600">
            They will immediately lose access to the SafeRoute admin dashboard.
          </span>
        </div>
      </Modal>

      <Modal
        open={dialog === 'invite'}
        onClose={close}
        title="Invite member"
        width={528}
        footer={
          <>
            <ModalCancel onClick={close} />
            <ModalAction onClick={close}>Send Invitation</ModalAction>
          </>
        }
      >
        <ModalNotice>
          An invitation will be sent to their email with instructions to set up their account
        </ModalNotice>
        <ModalField label="Email address" value="Name@company.com" placeholder />
        <ModalField label="Role" value="Select role" placeholder chevron />
        <ModalField
          label="Message (optional)"
          value="Add a personal message..."
          placeholder
          multiline
        />
      </Modal>
    </Shell>
  );
}

/** 44x24 toggle, Gray/900 when on (Figma 907:18627). */
function Toggle() {
  return (
    <span className="flex h-6 w-11 shrink-0 items-center justify-end rounded-xl bg-gray-900 p-[2px]">
      <span className="h-5 w-5 rounded-full bg-white" />
    </span>
  );
}
