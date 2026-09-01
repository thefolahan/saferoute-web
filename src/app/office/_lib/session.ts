import 'server-only';

import { cookies, headers } from 'next/headers';

/**
 * The admin session token never reaches client JavaScript. The browser holds an
 * httpOnly cookie; every call to the NestJS API is made from the server with
 * that token as a bearer, so an XSS on the dashboard cannot read or exfiltrate
 * it. That is also why the API base URL below is the server-only one.
 */
export const OFFICE_SESSION_COOKIE = 'sr_office_session';

export function apiBaseUrl(): string {
  const base =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:3000/api/v1';
  return base.replace(/\/$/, '');
}

export async function getSessionToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(OFFICE_SESSION_COOKIE)?.value;
}

/**
 * The external prefix the request arrived on (`/office-<code>`), stashed by
 * src/proxy.ts. Server components are rewritten to `/office/...` and cannot
 * otherwise know the code, so redirects would land on a 404 without this.
 */
export async function officeBase(): Promise<string> {
  const h = await headers();
  return h.get('x-office-base') ?? '/office';
}

export type AdminIdentity = { id: string; email: string; role: string };

/** Calls the API with the admin session. `null` means "not authenticated". */
export async function officeFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }
  return (await response.json()) as T;
}
