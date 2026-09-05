import { NextResponse } from 'next/server';
import { apiBaseUrl, getSessionToken } from '../../../../office/_lib/session';

/**
 * The waitlist as a CSV, filtered exactly as the screen is.
 *
 * Through the site rather than straight at the API, like the other exports:
 * the admin session is an httpOnly cookie and the API wants a bearer token.
 */
export async function GET(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const incoming = new URL(request.url).searchParams;
  const query = new URLSearchParams();

  for (const key of ['q', 'source']) {
    const value = incoming.get(key);
    if (value) query.set(key, value);
  }

  const response = await fetch(
    `${apiBaseUrl()}/admin/export/waitlist.csv?${query.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  ).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json(
      { error: 'That export could not be produced.' },
      { status: response?.status ?? 502 }
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(await response.text(), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="saferoute-waitlist-${stamp}.csv"`,
      'Cache-Control': 'no-store'
    }
  });
}
