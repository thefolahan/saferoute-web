import { NextResponse } from 'next/server';
import {
  OFFICE_SESSION_COOKIE,
  apiBaseUrl,
  getSessionToken
} from '../../../office/_lib/session';

/**
 * Login and logout for the dashboard. The browser never sees the session
 * token: it is exchanged here and stored in an httpOnly cookie.
 *
 * The API enforces TOTP on every account, so a correct password returns a
 * challenge rather than a session — either `mfa_setup_required` (first login,
 * with a QR to enrol) or `mfa_required`. Only ./mfa can mint a session.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${apiBaseUrl()}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: 'no-store'
  });

  const payload = (await upstream.json().catch(() => ({}))) as {
    status?: string;
    sessionToken?: string;
    expiresAt?: string;
    admin?: { email: string; role: string };
  };

  if (!upstream.ok) {
    // Never echo the API's reason back — it distinguishes "no such admin" from
    // "wrong password", which is a user-enumeration oracle.
    return NextResponse.json(
      { message: 'Those credentials did not match an admin account.' },
      { status: 401 }
    );
  }

  /**
   * With ADMIN_MFA_REQUIRED=false the API answers a correct password with a
   * session rather than a challenge, so the cookie is set here as well as in
   * ./mfa. The token still never reaches the page: it goes straight into an
   * httpOnly cookie and what comes back says only that it worked.
   */
  if (payload.status === 'authenticated' && payload.sessionToken) {
    const response = NextResponse.json({
      status: 'authenticated',
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

  return NextResponse.json(payload);
}

export async function DELETE() {
  const token = await getSessionToken();

  if (token) {
    // Best effort: revoke server-side too, but always clear the cookie.
    await fetch(`${apiBaseUrl()}/admin/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    }).catch(() => undefined);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(OFFICE_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}
