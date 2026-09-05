'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '../../../_components/shell';
import { useAction } from '../../../_components/use-action';
import { createBroadcast, type BroadcastDraft } from '../../../_lib/actions';
import { officeHref, useOfficeBase } from '../../../_lib/office-path';
import {
  CheckCircleGlyph,
  ChevronRightIcon,
  InfoIcon
} from '../../../_components/icons';

/* Figma 907:13548 / 13660 / 13788 / 13916 — the four-step "Create broadcast"
   wizard. Card 1018 wide, pad 23/19, radius 15; label column 180 + 240 gutter. */

const STEPS = [
  { id: 'details', label: 'Broadcast details' },
  { id: 'audience', label: 'Target Audience' },
  { id: 'schedule', label: 'Delivery & Schedule' },
  { id: 'preview', label: 'Preview' }
] as const;

type StepId = (typeof STEPS)[number]['id'];

type Channel = 'push' | 'in_app' | 'sms' | 'email';

/**
 * The design's four channels against what actually delivers.
 *
 * Push and in-app both come out of the notification pipeline. There is no SMS
 * or email fan-out to citizens — the SMS provider sends one-time codes, and
 * mail goes to admins — so those two are offered, recorded on the broadcast,
 * and labelled as not yet delivering rather than quietly dropped.
 */
const CHANNELS: {
  id: Channel;
  label: string;
  hint: string;
  delivers: boolean;
}[] = [
  {
    id: 'push',
    label: 'Push Notification',
    hint: 'Instant push notification',
    delivers: true
  },
  {
    id: 'in_app',
    label: 'In-App Alert',
    hint: 'Show In-App instantly',
    delivers: true
  },
  {
    id: 'sms',
    label: 'SMS Message',
    hint: 'Recorded, but SMS fan-out is not built yet',
    delivers: false
  },
  {
    id: 'email',
    label: 'Email',
    hint: 'Recorded, but email fan-out is not built yet',
    delivers: false
  }
];

const SEVERITIES: { id: BroadcastDraft['severity']; label: string; hint: string }[] = [
  { id: 'low', label: 'Low', hint: 'Useful to know, not urgent.' },
  { id: 'medium', label: 'Moderate', hint: 'Worth acting on today.' },
  { id: 'high', label: 'High', hint: 'Wakes the phone; use sparingly.' }
];

const MESSAGE_LIMIT = 250;

