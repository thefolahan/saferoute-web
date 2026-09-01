import { NextResponse, type NextRequest } from 'next/server';

/**
 * The admin dashboard is not served at a guessable path. Its routes live under
 * `app/office/*`, but the only URL that reaches them is
 * `/office-<code>/*`, where <code> comes from ADMIN_OFFICE_CODE.
 *
 * Two rules, both enforced here rather than in the pages:
 *   1. `/office-<code>/...`  ->  rewritten to `/office/...` (URL stays as typed)
 *   2. `/office` or `/office/...` requested directly  ->  404
 *
 * The obscure path is not the security boundary — the admin session is (see
 * app/office/login). It only keeps the dashboard out of casual scans and
 * crawler logs. Rotating it is an env change and a redeploy; nothing in the
 * app hardcodes it, because the client derives its link base from the URL it
 * was actually served on (see app/office/_lib/office-path.ts).
 */
const OFFICE_CODE = process.env.ADMIN_OFFICE_CODE?.trim();

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rule 2 — the internal path is never reachable from outside.
  if (pathname === '/office' || pathname.startsWith('/office/')) {
    return new NextResponse(null, { status: 404 });
  }

  if (!pathname.startsWith('/office-')) return NextResponse.next();

  // Without a configured code the dashboard is simply not routable, which is a
  // safer default than falling back to something guessable.
  if (!OFFICE_CODE) return new NextResponse(null, { status: 404 });

  const rest = pathname.slice('/office-'.length);
  const slash = rest.indexOf('/');
  const code = slash === -1 ? rest : rest.slice(0, slash);
  const tail = slash === -1 ? '' : rest.slice(slash);

  if (code !== OFFICE_CODE) return new NextResponse(null, { status: 404 });

  const url = request.nextUrl.clone();
  url.pathname = `/office${tail}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * `/office-:path*` does NOT match: a repeatable segment param cannot follow a
   * literal prefix inside the same segment. `:code` is a single-segment param,
   * which does, so the code segment and the tail are matched separately.
   */
  matcher: ['/office', '/office/:path*', '/office-:code', '/office-:code/:path*']
};
