import type { ReactNode } from 'react';

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
  rowKey
}: {
  columns: Column[];
  rows: T[];
  cell: (row: T, key: string) => ReactNode;
  rowKey: (row: T, i: number) => string;
}) {
  return (
    /* Column widths come from Figma and are meaningful; below the design width
       the table scrolls in its own container rather than compressing them. */
    <div className="w-full overflow-x-auto">
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
  );
}

/** Plain body text in a cell — Inter 14/20 w400 Gray/700. */
export function CellText({ children }: { children: ReactNode }) {
  return <span className="text-sm font-normal leading-5 text-gray-700">{children}</span>;
}

/** Avatar-initials + name + id (Figma 907:14137). */
export function CellUser({
  initials,
  name,
  sub
}: {
  initials: string;
  name: string;
  sub: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-[18px] bg-gray-100 text-base font-semibold leading-[22px] text-[#2F3037]">
        {initials}
      </span>
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

/** Pagination bar — Figma 907:14375, pad 12/32/16/32. */
export function Pagination({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <span className="text-sm font-medium leading-5 text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        {['Previous', 'Next'].map((t) => (
          <button
            key={t}
            type="button"
            className="flex h-9 items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA]"
          >
            <span className="px-[2px]">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
