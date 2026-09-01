'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react';

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

/** The waitlist card's shell, so this reads as the same surface. */
const CARD =
  'w-full rounded-[14px] border border-gray-200 bg-white p-1 text-left';

/** The waitlist card's dark action, widened to sit under stacked fields. */
const BUTTON_SHADOW =
  '0 1px 2px 0 rgba(10,13,18,0.05), inset 0 0 0 1px rgba(10,13,18,0.18), inset 0 -2px 0 0 rgba(10,13,18,0.05)';

export function LoginForm({ base }: { base: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: 'credentials' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      // Not kept around once it has been exchanged for a challenge.
      setPassword('');
      setShowPassword(false);
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
    <div className="flex w-full max-w-[460px] flex-col items-center gap-3">
      {step.name === 'credentials' ? (
        <form onSubmit={submitCredentials} className={CARD}>
          {/* Both fields in one container, divided rather than boxed
              separately, so the card stays the single object the waitlist
              card is. */}
          <div className="flex flex-col">
            <FieldRow icon={<Mail size={18} strokeWidth={1.5} />}>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email..."
                className="h-12 w-full bg-transparent text-[15px] leading-[18px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </FieldRow>

            <span className="mx-3 h-px bg-gray-200" aria-hidden />

            <FieldRow icon={<Lock size={18} strokeWidth={1.5} />}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password..."
                className="h-12 w-full bg-transparent text-[15px] leading-[18px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </FieldRow>
          </div>

          <Action busy={busy} label="Continue →" busyLabel="Checking…" />
        </form>
      ) : null}

      {step.name === 'code' ? (
        <form onSubmit={submitCode} className={CARD}>
          {step.enrol ? (
            <div className="flex flex-col items-center gap-3 px-4 pb-2 pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.enrol.qr}
                alt="Authenticator setup QR code"
                className="h-[168px] w-[168px] rounded-lg border border-gray-200 bg-white p-2"
              />
              <p className="text-center text-[13px] leading-5 text-gray-500">
                Can&apos;t scan? Add the account manually using the key in your
                authenticator app.
              </p>
            </div>
          ) : null}

          <FieldRow icon={<KeyRound size={18} strokeWidth={1.5} />}>
            <input
              type="text"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="6-digit code"
              className="h-12 w-full bg-transparent text-[15px] leading-[18px] tracking-[0.2em] text-gray-900 placeholder:tracking-normal placeholder:text-[#9CA3AF] focus:outline-none"
            />
          </FieldRow>

          <Action busy={busy} label="Sign in →" busyLabel="Verifying…" />
        </form>
      ) : null}

      {step.name === 'recovery' ? (
        <div className={CARD}>
          <ul className="m-1 grid grid-cols-2 gap-2 rounded-[10px] bg-gray-50 p-4 font-mono text-[13px] leading-6 text-gray-900">
            {step.codes.map((recoveryCode) => (
              <li key={recoveryCode}>{recoveryCode}</li>
            ))}
          </ul>
          <div className="p-1 pt-2">
            <button
              type="button"
              onClick={() => {
                router.replace(base);
                router.refresh();
              }}
              className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#111827] text-[14px] font-semibold leading-5 text-white"
              style={{ boxShadow: BUTTON_SHADOW }}
            >
              I&apos;ve saved these — continue
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-[13px] leading-5 text-[#D92D20]" role="alert">
          {error}
        </p>
      ) : null}

      {step.name === 'code' ? (
        <button
          type="button"
          onClick={() => {
            setStep({ name: 'credentials' });
            setError(null);
          }}
          className="text-[13px] font-medium leading-5 text-gray-500 underline transition-opacity hover:opacity-70"
        >
          Use a different account
        </button>
      ) : null}
    </div>
  );
}

/** One line of the card: leading glyph, the control, anything trailing. */
function FieldRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1">
      <span className="shrink-0 text-[#9CA3AF]">{icon}</span>
      {children}
    </div>
  );
}

function Action({
  busy,
  label,
  busyLabel
}: {
  busy: boolean;
  label: string;
  busyLabel: string;
}) {
  return (
    <div className="p-1 pt-2">
      <button
        type="submit"
        disabled={busy}
        className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#111827] text-[14px] font-semibold leading-5 text-white disabled:opacity-60"
        style={{ boxShadow: BUTTON_SHADOW }}
      >
        {busy ? busyLabel : label}
      </button>
    </div>
  );
}
