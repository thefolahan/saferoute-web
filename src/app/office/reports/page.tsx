import { Shell } from '../_components/shell';
import { Card, ChevronDown, Select } from '../_components/ui';
import { ActivityChart, CalendarOutlineIcon, ClockIcon } from '../_components/icons';

/* Figma 907:17661 "Analytics" — KPI grid, response/severity blocks, the
   incident-activity line chart and the community-activity stack. */

const KPIS = [
  { label: 'Total Incidents', value: '12k' },
  { label: 'Active users', value: '3.6k' },
  { label: 'SOS request', value: '7,200' },
  { label: 'Live incident count', value: '1,670' },
  { label: 'Avg Response Time', value: '4.2h' },
  { label: 'Crime reports', value: '120' },
  { label: 'Traffic reports', value: '300' },
  { label: 'App downloads', value: '40M' },
  { label: 'Emergency alerts', value: '12' },
  { label: 'Revenue', value: '$600M' }
];

const RESPONSE = [
  { label: 'Average Response Time', value: '4m 32s' },
  { label: 'Average Resolution Time', value: '18m 14s' },
  { label: 'SOS Response Rate', value: '94.2%' }
];

/* Bar px widths are the designer's own (Figma 907:17786 …) inside a 334 track. */
const SEVERITY = [
  { label: 'Critical', width: 105, color: 'bg-error-400', pct: '28.5 (30%)' },
  { label: 'High', width: 193, color: 'bg-warning-300', pct: '28.5 (30%)' },
  { label: 'Moderate', width: 238, color: 'bg-warning-500', pct: '28.5 (30%)' },
  { label: 'Low', width: 149, color: 'bg-success-500', pct: '28.5 (30%)' }
];

const ACTIVITY_X = [
  'May 2', 'May 6', 'May 8', 'May 10', 'May 16', 'may 24',
  'May 26', 'May 30', 'Jun4', 'Jun8', 'Jun16', 'Jun20'
];

