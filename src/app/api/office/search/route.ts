import { NextResponse } from 'next/server';
import { apiBaseUrl, getSessionToken } from '../../../office/_lib/session';

/**
 * The topbar's search box, proxied.
 *
 * The dashboard's session is an httpOnly cookie, so a client component cannot
 * call the API directly — and search has to be a client component, because it
 * runs as you type. This is the narrow seam between the two: it forwards one
 * query parameter and nothing else.
 */
export async function GET(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const q = new URL(request.url).searchParams.get('q') ?? '';
  if (q.trim().length < 2) {
    return NextResponse.json({
      users: [],
      incidents: [],
      posts: [],
      tickets: [],
      broadcasts: []
    });
  }

  const response = await fetch(
    `${apiBaseUrl()}/admin/search?q=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  ).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json(
      { error: 'Search is unavailable right now.' },
      { status: response?.status ?? 502 }
    );
  }

  return NextResponse.json(await response.json());
}
