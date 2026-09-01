import { NextResponse } from 'next/server';
import {
  OFFICE_SESSION_COOKIE,
  apiBaseUrl
} from '../../../../office/_lib/session';

/**
 * Second leg of login: exchange the challenge token plus a TOTP (or recovery)
 * code for a session, which is set as an httpOnly cookie and never returned to
 * the page. On first login the API also hands back one-time recovery codes;
 * those DO go to the page, because they exist to be written down.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { challengeToken?: string; code?: string }
    | null;

  if (!body?.challengeToken || !body?.code) {
    return NextResponse.json(
      { message: 'A verification code is required.' },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${apiBaseUrl()}/admin/auth/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challengeToken: body.challengeToken,
      code: body.code.trim()
    }),
    cache: 'no-store'
  });

  const payload = (await upstream.json().catch(() => ({}))) as {
    status?: string;
    sessionToken?: string;
    expiresAt?: string;
    recoveryCodes?: string[];
    admin?: { email: string; role: string };
  };

  if (!upstream.ok || payload.status !== 'authenticated' || !payload.sessionToken) {
    return NextResponse.json(
      { message: 'That code was not accepted. Try the next one.' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    recoveryCodes: payload.recoveryCodes ?? null,
    admin: payload.admin ?? null
  });

  response.cookies.set(OFFICE_SESSION_COOKIE, payload.sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: payload.expiresAt ? new Date(payload.expiresAt) : undefined
  });

  return response;
}
