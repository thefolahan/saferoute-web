import Link from 'next/link';
import { Avatar } from '../_components/avatar';
import { CompactTable } from '../_components/table';

/**
 * The Dashboard's detail half — the figures somebody doing diligence asks for.
 *
 * A server component: everything here is a number and a link, so none of it
 * needs to ship JavaScript. The scope switch is two links rather than a
 * toggle for the same reason, and it means a particular view can be sent to
 * somebody as a URL.
 */

export type Insights = {
  scope: 'real' | 'all';
  windowDays: number;
  seededAccounts: number;
  users: {
    total: number;
    new7d: number;
    new30d: number;
    active24h: number;
    active7d: number;
    active30d: number;
    stickiness: number | null;
    verified: number;
    officials: number;
    suspended: number;
    subscribers: number;
  };
  activity: {
    incidents: number;
    verifiedIncidents: number;
    verificationRate: number | null;
    posts: number;
    comments: number;
    broadcasts: number;
    sos: number;
    devices: number;
    reportsPerActiveUser: number | null;
  };
  growth: { day: string; signups: number; total: number }[];
  states: { state: string; users: number; incidents: number }[];
  trustLeaders: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
    accountType: string;
    trustScore: number;
    strikes: number;
    reports: number;
    verifiedReports: number;
    followers: number;
  }[];
  mostActive: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
    lastActiveAt: string | null;
    reports: number;
    posts: number;
    comments: number;
    sos: number;
    broadcasts: number;
    actions: number;
  }[];
  hourly: { hour: number; events: number }[];
  platforms: { platform: string; devices: number }[];
  appVersions: { version: string; devices: number }[];
  retention: {
    week: { signed: number; returned: number; rate: number | null };
    month: { signed: number; returned: number; rate: number | null };
  };
};

const num = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : new Intl.NumberFormat('en-NG').format(n);

