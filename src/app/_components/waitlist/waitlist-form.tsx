'use client';

import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';

type WaitlistFormProps = {
  variant: 'card' | 'row';
  placeholder: string;
  width: number;
  /** Which page this form is on, so the segments stay separable. */
  source?: string;
};

/**
 * The API this posts to. Same backend the mobile app uses — the waitlist is
 * just its one public, unauthenticated endpoint.
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export function WaitlistForm({
  variant,
  placeholder,
  width,
  source = 'website'
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * This used to set `submitted` and nothing else — the address was shown a
   * thank-you and then discarded, so every signup was lost.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || sending) return;

    setSending(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source })
      });
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      setSubmitted(true);
    } catch {
      // Never show a thank-you we cannot back up.
      setError('Could not add you just yet. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const buttonLabel = sending ? 'Adding…' : 'Get Notified →';

  const errorNote = error ? (
    <p className="mt-2 text-[13px] leading-5 text-[#D92D20]" role="alert">
      {error}
    </p>
  ) : null;

  if (variant === 'card') {
    return (
      <div style={{ maxWidth: width }} className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[14px] border border-gray-200 bg-white p-1"
        style={{ maxWidth: width }}
      >
        {submitted ? (
          <div className="flex h-14 items-center justify-center px-4 text-[15px] font-medium text-gray-900">
            Thanks! You&apos;re on the waitlist.
          </div>
        ) : (
          <div className="flex items-center gap-1 p-1">
            <div className="flex flex-1 items-center gap-2 pl-4 pr-2">
              <Mail size={18} strokeWidth={1.5} className="shrink-0 text-[#9CA3AF]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="h-12 w-full bg-transparent text-[15px] leading-[18px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center rounded-[10px] bg-[#111827] px-3 py-2 text-[14px] font-semibold leading-5 text-white disabled:opacity-60"
              style={{
                boxShadow:
                  '0 1px 2px 0 rgba(10,13,18,0.05), inset 0 0 0 1px rgba(10,13,18,0.18), inset 0 -2px 0 0 rgba(10,13,18,0.05)'
              }}
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </form>
      {errorNote}
      </div>
    );
  }

  // variant === 'row' (News Outlets)
  return (
    <div style={{ maxWidth: width }} className="w-full">
    <form
      onSubmit={handleSubmit}
      className="flex h-[52px] w-full items-center rounded-[12px] border border-[#E9EAEB] bg-white"
      style={{
        maxWidth: width,
        boxShadow: '0 4px 16px 0 rgba(10,13,18,0.10), 0 1px 4px 0 rgba(10,13,18,0.03)'
      }}
    >
      {submitted ? (
        <div className="flex h-full flex-1 items-center justify-center px-4 text-[15px] font-medium text-gray-900">
          Thanks! You&apos;re on the list.
        </div>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-[15px] leading-[18px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none"
          />
          <div className="p-2">
            <button
              type="submit"
              disabled={sending}
              className="flex h-9 items-center justify-center rounded-full bg-[#0A0D12] px-3 text-[14px] font-semibold leading-5 text-white disabled:opacity-60"
              style={{
                boxShadow:
                  '0 1px 2px 0 rgba(10,13,18,0.05), inset 0 0 0 1px rgba(10,13,18,0.18), inset 0 -2px 0 0 rgba(10,13,18,0.05)'
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </>
      )}
    </form>
    {errorNote}
    </div>
  );
}
