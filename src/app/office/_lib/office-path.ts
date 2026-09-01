'use client';

import { usePathname } from 'next/navigation';

/**
 * The dashboard is reached at `/office-<code>` and rewritten to `/office` by
 * src/proxy.ts, so the browser URL keeps the code but the route tree does not
 * know it. Nothing hardcodes the code: links are built from the prefix the
 * page was actually served on, which means rotating ADMIN_OFFICE_CODE is an
 * env change alone.
 */
export function useOfficeBase(): string {
  const pathname = usePathname();
  const first = pathname.split('/')[1] ?? '';
  return first.startsWith('office-') ? `/${first}` : '/office';
}

/** Build an absolute href from a dashboard-relative route ('' = the index). */
export function officeHref(base: string, route: string): string {
  return route ? `${base}/${route}` : base;
}