export default function CreateBroadcastPage() {
  const router = useRouter();
  const base = useOfficeBase();
  const { pending, error, run } = useAction();

  const [step, setStep] = useState<StepId>('details');
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<BroadcastDraft['severity']>('medium');
  const [city, setCity] = useState('');
  const [channels, setChannels] = useState<Channel[]>(['push', 'in_app']);
  const [later, setLater] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  /** What each step needs before Save & Continue means anything. */
  const blocked =
    (step === 'details' && (!title.trim() || !message.trim())) ||
    (step === 'audience' && channels.length === 0) ||
    (step === 'schedule' && later && (!date || !time));

  function publish() {
    run(
      () =>
        createBroadcast({
          title,
          message,
          severity,
          channels,
          city: city.trim() || undefined,
          // Sent as a local wall-clock time; the browser's own offset is what
          // the person picking 6pm meant.
          scheduledFor: later && date && time
            ? new Date(`${date}T${time}`).toISOString()
            : undefined
        }),
      () => router.push(officeHref(base, 'broadcast'))
    );
  }

  return (
    /*
      This is the compose wizard, not a list — there is nothing on it to
      filter. The pickers were inherited from the screen's Shell.
    */
    <Shell title="Broadcast message">
      <div className="flex px-4 sm:px-6 lg:pl-8 lg:pr-0">
        <div className="flex min-w-0 flex-1 flex-col gap-[34px] pt-[17px] lg:pr-[39px]">
          <div className="flex flex-col gap-[25px]">
            <nav className="flex flex-wrap items-center gap-2 text-base leading-6">
              {['Dashboard', 'Broadcast message', '...', 'Create broadcast'].map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 ? <ChevronRightIcon className="h-4 w-4 text-gray-400" /> : null}
                  <span className={i === 3 ? 'font-semibold text-gray-900' : 'text-gray-500'}>
                    {c}
                  </span>
                </span>
              ))}
            </nav>

            {/* Stepper — 30px dots, #0084FF when reached, 50px connector */}
            <div className="flex flex-wrap items-center gap-2">
              {STEPS.map((s, i) => (
                <span key={s.id} className="flex items-center gap-2">
                  {i > 0 ? <span className="h-[2px] w-[50px] bg-[#AFAFAF]" /> : null}
                  <button
                    type="button"
                    onClick={() => setStep(s.id)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`flex h-[30px] w-[30px] items-center justify-center rounded-[21px] p-[9px] ${
                        i <= stepIndex ? 'bg-[#0084FF]' : 'bg-rule'
                      }`}
                    >
                      <CheckCircleGlyph className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-base font-semibold leading-6 text-gray-500">
                      {s.label}
                    </span>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="edge flex w-full max-w-[1018px] flex-col justify-center gap-5 rounded-[15px] px-[19px] py-[23px]">
            <div className="flex flex-col justify-center gap-[10px] py-[10px]">
              <h2 className="text-xl font-bold leading-7 text-navy">
                {step === 'preview' ? 'Preview' : 'Create broadcast'}
              </h2>
              {step === 'preview' ? null : (
                <p className="text-base font-normal leading-6 text-navy">
                  Create and send safety alerts to selected SafeRoute users.
                </p>
              )}
            </div>

            {step === 'details' ? (
              <DetailsStep
                title={title}
                onTitle={setTitle}
                message={message}
                onMessage={setMessage}
                severity={severity}
                onSeverity={setSeverity}
              />
            ) : null}

            {step === 'audience' ? (
              <AudienceStep
                city={city}
                onCity={setCity}
                channels={channels}
                onToggleChannel={(id) =>
                  setChannels((current) =>
                    current.includes(id)
                      ? current.filter((value) => value !== id)
                      : [...current, id]
                  )
                }
              />
            ) : null}

            {step === 'schedule' ? (
              <ScheduleStep
                later={later}
                onLater={setLater}
                date={date}
                onDate={setDate}
                time={time}
                onTime={setTime}
              />
            ) : null}

            {step === 'preview' ? (
              <PreviewStep
                title={title}
                message={message}
                severity={severity}
                city={city}
                channels={channels}
                later={later}
                date={date}
                time={time}
              />
            ) : null}

            {error ? (
              <p
                role="alert"
                className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
              >
                {error}
              </p>
            ) : null}

            <Footer
              showBack={step !== 'details'}
              cta={
                step === 'preview'
                  ? later
                    ? 'Schedule broadcast'
                    : 'Publish'
                  : 'Save & Continue'
              }
              pending={pending}
              disabled={blocked}
              onBack={() => setStep(STEPS[Math.max(0, stepIndex - 1)]!.id)}
              onNext={() =>
                step === 'preview'
                  ? publish()
                  : setStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)]!.id)
              }
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-[33px] py-[10px]">
      <span className="flex-1 text-xl font-bold leading-7 text-navy">{children}</span>
    </div>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex w-full flex-col justify-center gap-[5px] lg:w-[180px] lg:shrink-0">
      <span className="text-base font-medium leading-6 tracking-[0.16px] text-black">
        {label}
      </span>
      {hint ? (
        <span className="text-xs font-normal leading-4 tracking-[0.12px] text-black/50">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/** The 20px outlined control the wizard uses for severity, channel and schedule. */
function Choice({
  label,
  hint,
  checked,
  onChange,
  kind = 'radio'
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
  kind?: 'radio' | 'checkbox';
}) {
  return (
    <label className="flex w-[232px] cursor-pointer items-start gap-[10px] rounded-lg">
      <input
        type={kind}
        checked={checked}
        onChange={onChange}
        className={`mt-0 h-5 w-5 shrink-0 accent-[#0084FF] ${
          kind === 'radio' ? 'rounded-full' : 'rounded'
        }`}
      />
      <span className="flex flex-col justify-center gap-[7px]">
        <span className="text-sm font-medium leading-5 text-gray-900">{label}</span>
        <span className="text-xs font-normal leading-4 tracking-[0.12px] text-black/50">
          {hint}
        </span>
      </span>
    </label>
  );
}

function DetailsStep({
  title,
  onTitle,
  message,
  onMessage,
  severity,
  onSeverity
}: {
  title: string;
  onTitle: (value: string) => void;
  message: string;
  onMessage: (value: string) => void;
  severity: BroadcastDraft['severity'];
  onSeverity: (value: BroadcastDraft['severity']) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Broadcast details</SectionTitle>

      <div className="flex flex-col gap-5 py-[17px]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[37px]">
            <FieldLabel label="Broadcast title" hint="Keep the title clear and actionable." />
            <div className="flex flex-1 flex-col justify-center gap-[7px] pb-[15px] shadow-[inset_0_-1px_0_0_#D5D7DA]">
              <input
                value={title}
                onChange={(event) => onTitle(event.target.value)}
                placeholder="Title....."
                maxLength={120}
                aria-label="Broadcast title"
                className="w-full border-0 bg-transparent p-0 text-[32px] font-bold leading-[39px] text-navy outline-none placeholder:text-navy/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:gap-[60px]">
            <FieldLabel label="Message" />
            <div className="edge-gray300 flex h-[174px] flex-1 flex-col rounded-lg bg-[#F9F9F9] px-[14px] py-[10px]">
              <textarea
                value={message}
                onChange={(event) =>
                  onMessage(event.target.value.slice(0, MESSAGE_LIMIT))
                }
                placeholder="What do you need people to know?"
                aria-label="Broadcast message"
                className="w-full flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-5 text-gray-900 outline-none placeholder:text-gray-500"
              />
              <span className="self-end text-xs font-normal leading-4 text-gray-500">
                {message.length}/{MESSAGE_LIMIT}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-10 py-5">
            <div className="flex flex-col gap-6 py-5 shadow-[inset_0_1px_0_0_#EEEEEE,inset_0_-1px_0_0_#EEEEEE] lg:flex-row lg:items-center lg:gap-[105px]">
              <span className="flex w-full items-center gap-[10px] lg:w-[180px] lg:shrink-0">
                <span className="text-base font-medium leading-6 tracking-[0.16px] text-black">
                  Severity level
                </span>
                <InfoIcon className="h-5 w-5 text-gray-400" />
              </span>
              <div className="flex flex-wrap items-center gap-[7px]">
                {SEVERITIES.map((s) => (
                  <Choice
                    key={s.id}
                    label={s.label}
                    hint={s.hint}
                    checked={severity === s.id}
                    onChange={() => onSeverity(s.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudienceStep({
  city,
  onCity,
  channels,
  onToggleChannel
}: {
  city: string;
  onCity: (value: string) => void;
  channels: Channel[];
  onToggleChannel: (id: Channel) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Target Audience</SectionTitle>

      <div className="flex flex-col gap-10 py-[17px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[60px]">
          <FieldLabel
            label="Audience Type"
            hint="Leave the city empty to reach every user."
          />
          <input
            value={city}
            onChange={(event) => onCity(event.target.value)}
            placeholder="All users"
            aria-label="City"
            className="h-11 w-full max-w-[240px] rounded-lg bg-rule px-[14px] py-[10px] text-sm font-normal leading-5 text-gray-700 outline-none placeholder:text-gray-700"
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-[60px]">
          <FieldLabel label="Delivery channel" />
          <div className="flex flex-1 flex-wrap gap-x-[72px] gap-y-[35px]">
            {CHANNELS.map((c) => (
              <Choice
                key={c.id}
                kind="checkbox"
                label={c.label}
                hint={c.hint}
                checked={channels.includes(c.id)}
                onChange={() => onToggleChannel(c.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleStep({
  later,
  onLater,
  date,
  onDate,
  time,
  onTime
}: {
  later: boolean;
  onLater: (value: boolean) => void;
  date: string;
  onDate: (value: string) => void;
  time: string;
  onTime: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Delivery &amp; Schedule</SectionTitle>

      <div className="flex flex-col gap-[35px] py-[17px]">
        <div className="flex flex-wrap gap-[72px]">
          <Choice
            label="Send now"
            hint="Send the broadcast immediately."
            checked={!later}
            onChange={() => onLater(false)}
          />
          <Choice
            label="Schedule for later"
            hint="Choose a date and time."
            checked={later}
            onChange={() => onLater(true)}
          />
        </div>

        {later ? (
          <div className="flex flex-col gap-[17px]">
            <span className="text-sm font-medium leading-5 text-gray-900">If scheduled:</span>

            <label className="flex items-center gap-[42px]">
              <span className="w-[35px] text-sm font-medium leading-5 text-gray-900">Date:</span>
              <input
                type="date"
                value={date}
                onChange={(event) => onDate(event.target.value)}
                className="h-11 w-[172px] rounded-lg bg-rule px-[14px] py-[10px] text-sm font-normal leading-5 text-gray-700 outline-none"
              />
            </label>

            <label className="flex items-center gap-[42px]">
              <span className="w-[35px] text-sm font-medium leading-5 text-gray-900">Time:</span>
              <input
                type="time"
                value={time}
                onChange={(event) => onTime(event.target.value)}
                className="h-11 w-[172px] rounded-lg bg-rule px-[14px] py-[10px] text-sm font-normal leading-5 text-gray-700 outline-none"
              />
            </label>

            {/*
              A scheduled broadcast is written and waits; nothing sends it yet.
              Said here rather than at the moment someone notices it never went
              out — who is standing inside a circle at 6pm is not knowable at
              9am, so this needs a job, not a timer on this page.
            */}
            <p className="max-w-[520px] text-xs font-normal leading-4 text-gray-500">
              Scheduled broadcasts are saved with their send time and appear on
              the broadcast list as Scheduled. The job that sends them at that
              time has not been built yet, so send now if it must go out today.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PreviewStep({
  title,
  message,
  severity,
  city,
  channels,
  later,
  date,
  time
}: {
  title: string;
  message: string;
  severity: BroadcastDraft['severity'];
  city: string;
  channels: Channel[];
  later: boolean;
  date: string;
  time: string;
}) {
  const severityLabel =
    SEVERITIES.find((s) => s.id === severity)?.label ?? 'Moderate';

  return (
    <div className="flex flex-col gap-[30px] py-[17px] xl:pl-[231px]">
      <PreviewRow label="Title:">
        <span className="text-xl font-semibold leading-7 tracking-[-0.4px] text-gray-900">
          {title || '—'}
        </span>
      </PreviewRow>

      <PreviewRow label="Subtext:">
        <p className="max-w-[358px] text-sm font-medium leading-5 tracking-[-0.28px] text-gray-900">
          {message || '—'}
        </p>
      </PreviewRow>

      <PreviewRow label="Audience:">
        <span className="flex flex-wrap items-center gap-[17px]">
          <span className="text-sm font-medium leading-5 text-gray-900">
            {city.trim() ? city.trim() : 'All users'}
          </span>
          {/*
            The design quotes a recipient count here. It is not knowable before
            sending — the audience is whoever has notifications on at the
            moment it goes out — so the real number is reported on the
            broadcast list afterwards instead of guessed at now.
          */}
          <span className="text-sm font-normal leading-5 text-gray-500">
            Recipient count is counted at send time
          </span>
        </span>
      </PreviewRow>

      <PreviewRow label="Channels:">
        <span className="text-sm font-medium leading-5 text-gray-900">
          {channels.length
            ? CHANNELS.filter((c) => channels.includes(c.id))
                .map((c) => c.label)
                .join(', ')
            : '—'}
        </span>
      </PreviewRow>

      <PreviewRow label="Severity:">
        <span
          className={`text-sm font-semibold leading-5 tracking-[-0.28px] ${
            severity === 'high' || severity === 'critical'
              ? 'text-error-600'
              : severity === 'medium'
                ? 'text-warning-600'
                : 'text-gray-900'
          }`}
        >
          {severityLabel}
        </span>
      </PreviewRow>

      <PreviewRow label="Delivery:">
        <span className="text-sm font-medium leading-5 text-gray-900">
          {later && date && time ? `Scheduled for ${date} at ${time}` : 'Send Now'}
        </span>
      </PreviewRow>
    </div>
  );
}

function PreviewRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-[80px]">
      <span className="w-[70px] shrink-0 text-sm font-medium leading-5 tracking-[0.14px] text-gray-700">
        {label}
      </span>
      {children}
    </div>
  );
}

function Footer({
  showBack,
  cta,
  onBack,
  onNext,
  pending,
  disabled
}: {
  showBack: boolean;
  cta: string;
  onBack: () => void;
  onNext: () => void;
  pending: boolean;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-[10px]">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-700 disabled:opacity-50"
        >
          Go back
        </button>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        {showBack ? (
          /*
            There is no draft state on a broadcast — it is written when it is
            sent or scheduled, and nothing stores a half-filled wizard. Left
            visible because the design has it, disabled because it would lose
            the work rather than save it.
          */
          <button
            type="button"
            disabled
            title="Broadcast drafts are not stored yet."
            className="edge-gray200 flex h-11 cursor-not-allowed items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-400"
          >
            Save to Draft
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          disabled={pending || disabled}
          className="flex h-11 items-center rounded-lg bg-black px-[14px] py-[10px] text-sm font-semibold leading-5 text-gray-50 disabled:opacity-60"
        >
          {pending ? 'Sending…' : cta}
        </button>
      </div>
    </div>
  );
}
