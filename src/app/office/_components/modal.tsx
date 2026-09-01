'use client';

import type { ReactNode } from 'react';
import { CloseIcon } from './icons';

/* Figma 907:18749 / 18791 / 18815 — the access-control dialogs.
   Sheet radius 22, header 80h pad 18/20 with a 1px inside hairline,
   body pad 0/20/26/20, footer row 72h pad 14/0 justify=end gap 6. */

export function Modal({
  open,
  onClose,
  title,
  width,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  width: number;
  children: ReactNode;
  footer: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-full w-full flex-col overflow-auto rounded-[22px] bg-white"
        style={{ maxWidth: width }}
      >
        <div className="edge flex shrink-0 items-center gap-[7px] px-5 py-[18px]">
          <div className="flex flex-1 items-center py-2">
            <h2 className="flex-1 text-xl font-semibold leading-7 text-gray-900">{title}</h2>
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

        <div className="flex flex-col gap-4 px-5 pb-[26px]">
          {children}
          <div className="flex items-center justify-end gap-[6px] py-[14px]">{footer}</div>
        </div>
      </div>
    </div>
  );
}

/** Cancel — 113x44, pad 10/33, 1px inside hairline, Gray/600. */
export function ModalCancel({
  onClick,
  disabled = false
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="edge flex h-11 items-center justify-center rounded-lg px-[33px] py-[10px] text-sm font-medium leading-6 text-gray-600 disabled:opacity-50"
    >
      Cancel
    </button>
  );
}

/** The dialogs' primary action — black, or Error/500 for a destructive one. */
export function ModalAction({
  children,
  tone = 'dark',
  onClick,
  pending = false,
  disabled = false
}: {
  children: ReactNode;
  tone?: 'dark' | 'danger';
  onClick?: () => void;
  pending?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending || disabled}
      className={`flex h-11 items-center justify-center rounded-lg px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-50 disabled:opacity-60 ${
        tone === 'danger' ? 'bg-error-500' : 'bg-black'
      }`}
    >
      {pending ? 'Working…' : children}
    </button>
  );
}

/** The dialog's failure line — Error/50 strip under the fields. */
export function ModalError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
    >
      {children}
    </p>
  );
}

/**
 * Label + 54h field, radius 14, 1px inside #D5D7DA.
 *
 * A real control, not the design's rendered placeholder: pass `options` for
 * the chevron variant (a native select, so it keeps the platform's keyboard
 * and screen-reader behaviour) and `multiline` for the 188h note box.
 */
export function ModalField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  options,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  options?: { value: string; label: string }[];
  type?: 'text' | 'email';
}) {
  const shell = `edge-gray300 flex items-center justify-between rounded-[14px] bg-white px-[14px] ${
    multiline ? 'h-[188px] items-start py-[22px]' : 'h-[54px] py-[15px]'
  }`;
  const field =
    'w-full flex-1 border-0 bg-transparent p-0 text-base font-normal leading-6 text-gray-900 outline-none placeholder:text-[#AFAFAF]';

  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-sm font-medium leading-5 text-gray-700">{label}</span>
      <div className={shell}>
        {options ? (
          <>
            <select
              value={value}
              onChange={(event) => onChange?.(event.target.value)}
              className={`${field} appearance-none ${value ? '' : 'text-[#AFAFAF]'}`}
            >
              {placeholder ? (
                <option value="">{placeholder}</option>
              ) : null}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronGlyph />
          </>
        ) : multiline ? (
          <textarea
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            className={`${field} h-full resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value}
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

function ChevronGlyph() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#717680"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The blue notice strip on "Invite member" (Blue light/50 + 3px left rule). */
export function ModalNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px] bg-bluelight-50 px-[14px] py-[17px] shadow-[inset_3px_0_0_0_#0BA5EC]">
      <span className="text-sm font-medium leading-5 text-bluelight-800">{children}</span>
    </div>
  );
}
