import { Shell } from '../../_components/shell';
import { LineChart, axisTicks, niceCeiling } from '../../_components/line-chart';
import { Card, ChevronDown, Select } from '../../_components/ui';
import { CalendarOutlineIcon, ClockIcon } from '../../_components/icons';

/* Figma 907:17661 "Analytics" — KPI grid, response/severity blocks, the
   incident-activity line chart and the community-activity stack. */

export type Kpi = { label: string; value: string };
export type ResponseStat = { label: string; value: string; delta: string | null };
export type SeverityBar = {
  label: string;
  width: number;
  color: string;
  pct: string;
  /** How many incidents this bar stands for — the panel's total is their sum. */
  count: number;
};
export type ActivityPoint = { label: string; reported: number; resolved: number };
export type Stat = { label: string; value: string };






const LEGEND = [
  { color: '#3DC47E', label: 'Verified' },
  { color: '#FDB022', label: 'Pending review' },
  { color: '#F97066', label: 'Rejected' }
];

export function AnalyticsView({
  kpis,
  response,
  severity,
  activity,
  communityStats
}: {
  kpis: Kpi[];
  response: ResponseStat[];
  severity: SeverityBar[];
  activity: ActivityPoint[];
  communityStats: Stat[];
}) {

  // The activity chart's own numbers: axis top, and each series' share.
  const activityTop = niceCeiling(
    Math.max(1, ...activity.flatMap((point) => [point.reported, point.resolved]))
  );
  const reportedTotal = activity.reduce((sum, point) => sum + point.reported, 0);
  const resolvedTotal = activity.reduce((sum, point) => sum + point.resolved, 0);
  const activityTotal = reportedTotal + resolvedTotal;

  return (
    <Shell title="Analytics">
      {/* Filters + KPI grid — Figma 907:17665 */}
      <section className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-[10px]">
            <FilledSelect width={319} icon>
              Last 30 days (may 12 - jun 10, 2026)
            </FilledSelect>
            <FilledSelect width={127}>All Regions</FilledSelect>
            <FilledSelect width={109}>All State</FilledSelect>
          </div>
          <Select
            label="Export"
            className="w-[97px] shrink-0"
            unavailable="Exporting analytics is not built yet."
          />
        </div>

        <div className="grid grid-cols-2 gap-[15px] py-[25px] md:grid-cols-3 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="edge flex flex-col items-center justify-center gap-[23px] rounded-[15px] px-[19px] py-[23px]"
            >
              <span className="text-sm font-normal leading-[17px] text-gray-700">{kpi.label}</span>
              <span className="text-2xl font-bold leading-[29px] text-navy">{kpi.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency response + incident severity — Figma 907:17731 */}
      <section className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8 xl:flex-row">
        <Block title="Emergency response">
          <div className="flex flex-col gap-[7px]">
            {response.map((r) => (
              <div
                key={r.label}
                className="edge flex items-center gap-5 rounded-[15px] bg-white px-[19px] py-[23px]"
              >
                <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[69px] bg-rule px-[6px]">
                  <ClockIcon className="h-6 w-6 text-gray-700" />
                </span>
                <div className="flex flex-1 flex-col gap-[9px]">
                  <span className="text-sm font-normal leading-[17px] text-gray-700">
                    {r.label}
                  </span>
                  <div className="flex items-center gap-[19px]">
                    <span className="text-2xl font-bold leading-[29px] text-navy">{r.value}</span>
                    {r.delta ? (
                      <span className="text-sm font-medium leading-[17px] text-gray-400">
                        <span className="text-success-500">{r.delta}</span>
                        <span className="font-normal"> vs previous period</span>
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="incident severity">
          {/* The design prints 12,456 here. It has to be the sum of the bars
              underneath it, or the panel contradicts itself. */}
          <div className="flex items-center justify-between gap-[10px] rounded-lg bg-gray-700 px-[30px] py-[11px]">
            <span className="text-sm font-normal leading-[17px] text-gray-200">Total incidents</span>
            <span className="text-xl font-semibold leading-6 text-gray-200">
              {new Intl.NumberFormat('en-NG').format(
                severity.reduce((total, bar) => total + bar.count, 0)
              )}
            </span>
          </div>

          {/*
            One row per severity, so the label, its bar and its percentage
            cannot drift apart. Three parallel columns (the design's own
            structure) only line up while every row is the same height, and
            they stopped being so once the label column had to wrap.

            The row scrolls inside itself below ~400px rather than stretching
            the page: 66 + 240 + 75 plus gaps does not fit a phone.
          */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-[34px] overflow-x-auto py-2">
            {severity.map((s) => (
              <div key={s.label} className="flex min-w-max items-center gap-4">
                <span className="w-[66px] shrink-0 text-right text-sm font-semibold leading-5 text-black/40">
                  {s.label}
                </span>

                <span className="flex min-w-[240px] flex-1 items-center">
                  <span
                    className={`h-7 shrink-0 rounded-lg ${s.color}`}
                    style={{ width: s.width }}
                  />
                  <span className="h-px flex-1 bg-gray-200" />
                </span>

                <span className="w-[75px] shrink-0 text-right text-sm font-semibold leading-5 text-black/40">
                  {s.pct}
                </span>
              </div>
            ))}
          </div>
        </Block>
      </section>

      {/* Incident activity line chart — Figma 907:17803 */}
      <section className="flex px-4 py-[19px] sm:px-6 lg:px-8">
        <Card className="min-w-0 flex-1 px-[19px] py-5">
          <div className="flex flex-col gap-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase leading-5 tracking-[0.5px] text-gray-700">
                IncIDENT activity
              </h2>
              <div className="edge-gray200 flex h-11 shrink-0 items-center gap-2 rounded-lg bg-white px-[14px] py-[10px]">
                {['7D', '30D', '3M', '1Y'].map((r) => (
                  <span
                    key={r}
                    className={`edge flex h-6 items-center rounded-[3px] px-[9px] text-sm font-normal leading-6 ${
                      r === '30D' ? 'bg-[#AFAFAF] text-gray-800' : 'text-gray-700'
                    }`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Nine date labels at 59px each is 531px before padding, so this
                chart scrolls in its own box the way the other two do. */}
            <div className="flex min-w-0 flex-col gap-[2px] overflow-x-auto">
              <div className="relative h-[159px] min-w-[560px]">
                <div className="flex h-full flex-col justify-between">
                  {axisTicks(activityTop).map((tick, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="w-8 shrink-0 text-right text-[10px] leading-[7px] text-[#6D7280]">
                        {tick}
                      </span>
                      <span className="plot-line flex-1" />
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute left-[42px] right-0 top-[14px] h-[142px]">
                  <LineChart
                    height={142}
                    series={[
                      {
                        label: 'Reported',
                        color: '#F04438',
                        values: activity.map((point) => point.reported)
                      },
                      {
                        label: 'Resolved',
                        color: '#3DC47E',
                        values: activity.map((point) => point.resolved)
                      }
                    ]}
                  />
                </div>
              </div>

              <div className="min-w-[560px] py-[3px]">
                <div className="flex justify-between px-5 py-[9px]">
                  {activity.map((point, i) => (
                    <span
                      key={i}
                      className="flex flex-1 items-center justify-center whitespace-nowrap py-[3px] text-[10px] leading-[12px] text-[#6D7280]"
                    >
                      {point.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/*
              The design prints "00%" beside each legend dot and tints both
              dots the same red. Each is now that series' share of the window's
              total, in its own colour.
            */}
            <div className="flex flex-wrap gap-[65px]">
              {[
                { label: 'Resolved', color: '#3DC47E', total: resolvedTotal },
                { label: 'Reported', color: '#F04438', total: reportedTotal }
              ].map((entry) => (
                <span key={entry.label} className="flex items-center gap-3">
                  <span className="flex items-center gap-[5px]">
                    <span
                      className="h-[10px] w-[10px] rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs font-medium leading-5 tracking-[-0.24px] text-[#4B5563]">
                      {entry.label}
                    </span>
                  </span>
                  <span className="text-sm font-medium leading-5 text-black">
                    {activityTotal
                      ? `${Math.round((entry.total / activityTotal) * 100)}%`
                      : '—'}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Community activity — Figma 907:17885 */}
      <section className="flex px-4 py-[19px] sm:px-6 lg:px-8">
        <Card className="min-w-0 flex-1 px-[19px] py-5">
          <div className="flex flex-col gap-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-700">
                Community activity
              </h2>
              <Select label="Last 6 months" className="w-[172px]" />
            </div>

            <div className="flex flex-col gap-7 xl:flex-row">
              <div className="edge flex w-full min-w-0 flex-col gap-[2px] overflow-x-auto rounded-lg px-[14px] py-[23px] xl:w-[643px] xl:shrink-0">
                <div className="relative h-[235px] min-w-[560px]">
                  <div className="flex h-full flex-col justify-between">
                    {/* Seven rows, the design's count, from the real total. */}
                    {axisTicks(activityTop, 7).map((tick, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-7 shrink-0 text-right text-[10px] leading-[7px] text-[#6D7280]">
                          {tick}
                        </span>
                        <span className="plot-line flex-1" />
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex h-[191px] items-end justify-between px-[13px]">
                    {activity.map((bar, i) => (
                      <div key={i} className="flex w-7 flex-col">
                        <span
                          className="bg-success-400"
                          style={{ height: Math.round((bar.resolved / activityTop) * 191) }}
                        />
                        <span
                          className="bg-warning-400"
                          style={{
                            height: Math.round(
                              (Math.max(0, bar.reported - bar.resolved) /
                                activityTop) *
                                191
                            )
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-[3px] min-w-[560px]">
                  <div className="flex justify-between py-[9px]">
                    {activity.map((bar, i) => (
                      <span
                        key={i}
                        className="flex w-[59px] items-center justify-center text-[10px] leading-[7px] text-[#6D7280]"
                      >
                        {bar.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-10">
                <div className="grid grid-cols-2 gap-[10px]">
                  {communityStats.map((s) => (
                    <div
                      key={s.label}
                      className="edge flex h-[115px] flex-col gap-[23px] rounded-[15px] bg-[#F9F9FA] px-[19px] py-[23px]"
                    >
                      <span className="text-sm font-normal leading-[17px] text-gray-700">
                        {s.label}
                      </span>
                      <span className="text-2xl font-bold leading-[29px] text-navy">{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-[21px]">
                  {LEGEND.map((l) => (
                    <span key={l.label} className="flex items-center gap-[10px]">
                      <span
                        className="h-[19px] w-[19px] shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="text-sm font-normal leading-[17px] text-gray-700">
                        {l.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </Shell>
  );
}

/** The #F9F9FA analytics block — pad 24, radius 20, 1px inside hairline. */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="edge flex min-w-0 flex-1 flex-col gap-4 rounded-[20px] bg-[#F9F9FA] p-6">
      <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-700">{title}</h2>
      {children}
    </div>
  );
}

function FilledSelect({
  children,
  width,
  icon = false
}: {
  children: React.ReactNode;
  width: number;
  icon?: boolean;
}) {
  return (
    <button
      type="button"
      /* The design's width is a maximum, not a floor: the date range is 319px
         wide, which is more than a 390px phone has once the page padding is
         taken off. */
      className="edge-gray200 flex h-11 w-full items-center gap-2 rounded-lg bg-[#F7F7F7] px-[14px] py-[10px]"
      style={{ maxWidth: width }}
    >
      {icon ? <CalendarOutlineIcon className="h-4 w-4 shrink-0 text-gray-700" /> : null}
      <span className="flex-1 whitespace-nowrap text-left text-sm font-medium leading-6 text-gray-700">
        {children}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-gray-900" />
    </button>
  );
}
