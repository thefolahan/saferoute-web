import { NextResponse } from 'next/server';
import { apiBaseUrl, getSessionToken } from '../../../../office/_lib/session';

/**
 * The Analytics figures as a CSV.
 *
 * The screen's Export button was disabled with "not built yet". It is a flat
 * list of labelled numbers rather than a rendering of the charts: what somebody
 * exporting these wants is the figures in a spreadsheet, and a picture of a
 * chart cannot be summed.
 */
export async function GET(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const days = new URL(request.url).searchParams.get('days') ?? '30';

  const response = await fetch(
    `${apiBaseUrl()}/admin/analytics?days=${encodeURIComponent(days)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  ).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json(
      { error: 'That export could not be produced.' },
      { status: response?.status ?? 502 }
    );
  }

  const data = (await response.json()) as Record<string, unknown>;

  const rows: [string, unknown][] = [];

  /**
   * Flattened one level: the payload is groups of named numbers, and a column
   * per group with a row per metric reads as a table rather than as JSON with
   * commas in it.
   */
  for (const [group, value] of Object.entries(data)) {
    if (value === null || typeof value !== 'object') {
      rows.push([group, value]);
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, i) => {
        if (entry && typeof entry === 'object') {
          for (const [k, v] of Object.entries(entry as Record<string, unknown>)) {
            rows.push([`${group}[${i}].${k}`, v]);
          }
        } else {
          rows.push([`${group}[${i}]`, entry]);
        }
      });
      continue;
    }
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      rows.push([`${group}.${k}`, v]);
    }
  }

  const cell = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const text = String(value);
    // A leading =, +, - or @ is a formula to a spreadsheet.
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const csv = [
    'metric,value',
    `"window","${days === '0' ? 'All time' : `Last ${days} days`}"`,
    ...rows.map(([k, v]) => `${cell(k)},${cell(v)}`)
  ].join('\n');

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="saferoute-analytics-${stamp}.csv"`,
      'Cache-Control': 'no-store'
    }
  });
}
