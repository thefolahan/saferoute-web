'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownIcon,
  ArrowRightSmall,
  BellIcon,
  ChevronDownIcon,
  InviteIcon,
  LogOutIcon,
  SettingsIcon,
  UserOutlineIcon
} from './icons';
import { officeHref, useOfficeBase } from '../_lib/office-path';
import { Avatar } from './avatar';
import { useAdmin } from './admin-context';
import { useNav } from './nav-state';
import { GlobalSearch } from './global-search';

/* Figma 907:17300 "Frame 33602" (with region/state filters) and its sibling
   "Frame 33603" (without). 1190x72, pad 8/32, 1px bottom hairline. */
/**
 * What the topbar's Region and State pickers should offer.
 *
 * They used to be permanently disabled: every screen queried by city and no
 * endpoint took either. They work now, but only where the screen behind them
 * does — so this is passed in by the screens that filter on it, and the
 * pickers are simply absent elsewhere rather than present and dead.
 */
export type TopbarFilters = { regions: string[]; states: string[] };

export function Topbar({
  title,
  filters
}: {
  title: string;
  filters?: TopbarFilters;
}) {
  const admin = useAdmin();
  const { toggle } = useNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between gap-4 edge-bottom bg-white px-4 py-2 sm:px-6 lg:gap-10 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Drawer toggle — the sidebar is off-canvas below lg. */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Open menu"
          className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-navy lg:hidden"
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h1 className="truncate text-lg font-bold leading-[29px] text-navy sm:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center justify-center gap-5">
        {/* One box for every record — see GlobalSearch for why it proxies. */}
        <GlobalSearch />

        {filters ? (
          <div className="hidden items-center gap-5 xl:flex">
            <FilterSelect
              label="All Region"
              param="region"
              options={filters.regions}
            />
            <FilterSelect
              label="All State"
              param="state"
              options={filters.states}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-5">
          {/*
            There is no admin notification feed — `notification_logs` are a
            citizen's, and nothing writes one for an admin. Disabled with the
            reason rather than a bell that opens nothing.
          */}
          <button
            type="button"
            disabled
            aria-label="Notifications"
            title="An admin notification feed has not been built yet."
            className="flex h-10 w-[42px] cursor-not-allowed items-center justify-center rounded-full bg-rule px-[9px] opacity-50"
          >
            <BellIcon className="h-6 w-6 text-navy" />
          </button>

          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className="flex items-center gap-2"
            >
              <Avatar
                src={admin?.avatarUrl}
                name={admin?.name ?? 'Signed-in admin'}
                size={40}
              />
              <span className="flex h-6 w-6 items-center justify-center">
                <ArrowDownIcon className="h-[7px] w-3 text-navy" />
              </span>
            </button>

            {menuOpen ? <ProfileMenu onClose={() => setMenuOpen(false)} /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}

/* Figma 907:19189 "Profile pop up" — 308x330, pad 20/15, radius 12,
   shadow 0 8 32 rgba(0,0,0,.24). */
function ProfileMenu({ onClose }: { onClose: () => void }) {
  const admin = useAdmin();
  const base = useOfficeBase();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    // Revokes the session server-side and clears the httpOnly cookie; the
    // refresh is what makes the guard bounce us to the login page.
    await fetch('/api/office/session', { method: 'DELETE' }).catch(
      () => undefined
    );
    onClose();
    router.replace(`${base}/login`);
    router.refresh();
  }
  const items = [
    { label: 'My Profile', href: officeHref(base, 'configuration'), Icon: UserOutlineIcon, active: true },
    { label: 'Settings', href: officeHref(base, 'configuration'), Icon: SettingsIcon, active: false },
    { label: 'Invite a member', href: officeHref(base, 'access-control'), Icon: InviteIcon, active: false }
  ];

  return (
    <div className="absolute right-0 top-[52px] z-40 w-[308px] rounded-xl bg-white px-[15px] py-5 shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-[9px]">
            <Avatar
              src={admin?.avatarUrl}
              name={admin?.name ?? 'Administrator'}
              size={70}
            />
            <span className="flex flex-col justify-center gap-[7px]">
              <span className="text-base font-semibold leading-[18px] text-[#1F2937]">
                {admin?.name ?? 'Administrator'}
              </span>
              <span className="text-xs leading-4 text-[#6B7280]">
                {admin?.email ?? ''}
              </span>
            </span>
          </div>
          <span className="h-px w-full bg-[#E5E7EB]" />
        </div>

        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between gap-[10px] px-[10px] py-[10px] ${
                item.active ? 'bg-[#F9FAFB]' : ''
              }`}
            >
              <span className="flex items-center gap-[10px]">
                <item.Icon className="h-6 w-6 text-gray-700" />
                <span className="text-sm font-semibold leading-5 text-gray-700">{item.label}</span>
              </span>
              <ArrowRightSmall className="h-6 w-6 text-gray-700" />
            </Link>
          ))}

          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex items-center gap-[10px] px-[10px] py-[10px] disabled:opacity-60"
          >
            <LogOutIcon className="h-6 w-6 text-error-500" />
            <span className="text-sm font-semibold leading-5 text-error-500">
              {signingOut ? 'Signing out…' : 'Log Out'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * One of the topbar's region/state pickers, bound to a search parameter.
 *
 * Region is a grouping of states rather than a column on anything, so the
 * expansion lives server-side and this only sends the name — see
 * NIGERIA_REGIONS in the API. Choosing a region clears any state and vice
 * versa: they are two ways of asking the same question, and holding both would
 * mean silently ignoring one.
 */
function FilterSelect({
  label,
  param,
  options
}: {
  label: string;
  param: 'region' | 'state';
  options: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const value = params.get(param) ?? '';

  return (
    <span className="flex h-11 w-[172px] items-center gap-2 rounded-lg bg-rule px-[14px] py-[10px]">
      <select
        value={value}
        aria-label={label}
        onChange={(event) => {
          const query = new URLSearchParams(params.toString());
          query.delete(param === 'region' ? 'state' : 'region');
          if (event.target.value) query.set(param, event.target.value);
          else query.delete(param);
          const text = query.toString();
          router.replace(text ? `?${text}` : '?', { scroll: false });
        }}
        className="flex-1 cursor-pointer appearance-none bg-transparent text-sm font-normal leading-6 text-gray-700 outline-none"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-900" />
    </span>
  );
}
