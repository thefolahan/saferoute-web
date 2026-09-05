'use client';

import { useState } from 'react';
import { ComposeModal } from './compose-modal';
import { useAction } from './use-action';
import { updateUser } from '../_lib/actions';

/**
 * Correct an account's record.
 *
 * `PATCH /admin/users/:id` existed with nothing able to call it, which is the
 * shape this project keeps hitting — see the note about grepping the call site
 * rather than the handler. This is that call site.
 *
 * Only fields present are sent, so an untouched select writes nothing. Status
 * is deliberately absent: suspending has its own button and its own audit
 * action, and a suspension arriving as a side effect of a profile edit would
 * be invisible in the trail.
 */

export type EditableUser = {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  homeCity: string | null;
  accountType: string;
  role: string;
  verificationStatus: string;
  idVerificationStatus: string;
  organizationName: string | null;
  organizationState: string | null;
  organizationUnit: string | null;
  strikes: number;
  banned: boolean;
};

export function EditUserModal({
  open,
  onClose,
  user,
  isAgency
}: {
  open: boolean;
  onClose: () => void;
  user: EditableUser;
  isAgency: boolean;
}) {
  const { pending, error, run } = useAction();
  const [form, setForm] = useState(user);
  const [reason, setReason] = useState('');
  const [clearBan, setClearBan] = useState(false);

  function set<K extends keyof EditableUser>(key: K, value: EditableUser[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  /** Only what actually changed, so the audit diff stays a diff. */
  function patch() {
    const body: Record<string, string | number | boolean> = {};
    const keys = [
      'displayName',
      'firstName',
      'lastName',
      'homeCity',
      'accountType',
      'role',
      'verificationStatus',
      'idVerificationStatus',
      'organizationName',
      'organizationState',
      'organizationUnit'
    ] as const;

    for (const key of keys) {
      const next = form[key];
      if (next !== user[key] && next !== null && next !== '') body[key] = next;
    }

    if (form.strikes !== user.strikes) body.strikes = form.strikes;
    if (clearBan) body.clearBan = true;
    if (reason.trim()) body.reason = reason.trim();

    return body;
  }

  const changed = Object.keys(patch()).filter((k) => k !== 'reason').length > 0;

  return (
    <ComposeModal
      open={open}
      onClose={onClose}
      title="Edit account record"
      subtitle="Corrects what the record says. It does not suspend or restore access — that is the button on the account."
      width={640}
      cta="Save changes"
      pending={pending}
      error={error}
      disabled={!changed}
      onSubmit={() => run(() => updateUser(user.id, patch()), onClose)}
    >
      <div className="flex flex-col gap-4">
        {isAgency ? (
          <>
            <Field label="Agency name" value={form.organizationName ?? ''} onChange={(v) => set('organizationName', v)} />
            <Field label="Jurisdiction" value={form.organizationState ?? ''} onChange={(v) => set('organizationState', v)} />
            <Field label="Unit" value={form.organizationUnit ?? ''} onChange={(v) => set('organizationUnit', v)} />
          </>
        ) : (
          <>
            <Field label="Display name" value={form.displayName ?? ''} onChange={(v) => set('displayName', v)} />
            <Field label="First name" value={form.firstName ?? ''} onChange={(v) => set('firstName', v)} />
            <Field label="Last name" value={form.lastName ?? ''} onChange={(v) => set('lastName', v)} />
          </>
        )}

        <Field label="City" value={form.homeCity ?? ''} onChange={(v) => set('homeCity', v)} />

        <Select
          label="Account type"
          value={form.accountType}
          onChange={(v) => set('accountType', v)}
          options={[
            ['community', 'Community'],
            ['official', 'Official'],
            ['news_outlet', 'News outlet']
          ]}
        />
        <Select
          label="Role"
          value={form.role}
          onChange={(v) => set('role', v)}
          options={[
            ['user', 'User'],
            ['moderator', 'Moderator'],
            ['admin', 'Admin'],
            ['official', 'Official']
          ]}
        />
        <Select
          label="Verification"
          value={form.verificationStatus}
          onChange={(v) => set('verificationStatus', v)}
          options={[
            ['unverified', 'Unverified'],
            ['phone_verified', 'Phone verified'],
            ['id_verified', 'ID verified'],
            ['trusted', 'Trusted']
          ]}
        />
        <Select
          label="KYC"
          value={form.idVerificationStatus}
          onChange={(v) => set('idVerificationStatus', v)}
          options={[
            ['not_required', 'Not required'],
            ['pending', 'Pending'],
            ['approved', 'Approved'],
            ['rejected', 'Rejected']
          ]}
        />

        <div className="flex flex-col gap-1">
          <Select
            label="Strikes"
            value={String(form.strikes)}
            onChange={(v) => set('strikes', Number.parseInt(v, 10))}
            options={Array.from({ length: 11 }, (_, i) => [String(i), String(i)] as [string, string])}
          />
          <span className="pl-[150px] text-xs font-normal leading-4 text-gray-500">
            Ten closes an account automatically. This is the only way back down
            from nine.
          </span>
        </div>

        {form.banned ? (
          <label className="flex items-center gap-3 rounded-[10px] bg-error-50 px-4 py-3">
            <input
              type="checkbox"
              checked={clearBan}
              onChange={(event) => setClearBan(event.target.checked)}
              className="h-4 w-4 accent-navy"
            />
            <span className="text-sm font-medium leading-5 text-error-700">
              Lift the automatic ban and restore access
            </span>
          </label>
        ) : null}

        <Field
          label="Reason"
          value={reason}
          onChange={setReason}
          placeholder="Why — recorded in the audit log beside the change"
        />
      </div>
    </ComposeModal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-full shrink-0 text-sm font-medium leading-[17px] text-gray-700 sm:w-[134px]">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border-2 border-gray-100 px-[14px] text-sm font-normal leading-6 text-gray-900 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-full shrink-0 text-sm font-medium leading-[17px] text-gray-700 sm:w-[134px]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border-2 border-gray-100 bg-white px-[11px] text-sm font-normal leading-6 text-gray-900 outline-none"
      >
        {options.map(([id, text]) => (
          <option key={id} value={id}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
