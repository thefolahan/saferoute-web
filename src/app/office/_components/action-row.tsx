'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, GhostButton } from './ui';

/* Figma 907:12740 — the Needs Action row, shared by the Dashboard and the
   full list. 1088x122: 4px Error/600 rail, 1px inside hairline, pad 7/20,
   inner cell pad 8/0, content gaps 9. */

export type ActionBadge = { text: string; tone: 'error' | 'gray' | 'warning' | 'success' };

export type ActionRowData = {
  id: string;
  badges: ActionBadge[];
  lead: string;
  rest?: string;
  meta: string[];
  /** Trailing button; defaults to "Investigate →". */
  action?: { label: string; icon?: ReactNode };
  /** Where the trailing button goes. Without one it is not a control. */
  href?: string;
  /** Broadcast rows only — whether this one can still be pulled back. */
  cancellable?: boolean;
  /** Verified reports — whether the verification can be taken back. */
  revocable?: boolean;
  /**
   * When this happened, as an ISO string. `meta` carries the same moment
   * formatted for reading; a filter needs the machine-readable one, and
   * parsing "Sent 4 Sept" back into a date would be inventing a parser for
   * text we already had as a timestamp.
   */
  at?: string;
};

const BADGE_CLASS: Record<ActionBadge['tone'], string> = {
  error: 'bg-error-50 text-error-700',
  gray: 'bg-rule text-gray-600',
  warning: 'bg-warning-50 text-warning-700',
  success: 'bg-success-50 text-success-700'
};

export function ActionRow({
  row,
  rail = true,
  onAction,
  onRevoke,
  pending = false
}: {
  row: ActionRowData;
  rail?: boolean;
  /** Overrides the link, for rows whose button is a mutation. */
  onAction?: (row: ActionRowData) => void;
  /** Takes a verification back, on the Verified tab. */
  onRevoke?: (row: ActionRowData) => void;
  pending?: boolean;
}) {
  return (
    <div className={`rounded-md bg-white ${rail ? 'edge-left-error' : ''}`}>
      <div className="edge flex flex-col items-start gap-3 rounded-[7px] px-5 py-[7px] sm:flex-row sm:items-center sm:gap-5">
        <div className="flex flex-1 flex-col gap-[9px] py-2">
          <div className="flex flex-wrap gap-[9px]">
            {row.badges.map((b) => (
              <span
                key={b.text}
                className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium leading-4 ${BADGE_CLASS[b.tone]}`}
              >
                {b.text}
              </span>
            ))}
          </div>

          <p className="text-base leading-6">
            <span className="font-semibold text-gray-900">{row.lead}</span>
            {row.rest ? <span className="font-medium text-gray-600">{row.rest}</span> : null}
          </p>

          <div className="flex flex-wrap gap-[5px] text-xs font-normal leading-4 tracking-[-0.24px] text-gray-500">
            {row.meta.map((m, i) => (
              <span key={m} className="flex gap-[5px]">
                {i > 0 ? <span aria-hidden>•</span> : null}
                {m}
              </span>
            ))}
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-[10px] self-end sm:self-auto">
          {row.revocable && onRevoke ? (
            <GhostButton
              size="md"
              disabled={pending}
              onClick={() => onRevoke(row)}
              className="gap-[5px] text-error-500"
            >
              Revoke action
            </GhostButton>
          ) : null}
          <ActionControl row={row} onAction={onAction} pending={pending} />
        </span>
      </div>
    </div>
  );
}

/**
 * The row's trailing control.
 *
 * A button, a link or plain text depending on what the row can actually do —
 * it used to be a `<button>` with no handler on every row, so "Investigate"
 * and "Edit" both looked like controls and neither was one.
 */
function ActionControl({
  row,
  onAction,
  pending
}: {
  row: ActionRowData;
  onAction?: (row: ActionRowData) => void;
  pending: boolean;
}) {
  const content = (
    <>
      {row.action?.icon ?? null}
      {row.action?.label ?? 'Investigate'}
      {row.action ? null : <ArrowRightIcon className="h-4 w-4 text-gray-900" />}
    </>
  );
  const size = row.action ? 'sm' : 'md';
  const className = 'shrink-0 gap-[5px] self-end sm:self-auto';

  // A mutation button only where the row actually carries one; otherwise a
  // link, otherwise nothing at all rather than a control that does nothing.
  if (onAction && row.action) {
    return (
      <GhostButton
        size={size}
        className={className}
        disabled={pending}
        onClick={() => onAction(row)}
      >
        {content}
      </GhostButton>
    );
  }

  if (row.href) {
    return (
      <GhostButton as={Link} href={row.href} size={size} className={className}>
        {content}
      </GhostButton>
    );
  }

  return null;
}

/** The #F4F4F4 well the rows sit in — pad 14/19, gap 14. */
export function ActionRowList({
  rows,
  rail = true,
  onAction,
  onRevoke,
  pending = false
}: {
  rows: ActionRowData[];
  rail?: boolean;
  onAction?: (row: ActionRowData) => void;
  onRevoke?: (row: ActionRowData) => void;
  pending?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[14px] bg-surface-muted px-[19px] py-[14px]">
      {rows.map((row) => (
        <ActionRow
          key={row.id}
          row={row}
          rail={rail}
          onAction={onAction}
          onRevoke={onRevoke}
          pending={pending}
        />
      ))}
    </div>
  );
}
