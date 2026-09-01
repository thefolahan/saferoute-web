'use client';

import { useState, type ReactNode } from 'react';
import { Shell } from '../../_components/shell';
import { CheckCircleGlyph, ChevronRightIcon, ChevronDownIcon, InfoIcon } from '../../_components/icons';

/* Figma 907:13548 / 13660 / 13788 / 13916 — the four-step "Create broadcast"
   wizard. Card 1018 wide, pad 23/19, radius 15; label column 180 + 240 gutter. */

const STEPS = [
  { id: 'details', label: 'Broadcast details' },
  { id: 'audience', label: 'Target Audience' },
  { id: 'schedule', label: 'Delivery & Schedule' },
  { id: 'preview', label: 'Preview' }
] as const;

type StepId = (typeof STEPS)[number]['id'];

const CHANNELS = [
  { label: 'Push Notification', hint: 'Instant push notification' },
  { label: 'In-App Alert', hint: 'Show In-App instantly' },
  { label: 'SMS Message', hint: 'Send Via SMS' },
  { label: 'Email', hint: 'Send via email' }
];

const SEVERITIES = [
  { label: 'Low', hint: 'Keep the title clear and actionable.' },
  { label: 'Moderate', hint: 'Keep the title clear and actionable.' },
  { label: 'High', hint: 'Keep the title clear and actionable.' }
];

