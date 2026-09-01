'use client';

import { useState } from 'react';
import { Shell } from '../../_components/shell';
import { Tabs } from '../../_components/tabs';
import { CellUser, DataTable, Pagination, type Column } from '../../_components/table';
import { PlusIcon } from '../../_components/icons';
import { Modal, ModalAction, ModalCancel, ModalField, ModalNotice } from '../../_components/modal';

/* Figma 907:18320 (Team members), 907:18592 (Roles & permissions) and the
   dialogs 907:18749 (Edit member), 907:18791 (Remove), 907:18815 (Invite). */


const COLUMNS: Column[] = [
  { key: 'name', label: 'NAME', width: 373, pad: 32 },
  { key: 'role', label: 'ROLE', width: 262 },
  { key: 'status', label: 'STATUS', width: 106 },
  { key: 'login', label: 'LAST LOGIN', width: 173 },
  { key: 'actions', label: '', width: 276, pad: 32, align: 'right' }
];

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  login: string;
};

export type RoleCard = {
  title: string;
  subtitle: string;
  permissions: { title: string; hint: string }[];
};

export function AccessControlView({
  rows,
  roleCards,
  tabs,
  pageLabel
}: {
  rows: MemberRow[];
  roleCards: RoleCard[];
  tabs: { id: string; label: string; count?: string }[];
  pageLabel: string;
}) {
  const [tab, setTab] = useState('members');
  const [dialog, setDialog] = useState<'edit' | 'remove' | 'invite' | null>(null);
  const [target, setTarget] = useState<MemberRow | null>(null);
  const close = () => setDialog(null);

  return (
    <Shell title="Access control">
      <div className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-[15px]">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
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
            rows={rows}
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
                        onClick={() => {
                          setTarget(row);
                          setDialog('remove');
                        }}
                        className="text-sm font-medium leading-5 text-error-400"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTarget(row);
                          setDialog('edit');
                        }}
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
          <Pagination label={pageLabel} />
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-4 py-3 sm:px-6 lg:px-8">
          {roleCards.map((card) => (
            <div
              key={card.title}
              className="edge flex flex-col gap-[23px] rounded-[15px] bg-[#F7F7F7] px-[19px] py-5"
            >
              <div className="flex flex-col gap-5 py-5">
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div className="flex w-full max-w-[509px] flex-col justify-center gap-1">
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

                <div className="grid grid-cols-1 gap-x-[73px] lg:grid-cols-2">
                  {card.permissions.map((p, i) => (
                    <div
                      key={p.title}
                      className={`flex flex-col gap-5 py-[11px] ${i < 2 ? 'edge-bottom' : ''}`}
                    >
                      <div className="flex w-full max-w-[328px] flex-col gap-5 py-[10px]">
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
        <ModalField label="Full Name" value={target?.name ?? ''} />
        <ModalField label="Email address" value={target?.email ?? ''} />
        <ModalField label="Role" value={target?.role ?? ''} chevron />
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
            Are you sure you want to remove {target?.name ?? 'this member'}?{' '}
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
