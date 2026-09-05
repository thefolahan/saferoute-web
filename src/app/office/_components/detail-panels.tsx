import type { ReactNode } from 'react';
import Link from 'next/link';
import { Avatar } from './avatar';

/**
 * The building blocks the account tabs are made of.
 *
 * Nine tabs of new material would be nine bespoke layouts if each drew itself,
 * so they share five primitives: a section heading, a definition list, a
 * compact table, a person row and a status pill. The visual language is the
 * one already on the detail screen — `.edge` inside-strokes, 10px radii, the
 * gray-500 label / black value pairing from `InfoPanel`.
 *
 * These are server components on purpose. Every tab's data is fetched with the
 * admin's httpOnly session, which client JavaScript cannot read, so the panels
 * that render it never need to be client-side either.
 */

export function Section({
  title,
  count,
  note,
  action,
  children
}: {
  title: string;
  /** Drawn beside the heading, in the design's blue. */
  count?: number | string | null;
  /** A line under the heading — say what a panel means, or why it is empty. */
  note?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold leading-[22px] text-black">{title}</h3>
        {count !== undefined && count !== null ? (
          <span className="text-sm font-semibold leading-5 text-[#0BA5EC]">{count}</span>
        ) : null}
        {action ? <span className="ml-auto">{action}</span> : null}
      </div>
      {note ? (
        <p className="max-w-[760px] text-sm font-normal leading-6 text-gray-500">{note}</p>
      ) : null}
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-6 text-gray-500">{children}</p>;
}

export type Row = {
  label: string;
  value: ReactNode;
  /** Marks the value as sensitive — a lock, as the design draws it. */
  sensitive?: boolean;
};

/** The label/value list `InfoPanel` draws, usable with any content. */
export function Rows({ rows }: { rows: Row[] }) {
  return (
    <div className="flex max-w-[620px] flex-col gap-4 py-[10px]">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-[40px]"
        >
          <span className="w-full shrink-0 text-base font-normal leading-[19px] text-black/50 sm:w-[200px]">
            {row.label}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-3 break-words text-base font-normal leading-[22px] text-black">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * A compact table for a tab's list.
 *
 * Not `DataTable`: that one carries the Figma column widths that sum to the
 * 1190 content area, which is right for a full-page table and wrong for a
 * list inside a tab that shares the page with a hero card. This one sizes to
 * its content and scrolls horizontally inside its own box.
 */
export function MiniTable({
  head,
  rows,
  empty
}: {
  head: string[];
  rows: ReactNode[][];
  empty: string;
}) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;

  return (
    <div className="edge max-w-full overflow-x-auto rounded-[10px]">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                className="h-10 border-b border-[#EAECF0] bg-[#FCFCFD] px-4 text-left text-[12px] font-medium uppercase leading-[18px] tracking-[0.02em] text-[#667085]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            /*
              The rule belongs to the row, not the cell.

              `last:border-b-0` on a <td> matches the last CELL of every row —
              which left a gap at the right-hand end of each rule instead of
              clearing the one under the final row.
            */
            <tr key={i} className="last:[&>td]:border-b-0">
              {cells.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-[#EAECF0] px-4 py-3 align-top text-sm font-normal leading-5 text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type PersonCard = {
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  accountType: string | null;
  status: string | null;
  trustScore: number | null;
};

/** One account in a list, linking to its own detail page. */
export function Person({
  person,
  base,
  sub
}: {
  person: PersonCard;
  /** The served office prefix, so the link survives the code in the path. */
  base: string;
  sub?: string | null;
}) {
  const href = `${base}/users/${
    person.accountType === 'community' || person.accountType === null
      ? 'community'
      : 'agency'
  }?id=${person.id}`;

  return (
    <Link href={href} className="flex min-w-0 items-center gap-3">
      <Avatar src={person.avatarUrl} name={person.name} size={36} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium leading-5 text-gray-900">
          {person.name}
        </span>
        <span className="truncate text-xs font-normal leading-4 text-gray-500">
          {sub ?? (person.username ? `@${person.username}` : '—')}
        </span>
      </span>
    </Link>
  );
}

/**
 * A status word as a pill.
 *
 * The tone is chosen from the word rather than passed in, so that thirty call
 * sites across nine tabs cannot disagree about what "rejected" looks like.
 */
export function Pill({ children }: { children: string | null | undefined }) {
  const value = (children ?? '—').toString();
  const key = value.toLowerCase();

  const good = [
    'active',
    'approved',
    'verified',
    'sent',
    'published',
    'resolved',
    'live',
    'accepted',
    'id_verified',
    'trusted',
    'delivered'
  ];
  const bad = [
    'suspended',
    'rejected',
    'deleted',
    'failed',
    'banned',
    'infected',
    'removed',
    'blocked',
    'revoked',
    'expired',
    'cancelled'
  ];
  const warn = ['pending', 'queued', 'review', 'unverified', 'open', 'waiting', 'draft'];

  const tone = good.includes(key)
    ? 'bg-success-50 text-success-700'
    : bad.includes(key)
      ? 'bg-error-50 text-error-700'
      : warn.includes(key)
        ? 'bg-warning-50 text-warning-700'
        : 'bg-rule text-gray-600';

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-2xl py-1 pl-[9px] pr-3 text-xs font-semibold capitalize leading-[18px] ${tone}`}
    >
      {value.replace(/_/g, ' ')}
    </span>
  );
}

/** A count with its name — the small stat blocks inside a tab. */
export function Tiles({
  tiles
}: {
  tiles: { label: string; value: ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="edge flex flex-col gap-1 rounded-[10px] bg-[#FCFCFD] px-4 py-3"
        >
          <span className="text-xl font-bold leading-7 text-gray-900">{tile.value}</span>
          <span className="text-xs font-normal leading-4 text-gray-500">{tile.label}</span>
        </div>
      ))}
    </div>
  );
}

/** A boolean setting, drawn as the state rather than an editable switch. */
export function Toggle({ on, label }: { on: boolean; label: string }) {
  return (
    <div className="edge flex items-center justify-between gap-4 rounded-[10px] px-4 py-3">
      <span className="text-sm font-normal leading-5 text-gray-700">{label}</span>
      <span
        className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full px-[3px] ${
          on ? 'justify-end bg-success-500' : 'justify-start bg-gray-200'
        }`}
        role="img"
        aria-label={on ? 'On' : 'Off'}
      >
        <span className="h-[18px] w-[18px] rounded-full bg-white" />
      </span>
    </div>
  );
}

/* ------------------------------- formatting ------------------------------ */

export function dateTime(iso: string | Date | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function day(iso: string | Date | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function num(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-NG').format(value);
}

export function words(value: string | null | undefined): string {
  if (!value) return '—';
  return value.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

export function bytes(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

/** "2 hours ago" — how long since, for last-seen columns. */
export function ago(iso: string | Date | null | undefined): string {
  if (!iso) return '—';
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} hr ago`;
  const days = Math.floor(minutes / (60 * 24));
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return day(iso);
}

export function coords(lat: number | null, lng: number | null): string {
  if (lat === null || lng === null) return '—';
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