/* Community activity: 9 stacked bars, segments top→bottom (Figma 907:17936 …) */
const COMMUNITY = [
  { x: 'May 18', segs: [[78, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'May 20', segs: [[46, 'bg-success-400'], [78, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'May 22', segs: [[58, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'May24', segs: [[60, 'bg-warning-400'], [42, 'bg-error-400']] },
  { x: 'May 27', segs: [[46, 'bg-success-400'], [78, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'May 29', segs: [[78, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'Jun 4', segs: [[53, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'Jun 4', segs: [[46, 'bg-success-400'], [78, 'bg-warning-400'], [63, 'bg-error-400']] },
  { x: 'Jun 4', segs: [[78, 'bg-warning-400'], [63, 'bg-error-400']] }
] as const;

const COMMUNITY_STATS = [
  { label: 'Reports submitted', value: '12,00' },
  { label: 'Reports verified', value: '184' },
  { label: 'Reports rejected', value: '1,467' },
  { label: 'Active Users', value: '200' }
];

const LEGEND = [
  { color: '#3DC47E', label: 'Verified' },
  { color: '#FDB022', label: 'Pending review' },
  { color: '#F97066', label: 'Rejected' }
];

export default function AnalyticsPage() {
  return (
    <Shell title="Analytics">
      {/* Filters + KPI grid — Figma 907:17665 */}
      <section className="flex flex-col gap-[15px] px-8 py-[19px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <FilledSelect width={319} icon>
              Last 30 days (may 12 - jun 10, 2026)
            </FilledSelect>
            <FilledSelect width={127}>All Regions</FilledSelect>
            <FilledSelect width={109}>All State</FilledSelect>
          </div>
          <Select label="Export" className="w-[97px] shrink-0" />
        </div>

        <div className="grid grid-cols-5 gap-[15px] py-[25px]">
          {KPIS.map((kpi) => (
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
      <section className="flex gap-[15px] px-8 py-[19px]">
        <Block title="Emergency response">
          <div className="flex flex-col gap-[7px]">
            {RESPONSE.map((r) => (
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
                    <span className="text-sm font-medium leading-[17px] text-gray-400">
                      <span className="text-success-500">8.7%</span>
                      <span className="font-normal"> vs Apr 12 - may 11</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="incident severity">
          <div className="flex items-center justify-between gap-[10px] rounded-lg bg-gray-700 px-[30px] py-[11px]">
            <span className="text-sm font-normal leading-[17px] text-gray-200">Total incidents</span>
            <span className="text-xl font-semibold leading-6 text-gray-200">12,456</span>
          </div>

          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-full w-[66px] shrink-0 flex-col justify-between text-right">
              {SEVERITY.map((s) => (
                <span
                  key={s.label}
                  className="flex flex-1 items-center justify-end text-sm font-semibold leading-5 text-black/40"
                >
                  {s.label}
                </span>
              ))}
            </div>

            <div className="flex flex-1 flex-col justify-center gap-[34px]">
              {SEVERITY.map((s) => (
                <div key={s.label} className="flex items-center">
                  <span
                    className={`h-7 shrink-0 rounded-lg ${s.color}`}
                    style={{ width: s.width }}
                  />
                  <span className="h-px flex-1 bg-gray-200" />
                </div>
              ))}
            </div>

            <div className="flex h-[203px] w-[75px] shrink-0 flex-col justify-center gap-[41px] text-right">
              {SEVERITY.map((s, i) => (
                <span
                  key={i}
                  className="text-sm font-semibold leading-5 text-black/40"
                >
                  {s.pct}
                </span>
              ))}
            </div>
          </div>
        </Block>
      </section>

      {/* Incident activity line chart — Figma 907:17803 */}
      <section className="flex px-8 py-[19px]">
        <Card className="flex-1 px-[19px] py-5">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-1">
              <h2 className="text-sm font-semibold uppercase leading-5 tracking-[0.5px] text-gray-700">
                IncIDENT activity
              </h2>
              <div className="edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-white px-[14px] py-[10px]">
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

            <div className="flex flex-col gap-[2px]">
              <div className="relative h-[159px]">
                <div className="flex h-full flex-col justify-between">
                  {['80K', '60K', '40K', '20K', '0'].map((tick) => (
                    <div key={tick} className="flex items-center gap-1">
                      <span className="w-5 shrink-0 text-[10px] leading-[7px] text-[#6D7280]">
                        {tick}
                      </span>
                      <span className="plot-line flex-1" />
                    </div>
                  ))}
                </div>
                <ActivityChart className="pointer-events-none absolute left-[82px] top-[14px] h-[142px] w-[1007px] max-w-none" />
              </div>

              <div className="py-[3px]">
                <div className="flex justify-between px-5 py-[9px]">
                  {ACTIVITY_X.map((x, i) => (
                    <span
                      key={i}
                      className="flex w-[59px] items-center justify-center px-[13px] py-[3px] text-[10px] leading-[7px] text-[#6D7280]"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-[65px]">
              {['Resolved', 'Reported'].map((l) => (
                <span key={l} className="flex items-center gap-3">
                  <span className="flex items-center gap-[5px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-error-500" />
                    <span className="text-xs font-medium leading-5 tracking-[-0.24px] text-[#4B5563]">
                      {l}
                    </span>
                  </span>
                  <span className="text-sm font-medium leading-5 text-black">00%</span>
                </span>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Community activity — Figma 907:17885 */}
      <section className="flex px-8 py-[19px]">
        <Card className="flex-1 px-[19px] py-5">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-1">
              <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-700">
                Community activity
              </h2>
              <Select label="Last 6 months" className="w-[172px]" />
            </div>

            <div className="flex gap-7">
              <div className="edge flex w-[643px] shrink-0 flex-col gap-[2px] rounded-lg px-[14px] py-[23px]">
                <div className="relative h-[235px]">
                  <div className="flex h-full flex-col justify-between">
                    {['12k', '10k', '8k', '6k', '4k', '2k', '0'].map((tick) => (
                      <div key={tick} className="flex items-center gap-1">
                        <span className="w-5 shrink-0 text-[10px] leading-[7px] text-[#6D7280]">
                          {tick}
                        </span>
                        <span className="plot-line flex-1" />
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex h-[191px] items-end justify-between px-[13px]">
                    {COMMUNITY.map((bar, i) => (
                      <div key={i} className="flex w-7 flex-col">
                        {bar.segs.map(([h, color], j) => (
                          <span key={j} className={color} style={{ height: h }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-[3px]">
                  <div className="flex justify-between py-[9px]">
                    {COMMUNITY.map((bar, i) => (
                      <span
                        key={i}
                        className="flex w-[59px] items-center justify-center text-[10px] leading-[7px] text-[#6D7280]"
                      >
                        {bar.x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-10">
                <div className="grid grid-cols-2 gap-[10px]">
                  {COMMUNITY_STATS.map((s) => (
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

                <div className="flex gap-[21px]">
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
    <div className="edge flex flex-1 flex-col gap-4 rounded-[20px] bg-[#F9F9FA] p-6">
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
      className="edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-[#F7F7F7] px-[14px] py-[10px]"
      style={{ width }}
    >
      {icon ? <CalendarOutlineIcon className="h-4 w-4 shrink-0 text-gray-700" /> : null}
      <span className="flex-1 whitespace-nowrap text-left text-sm font-medium leading-6 text-gray-700">
        {children}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-gray-900" />
    </button>
  );
}
