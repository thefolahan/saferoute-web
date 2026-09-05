import { officeFetch } from '../../_lib/session';
import { AuditView, type AuditRow } from './audit-view';

export const dynamic = 'force-dynamic';

type ApiAudit = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  actions: string[];
  admins: { id: string; name: string }[];
  rows: {
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    beforeJson: unknown;
    afterJson: unknown;
    ipAddress: string | null;
    createdAt: string;
    admin: { id: string; fullName: string | null; email: string; avatarUrl: string | null };
  }[];
};

export default async function AuditLogPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams({ page: params.page ?? '1' });

  for (const key of ['q', 'adminId', 'action', 'entityType', 'entityId'] as const) {
    const value = params[key];
    if (value) query.set(key, value);
  }

  const data = await officeFetch<ApiAudit>(`/admin/audit-log?${query.toString()}`);

  return (
    <AuditView
      rows={(data?.rows ?? []).map(
        (row): AuditRow => ({
          id: row.id,
          adminName: row.admin.fullName ?? row.admin.email.split('@')[0]!,
          adminEmail: row.admin.email,
          adminAvatar: row.admin.avatarUrl,
          action: row.action,
          entityType: row.entityType,
          entityId: row.entityId,
          before: row.beforeJson,
          after: row.afterJson,
          ipAddress: row.ipAddress,
          createdAt: row.createdAt
        })
      )}
      actions={data?.actions ?? []}
      admins={data?.admins ?? []}
      page={data?.page ?? 1}
      pageCount={data?.pageCount ?? 1}
      pageLabel={pageLabel(data)}
    />
  );
}

function pageLabel(data: ApiAudit | null): string {
  if (!data || data.total === 0) return 'Nothing recorded yet';
  const first = (data.page - 1) * data.pageSize + 1;
  const last = Math.min(data.page * data.pageSize, data.total);
  return `Showing ${first}–${last} of ${data.total}`;
}
