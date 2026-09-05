'use client';

import { Shell } from '../../_components/shell';
import { Avatar } from '../../_components/avatar';
import { CompactTable as Table } from '../../_components/table';
import { useAction } from '../../_components/use-action';
import { revokeAdminSession } from '../../_lib/actions';

/**
 * Who is signed into the dashboard, and who has been trying to.
 *
 * `admin_sessions` and `admin_login_attempts` were both write-only: a session
 * left open on a machine in an office, a locked-out moderator, and a run of
 * failed sign-ins against one address are all things the team is meant to
 * notice, and none of them could be seen from anywhere.
 */

export type Session = {
  id: string;
  adminName: string;
  adminEmail: string;
  adminAvatar: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
};

export type Attempt = {
  id: string;
  email: string;
  success: boolean;
  reason: string;
  ipAddress: string | null;
  createdAt: string;
};

export type AdminAccount = {
  id: string;
  email: string;
  fullName: string | null;
  status: string;
  roleName: string;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
};

export function SecurityView({
  sessions,
  attempts,
  admins,
  failedByEmail
}: {
  sessions: Session[];
  attempts: Attempt[];
  admins: AdminAccount[];
  failedByEmail: { email: string; failures: number }[];
}) {
  const { pending, error, run } = useAction();

  return (
    <Shell title="Security">
      <div className="flex flex-col gap-10 px-4 py-[17px] sm:px-6 lg:px-8">
        {error ? (
          <p role="alert" className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700">
            {error}
          </p>
        ) : null}

        <Card
          title="Admin accounts"
          note="Second factor, lockouts and when each password was last changed."
        >
          <Table
            head={['Admin', 'Role', 'Status', '2FA', 'Failed attempts', 'Password changed', 'Last sign-in']}
            rows={admins.map((admin) => [
              <span key="a" className="flex flex-col">
                <span className="text-sm font-medium leading-5 text-gray-900">
                  {admin.fullName ?? admin.email.split('@')[0]}
                </span>
                <span className="text-xs font-normal leading-4 text-gray-500">
                  {admin.email}
                </span>
              </span>,
              <span key="r">{admin.roleName}</span>,
              <Chip key="s" tone={admin.status === 'active' ? 'good' : 'bad'}>
                {admin.lockedUntil && new Date(admin.lockedUntil) > new Date()
                  ? 'locked'
                  : admin.status}
              </Chip>,
              <Chip key="m" tone={admin.mfaEnabled ? 'good' : 'warn'}>
                {admin.mfaEnabled ? 'on' : 'off'}
              </Chip>,
              <span key="f">{admin.failedLoginAttempts}</span>,
              <span key="p">{when(admin.passwordChangedAt)}</span>,
              <span key="l">{when(admin.lastLoginAt)}</span>
            ])}
            empty="No admin accounts."
          />
        </Card>

        <Card
          title="Open dashboard sessions"
          note="Every browser currently signed in. Signing one out takes effect on that machine's next request."
        >
          <Table
            head={['Admin', 'From', 'Browser', 'Signed in', 'Last seen', '']}
            rows={sessions.map((session) => [
              <span key="a" className="flex min-w-0 items-center gap-3">
                <Avatar src={session.adminAvatar} name={session.adminName} size={36} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium leading-5 text-gray-900">
                    {session.adminName}
                  </span>
                  <span className="truncate text-xs font-normal leading-4 text-gray-500">
                    {session.adminEmail}
                  </span>
                </span>
              </span>,
              <span key="i">{session.ipAddress ?? '—'}</span>,
              <span key="u" className="block max-w-[280px] truncate" title={session.userAgent ?? ''}>
                {browser(session.userAgent)}
              </span>,
              <span key="c">{when(session.createdAt)}</span>,
              <span key="s">{when(session.lastSeenAt)}</span>,
              <button
                key="b"
                type="button"
                disabled={pending}
                onClick={() => run(() => revokeAdminSession(session.id))}
                className="text-sm font-semibold leading-5 text-error-600 disabled:opacity-50"
              >
                Sign out
              </button>
            ])}
            empty="Nobody is signed in."
          />
        </Card>

        {failedByEmail.length > 0 ? (
          <Card
            title="Most failed sign-ins"
            note="By address, over the last thirty days. A name here that is not one of yours is somebody guessing."
          >
            <Table
              head={['Address', 'Failures']}
              rows={failedByEmail.map((row) => [
                <span key="e" className="text-gray-900">{row.email}</span>,
                <Chip key="f" tone={row.failures >= 5 ? 'bad' : 'warn'}>
                  {String(row.failures)}
                </Chip>
              ])}
              empty="No failed sign-ins."
            />
          </Card>
        ) : null}

        <Card title="Recent sign-in attempts" note="The last hundred, successful or not.">
          <Table
            head={['Address', 'Outcome', 'Reason', 'From', 'When']}
            rows={attempts.map((attempt) => [
              <span key="e" className="text-gray-900">{attempt.email}</span>,
              <Chip key="o" tone={attempt.success ? 'good' : 'bad'}>
                {attempt.success ? 'success' : 'failed'}
              </Chip>,
              <span key="r">{attempt.reason.replace(/_/g, ' ')}</span>,
              <span key="i">{attempt.ipAddress ?? '—'}</span>,
              <span key="w">{when(attempt.createdAt)}</span>
            ])}
            empty="No sign-in attempts recorded."
          />
        </Card>
      </div>
    </Shell>
  );
}

function Card({
  title,
  note,
  children
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold leading-[22px] text-black">{title}</h2>
        {note ? (
          <p className="max-w-[760px] text-sm font-normal leading-6 text-gray-500">{note}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Chip({
  children,
  tone
}: {
  children: string;
  tone: 'good' | 'bad' | 'warn';
}) {
  const classes =
    tone === 'good'
      ? 'bg-success-50 text-success-700'
      : tone === 'bad'
        ? 'bg-error-50 text-error-700'
        : 'bg-warning-50 text-warning-700';

  return (
    <span
      className={`inline-flex items-center rounded-2xl px-3 py-1 text-xs font-semibold capitalize leading-[18px] ${classes}`}
    >
      {children}
    </span>
  );
}

function when(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/** The browser and platform out of a user agent, rather than the whole string. */
function browser(agent: string | null): string {
  if (!agent) return '—';
  const name =
    /Edg\//.test(agent) ? 'Edge'
    : /OPR\//.test(agent) ? 'Opera'
    : /Chrome\//.test(agent) ? 'Chrome'
    : /Safari\//.test(agent) ? 'Safari'
    : /Firefox\//.test(agent) ? 'Firefox'
    : 'Unknown browser';

  const platform =
    /Mac OS X/.test(agent) ? 'macOS'
    : /Windows/.test(agent) ? 'Windows'
    : /Android/.test(agent) ? 'Android'
    : /(iPhone|iPad)/.test(agent) ? 'iOS'
    : /Linux/.test(agent) ? 'Linux'
    : '';

  return platform ? `${name} · ${platform}` : name;
}
