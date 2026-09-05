import { NextResponse } from 'next/server';
import { apiBaseUrl, getSessionToken } from '../../../../../../office/_lib/session';

/**
 * Open one of an account's uploaded files.
 *
 * The API mints a short-lived signed URL for the object; this asks for it with
 * the admin session and redirects the browser there, so the moderator clicks a
 * link and sees the file. The alternative — putting signed URLs in the page —
 * would mean signing every file on the tab whether or not anybody looks at
 * one, and leaving those URLs in the HTML afterwards.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const { id, mediaId } = await params;
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const response = await fetch(
    `${apiBaseUrl()}/admin/users/${id}/media/${mediaId}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  ).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json(
      { error: 'That file could not be opened.' },
      { status: response?.status ?? 502 }
    );
  }

  const payload = (await response.json()) as { url?: string };

  if (!payload.url) {
    return NextResponse.json({ error: 'No URL for that file.' }, { status: 502 });
  }

  // 302, not 301: the signed URL expires, so it must never be cached as the
  // permanent home of this path.
  return NextResponse.redirect(payload.url, 302);
}
