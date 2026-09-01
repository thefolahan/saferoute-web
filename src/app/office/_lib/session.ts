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

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });
  } catch (error) {
    /**
     * The API being unreachable should degrade a panel to its empty state, not
     * take the whole dashboard down with an error boundary — a moderator with
     * eight working panels and one empty is better off than one staring at a
     * stack trace.
     */
    console.error(`[office] ${path} unreachable`, error);
    return null;
  }

  if (response.status === 401) return null;

  if (!response.ok) {
    console.error(`[office] ${path} failed: ${response.status}`);
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[office] ${path} returned invalid JSON`, error);
    return null;
  }
}

/**
 * The write half of `officeFetch`.
 *
 * Mutations are called from server actions, whose caller is a form or a button
 * in a client component — so a thrown error there is an unhandled rejection in
 * the browser, not something the screen can show. This returns the failure
 * instead, and the API's own message with it where there is one worth reading.
 */
export type OfficeResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function officeSend<T = unknown>(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<OfficeResult<T>> {
  const token = await getSessionToken();
  if (!token) return { ok: false, error: 'Your session has expired. Sign in again.' };

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store'
    });
  } catch {
    return { ok: false, error: 'Could not reach the API. Try again.' };
  }

  if (response.status === 401) {
    return { ok: false, error: 'Your session has expired. Sign in again.' };
  }

  const payload = (await response.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  if (!response.ok) {
    // Nest's validation pipe returns `message` as an array of field errors.
    const message = Array.isArray(payload?.message)
      ? payload.message.join('. ')
      : payload?.message;

    return { ok: false, error: message || `That did not work (${response.status}).` };
  }

  return { ok: true, data: payload as T };
}
