import { officeFetch } from '../../_lib/session';
import {
  SecurityView,
  type AdminAccount,
  type Attempt,
  type Session
} from './security-view';

export const dynamic = 'force-dynamic';

type ApiSecurity = {
  activeSessions: {
    id: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    lastSeenAt: string;
    expiresAt: string;
    admin: { id: string; fullName: string | null; email: string; avatarUrl: string | null };
  }[];
  recentAttempts: {
    id: string;
    email: string;
    success: boolean;
    reason: string;
    ipAddress: string | null;
    createdAt: string;
  }[];
  admins: {
    id: string;
    email: string;
    fullName: string | null;
    status: string;
    mfaEnabled: boolean;
    failedLoginAttempts: number;
    lockedUntil: string | null;
    passwordChangedAt: string | null;
    lastLoginAt: string | null;
    role: { name: string };
  }[];
  failedByEmail: { email: string; failures: number }[];
};

export default async function SecurityPage() {
  const data = await officeFetch<ApiSecurity>('/admin/security');

  return (
    <SecurityView
      sessions={(data?.activeSessions ?? []).map(
        (row): Session => ({
          id: row.id,
          adminName: row.admin.fullName ?? row.admin.email.split('@')[0]!,
          adminEmail: row.admin.email,
          adminAvatar: row.admin.avatarUrl,
          ipAddress: row.ipAddress,
          userAgent: row.userAgent,
          createdAt: row.createdAt,
          lastSeenAt: row.lastSeenAt,
          expiresAt: row.expiresAt
        })
      )}
      attempts={(data?.recentAttempts ?? []) as Attempt[]}
      admins={(data?.admins ?? []).map(
        (row): AdminAccount => ({
          id: row.id,
          email: row.email,
          fullName: row.fullName,
          status: row.status,
          roleName: row.role.name,
          mfaEnabled: row.mfaEnabled,
          failedLoginAttempts: row.failedLoginAttempts,
          lockedUntil: row.lockedUntil,
          passwordChangedAt: row.passwordChangedAt,
          lastLoginAt: row.lastLoginAt
        })
      )}
      failedByEmail={data?.failedByEmail ?? []}
    />
  );
}
