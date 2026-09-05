'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  SVGProps
} from 'react';

/* ---------------------------------------------------------------------------
   Primitives shared by every O-Dashboard screen. Sizes/colours come straight
   from the Figma node properties — see docs/design/odash-spec/*.txt.
   --------------------------------------------------------------------------- */

/** heroicons-mini/arrow-right, 16x16 (Figma 31:3240). */
export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.40039 7.99999C2.40039 7.66862 2.66902 7.39999 3.00039 7.39999L11.5107 7.39999L8.18453 4.23249C7.94566 4.00281 7.93821 3.62298 8.16789 3.38412C8.39757 3.14526 8.77739 3.13781 9.01626 3.36749L13.4163 7.56749C13.5339 7.68061 13.6004 7.83678 13.6004 7.99999C13.6004 8.1632 13.5339 8.31936 13.4163 8.43249L9.01626 12.6325C8.77739 12.8622 8.39757 12.8547 8.16789 12.6159C7.93821 12.377 7.94566 11.9972 8.18453 11.7675L11.5107 8.59999L3.00039 8.59999C2.66902 8.59999 2.40039 8.33136 2.40039 7.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The 72x28 KPI sparkline (Figma 907:12658 / 907:12707), drawn from a real
 * series.
 *
 * It used to be one exported path repeated on all ten tiles, tinted red on
 * whichever the design tinted red — the same imaginary curve whatever the
 * number above it did. `points` is the metric's own last few days, and the
 * colour follows its actual direction rather than a hardcoded flag.
 *
 * A flat or empty series draws a flat line, which is the honest picture of a
 * metric that has not moved, rather than no chart at all.
 */
