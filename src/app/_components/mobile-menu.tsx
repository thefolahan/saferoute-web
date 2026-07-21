'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Tab = { label: string; href: string };

/**
 * Mobile nav — a hamburger that opens a full-screen menu (the Figma mobile
 * frames show a logo + hamburger, no inline tabs). Shown below lg only.
 */
export function MobileMenu({
  tabs,
  active,
  dark
}: {
  tabs: readonly Tab[];
  active?: string;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex h-10 w-10 items-center justify-center ${
          dark ? 'text-white' : 'text-gray-950'
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex h-20 items-center justify-between px-6">
            <span className="text-[22px] font-semibold text-gray-950">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-gray-950"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-6 pt-4">
            {tabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                onClick={() => setOpen(false)}
                aria-current={tab.label === active ? 'page' : undefined}
                className={`rounded-xl px-4 py-4 text-[22px] transition-colors ${
                  tab.label === active
                    ? 'bg-gray-100 font-semibold text-gray-950'
                    : 'font-medium text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <Link
              href="#download"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center rounded-full bg-gray-950 px-6 py-4 text-[16px] font-semibold text-white"
            >
              Download App
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
