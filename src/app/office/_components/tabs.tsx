'use client';

import type { ReactNode } from 'react';

/* Figma 907:12983 — the underlined tab bar.
   Track: 52h, 1px inside hairline along the bottom.
   Active tab: 3px black bottom rule, label #000; inactive label Gray/600.
   Count pill: pad 3/9, radius 24, Gray/200 bg, Inter 14/16 w600 ls-0.5. */

export type TabDef = { id: string; label: string; count?: string };

export function Tabs({
  tabs,
  active,
  onChange
}: {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="edge-bottom flex items-center">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex h-[52px] items-center justify-center gap-[10px] px-[22px] ${
              isActive ? 'shadow-[inset_0_-3px_0_0_#000000]' : ''
            }`}
          >
            <span
              className={`text-base font-semibold leading-[19px] ${
                isActive ? 'text-black' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </span>
            {tab.count !== undefined ? (
              <span className="inline-flex items-center justify-center rounded-3xl bg-gray-200 px-[9px] py-[3px] text-sm font-semibold leading-4 tracking-[-0.5px] text-gray-700">
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** "Go back" — Figma 907:12975, pad 10/14 gap 8 radius 8, 14/24 w700. */
export function GoBack({ children = 'Go back' }: { children?: ReactNode }) {
  return (
    <button
      type="button"
      className="flex w-fit items-center gap-2 rounded-lg px-[14px] py-[10px] text-sm font-bold leading-6 text-gray-700 transition-colors hover:bg-gray-50"
    >
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rotate-180 text-gray-900">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.40039 7.99999C2.40039 7.66862 2.66902 7.39999 3.00039 7.39999L11.5107 7.39999L8.18453 4.23249C7.94566 4.00281 7.93821 3.62298 8.16789 3.38412C8.39757 3.14526 8.77739 3.13781 9.01626 3.36749L13.4163 7.56749C13.5339 7.68061 13.6004 7.83678 13.6004 7.99999C13.6004 8.1632 13.5339 8.31936 13.4163 8.43249L9.01626 12.6325C8.77739 12.8622 8.39757 12.8547 8.16789 12.6159C7.93821 12.377 7.94566 11.9972 8.18453 11.7675L11.5107 8.59999L3.00039 8.59999C2.66902 8.59999 2.40039 8.33136 2.40039 7.99999Z"
          fill="currentColor"
        />
      </svg>
      {children}
    </button>
  );
}