export default function CreateBroadcastPage() {
  const [step, setStep] = useState<StepId>('details');
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <Shell title="Broadcast message" filters>
      <div className="flex pl-8">
        <div className="flex flex-1 flex-col gap-[34px] pr-[39px] pt-[17px]">
          <div className="flex flex-col gap-[25px]">
            <nav className="flex items-center gap-2 text-base leading-6">
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
            <div className="flex items-center gap-2">
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

          <div className="edge flex w-[1018px] flex-col justify-center gap-5 rounded-[15px] px-[19px] py-[23px]">
            <div className="flex flex-col justify-center gap-[10px] py-[10px]">
              <h2 className="text-xl font-bold leading-6 text-navy">
                {step === 'preview' ? 'Preview' : 'Create broadcast'}
              </h2>
              {step === 'preview' ? null : (
                <p className="text-[15px] font-normal leading-[18px] text-navy">
                  Create and send safety alerts to selected SafeRoute users.
                </p>
              )}
            </div>

            {step === 'details' ? <DetailsStep /> : null}
            {step === 'audience' ? <AudienceStep /> : null}
            {step === 'schedule' ? <ScheduleStep /> : null}
            {step === 'preview' ? <PreviewStep /> : null}

            <Footer
              showBack={step !== 'details'}
              cta={step === 'preview' ? 'Publish' : 'Save & Continue'}
              onBack={() => setStep(STEPS[Math.max(0, stepIndex - 1)]!.id)}
              onNext={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)]!.id)}
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
      <span className="flex-1 text-xl font-bold leading-6 text-navy">{children}</span>
    </div>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex w-[180px] shrink-0 flex-col justify-center gap-[5px]">
      <span className="text-base font-medium leading-[19px] tracking-[0.16px] text-black">
        {label}
      </span>
      {hint ? (
        <span className="text-xs font-normal leading-[15px] tracking-[0.12px] text-black/50">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/** The 20px outlined radio the wizard uses for severity/channel/schedule. */
function Radio({ label, hint }: { label: string; hint: string }) {
  return (
    <label className="flex w-[232px] cursor-pointer items-start gap-[10px] rounded-lg">
      <span className="mt-0 h-5 w-5 shrink-0 rounded-full shadow-[inset_0_0_0_1px_#AFAFAF]" />
      <span className="flex flex-col justify-center gap-[7px]">
        <span className="text-sm font-medium leading-5 text-gray-900">{label}</span>
        <span className="text-xs font-normal leading-[15px] tracking-[0.12px] text-black/50">
          {hint}
        </span>
      </span>
    </label>
  );
}

function DetailsStep() {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Broadcast details</SectionTitle>

      <div className="flex flex-col gap-5 py-[17px]">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-[37px]">
            <FieldLabel label="Broadcast title" hint="Keep the title clear and actionable." />
            <div className="flex flex-1 flex-col justify-center gap-[7px] pb-[15px] shadow-[inset_0_-1px_0_0_#D5D7DA]">
              <span className="text-[32px] font-bold leading-[39px] text-navy">|Title.....</span>
            </div>
          </div>

          <div className="flex gap-[60px]">
            <FieldLabel label="Message" />
            <div className="edge-gray300 flex h-[174px] flex-1 items-end justify-end rounded-lg bg-[#F9F9F9] px-[14px] py-[10px]">
              <span className="text-xs font-normal leading-6 text-gray-500">0/250</span>
            </div>
          </div>

          <div className="flex flex-col gap-10 py-5">
            <div className="flex items-center gap-[105px] py-5 shadow-[inset_0_1px_0_0_#EEEEEE,inset_0_-1px_0_0_#EEEEEE]">
              <span className="flex w-[180px] shrink-0 items-center gap-[10px]">
                <span className="text-base font-medium leading-[19px] tracking-[0.16px] text-black">
                  Severity level
                </span>
                <InfoIcon className="h-5 w-5 text-gray-400" />
              </span>
              <div className="flex items-center gap-[7px]">
                {SEVERITIES.map((s) => (
                  <Radio key={s.label} label={s.label} hint={s.hint} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudienceStep() {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Target Audience</SectionTitle>

      <div className="flex flex-col gap-10 py-[17px]">
        <div className="flex items-center gap-[60px]">
          <FieldLabel label="Audience Type" />
          <button
            type="button"
            className="flex h-11 w-[172px] items-center gap-2 rounded-lg bg-rule px-[14px] py-[10px]"
          >
            <span className="flex-1 text-left text-sm font-normal leading-6 text-gray-700">
              All users
            </span>
            <ChevronDownIcon className="h-4 w-4 text-gray-900" />
          </button>
        </div>

        <div className="flex gap-[60px]">
          <FieldLabel label="Delivery channel" />
          <div className="flex flex-1 flex-wrap gap-x-[72px] gap-y-[35px]">
            {CHANNELS.map((c) => (
              <Radio key={c.label} label={c.label} hint={c.hint} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleStep() {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Preview</SectionTitle>

      <div className="flex flex-col gap-[35px] py-[17px]">
        <div className="flex gap-[72px]">
          <Radio label="Send now" hint="Send the broadcast immediately." />
          <Radio label="Schedule for later" hint="Choose a date and time." />
        </div>

        <div className="flex flex-col gap-[17px]">
          <span className="text-sm font-medium leading-5 text-gray-900">If scheduled:</span>

          <div className="flex items-center gap-[42px]">
            <span className="w-[35px] text-sm font-medium leading-5 text-gray-900">Date:</span>
            <span className="flex h-11 w-[172px] items-center rounded-lg bg-rule px-[14px] py-[10px] text-sm font-normal leading-6 text-gray-700">
              dd/mm/yyyy
            </span>
          </div>

          <div className="flex items-center gap-[42px]">
            <span className="w-[35px] text-sm font-medium leading-5 text-gray-900">Time:</span>
            <span className="flex h-11 w-[172px] items-center rounded-lg bg-rule px-[14px] py-[10px] text-sm font-normal leading-6 text-gray-700">
              10:00 AM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStep() {
  return (
    <div className="flex flex-col gap-[30px] py-[17px] pl-[231px]">
      <PreviewRow label="Title:">
        <span className="text-xl font-semibold leading-5 tracking-[-0.4px] text-gray-900">
          Important safety update
        </span>
      </PreviewRow>

      <PreviewRow label="Subtext:">
        <p className="w-[358px] text-sm font-medium leading-6 tracking-[-0.28px] text-gray-900">
          Heavy traffic has been reported around Lekki-Epe Expressway...Heavy traffic has been
          reported around Lekki-Epe Expressway...
        </p>
      </PreviewRow>

      <PreviewRow label="Audience:">
        <span className="flex items-center gap-[17px]">
          <span className="text-sm font-medium leading-5 text-gray-900">All users </span>
          <span className="text-sm font-semibold leading-5 tracking-[-0.28px] text-success-800">
            {' '}
            24,850 recipients
          </span>
        </span>
      </PreviewRow>

      <PreviewRow label="Severity:">
        <span className="text-sm font-semibold leading-5 tracking-[-0.28px] text-error-600">
          High
        </span>
      </PreviewRow>

      <PreviewRow label="Delivery:">
        <span className="text-sm font-medium leading-5 text-gray-900">Send Now</span>
      </PreviewRow>
    </div>
  );
}

function PreviewRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-[80px]">
      <span className="w-[70px] shrink-0 text-sm font-medium leading-[17px] tracking-[0.14px] text-gray-700">
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
  onNext
}: {
  showBack: boolean;
  cta: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-[10px]">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-700"
        >
          Go back
        </button>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            type="button"
            className="edge-gray200 flex h-11 items-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-700"
          >
            Save to Draft
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          className="flex h-11 items-center rounded-lg bg-black px-[14px] py-[10px] text-sm font-semibold leading-6 text-gray-50"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
