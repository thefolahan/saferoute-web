import 'server-only';

import { apiBaseUrl, getSessionToken } from './session';

/**
 * The write half of `officeFetch`.
 *
 * Mutations are called from server actions, whose caller is a form or a button
 * in a client component — so a thrown error there is an unhandled rejection in
 * the browser, not something the screen can show. This returns the failure
 * instead, along with the API's own message where there is one worth reading.
 *
 * It lives beside `session.ts` rather than in it because the session module is
 * the read path and the auth guard; this is the only thing that writes.
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
  if (!token) {
    return { ok: false, error: 'Your session has expired. Sign in again.' };
  }

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

    return {
      ok: false,
      error: message || `That did not work (${response.status}).`
    };
  }

  return { ok: true, data: payload as T };
}
