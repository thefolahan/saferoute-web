'use client';

import type { ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar } from './avatar';

/* Figma builds these tables as columns (907:14132 …). Header cell 44h
   pad 12/x, bg #FCFCFD; body cell 75h pad 20/x; every cell carries a 1px
   #EAECF0 bottom rule. `pad` is the column's horizontal padding: the outer
   columns use 32, the inner ones 24. */

export type Column = {
  key: string;
  label: string;
  /** Figma column width in px; the widths must sum to the table width. */
  width: number;
  pad?: number;
  align?: 'left' | 'right';
};

export function DataTable<T>({
  columns,
  rows,
  cell,
  rowKey,
  empty
}: {
  columns: Column[];
  rows: T[];
  cell: (row: T, key: string) => ReactNode;
  rowKey: (row: T, i: number) => string;
  /** Shown in place of the table when there is nothing to list. */
  empty?: ReactNode;
}) {
  if (rows.length === 0 && empty) {
    return (
      <div className="px-4 py-16 text-center text-sm leading-6 text-gray-500 sm:px-6 lg:px-8">
        {empty}
      </div>
    );
  }

  return (
    <>
      {/*
        Two layouts, one set of cells.

        The Figma column widths sum to the 1190 content area and are meaningful,
        so at `md` and up the table keeps them and scrolls in its own container
        rather than compressing them. Below that the same row is a card: a
        table narrower than its columns puts the action button off the right
        edge, which on a phone means the one control on the row cannot be
        reached without panning sideways.
      */}
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[1000px] table-fixed border-collapse">
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="h-11 border-b border-[#EAECF0] bg-[#FCFCFD] text-[13px] font-medium leading-[18px] text-[#667085]"
                  style={{
                    paddingLeft: c.pad ?? 24,
                    paddingRight: c.pad ?? 24,
                    textAlign: c.align ?? 'left'
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={rowKey(row, i)}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="h-[75px] border-b border-[#EAECF0] align-middle"
                    style={{
                      paddingLeft: c.pad ?? 24,
                      paddingRight: c.pad ?? 24,
                      textAlign: c.align ?? 'left'
                    }}
                  >
                    {cell(row, c.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:hidden">
        {rows.map((row, i) => (
          <div
            key={rowKey(row, i)}
            className="flex flex-col gap-3 border-b border-[#EAECF0] px-4 py-4 sm:px-6"
          >
            {columns.map((c) => {
              const content = cell(row, c.key);
              if (content === null || content === undefined) return null;

              // A column with no header is the actions column; it gets the
              // full width and sits at the foot of the card.
              if (!c.label) {
                return (
                  <div key={c.key} className="flex items-center gap-5 pt-1">
                    {content}
                  </div>
                );
              }

              return (
                <div key={c.key} className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-[11px] font-medium uppercase leading-[18px] tracking-[0.4px] text-[#667085]">
                    {c.label}
                  </span>
                  <span className="min-w-0 text-right">{content}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

/** Plain body text in a cell — Inter 14/20 w400 Gray/700. */
export function CellText({ children }: { children: ReactNode }) {
  return <span className="text-sm font-normal leading-5 text-gray-700">{children}</span>;
}

/** Photograph (or initials) + name + id (Figma 907:14137). */
export function CellUser({
  name,
  sub,
  avatarUrl
}: {
  name: string;
  sub: string;
  /** The account's own photograph; initials when there is none. */
  avatarUrl?: string | null;
}) {
  return (
    <span className="flex items-center gap-2">
      <Avatar src={avatarUrl} name={name} size={35} />
      <span className="flex flex-col justify-center">
        <span className="text-sm font-medium leading-5 text-[#2F3037]">{name}</span>
        <span className="text-xs font-normal leading-5 text-[#767B8C]">{sub}</span>
      </span>
    </span>
  );
}

/** The square-ish "ID Verified" chip — pad 7/11, radius 5, #F2F4F7. */
export function CellChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-[5px] bg-[#F2F4F7] px-[11px] py-[7px] text-sm font-medium leading-[18px] text-gray-700">
      {children}
    </span>
  );
}

/**
 * Pagination bar — Figma 907:14375, pad 12/32/16/32.
 *
 * Pages through `?page=`, which is what the server pages read. The buttons
 * disable at each end rather than requesting a page the API would answer with
 * an empty table.
 */
export function Pagination({
  label,
  page,
  pageCount
}: {
  label: string;
  page: number;
  pageCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function go(next: number) {
    const query = new URLSearchParams(params.toString());
    if (next <= 1) query.delete('page');
    else query.set('page', String(next));

    const text = query.toString();
    router.replace(text ? `?${text}` : '?', { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <span className="text-sm font-medium leading-5 text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <PageButton disabled={page <= 1} onClick={() => go(page - 1)}>
          Previous
        </PageButton>
        <PageButton disabled={page >= pageCount} onClick={() => go(page + 1)}>
          Next
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({
  children,
  disabled,
  onClick
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA] disabled:cursor-not-allowed disabled:text-gray-400"
    >
      <span className="px-[2px]">{children}</span>
    </button>
  );
}
