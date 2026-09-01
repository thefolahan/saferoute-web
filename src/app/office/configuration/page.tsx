'use client';

import { useState, type ReactNode } from 'react';
import { Shell } from '../_components/shell';
import { AVATAR } from '../_lib/assets';

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

export default function ConfigurationPage() {
  const [section, setSection] = useState<Section>('Profile information');

  return (
    <Shell title="Configuration">
      <div className="flex gap-[25px] px-8 py-[19px]">
        {/* Section list — Figma 907:18868, 271 wide */}
        <div className="edge flex w-[271px] shrink-0 flex-col gap-2 self-start rounded-[15px] px-[19px] py-[23px]">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`flex h-[39px] items-center gap-[10px] px-2 py-[10px] text-left text-base font-medium leading-[19px] text-navy ${
                s === section ? 'bg-[#E2E2E2] shadow-[inset_-3px_0_0_0_#000000]' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="edge flex flex-1 flex-col gap-5 self-start rounded-[15px] px-[19px] py-[23px]">
          {section === 'Profile information' ? <ProfilePanel /> : null}
          {section === 'Security & Privacy' ? <SecurityPanel /> : null}
          {section === 'Notification' ? <NotificationPanel /> : null}
          {section === 'System settings' ? <PreferencePanel /> : null}
          {section === 'Log out' ? (
            <PanelHeader title="Log out" subtitle="End your SafeRoute admin session." />
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
    <div className="flex items-center gap-5">
      <div className="flex flex-1 flex-col justify-center gap-[10px] py-[10px]">
        <h2 className="text-xl font-bold leading-6 text-navy">{title}</h2>
        <p className="text-[15px] font-normal leading-[18px] text-navy">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="button"
      className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-black px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-50"
    >
      Save changes
    </button>
  );
}

/** Label + 370px input, 60px gutter (Figma 907:18905). */
function FormRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-[60px]">
      <span className="w-[180px] shrink-0 self-center text-base font-normal leading-[19px] tracking-[0.16px] text-black/50">
        {label}
      </span>
      <span className="flex h-11 w-[370px] items-center rounded-lg bg-white px-[14px] py-[10px] text-base font-normal leading-6 text-gray-800 shadow-[inset_0_0_0_1px_#D5D7DA]">
        {value}
      </span>
    </div>
  );
}

function ProfilePanel() {
  return (
    <>
      <PanelHeader
        title="Profile information"
        subtitle="Manage your organization's information and preferences."
        action={<SaveButton />}
      />

      <div className="flex flex-col gap-5 py-5">
        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR.admin}
            alt="Tobi Olusegun"
            className="h-[100px] w-[100px] shrink-0 rounded-full object-cover"
          />
          <div className="flex w-[348px] flex-col justify-center gap-1">
            <span className="text-xl font-medium leading-6 tracking-[0.2px] text-black">
              Tobi Olusegun
            </span>
            <span className="inline-flex w-fit items-center justify-center rounded-[5px] bg-[#F2F4F7] px-[11px] py-[7px] text-sm font-medium leading-[18px] text-gray-700">
              Admin
            </span>
          </div>
          <button
            type="button"
            className="flex h-9 items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA]"
          >
            <span className="px-[2px]">Upload photo</span>
          </button>
        </div>

        <div className="flex w-[610px] flex-col gap-5 py-[17px]">
          <span className="text-base font-medium leading-[19px] tracking-[0.16px] text-black">
            Personal Information
          </span>
          <div className="flex flex-col gap-5">
            <FormRow label="Full name" value="Tobi Olusegun" />
            <FormRow label="Email" value="Tobi@saferoutehq.com" />
            <FormRow label="Phone" value="+234 708 8034 567" />
            <FormRow label="Department" value="Operations" />
          </div>
        </div>
      </div>
    </>
  );
}

function SecurityPanel() {
  return (
    <>
      <PanelHeader
        title="Security & Privacy"
        subtitle="Last changed 3 months ago"
        action={<SaveButton />}
      />

      <div className="flex flex-col gap-5 py-5">
        <div className="flex w-[610px] flex-col gap-5 py-[17px]">
          <span className="text-base font-medium leading-[19px] tracking-[0.16px] text-black">
            Change password
          </span>
          <div className="flex flex-col gap-5">
            <FormRow label="Current Password" value="" />
            <FormRow label="New Password" value="" />
            <FormRow label="Confirm Password" value="" />
          </div>
        </div>

        <div className="flex w-[610px] flex-col gap-5 py-[17px]">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-black">
              Two-Factor Authentication
            </span>
            <span className="text-sm font-normal leading-[17px] text-gray-600">
              Last changed 3 months ago
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <StatusRow label="Status" value="Enabled" tone="success" />
            <StatusRow label="Authenticator App" value="Connected" tone="success" />
            <StatusRow label="SMS Backup" value="+234 ••• •• 483" tone="plain" />
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
    <div className="flex w-[380px] items-center justify-between gap-[60px]">
      <span className="text-base font-normal leading-[19px] tracking-[0.16px] text-black">
        {label}
      </span>
      {tone === 'success' ? (
        <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-sm font-semibold leading-[18px] text-success-700">
          {value}
        </span>
      ) : (
        <span className="text-base font-normal leading-[19px] text-gray-600">{value}</span>
      )}
    </div>
  );
}

/** Section head + a 44x24 Gray/900 toggle (Figma 907:19025). */
function ToggleGroup({
  title,
  subtitle,
  items
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="edge-bottom flex flex-col gap-5 py-5 pr-[180px]">
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col justify-center gap-1">
          <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-black">
            {title}
          </span>
          <span className="text-sm font-normal leading-[17px] text-gray-600">{subtitle}</span>
        </div>
        <span className="flex h-6 w-11 shrink-0 items-center justify-end rounded-xl bg-gray-900 p-[2px]">
          <span className="h-5 w-5 rounded-full bg-white" />
        </span>
      </div>

      <div className="flex w-[380px] flex-col gap-5 py-[10px]">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-[60px]">
            <span className="text-base font-normal leading-[19px] tracking-[0.16px] text-black">
              {item}
            </span>
            <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-sm font-semibold leading-[18px] text-success-700">
              ON
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationPanel() {
  return (
    <>
      <PanelHeader title="Notification" subtitle="Choose what you want to be notified about." />
      <ToggleGroup
        title="Emergency Alerts"
        subtitle="Get notified about urgent safety events."
        items={['Emergency / SOS alerts', 'Critical incidents']}
      />
      <ToggleGroup
        title="Activity"
        subtitle="Stay updated on activity that needs your attention."
        items={['New incident reports', 'Verification requests', 'Content requiring review']}
      />
      <ToggleGroup
        title="System"
        subtitle="Receive important updates about your account."
        items={['System updates', 'Security alerts']}
      />
      <ToggleGroup
        title="Notification Channels"
        subtitle="Receive important updates about your account."
        items={['In-app notifications', 'Email notifications']}
      />
    </>
  );
}

function PreferencePanel() {
  return (
    <>
      <PanelHeader title="Preference" subtitle="Customize your SafeRoute dashboard experience." />

      <div className="edge-bottom flex flex-col gap-5 py-5 pr-[180px]">
        <div className="flex flex-col justify-center gap-1">
          <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-black">
            Theme
          </span>
          <span className="text-sm font-normal leading-[17px] text-gray-600">
            Choose your preferred dashboard theme.
          </span>
        </div>
        <div className="flex w-[380px] flex-col gap-5 py-[10px]">
          {['Light mode', 'Dark mode', 'System mode'].map((t) => (
            <span
              key={t}
              className="text-base font-normal leading-[19px] tracking-[0.16px] text-black"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="edge-bottom flex flex-col gap-5 py-5 pr-[180px]">
        <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-black">
          Language &amp; Region
        </span>
        <div className="flex w-[380px] flex-col gap-5 py-[10px]">
          <StatusRow label="Language" value="English" tone="plain" />
          <StatusRow label="Timezone" value="West Africa Time (WAT)" tone="plain" />
        </div>
      </div>

      <div className="flex flex-col gap-5 py-5 pr-[180px]">
        <span className="text-base font-semibold leading-[19px] tracking-[0.16px] text-black">
          Date &amp; Time
        </span>
        <div className="flex w-[380px] flex-col gap-5 py-[10px]">
          <StatusRow label="Date format" value="DD/MM/YYYY" tone="plain" />
          <StatusRow label="Time format" value="24-hour" tone="plain" />
        </div>
      </div>
    </>
  );
}