export function InsightsPanel({
  data,
  base
}: {
  data: Insights;
  base: string;
}) {
  const real = data.scope === 'real';

  return (
    <section className="flex flex-col gap-10 px-4 pb-12 sm:px-6 lg:px-8">
      {/*
        The most important control on the page, and the reason it is at the top
        rather than tucked in a corner: 520 of the 550 accounts on this install
        are seeded demonstration rows, and they hold most of the reports and
        posts. Anyone reading these figures has to know which set they are.
      */}
      <div className="edge flex flex-col gap-3 rounded-[10px] bg-[#FCFCFD] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold leading-6 text-gray-900">
            {real ? 'Real accounts only' : 'Including seeded demonstration accounts'}
          </span>
          <span className="text-sm font-normal leading-5 text-gray-500">
            {real
              ? `${num(data.seededAccounts)} seeded demonstration accounts are excluded from every figure below, along with everything they created.`
              : `These figures include ${num(data.seededAccounts)} seeded demonstration accounts and the reports and posts they created. Not a picture of real usage.`}
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          <ScopeLink base={base} scope="real" active={real} label="Real" />
          <ScopeLink base={base} scope="all" active={!real} label="Include seeded" />
        </div>
      </div>

      <Block title="People" note={`Active means seen in the period. Stickiness is daily over monthly — the share of the month's users who were here today.`}>
        <Stats
          items={[
            { label: 'Total accounts', value: num(data.users.total) },
            { label: 'Active today', value: num(data.users.active24h) },
            { label: 'Active this week', value: num(data.users.active7d) },
            { label: 'Active this month', value: num(data.users.active30d) },
            {
              label: 'Stickiness (DAU/MAU)',
              value: data.users.stickiness === null ? '—' : `${data.users.stickiness}%`
            },
            { label: 'New this week', value: num(data.users.new7d) },
            { label: 'ID verified', value: num(data.users.verified) },
            { label: 'Officials & agencies', value: num(data.users.officials) },
            { label: 'Paying subscribers', value: num(data.users.subscribers) },
            { label: 'Suspended', value: num(data.users.suspended) }
          ]}
        />
      </Block>

      <Block title="What they do">
        <Stats
          items={[
            { label: 'Reports filed', value: num(data.activity.incidents) },
            { label: 'Verified reports', value: num(data.activity.verifiedIncidents) },
            {
              label: 'Verification rate',
              value:
                data.activity.verificationRate === null
                  ? '—'
                  : `${data.activity.verificationRate}%`
            },
            { label: 'SOS activations', value: num(data.activity.sos) },
            { label: 'Posts', value: num(data.activity.posts) },
            { label: 'Comments', value: num(data.activity.comments) },
            { label: 'Live broadcasts', value: num(data.activity.broadcasts) },
            { label: 'Registered devices', value: num(data.activity.devices) },
            {
              label: 'Reports per active user',
              value: num(data.activity.reportsPerActiveUser)
            }
          ]}
        />
      </Block>

      <Block
        title="Signups"
        note={`Per day over the last ${data.windowDays} days, with the running total.`}
      >
        <GrowthChart rows={data.growth} />
      </Block>

      <Block
        title="When the app is used"
        note="Every report, post, SOS and sign-in in the period, by hour of the Lagos day. This is when people open SafeRoute, not when incidents happen."
      >
        <HourChart rows={data.hourly} />
      </Block>

      <Block
        title="Coverage by state"
        note="All thirty-six states and the FCT. Reports carry a state, so that column is a fact; an account does not, so its state is the one it most recently reported from — inferred, not declared."
      >
        <StateTable rows={data.states} base={base} />
      </Block>

      <Block
        title="Trust leaderboard"
        note="Highest trust scores among active accounts. The score is a 0–1 confidence recomputed from reporting history; ten strikes closes an account."
      >
        <CompactTable
          head={['#', 'Account', 'Trust', 'Reports', 'Verified', 'Followers', 'Strikes']}
          empty="No accounts to rank yet."
          rows={data.trustLeaders.map((user, i) => [
            <span key="i" className="font-medium text-gray-900">{i + 1}</span>,
            <Person key="p" user={user} base={base} />,
            <TrustBar key="t" score={user.trustScore} />,
            num(user.reports),
            num(user.verifiedReports),
            num(user.followers),
            user.strikes === 0 ? '—' : (
              <span key="s" className="font-medium text-error-700">{user.strikes}</span>
            )
          ])}
        />
      </Block>

      <Block
        title="Most active accounts"
        note="Reports, posts, comments, SOS activations and broadcasts added together — so somebody who reports rather than posts still appears."
      >
        <CompactTable
          head={['#', 'Account', 'Actions', 'Reports', 'Posts', 'Comments', 'SOS', 'Last seen']}
          empty="Nobody has done anything yet."
          rows={data.mostActive.map((user, i) => [
            <span key="i" className="font-medium text-gray-900">{i + 1}</span>,
            <Person key="p" user={user} base={base} />,
            <span key="a" className="font-semibold text-gray-900">{num(user.actions)}</span>,
            num(user.reports),
            num(user.posts),
            num(user.comments),
            num(user.sos),
            user.lastActiveAt
              ? new Date(user.lastActiveAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short'
                })
              : '—'
          ])}
        />
      </Block>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <Block title="Devices" note="What the app is running on, and which builds are still in the field.">
          <div className="flex flex-col gap-4">
            <Bars
              rows={data.platforms.map((p) => ({
                label: p.platform === 'ios' ? 'iOS' : 'Android',
                value: p.devices
              }))}
              empty="No devices registered."
            />
            <Bars
              rows={data.appVersions.map((v) => ({
                label: `App ${v.version}`,
                value: v.devices
              }))}
              empty="No app versions reported."
              tint="#0BA5EC"
            />
          </div>
        </Block>

        <Block
          title="Do they come back?"
          note="Of the accounts created in a period, how many have been seen since. Not a full cohort curve — the schema keeps no session history — so it is exactly what it says."
        >
          <div className="flex flex-col gap-3">
            <Retention
              label="Signed up 7–30 days ago, seen in the last 7"
              {...data.retention.week}
            />
            <Retention
              label="Signed up 30–90 days ago, seen in the last 30"
              {...data.retention.month}
            />
          </div>
        </Block>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ parts */

function ScopeLink({
  base,
  scope,
  active,
  label
}: {
  base: string;
  scope: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={`${base}?scope=${scope}`}
      scroll={false}
      className={`flex h-9 items-center rounded-lg px-3 text-sm font-medium leading-5 ${
        active ? 'bg-navy text-white' : 'edge-gray200 bg-white text-gray-700'
      }`}
    >
      {label}
    </Link>
  );
}

function Block({
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
        <h3 className="text-lg font-semibold leading-7 text-black">{title}</h3>
        {note ? (
          <p className="max-w-[820px] text-sm font-normal leading-5 text-gray-500">{note}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Stats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="edge flex flex-col gap-1 rounded-[10px] bg-[#FCFCFD] px-4 py-4"
        >
          <span className="text-2xl font-bold leading-8 text-gray-900">{item.value}</span>
          <span className="text-xs font-normal leading-4 text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Person({
  user,
  base
}: {
  user: { id: string; name: string; username: string | null; avatarUrl: string | null };
  base: string;
}) {
  return (
    <Link
      href={`${base}/users/community?id=${user.id}`}
      className="flex min-w-0 items-center gap-3"
    >
      <Avatar src={user.avatarUrl} name={user.name} size={32} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-gray-900">{user.name}</span>
        <span className="truncate text-xs leading-4 text-gray-500">
          {user.username ? `@${user.username}` : '—'}
        </span>
      </span>
    </Link>
  );
}

/** The 0–1 confidence as a bar, so a column of them is scannable. */
function TrustBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const tint = pct >= 80 ? '#17B26A' : pct >= 60 ? '#3DC47E' : pct >= 40 ? '#F79009' : '#F04438';

  return (
    <span className="flex items-center gap-2">
      <span className="h-2 w-[72px] shrink-0 overflow-hidden rounded-full bg-rule">
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: tint }} />
      </span>
      <span className="font-medium text-gray-900">{pct}</span>
    </span>
  );
}

