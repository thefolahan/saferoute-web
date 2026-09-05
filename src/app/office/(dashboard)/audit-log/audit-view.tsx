'use client';

import { Shell } from '../../_components/shell';
import { FilterBar, FilterField } from '../../_components/filter-bar';
import { DataTable, Pagination, type Column } from '../../_components/table';
import { Avatar } from '../../_components/avatar';

/**
 * Every write the dashboard has made.
 *
 * The audit table has been written on every admin action since the API was
 * built and nothing could read one back — a trail nobody can see does not do
 * the job a trail is for. Two questions it answers: what has this moderator
 * been doing, and who touched this account.
 */

const COLUMNS: Column[] = [
  { key: 'admin', label: 'ADMIN', width: 260, pad: 32 },
  { key: 'action', label: 'ACTION', width: 220 },
  { key: 'entity', label: 'SUBJECT', width: 200 },
  { key: 'change', label: 'CHANGE', width: 360 },
  { key: 'ip', label: 'FROM', width: 150 },
  { key: 'when', label: 'WHEN', width: 180, pad: 32, align: 'right' }
];

export type AuditRow = {
  id: string;
  adminName: string;
  adminEmail: string;
  adminAvatar: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  before: unknown;
  after: unknown;
  ipAddress: string | null;
  createdAt: string;
};

export function AuditView({
  rows,
  actions,
  admins,
  page,
  pageCount,
  pageLabel
}: {
  rows: AuditRow[];
  /** The actions that actually appear in the log, for the filter's options. */
  actions: string[];
  admins: { id: string; name: string }[];
  page: number;
  pageCount: number;
  pageLabel: string;
}) {
  return (
    <Shell title="Audit log">
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col">
          <div className="px-4 pt-[15px] sm:px-6 lg:px-8">
            <p className="max-w-[760px] text-sm font-normal leading-5 text-gray-500">
              Every change made from this dashboard, with what it changed from
              and to. Written automatically — there is nothing here to turn on.
            </p>
          </div>

          <FilterBar>
            <FilterField placeholder="Search the log" param="q" width={360} search />
            <FilterField
              placeholder="Admin"
              param="adminId"
              width={240}
              options={admins.map((admin) => ({ value: admin.id, label: admin.name }))}
            />
            <FilterField
              placeholder="Action"
              param="action"
              width={260}
              options={actions.map((action) => ({
                value: action,
                label: label(action)
              }))}
            />
            <FilterField
              placeholder="Subject type"
              param="entityType"
              width={200}
              options={[
                { value: 'user', label: 'User' },
                { value: 'incident', label: 'Incident' },
                { value: 'feed_post', label: 'Post' },
                { value: 'broadcast', label: 'Broadcast' },
                { value: 'admin_user', label: 'Admin' },
                { value: 'admin_session', label: 'Admin session' }
              ]}
            />
          </FilterBar>
        </div>

        <div className="flex flex-col">
          <DataTable
            columns={COLUMNS}
            rows={rows}
            rowKey={(row) => row.id}
            empty="Nothing matches these filters."
            cell={(row, key) => {
              switch (key) {
                case 'admin':
                  return (
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar src={row.adminAvatar} name={row.adminName} size={36} />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium leading-5 text-gray-900">
                          {row.adminName}
                        </span>
                        <span className="truncate text-xs font-normal leading-4 text-gray-500">
                          {row.adminEmail}
                        </span>
                      </span>
                    </span>
                  );
                case 'action':
                  return (
                    <span className="text-sm font-medium leading-5 text-gray-900">
                      {label(row.action)}
                    </span>
                  );
                case 'entity':
                  return (
                    <span className="flex flex-col">
                      <span className="text-sm font-normal leading-5 text-gray-700">
                        {label(row.entityType)}
                      </span>
                      {row.entityId ? (
                        <span className="text-xs font-normal leading-4 text-gray-400">
                          {row.entityId.slice(0, 8)}
                        </span>
                      ) : null}
                    </span>
                  );
                case 'change':
                  return <Change before={row.before} after={row.after} />;
                case 'ip':
                  return (
                    <span className="text-sm font-normal leading-5 text-gray-500">
                      {row.ipAddress ?? '—'}
                    </span>
                  );
                case 'when':
                  return (
                    <span className="text-sm font-normal leading-5 text-gray-500">
                      {new Date(row.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  );
                default:
                  return null;
              }
            }}
          />
          <Pagination label={pageLabel} page={page} pageCount={pageCount} />
        </div>
      </div>
    </Shell>
  );
}

/**
 * The before/after pair as a readable diff.
 *
 * The two JSON columns hold only the fields the action changed, so printing
 * them side by side is the change itself rather than a snapshot of the row.
 */
function Change({ before, after }: { before: unknown; after: unknown }) {
  const b = (before ?? {}) as Record<string, unknown>;
  const a = (after ?? {}) as Record<string, unknown>;
  const keys = [...new Set([...Object.keys(b), ...Object.keys(a)])];

  if (keys.length === 0) {
    return <span className="text-sm font-normal leading-5 text-gray-400">—</span>;
  }

  return (
    <span className="flex flex-col gap-1">
      {keys.map((key) => (
        <span key={key} className="flex flex-wrap items-baseline gap-2 text-xs leading-4">
          <span className="font-medium text-gray-600">{label(key)}</span>
          {key in b ? (
            <>
              <span className="text-gray-400 line-through">{show(b[key])}</span>
              <span className="text-gray-400">→</span>
            </>
          ) : null}
          <span className="text-gray-900">{show(a[key])}</span>
        </span>
      ))}
    </span>
  );
}

function show(value: unknown): string {
  if (value === null || value === undefined) return 'none';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function label(value: string): string {
  return value
    .replace(/^admin\./, '')
    .replace(/[_.]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}
