import { NextResponse } from 'next/server';
import { apiBaseUrl, getSessionToken } from '../../../../office/_lib/session';

/**
 * The Users table as a CSV, filtered exactly as the screen is.
 *
 * The querystring is forwarded whole, so whatever the filter bar has put in
 * the URL is what the export contains — an export of a different set than the
 * one on screen is worse than no export.
 */
export async function GET(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const incoming = new URL(request.url).searchParams;
  const query = new URLSearchParams();

  for (const key of [
    'tab',
    'q',
    'type',
    'status',
    'city',
    'verification',
    'kyc',
    'seeded',
    'joinedFrom',
    'joinedTo',
    'sort',
    'direction'
  ]) {
    const value = incoming.get(key);
    if (value) query.set(key, value);
  }

  const response = await fetch(
    `${apiBaseUrl()}/admin/export/users.csv?${query.toString()}`,
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
      'Content-Disposition': `attachment; filename="saferoute-users-${stamp}.csv"`,
      'Cache-Control': 'no-store'
    }
  });
}
