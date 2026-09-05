'use client';

import { useState } from 'react';
import { Shell } from '../../_components/shell';
import { Tabs } from '../../_components/tabs';
import { CellUser, DataTable, Pagination, type Column } from '../../_components/table';
import { PlusIcon } from '../../_components/icons';
import {
  Modal,
  ModalAction,
  ModalCancel,
  ModalError,
  ModalField,
  ModalNotice
} from '../../_components/modal';
import { useAction } from '../../_components/use-action';
import {
  inviteMember,
  removeMember,
  setRolePermission,
  updateMember
} from '../../_lib/actions';

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
  avatarUrl: string | null;
  email: string;
  /** The role's own name (`super_admin`), not the humanised label. */
  roleKey: string;
  role: string;
  status: string;
  login: string;
};

export type RoleCard = {
  id: string;
  title: string;
  subtitle: string;
  permissions: { key: string; title: string; hint: string; enabled: boolean }[];
};

export type RoleOption = { value: string; label: string };

export function AccessControlView({
  rows,
  roleCards,
  roleOptions,
  tabs,
  pageLabel
}: {
  rows: MemberRow[];
  roleCards: RoleCard[];
  roleOptions: RoleOption[];
  tabs: { id: string; label: string; count?: string }[];
  pageLabel: string;
}) {
  const [tab, setTab] = useState('members');
  const [dialog, setDialog] = useState<'edit' | 'remove' | 'invite' | null>(null);
  const [target, setTarget] = useState<MemberRow | null>(null);
  const { pending, error, setError, run } = useAction();

  // Dialog drafts. Seeded when the dialog opens, so reopening never shows the
  // last edit that was cancelled.
  const [draftName, setDraftName] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviteNote, setInviteNote] = useState('');

  const close = () => {
    setDialog(null);
    setError(null);
  };

  function openEdit(row: MemberRow) {
    setTarget(row);
    setDraftName(row.name);
    setDraftRole(row.roleKey);
    setError(null);
    setDialog('edit');
  }

  function openRemove(row: MemberRow) {
    setTarget(row);
    setError(null);
    setDialog('remove');
  }

  function openInvite() {
    setInviteEmail('');
    setInviteRole('');
    setInviteNote('');
    setError(null);
    setDialog('invite');
  }

  return (
    <Shell title="Access control">
      <div className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-[15px]">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
          <button
            type="button"
            onClick={openInvite}
            className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px]"
          >
            <PlusIcon className="h-4 w-4 text-gray-50" />
            <span className="text-sm font-medium leading-5 text-gray-50">Invite member</span>
          </button>
        </div>
      </div>

      {tab === 'members' ? (
        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(r) => r.id}
            empty="No admins on the team yet."
            cell={(row, key) => {
              switch (key) {
                case 'name':
                  return (
                    <CellUser
                      name={row.name}
                      sub={row.email}
                      avatarUrl={row.avatarUrl}
                    />
                  );
                case 'role':
                  return (
                    <span className="text-sm font-normal leading-5 text-gray-700">{row.role}</span>
                  );
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
                case 'login':
                  return (
                    <span className="text-sm font-normal leading-5 text-gray-700">{row.login}</span>
                  );
                case 'actions':
                  return (
                    <span className="flex items-center justify-end gap-[21px]">
                      <button
                        type="button"
                        onClick={() => openRemove(row)}
                        className="text-sm font-medium leading-5 text-error-400"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
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
          {/* /admin/team returns the whole team, so there is nothing to page. */}
          <Pagination label={pageLabel} page={1} pageCount={1} />
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-4 py-3 sm:px-6 lg:px-8">
          {error ? (
            <ModalError>{error}</ModalError>
          ) : null}
          {roleCards.map((card) => {
            const allOn = card.permissions.every((p) => p.enabled);

            return (
              <div
                key={card.id}
                className="edge flex flex-col gap-[23px] rounded-[15px] bg-[#F7F7F7] px-[19px] py-5"
              >
                <div className="flex flex-col gap-5 py-5">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row">
                    <div className="flex w-full max-w-[509px] flex-col justify-center gap-1">
                      <span className="whitespace-pre text-base font-semibold leading-6 tracking-[0.16px] text-gray-700">
                        {card.title}
                      </span>
                      {card.subtitle ? (
                        <span className="text-sm font-normal leading-5 text-gray-600">
                          {card.subtitle}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-[13px] py-[10px]">
                      <span className="text-sm font-semibold leading-5 text-gray-500">
                        Enable all
                      </span>
                      <Toggle
                        on={allOn}
                        disabled={pending}
                        label={`Enable every permission for ${card.title}`}
                        onChange={(next) =>
                          run(async () => {
                            // One call per permission that is not already
                            // where it needs to be; the endpoint is per-key.
                            for (const permission of card.permissions) {
                              if (permission.enabled === next) continue;
                              const result = await setRolePermission(
                                card.id,
                                permission.key,
                                next
                              );
                              if (!result.ok) return result;
                            }
                            return { ok: true };
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-[73px] lg:grid-cols-2">
                    {card.permissions.map((p, i) => (
                      <div
                        key={p.key}
                        className={`flex flex-col gap-5 py-[11px] ${
                          i < card.permissions.length - 2 ? 'edge-bottom' : ''
                        }`}
                      >
                        <div className="flex w-full max-w-[328px] flex-col gap-5 py-[10px]">
                          <Toggle
                            on={p.enabled}
                            disabled={pending}
                            label={p.title}
                            onChange={(next) =>
                              run(() => setRolePermission(card.id, p.key, next))
                            }
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-base font-semibold leading-6 tracking-[0.16px] text-gray-700">
                              {p.title}
                            </span>
                            <span className="text-sm font-normal leading-5 text-gray-600">
                              {p.hint}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={dialog === 'edit'}
        onClose={close}
        title="Edit member"
        width={457}
        footer={
          <>
            <ModalCancel onClick={close} disabled={pending} />
            <ModalAction
              pending={pending}
              onClick={() =>
                run(
                  () =>
                    updateMember(target!.id, {
                      fullName: draftName,
                      role: draftRole
                    }),
                  close
                )
              }
            >
              Save changes
            </ModalAction>
          </>
        }
      >
        <ModalField label="Full Name" value={draftName} onChange={setDraftName} />
        {/* Email is the login identity, so it is shown but not editable. */}
        <ModalField label="Email address" value={target?.email ?? ''} />
        <ModalField
          label="Role"
          value={draftRole}
          onChange={setDraftRole}
          options={roleOptions}
        />
        {error ? <ModalError>{error}</ModalError> : null}
      </Modal>

      <Modal
        open={dialog === 'remove'}
        onClose={close}
        title="Remove team member?"
        width={457}
        footer={
          <>
            <ModalCancel onClick={close} disabled={pending} />
            <ModalAction
              tone="danger"
              pending={pending}
              onClick={() => run(() => removeMember(target!.id), close)}
            >
              Remove member
            </ModalAction>
          </>
        }
      >
        <div className="flex flex-col justify-center gap-[19px] py-[18px]">
          <span className="text-base font-semibold leading-6 tracking-[0.16px] text-gray-700">
            Are you sure you want to remove {target?.name ?? 'this member'}?{' '}
          </span>
          <span className="text-sm font-normal leading-5 text-gray-600">
            They will immediately lose access to the SafeRoute admin dashboard.
            Their account is suspended rather than deleted, so the audit trail
            of what they did stays intact.
          </span>
        </div>
        {error ? <ModalError>{error}</ModalError> : null}
      </Modal>

      <Modal
        open={dialog === 'invite'}
        onClose={close}
        title="Invite member"
        width={528}
        footer={
          <>
            <ModalCancel onClick={close} disabled={pending} />
            <ModalAction
              pending={pending}
              onClick={() =>
                run(
                  () =>
                    inviteMember({
                      email: inviteEmail,
                      role: inviteRole,
                      message: inviteNote
                    }),
                  close
                )
              }
            >
              Send Invitation
            </ModalAction>
          </>
        }
      >
        <ModalNotice>
          An invitation will be sent to their email with instructions to set up their account
        </ModalNotice>
        <ModalField
          label="Email address"
          type="email"
          value={inviteEmail}
          onChange={setInviteEmail}
          placeholder="Name@company.com"
        />
        <ModalField
          label="Role"
          value={inviteRole}
          onChange={setInviteRole}
          options={roleOptions}
          placeholder="Select role"
        />
        <ModalField
          label="Message (optional)"
          value={inviteNote}
          onChange={setInviteNote}
          placeholder="Add a personal message..."
          multiline
        />
        {error ? <ModalError>{error}</ModalError> : null}
      </Modal>
    </Shell>
  );
}

/** 44x24 toggle, Gray/900 when on (Figma 907:18627), Gray/300 when off. */
function Toggle({
  on,
  onChange,
  disabled = false,
  label
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`flex h-6 w-11 shrink-0 items-center rounded-xl p-[2px] transition-colors disabled:opacity-50 ${
        on ? 'justify-end bg-gray-900' : 'justify-start bg-gray-300'
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white" />
    </button>
  );
}
