'use client';

import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';

type WaitlistFormProps = {
  variant: 'card' | 'row';
  placeholder: string;
  width: number;
};

// Waitlist stub — no backend. On submit we flip to an inert "Thanks!" state.
export function WaitlistForm({ variant, placeholder, width }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  const buttonLabel = 'Get Notified →';

  if (variant === 'card') {
    return (
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
              className="flex items-center justify-center rounded-[10px] bg-[#111827] px-3 py-2 text-[14px] font-semibold leading-5 text-white"
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
    );
  }

  // variant === 'row' (Journalist)
  return (
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
              className="flex h-9 items-center justify-center rounded-full bg-[#0A0D12] px-3 text-[14px] font-semibold leading-5 text-white"
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
  );
}
