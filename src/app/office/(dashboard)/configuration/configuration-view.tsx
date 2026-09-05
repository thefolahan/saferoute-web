'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '../../_components/shell';
import { Avatar } from '../../_components/avatar';
import { useAction } from '../../_components/use-action';
import { changePassword, updateProfile } from '../../_lib/actions';
import { useOfficeBase } from '../../_lib/office-path';

/* Figma 907:18863 (Profile information), 907:18933 (Security and privacy),
   907:18999 (Notifications), 907:19092 (Preferences).
   Layout: 271 side card + flexible panel, gap 25, page pad 19/32. */

const SECTIONS = [
  'Profile information',
  'Security & Privacy',
  'Notification',
  'System settings',
  'Log out'
] as const;

type Section = (typeof SECTIONS)[number];

export type AdminProfile = {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  avatarUrl: string | null;
  mfaEnabled: boolean;
  /** Already formatted for display, or null if it never has been. */
  passwordChangedAt: string | null;
  /** This admin's own display choices, as stored on their account. */
  preferences: {
    notifications?: Record<string, boolean>;
    theme?: string;
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
  };
};

export function ConfigurationView({ profile }: { profile: AdminProfile }) {
  const [section, setSection] = useState<Section>('Profile information');
  const router = useRouter();
  const base = useOfficeBase();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    // The session cookie is httpOnly, so only the route handler can clear it.
    await fetch('/api/office/session', { method: 'DELETE' }).catch(
      () => undefined
    );
    router.replace(`${base}/login`);
  }

  return (
    <Shell title="Configuration">
      <div className="flex flex-col gap-[25px] px-4 py-[19px] sm:px-6 lg:flex-row lg:px-8">
        {/* Section list — Figma 907:18868, 271 wide */}
        <div className="edge flex w-full flex-col gap-2 self-stretch rounded-[15px] px-[19px] py-[23px] lg:w-[271px] lg:shrink-0 lg:self-start">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`flex h-[39px] items-center gap-[10px] px-2 py-[10px] text-left text-base font-medium leading-6 text-navy ${
                s === section ? 'bg-[#E2E2E2] shadow-[inset_-3px_0_0_0_#000000]' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="edge flex min-w-0 flex-1 flex-col gap-5 rounded-[15px] px-[19px] py-[23px] lg:self-start">
          {section === 'Profile information' ? <ProfilePanel profile={profile} /> : null}
          {section === 'Security & Privacy' ? <SecurityPanel profile={profile} /> : null}
          {section === 'Notification' ? <NotificationPanel profile={profile} /> : null}
          {section === 'System settings' ? <PreferencePanel profile={profile} /> : null}
          {section === 'Log out' ? (
            <>
              <PanelHeader
                title="Log out"
                subtitle="End your SafeRoute admin session on this device."
                action={
                  <button
                    type="button"
                    onClick={signOut}
                    disabled={signingOut}
                    className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-error-500 px-[14px] py-[10px] text-sm font-medium leading-5 text-white disabled:opacity-60"
                  >
                    {signingOut ? 'Signing out…' : 'Log out'}
                  </button>
                }
              />
              <p className="max-w-[610px] py-5 text-sm font-normal leading-5 text-gray-600">
                Signing out revokes this session on the server as well as
                clearing it here, so an open tab elsewhere on this device stops
                working too.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

function PanelHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="flex flex-1 flex-col justify-center gap-[10px] py-[10px]">
        <h2 className="text-xl font-bold leading-7 text-navy">{title}</h2>
        <p className="text-base font-normal leading-6 text-navy">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function SaveButton({
  onClick,
  pending = false,
  disabled = false
}: {
  onClick: () => void;
  pending?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending || disabled}
      className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-50 disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  );
}

/** The panel's result line — one of these, not a toast, so it stays put. */
function Notice({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`w-full max-w-[610px] rounded-lg px-[14px] py-[10px] text-sm font-medium leading-5 ${
        tone === 'error'
          ? 'bg-error-50 text-error-700'
          : 'bg-success-50 text-success-700'
      }`}
    >
      {children}
    </p>
  );
}

/** Label + 370px input, 60px gutter (Figma 907:18905). */
function FormRow({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  hint
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password';
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2 sm:flex-row sm:gap-[60px]">
      {/* `self-center` centres the label horizontally once the row stacks,
          so it only applies from the breakpoint where the row is a row. */}
      <span className="w-full text-base font-normal leading-6 tracking-[0.16px] text-black/50 sm:w-[180px] sm:shrink-0 sm:self-center">
        {label}
      </span>
      <span className="flex w-full max-w-[370px] flex-col gap-1">
        <input
          type={type}
          value={value}
          readOnly={readOnly || !onChange}
          onChange={(event) => onChange?.(event.target.value)}
          autoComplete={type === 'password' ? 'new-password' : undefined}
          className={`h-11 w-full rounded-lg px-[14px] py-[10px] text-base font-normal leading-6 text-gray-800 shadow-[inset_0_0_0_1px_#D5D7DA] outline-none focus:shadow-[inset_0_0_0_2px_#083A50] ${
            readOnly || !onChange ? 'bg-[#F7F7F7] text-gray-500' : 'bg-white'
          }`}
        />
        {hint ? (
          <span className="text-xs font-normal leading-4 text-gray-500">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

function ProfilePanel({ profile }: { profile: AdminProfile }) {
  const { pending, error, run } = useAction();
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [department, setDepartment] = useState(profile.department);

  const dirty =
    fullName !== profile.fullName ||
    phone !== profile.phone ||
    department !== profile.department;

  return (
    <>
      <PanelHeader
        title="Profile information"
        subtitle="Manage your organization's information and preferences."
        action={
          <SaveButton
            pending={pending}
            disabled={!dirty}
            onClick={() => {
              setSaved(false);
              run(
                () => updateProfile({ fullName, phone, department }),
                () => setSaved(true)
              );
            }}
          />
        }
      />

      <div className="flex flex-col gap-5 py-5">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar
            src={profile.avatarUrl}
            name={fullName || profile.email}
            size={100}
          />
          <div className="flex w-full max-w-[348px] flex-col justify-center gap-1">
            <span className="text-xl font-medium leading-7 tracking-[0.2px] text-black">
              {fullName || profile.email}
            </span>
            <span className="inline-flex w-fit items-center justify-center rounded-[5px] bg-[#F2F4F7] px-[11px] py-[7px] text-sm font-medium capitalize leading-5 text-gray-700">
              {profile.role.replace(/_/g, ' ')}
            </span>
          </div>
          {/*
            Uploading a photograph needs the media pipeline's presigned-upload
            handshake, which the dashboard does not speak yet. Disabled and
            labelled rather than a button that appears to work.
          */}
          <button
            type="button"
            disabled
            title="Photo upload from the dashboard is not built yet."
            className="flex h-9 cursor-not-allowed items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-400 shadow-[inset_0_0_0_1px_#D5D7DA]"
          >
            <span className="px-[2px]">Upload photo</span>
          </button>
        </div>

        <div className="flex w-full max-w-[610px] flex-col gap-5 py-[17px]">
          <span className="text-base font-medium leading-6 tracking-[0.16px] text-black">
            Personal Information
          </span>
          <div className="flex flex-col gap-5">
            <FormRow label="Full name" value={fullName} onChange={setFullName} />
            <FormRow
              label="Email"
              value={profile.email}
              type="email"
              readOnly
              hint="Your sign-in address; changing it is an account operation."
            />
            <FormRow label="Phone" value={phone} onChange={setPhone} type="tel" />
            <FormRow label="Department" value={department} onChange={setDepartment} />
          </div>
        </div>

        {error ? <Notice tone="error">{error}</Notice> : null}
        {saved && !error ? <Notice tone="success">Profile saved.</Notice> : null}
      </div>
    </>
  );
}

function SecurityPanel({ profile }: { profile: AdminProfile }) {
  const { pending, error, setError, run } = useAction();
  const [saved, setSaved] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  function save() {
    setSaved(false);

    if (next !== confirm) {
      setError('The new password and its confirmation do not match.');
      return;
    }

    run(
      () => changePassword({ currentPassword: current, newPassword: next }),
      () => {
        setSaved(true);
        setCurrent('');
        setNext('');
        setConfirm('');
      }
    );
  }

  return (
    <>
      <PanelHeader
        title="Security & Privacy"
        subtitle={
          profile.passwordChangedAt
            ? `Password last changed ${profile.passwordChangedAt}`
            : 'This password has not been changed since the account was created.'
        }
        action={
          <SaveButton
            pending={pending}
            disabled={!current || !next || !confirm}
            onClick={save}
          />
        }
      />

      <div className="flex flex-col gap-5 py-5">
        <div className="flex w-full max-w-[610px] flex-col gap-5 py-[17px]">
          <span className="text-base font-medium leading-6 tracking-[0.16px] text-black">
            Change password
          </span>
          <div className="flex flex-col gap-5">
            <FormRow
              label="Current Password"
              type="password"
              value={current}
              onChange={setCurrent}
            />
            <FormRow
              label="New Password"
              type="password"
              value={next}
              onChange={setNext}
              hint="At least 14 characters, with an upper case, a lower case and a digit."
            />
            <FormRow
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={setConfirm}
            />
          </div>

          {error ? <Notice tone="error">{error}</Notice> : null}
          {saved && !error ? (
            <Notice tone="success">
              Password changed. Your other sessions have been signed out.
            </Notice>
          ) : null}
        </div>

        <div className="flex w-full max-w-[610px] flex-col gap-5 py-[17px]">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold leading-6 tracking-[0.16px] text-black">
              Two-Factor Authentication
            </span>
            <span className="text-sm font-normal leading-5 text-gray-600">
              Required on every admin account; it is set up at first sign-in.
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <StatusRow
              label="Status"
              value={profile.mfaEnabled ? 'Enabled' : 'Not set up'}
              tone={profile.mfaEnabled ? 'success' : 'plain'}
            />
            <StatusRow
              label="Authenticator App"
              value={profile.mfaEnabled ? 'Connected' : '—'}
              tone={profile.mfaEnabled ? 'success' : 'plain'}
            />
            {/* No SMS second factor exists; the row says so rather than "—". */}
            <StatusRow label="SMS Backup" value="Not offered" tone="plain" />
          </div>
        </div>
      </div>
    </>
  );
}

function StatusRow({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: 'success' | 'plain';
}) {
  return (
    <div className="flex w-full max-w-[380px] items-center justify-between gap-6">
      <span className="text-base font-normal leading-6 tracking-[0.16px] text-black">
        {label}
      </span>
      {tone === 'success' ? (
        <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-sm font-semibold leading-5 text-success-700">
          {value}
        </span>
      ) : (
        <span className="text-base font-normal leading-6 text-gray-600">{value}</span>
      )}
    </div>
  );
}

/** Section head + a 44x24 Gray/900 toggle (Figma 907:19025). */
/**
 * A titled block of switches. Each one saves on its own — there is no Save
 * button on these panels in the design, so the switch is the commit.
 */
function ToggleGroup({
  title,
  subtitle,
  items,
  values,
  onChange,
  pending
}: {
  title: string;
  subtitle?: string;
  items: string[];
  values: Record<string, boolean>;
  onChange: (key: string, next: boolean) => void;
  pending: boolean;
}) {
  return (
    <div className="edge-bottom flex flex-col gap-5 py-5 xl:pr-[180px]">
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col justify-center gap-1">
          <span className="text-base font-semibold leading-6 tracking-[0.16px] text-black">
            {title}
          </span>
          {subtitle ? (
            <span className="text-sm font-normal leading-5 text-gray-600">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex w-full max-w-[380px] flex-col gap-5 py-[10px]">
        {items.map((item) => {
          const key = prefKey(item);
          const on = values[key] ?? true;

          return (
            <div key={item} className="flex items-center justify-between gap-6">
              <span className="text-base font-normal leading-6 tracking-[0.16px] text-black">
                {item}
              </span>
              <PrefToggle
                on={on}
                label={item}
                disabled={pending}
                onChange={(next) => onChange(key, next)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 44x24 switch, Gray/900 when on (Figma 907:19027). */
function PrefToggle({
  on,
  onChange,
  label,
  disabled = false
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
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

/** A stable storage key for a switch the design names in prose. */
function prefKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/** Label + a native select styled as the design's value text. */
function ChoiceRow({
  label,
  value,
  options,
  onChange,
  disabled
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="flex w-full max-w-[380px] items-center justify-between gap-6">
      <span className="text-base font-normal leading-6 tracking-[0.16px] text-black">
        {label}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg bg-white px-2 py-1 text-right text-base font-semibold leading-6 text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA] outline-none disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

const NOTIFICATION_GROUPS = [
  {
    title: 'Emergency Alerts',
    subtitle: 'Get notified about urgent safety events.',
    items: ['Emergency / SOS alerts', 'Critical incidents']
  },
  {
    title: 'Activity',
    subtitle: 'Stay updated on activity that needs your attention.',
    items: ['New incident reports', 'Verification requests', 'Content requiring review']
  },
  {
    title: 'System',
    subtitle: 'Receive important updates about your account.',
    items: ['System updates', 'Security alerts']
  },
  {
    title: 'Notification Channels',
    subtitle: 'Receive important updates about your account.',
    items: ['In-app notifications', 'Email notifications']
  }
] as const;

function NotificationPanel({ profile }: { profile: AdminProfile }) {
  const { pending, error, run } = useAction();
  const [values, setValues] = useState<Record<string, boolean>>(
    profile.preferences.notifications ?? {}
  );

  function set(key: string, next: boolean) {
    // Optimistic: the switch moves under the finger and rolls back if the
    // save fails, rather than sitting still for a round trip.
    const previous = values;
    const updated = { ...values, [key]: next };
    setValues(updated);

    run(async () => {
      const result = await updateProfile({
        preferences: { notifications: updated }
      });
      if (!result.ok) setValues(previous);
      return result;
    });
  }

  return (
    <>
      <PanelHeader
        title="Notification"
        subtitle="Choose what you want to be notified about."
      />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {NOTIFICATION_GROUPS.map((group) => (
        <ToggleGroup
          key={group.title}
          title={group.title}
          subtitle={group.subtitle}
          items={[...group.items]}
          values={values}
          onChange={set}
          pending={pending}
        />
      ))}
    </>
  );
}

function PreferencePanel({ profile }: { profile: AdminProfile }) {
  const { pending, error, run } = useAction();
  const [prefs, setPrefs] = useState({
    theme: profile.preferences.theme ?? 'System mode',
    language: profile.preferences.language ?? 'English',
    timezone: profile.preferences.timezone ?? 'West Africa Time (WAT)',
    dateFormat: profile.preferences.dateFormat ?? 'DD/MM/YYYY',
    timeFormat: profile.preferences.timeFormat ?? '24-hour'
  });

  function set(key: keyof typeof prefs, value: string) {
    const previous = prefs;
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);

    run(async () => {
      const result = await updateProfile({ preferences: updated });
      if (!result.ok) setPrefs(previous);
      return result;
    });
  }

  return (
    <>
      <PanelHeader
        title="Preference"
        subtitle="Customize your SafeRoute dashboard experience."
      />
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="edge-bottom flex flex-col gap-5 py-5 xl:pr-[180px]">
        <div className="flex flex-col justify-center gap-1">
          <span className="text-base font-semibold leading-6 tracking-[0.16px] text-black">
            Theme
          </span>
          <span className="text-sm font-normal leading-5 text-gray-600">
            Choose your preferred dashboard theme.
          </span>
        </div>
        <div className="flex w-full max-w-[380px] flex-col gap-5 py-[10px]">
          {['Light mode', 'Dark mode', 'System mode'].map((option) => (
            <label
              key={option}
              className="flex items-center justify-between gap-6 text-base font-normal leading-6 tracking-[0.16px] text-black"
            >
              {option}
              <input
                type="radio"
                name="dashboard-theme"
                checked={prefs.theme === option}
                disabled={pending}
                onChange={() => set('theme', option)}
                className="h-[18px] w-[18px] accent-gray-900"
              />
            </label>
          ))}
        </div>
        {/*
          Stored per admin, but the dashboard has no dark palette yet, so the
          choice is remembered rather than applied. Said plainly instead of
          leaving a control that appears to do nothing.
        */}
        <span className="text-xs font-normal leading-4 text-gray-500">
          Saved to your profile. A dark palette has not been built yet, so the
          dashboard stays light whichever you pick.
        </span>
      </div>

      <div className="edge-bottom flex flex-col gap-5 py-5 xl:pr-[180px]">
        <span className="text-base font-semibold leading-6 tracking-[0.16px] text-black">
          Language &amp; Region
        </span>
        <div className="flex w-full max-w-[380px] flex-col gap-5 py-[10px]">
          <ChoiceRow
            label="Language"
            value={prefs.language}
            options={['English']}
            disabled={pending}
            onChange={(value) => set('language', value)}
          />
          <ChoiceRow
            label="Timezone"
            value={prefs.timezone}
            options={[
              'West Africa Time (WAT)',
              'Greenwich Mean Time (GMT)',
              'Central European Time (CET)',
              'Eastern Time (ET)'
            ]}
            disabled={pending}
            onChange={(value) => set('timezone', value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 py-5 xl:pr-[180px]">
        <span className="text-base font-semibold leading-6 tracking-[0.16px] text-black">
          Date &amp; Time
        </span>
        <div className="flex w-full max-w-[380px] flex-col gap-5 py-[10px]">
          <ChoiceRow
            label="Date format"
            value={prefs.dateFormat}
            options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
            disabled={pending}
            onChange={(value) => set('dateFormat', value)}
          />
          <ChoiceRow
            label="Time format"
            value={prefs.timeFormat}
            options={['24-hour', '12-hour']}
            disabled={pending}
            onChange={(value) => set('timeFormat', value)}
          />
        </div>
      </div>
    </>
  );
}
