import { NextResponse } from 'next/server';
import { apiBaseUrl, getSessionToken } from '../../../../../office/_lib/session';

/**
 * Download one account's full record as JSON.
 *
 * A route handler rather than a link straight at the API, for the same reason
 * the writes are server actions: the admin session is an httpOnly cookie the
 * browser's JavaScript cannot read, and the API wants it as a bearer token. So
 * the browser asks the site, the site asks the API with the token, and the
 * token never leaves the server.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const response = await fetch(`${apiBaseUrl()}/admin/users/${id}/export`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json(
      { error: 'That record could not be exported.' },
      { status: response?.status ?? 502 }
    );
  }

  const body = await response.text();

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A short id in the filename so two exports in a folder stay apart.
      'Content-Disposition': `attachment; filename="saferoute-user-${id.slice(0, 8)}.json"`,
      'Cache-Control': 'no-store'
    }
  });
}