function Retention({
  label,
  signed,
  returned,
  rate
}: {
  label: string;
  signed: number;
  returned: number;
  rate: number | null;
}) {
  return (
    <div className="edge flex flex-col gap-2 rounded-[10px] px-5 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-normal leading-5 text-gray-600">{label}</span>
        <span className="text-2xl font-bold leading-8 text-gray-900">
          {rate === null ? '—' : `${rate}%`}
        </span>
      </div>
      <span className="h-2 w-full overflow-hidden rounded-full bg-rule">
        <span
          className="block h-full rounded-full bg-success-500"
          style={{ width: `${rate ?? 0}%` }}
        />
      </span>
      <span className="text-xs font-normal leading-4 text-gray-500">
        {returned} of {signed} came back
      </span>
    </div>
  );
}

function Bars({
  rows,
  empty,
  tint = '#083A50'
}: {
  rows: { label: string; value: number }[];
  empty: string;
  tint?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm leading-5 text-gray-500">{empty}</p>;
  }
  const top = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-[104px] shrink-0 truncate text-sm font-normal leading-5 text-gray-600">
            {row.label}
          </span>
          <span className="h-3 flex-1 overflow-hidden rounded-full bg-rule">
            <span
              className="block h-full rounded-full"
              style={{ width: `${(row.value / top) * 100}%`, background: tint }}
            />
          </span>
          <span className="w-[52px] shrink-0 text-right text-sm font-medium leading-5 text-gray-900">
            {num(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Signups per day as columns, with the running total as a line above them. */
function GrowthChart({ rows }: { rows: { day: string; signups: number; total: number }[] }) {
  if (rows.length === 0) return <p className="text-sm leading-5 text-gray-500">No signups yet.</p>;

  const top = Math.max(...rows.map((r) => r.signups), 1);

  return (
    <div className="edge flex flex-col gap-3 rounded-[10px] px-5 py-4">
      <div className="flex items-end gap-[3px]" style={{ height: 140 }}>
        {rows.map((row) => (
          <span
            key={row.day}
            title={`${row.day}: ${row.signups} signup${row.signups === 1 ? '' : 's'} (${row.total} total)`}
            className="flex-1 rounded-t-[3px] bg-navy/85"
            style={{ height: `${Math.max(2, (row.signups / top) * 100)}%` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs font-normal leading-4 text-gray-500">
        <span>{rows[0]?.day}</span>
        <span>
          {num(rows[rows.length - 1]?.total ?? 0)} accounts in total · peak {top} in a day
        </span>
        <span>{rows[rows.length - 1]?.day}</span>
      </div>
    </div>
  );
}

/** Twenty-four columns, one per hour of the Lagos day. */
function HourChart({ rows }: { rows: { hour: number; events: number }[] }) {
  const top = Math.max(...rows.map((r) => r.events), 1);
  const busiest = rows.reduce((a, b) => (b.events > a.events ? b : a), rows[0]!);
  const total = rows.reduce((sum, r) => sum + r.events, 0);

  if (total === 0) {
    return <p className="text-sm leading-5 text-gray-500">No activity in this period.</p>;
  }

  return (
    <div className="edge flex flex-col gap-3 rounded-[10px] px-5 py-4">
      <div className="flex items-end gap-1" style={{ height: 140 }}>
        {rows.map((row) => (
          <span
            key={row.hour}
            title={`${String(row.hour).padStart(2, '0')}:00 — ${row.events} events`}
            className={`flex-1 rounded-t-[3px] ${
              row.hour === busiest.hour ? 'bg-[#FE646F]' : 'bg-navy/70'
            }`}
            style={{ height: `${Math.max(2, (row.events / top) * 100)}%` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs font-normal leading-4 text-gray-500">
        <span>00:00</span>
        <span>
          Busiest at {String(busiest.hour).padStart(2, '0')}:00 · {num(total)} events
        </span>
        <span>23:00</span>
      </div>
    </div>
  );
}

/** Every state, ranked by reports, with users beside them. */
function StateTable({
  rows,
  base
}: {
  rows: { state: string; users: number; incidents: number }[];
  base: string;
}) {
  const ranked = [...rows].sort(
    (a, b) => b.incidents - a.incidents || b.users - a.users || a.state.localeCompare(b.state)
  );
  const top = Math.max(...ranked.map((r) => r.incidents), 1);
  const covered = ranked.filter((r) => r.incidents > 0).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-normal leading-5 text-gray-600">
        {covered} of {rows.length} states have at least one report.
      </p>
      <CompactTable
        minWidth={560}
        head={['State', 'Reports', '', 'Accounts']}
        empty="No states on record."
        rows={ranked.map((row) => [
          <Link
            key="s"
            href={`${base}/map?state=${encodeURIComponent(row.state)}`}
            className="font-medium text-gray-900"
          >
            {row.state}
          </Link>,
          <span key="n" className="tabular-nums">{num(row.incidents)}</span>,
          <span key="b" className="block h-2 w-full min-w-[80px] overflow-hidden rounded-full bg-rule">
            <span
              className="block h-full rounded-full bg-navy/80"
              style={{ width: `${(row.incidents / top) * 100}%` }}
            />
          </span>,
          <span key="u" className="tabular-nums">{num(row.users)}</span>
        ])}
      />
    </div>
  );
}
