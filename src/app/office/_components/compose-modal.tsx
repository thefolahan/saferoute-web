'use client';

import type { ReactNode } from 'react';
import { AttachIcon, CloseIcon } from './icons';

/* Figma 907:16106 "Send message" and 907:18217 "Reply" — a lighter sheet than
   the access-control dialogs: radius 15, header 70/90 pad 13/20, body pad
   29/20 gap 31, and a 2px OUTSIDE Gray/100 stroke on every field. */

export function ComposeModal({
  open,
  onClose,
  title,
  subtitle,
  width,
  gradient = false,
  children,
  cta,
  onSubmit,
  pending = false,
  error = null,
  disabled = false
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width: number;
  gradient?: boolean;
  children: ReactNode;
  cta: string;
  /** Omit and the CTA only closes the sheet, as the design's static state. */
  onSubmit?: () => void;
  pending?: boolean;
  error?: string | null;
  disabled?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-full w-full flex-col overflow-auto rounded-[15px] bg-white"
        style={{ maxWidth: width }}
      >
        <div className="edge flex shrink-0 items-center gap-[7px] px-5 py-[13px]">
          <div className="flex flex-1 flex-col py-2">
            <h2 className="text-xl font-bold leading-7 text-gray-900">{title}</h2>
            {subtitle ? (
              <span className="text-sm font-normal leading-5 tracking-[-0.28px] text-gray-500">
                {subtitle}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[33px] w-[33px] shrink-0 items-center justify-center"
          >
            <CloseIcon className="h-[33px] w-[33px] text-gray-500" />
          </button>
        </div>

        <div
          className="flex flex-col gap-[31px] px-9 py-[29px]"
          style={
            gradient
              ? {
                  background:
                    'linear-gradient(180deg, rgba(105,197,220,0.11) 0%, rgba(255,251,251,0.01) 100%)'
                }
              : undefined
          }
        >
          {children}

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
            >
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end py-[27px]">
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="flex h-11 items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA] disabled:opacity-50"
              >
                <span className="px-[2px]">Cancel</span>
              </button>
              <button
                type="button"
                onClick={onSubmit ?? onClose}
                disabled={pending || disabled}
                className="flex h-11 items-center rounded-lg bg-black px-[14px] py-[10px] text-sm font-semibold leading-6 text-gray-50 disabled:opacity-60"
              >
                {pending ? 'Sending…' : cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Label + white field with a 2px OUTSIDE Gray/100 stroke, radius 9.
 *
 * Single-line under ~60px tall, a textarea above it — the design draws both as
 * the same field and only the height tells them apart.
 */
export function ComposeField({
  label,
  placeholder,
  height,
  labelWidth = 62,
  gutter = 71,
  value,
  onChange
}: {
  label: string;
  placeholder: string;
  height: number;
  labelWidth?: number;
  gutter?: number;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const field =
    'w-full flex-1 border-0 bg-transparent p-0 text-sm font-medium leading-6 tracking-[-0.28px] text-gray-900 outline-none placeholder:text-gray-500';

  return (
    <label className="flex flex-col sm:flex-row" style={{ gap: gutter }}>
      <span
        className="shrink-0 text-sm font-medium leading-[17px] tracking-[0.14px] text-gray-700"
        style={{ width: labelWidth }}
      >
        {label}
      </span>
      <div
        className="flex flex-1 rounded-[9px] bg-white px-3 py-[14px] ring-2 ring-gray-100"
        style={{ height }}
      >
        {height > 60 ? (
          <textarea
            value={value ?? ''}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            readOnly={!onChange}
            className={`${field} h-full resize-none`}
          />
        ) : (
          <input
            value={value ?? ''}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            readOnly={!onChange}
            className={field}
          />
        )}
      </div>
    </label>
  );
}

/**
 * Attaching a file needs the media pipeline's presigned-upload handshake, and
 * a support reply has no media relation to hang the result on. Disabled with
 * the reason rather than a picker whose file goes nowhere.
 */
export function AttachButton() {
  return (
    <button
      type="button"
      disabled
      title="Attachments on a reply are not built yet."
      className="edge-grey50 flex h-[50px] w-fit cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-white px-6 py-[10px] text-sm font-bold leading-[30px] text-gray-400"
    >
      <AttachIcon className="h-[23px] w-[23px]" />
      Attach files
    </button>
  );
}
