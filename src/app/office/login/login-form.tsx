'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Logo } from '../_components/icons';

/**
 * Three steps, because the API enforces TOTP on every admin account and will
 * not mint a session from a password alone:
 *
 *   credentials -> code            (account already enrolled)
 *   credentials -> enrol -> code   (first login; the API returns a QR)
 *
 * A successful first login also returns one-time recovery codes. Those are the
 * only secret this page is allowed to display, and it blocks on an explicit
 * acknowledgement before continuing — they cannot be retrieved later.
 */
type Step =
  | { name: 'credentials' }
  | { name: 'code'; challengeToken: string; enrol?: { qr: string; url: string } }
  | { name: 'recovery'; codes: string[] };

export function LoginForm({ base }: { base: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: 'credentials' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitCredentials(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/office/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? 'Sign in failed.');
        return;
      }

      setCode('');
      setStep({
        name: 'code',
        challengeToken: data.challengeToken,
        enrol:
          data.status === 'mfa_setup_required'
            ? { qr: data.qrCodeDataUrl, url: data.otpAuthUrl }
            : undefined
      });
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event: FormEvent) {
    event.preventDefault();
    if (step.name !== 'code') return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/office/session/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeToken: step.challengeToken, code })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? 'That code was not accepted.');
        return;
      }

      if (data.recoveryCodes?.length) {
        setStep({ name: 'recovery', codes: data.recoveryCodes });
        return;
      }

      router.replace(base);
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Logo className="h-[25px] w-[121px] text-navy lg:hidden" />
        <h1 className="text-[28px] font-bold leading-9 text-navy">
          {step.name === 'recovery' ? 'Save your recovery codes' : 'Sign in'}
        </h1>
        <p className="text-[15px] leading-[22px] text-gray-500">
          {step.name === 'credentials'
            ? 'SafeRoute operations dashboard. Authorised staff only.'
            : step.name === 'code'
              ? step.enrol
                ? 'Scan this with an authenticator app, then enter the 6-digit code it shows.'
                : 'Enter the 6-digit code from your authenticator app.'
              : 'Each code works once, and this is the only time they are shown.'}
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-error-50 px-4 py-3 text-sm font-medium leading-5 text-error-700"
        >
          {error}
        </p>
      ) : null}

      {step.name === 'credentials' ? (
        <form onSubmit={submitCredentials} className="flex flex-col gap-5">
          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="username"
            placeholder="you@saferoutehq.com"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="••••••••••••"
          />
          <Submit busy={busy} label="Continue" busyLabel="Checking…" />
        </form>
      ) : null}

      {step.name === 'code' ? (
        <form onSubmit={submitCode} className="flex flex-col gap-5">
          {step.enrol ? (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.enrol.qr}
                alt="Authenticator setup QR code"
                className="h-[168px] w-[168px] rounded-lg bg-white p-2"
              />
              <p className="text-center text-xs leading-5 text-gray-500">
                Can&apos;t scan? Add the account manually using the key in your
                authenticator app.
              </p>
            </div>
          ) : null}

          <Field
            label="Verification code"
            type="text"
            value={code}
            onChange={setCode}
            autoComplete="one-time-code"
            placeholder="123456"
            inputMode="numeric"
          />
          <Submit busy={busy} label="Sign in" busyLabel="Verifying…" />

          <button
            type="button"
            onClick={() => {
              setStep({ name: 'credentials' });
              setError(null);
            }}
            className="text-sm font-medium leading-5 text-gray-500 underline"
          >
            Use a different account
          </button>
        </form>
      ) : null}

      {step.name === 'recovery' ? (
        <div className="flex flex-col gap-5">
          <ul className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-4 font-mono text-sm leading-6 text-navy">
            {step.codes.map((recoveryCode) => (
              <li key={recoveryCode}>{recoveryCode}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              router.replace(base);
              router.refresh();
            }}
            className="flex h-12 items-center justify-center rounded-lg bg-error-500 text-sm font-semibold text-white transition-colors hover:bg-error-600"
          >
            I&apos;ve saved these — continue
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  placeholder,
  inputMode
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  inputMode?: 'numeric';
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium leading-5 text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        required
        className="edge-gray300 h-12 rounded-lg bg-white px-4 text-base leading-6 text-gray-900 outline-none placeholder:text-gray-400 focus:shadow-[inset_0_0_0_2px_#083A50]"
      />
    </label>
  );
}

function Submit({
  busy,
  label,
  busyLabel
}: {
  busy: boolean;
  label: string;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex h-12 items-center justify-center rounded-lg bg-navy text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {busy ? busyLabel : label}
    </button>
  );
}
