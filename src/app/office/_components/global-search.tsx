'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SearchLgIcon } from './icons';
import { useOfficeBase } from '../_lib/office-path';
import { Avatar } from './avatar';

/**
 * One box, every kind of record.
 *
 * The dashboard could search users on the Users screen and incidents on the
 * Incidents screen, and there was nowhere to paste a reference — a ticket
 * number, an incident's public id, a UUID out of a log — and be taken to
 * whatever it names. This is that box.
 *
 * It goes through `/api/office/search` rather than at the API, because the
 * admin session is an httpOnly cookie this component cannot read.
 */

type Results = {
  users: {
    id: string;
    name: string;
    reference: string;
    username: string | null;
    avatarUrl: string | null;
    accountType: string;
    city: string | null;
  }[];
  incidents: { id: string; publicId: string; title: string; city: string; status: string }[];
  posts: {
    id: string;
    caption: string;
    status: string;
    author: { displayName: string | null; username: string | null };
  }[];
  tickets: { id: string; reference: string; subject: string | null; status: string }[];
  broadcasts: { id: string; title: string; status: string; city: string | null }[];
};

const EMPTY: Results = {
  users: [],
  incidents: [],
  posts: [],
  tickets: [],
  broadcasts: []
};

export function GlobalSearch() {
  const base = useOfficeBase();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Results>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    const query = term.trim();

    if (query.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }

    /**
     * Debounced, and the in-flight request is abandoned when the term moves
     * on — otherwise a slow answer to "jo" lands on top of the answer to
     * "joshua" and the list flickers backwards.
     */
    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/office/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal
      })
        .then((response) => (response.ok ? response.json() : EMPTY))
        .then((data: Results) => {
          setResults({ ...EMPTY, ...data });
          setLoading(false);
        })
        .catch(() => undefined);
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const total =
    results.users.length +
    results.incidents.length +
    results.posts.length +
    results.tickets.length +
    results.broadcasts.length;

  return (
    <div ref={box} className="relative hidden md:block">
      <div className="edge-gray200 flex h-10 w-[260px] items-center gap-2 rounded-lg bg-[#F6F6F6] px-[12px] lg:w-[320px]">
        <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-500" />
        <input
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search users, reports, tickets…"
          aria-label="Search everything"
          className="w-full bg-transparent text-sm font-normal leading-5 text-gray-900 outline-none placeholder:text-gray-500"
        />
      </div>

      {open && term.trim().length >= 2 ? (
        <div className="absolute right-0 top-[46px] z-40 max-h-[70vh] w-[420px] overflow-y-auto rounded-xl bg-white p-2 shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
          {loading && total === 0 ? (
            <p className="px-3 py-4 text-sm leading-5 text-gray-500">Searching…</p>
          ) : null}

          {!loading && total === 0 ? (
            <p className="px-3 py-4 text-sm leading-5 text-gray-500">
              Nothing matches “{term.trim()}”.
            </p>
          ) : null}

          <Group label="Users" show={results.users.length > 0}>
            {results.users.map((user) => (
              <Row
                key={user.id}
                href={`${base}/users/${
                  user.accountType === 'community' ? 'community' : 'agency'
                }?id=${user.id}`}
                onGo={() => setOpen(false)}
                icon={<Avatar src={user.avatarUrl} name={user.name} size={32} />}
                title={user.name}
                sub={[user.username ? `@${user.username}` : null, user.reference, user.city]
                  .filter(Boolean)
                  .join(' · ')}
              />
            ))}
          </Group>

          <Group label="Reports" show={results.incidents.length > 0}>
            {results.incidents.map((incident) => (
              <Row
                key={incident.id}
                href={`${base}/incidents?id=${incident.id}`}
                onGo={() => setOpen(false)}
                title={incident.title}
                sub={`${incident.publicId} · ${incident.city} · ${incident.status.replace(/_/g, ' ')}`}
              />
            ))}
          </Group>

          <Group label="Posts" show={results.posts.length > 0}>
            {results.posts.map((post) => (
              <Row
                key={post.id}
                href={`${base}/contents?id=${post.id}`}
                onGo={() => setOpen(false)}
                title={post.caption}
                sub={`${
                  post.author.displayName ??
                  (post.author.username ? `@${post.author.username}` : 'Unknown')
                } · ${post.status}`}
              />
            ))}
          </Group>

          <Group label="Support tickets" show={results.tickets.length > 0}>
            {results.tickets.map((ticket) => (
              <Row
                key={ticket.id}
                href={`${base}/support?id=${ticket.id}`}
                onGo={() => setOpen(false)}
                title={ticket.subject ?? ticket.reference}
                sub={`${ticket.reference} · ${ticket.status}`}
              />
            ))}
          </Group>

          <Group label="Live broadcasts" show={results.broadcasts.length > 0}>
            {results.broadcasts.map((live) => (
              <Row
                key={live.id}
                href={`${base}/contents?live=${live.id}`}
                onGo={() => setOpen(false)}
                title={live.title}
                sub={[live.city, live.status].filter(Boolean).join(' · ')}
              />
            ))}
          </Group>
        </div>
      ) : null}
    </div>
  );
}

function Group({
  label,
  show,
  children
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;

  return (
    <div className="flex flex-col">
      <span className="px-3 pb-1 pt-3 text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-gray-400">
        {label}
      </span>
      {children}
    </div>
  );
}

function Row({
  href,
  title,
  sub,
  icon,
  onGo
}: {
  href: string;
  title: string;
  sub: string;
  icon?: React.ReactNode;
  onGo: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onGo}
      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#F9FAFB]"
    >
      {icon}
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium leading-5 text-gray-900">{title}</span>
        <span className="truncate text-xs font-normal leading-4 text-gray-500">{sub}</span>
      </span>
    </Link>
  );
}
