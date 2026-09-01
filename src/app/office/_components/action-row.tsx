import type { ReactNode } from 'react';
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
};

const BADGE_CLASS: Record<ActionBadge['tone'], string> = {
  error: 'bg-error-50 text-error-700',
  gray: 'bg-rule text-gray-600',
  warning: 'bg-warning-50 text-warning-700',
  success: 'bg-success-50 text-success-700'
};

export function ActionRow({ row, rail = true }: { row: ActionRowData; rail?: boolean }) {
  return (
    <div className={`rounded-md bg-white ${rail ? 'edge-left-error' : ''}`}>
      <div className="edge flex flex-col items-start gap-3 rounded-[7px] px-5 py-[7px] sm:flex-row sm:items-center sm:gap-5">
        <div className="flex flex-1 flex-col gap-[9px] py-2">
          <div className="flex flex-wrap gap-[9px]">
            {row.badges.map((b) => (
              <span
                key={b.text}
                className={`inline-flex items-center justify-center rounded-2xl px-3 py-1 text-xs font-medium leading-[18px] ${BADGE_CLASS[b.tone]}`}
              >
                {b.text}
              </span>
            ))}
          </div>

          <p className="text-base leading-7">
            <span className="font-semibold text-gray-900">{row.lead}</span>
            {row.rest ? <span className="font-medium text-gray-600">{row.rest}</span> : null}
          </p>

          <div className="flex flex-wrap gap-[5px] text-xs font-normal leading-5 tracking-[-0.24px] text-gray-500">
            {row.meta.map((m, i) => (
              <span key={m} className="flex gap-[5px]">
                {i > 0 ? <span aria-hidden>•</span> : null}
                {m}
              </span>
            ))}
          </div>
        </div>

        <GhostButton size={row.action ? 'sm' : 'md'} className="shrink-0 gap-[5px] self-end sm:self-auto">
          {row.action?.icon ?? null}
          {row.action?.label ?? 'Investigate'}
          {row.action ? null : <ArrowRightIcon className="h-4 w-4 text-gray-900" />}
        </GhostButton>
      </div>
    </div>
  );
}

/** The #F4F4F4 well the rows sit in — pad 14/19, gap 14. */
export function ActionRowList({ rows, rail = true }: { rows: ActionRowData[]; rail?: boolean }) {
  return (
    <div className="flex flex-col gap-[14px] bg-surface-muted px-[19px] py-[14px]">
      {rows.map((row) => (
        <ActionRow key={row.id} row={row} rail={rail} />
      ))}
    </div>
  );
}
