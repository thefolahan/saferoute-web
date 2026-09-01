import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminProvider } from '../_components/admin-context';
import { getSessionToken, officeBase, officeFetch } from '../_lib/session';

/**
 * Everything under this group requires a live admin session. The login page is
 * deliberately a sibling of the group, not a child, so it is not guarded.
 *
 * The check is a real API call rather than "a cookie exists": a revoked,
 * expired, or tampered token still presents as a cookie, and the dashboard
 * would then render a full shell before its first data fetch failed.
 */
export const dynamic = 'force-dynamic';

export default async function DashboardGroupLayout({
  children
}: {
  children: ReactNode;
}) {
  const base = await officeBase();
  const token = await getSessionToken();

  if (!token) redirect(`${base}/login`);

  const me = await officeFetch<{
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
  }>('/admin/auth/me').catch(() => null);

  if (!me) redirect(`${base}/login`);

  return (
    <AdminProvider
      admin={{
        name: me.fullName ?? me.email.split('@')[0] ?? 'Administrator',
        email: me.email,
        avatarUrl: me.avatarUrl
      }}
    >
      {children}
    </AdminProvider>
  );
}