export function Sparkline({ points, id }: { points: number[]; id: string }) {
  const width = 72;
  const height = 29;
  const pad = 2;

  const series = points.length >= 2 ? points : [0, 0];
  const min = Math.min(...series);
  const max = Math.max(...series);
  // A flat series has no range to scale by; centre it instead of dividing by 0.
  const span = max - min || 1;
  const flat = max === min;

  const step = (width - pad * 2) / (series.length - 1);
  const coords = series.map((value, index) => {
    const x = pad + index * step;
    const y = flat
      ? height / 2
      : height - pad - ((value - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = coords
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  const area = `${line} L${coords[coords.length - 1]![0].toFixed(1)} ${height} L${coords[0]![0].toFixed(1)} ${height} Z`;

  // Down only when it actually ended lower than it started.
  const down = series[series.length - 1]! < series[0]!;
  const stroke = down ? '#FF383C' : '#3DC47E';
  const gid = `spark-${id.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
          <stop stopColor={stroke} stopOpacity="0.35" />
          <stop offset="1" stopColor={stroke} stopOpacity="0.01" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** _Badge base — pad 4/12, radius 16, Inter 12/18 w500 centred. */
export type BadgeTone =
  | 'error'
  | 'warning'
  | 'success'
  | 'gray'
  | 'bluelight'
  | 'brand'
  | 'dark';

const BADGE_TONES: Record<BadgeTone, string> = {
  error: 'bg-error-50 text-error-700',
  warning: 'bg-warning-50 text-warning-700',
  success: 'bg-success-50 text-success-700',
  gray: 'bg-rule text-gray-600',
  bluelight: 'bg-bluelight-50 text-bluelight-700',
  brand: 'bg-[#F4F3FF] text-brand-600',
  dark: 'bg-gray-100 text-gray-700'
};

export function Badge({
  tone = 'gray',
  children,
  dot = false
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-[6px] rounded-2xl px-3 py-1 text-center text-xs font-medium leading-[18px] ${BADGE_TONES[tone]}`}
    >
      {dot ? <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

/**
 * Input/select shell — 44h, pad 10/14, radius 8, gap 8.
 * `filled` is the topbar's #EEEEEE variant; `outline` is white + Gray/200.
 *
 * With `options` it is a real select bound to a search parameter; without
 * them it is the design's static chip, disabled and saying why on hover, so a
 * picker that cannot filter anything does not look like one that can.
 */
/**
 * The date presets the Support and Verification queues offer.
 *
 * One list rather than two, and it lives here beside `Select` rather than in
 * either screen — one queue importing the other's view file to borrow a
 * constant is a dependency between two unrelated pages.
 *
 * These are presets, not a calendar: the queues are read as "what has come in
 * lately", and every question that actually gets asked of them is a recent
 * window. The page turns the chosen key into the from/to the API takes.
 */
export const RANGES = [
  { value: 'all', label: 'Any date' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' }
];

/** Turns a preset key into the inclusive from/to the API expects. */
export function rangeToDates(key: string | undefined): {
  from?: string;
  to?: string;
} {
  if (!key || key === 'all') return {};

  const days = key === 'today' ? 0 : Number.parseInt(key, 10);
  if (!Number.isFinite(days)) return {};

  const from = new Date();
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);

  return { from: from.toISOString(), to: new Date().toISOString() };
}

export function Select({
  label,
  variant = 'outline',
  weight = 'medium',
  className = '',
  param,
  options,
  unavailable
}: {
  label: string;
  variant?: 'filled' | 'outline';
  weight?: 'normal' | 'medium' | 'semibold';
  className?: string;
  /** The search parameter this picker writes to. */
  param?: string;
  options?: { value: string; label: string }[];
  /** Why this picker does nothing, when it does nothing. */
  unavailable?: string;
}) {
  const weights = { normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold' };
  const shell = `flex h-11 items-center gap-2 rounded-lg px-[14px] py-[10px] ${
    variant === 'filled' ? 'bg-rule' : 'edge-gray200 bg-white'
  } ${className}`;
  const text = `flex-1 text-left text-sm leading-6 text-gray-700 ${weights[weight]}`;

  if (options && param) {
    return <BoundSelect className={shell} textClassName={text} param={param} options={options} />;
  }

  return (
    <button
      type="button"
      disabled
      title={unavailable ?? 'This filter is not wired to the data yet.'}
      className={`${shell} cursor-not-allowed opacity-60`}
    >
      <span className={text}>{label}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-gray-900" />
    </button>
  );
}

/** The working half of `Select`: writes its value to the URL and reloads. */
function BoundSelect({
  className,
  textClassName,
  param,
  options
}: {
  className: string;
  textClassName: string;
  param: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const value = params.get(param) ?? options[0]?.value ?? '';

  return (
    <span className={className}>
      <select
        value={value}
        onChange={(event) => {
          const query = new URLSearchParams(params.toString());
          if (event.target.value === options[0]?.value) query.delete(param);
          else query.set(param, event.target.value);
          query.delete('page');
          const text = query.toString();
          router.replace(text ? `?${text}` : '?', { scroll: false });
        }}
        className={`${textClassName} appearance-none border-0 bg-transparent p-0 outline-none`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="h-4 w-4 shrink-0 text-gray-900" />
    </span>
  );
}

/** heroicons-mini/chevron-down, 16x16 (Figma 31:3994). */
export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.23093 6.20938C4.46059 5.9705 4.84041 5.96302 5.0793 6.19268L8 9.00027L10.9207 6.19268C11.1596 5.96302 11.5394 5.9705 11.7691 6.20938C11.9987 6.44827 11.9913 6.82809 11.7524 7.05775L8.41584 10.2661C8.18374 10.4893 7.81626 10.4893 7.58416 10.2661L4.24759 7.05775C4.00871 6.82809 4.00126 6.44827 4.23093 6.20938Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The 15px-radius white panel every chart/table sits in. */
export function Card({
  children,
  className = '',
  padded = false
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`edge rounded-[15px] bg-white ${padded ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/** "Name & Number" — a card's header row: title left, control right. */
export function CardHeader({
  title,
  action,
  bordered = false
}: {
  title: string;
  action?: ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-7 ${
        bordered ? 'edge-bottom px-5 py-[18px]' : ''
      }`}
    >
      <h2
        className={
          bordered
            ? 'text-xl font-semibold leading-5 tracking-[-0.4px] text-gray-700'
            : 'text-sm font-semibold uppercase leading-[17px] text-gray-700'
        }
      >
        {title}
      </h2>
      {action}
    </div>
  );
}

/** The bordered pill button used for "Investigate" (40h, 15/24) and "Edit"
    (36h, 14/20). Both are pad 8/18 with a 1px inside hairline.

    `as` lets a row render it as a Link where the control is navigation rather
    than a mutation; the styling is identical either way. */
export function GhostButton<T extends ElementType = 'button'>({
  children,
  size = 'md',
  className = '',
  as,
  ...rest
}: {
  children: ReactNode;
  size?: 'md' | 'sm';
  className?: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'children' | 'className' | 'size' | 'as'>) {
  const Component = (as ?? 'button') as ElementType;
  const type = size === 'md' ? 'text-[15px] leading-6' : 'text-[14px] leading-5';

  return (
    <Component
      {...(as ? {} : { type: 'button' })}
      {...rest}
      className={`edge flex items-center gap-2 rounded-lg px-[18px] py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 ${type} ${className}`}
    >
      {children}
    </Component>
  );
}

/** heroicons-outline/magnifying-glass, 20x20. */
export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchInput({
  placeholder,
  className = ''
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <div
      className={`edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-white px-[14px] py-[10px] ${className}`}
    >
      <SearchIcon className="h-5 w-5 shrink-0 text-gray-500" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full flex-1 border-0 bg-transparent text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-500"
      />
    </div>
  );
}
