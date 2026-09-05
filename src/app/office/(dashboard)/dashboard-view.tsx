'use client';

import Link from 'next/link';
import { officeHref, useOfficeBase } from '../_lib/office-path';
import { Shell } from '../_components/shell';
import { ArrowRightIcon, Card, Select, Sparkline } from '../_components/ui';
import { IncidentMiniMap, type MapPlace } from '../_components/incident-mini-map';
import { axisTicks } from '../_components/line-chart';
import { ActionRowList } from '../_components/action-row';
import type { ActionRowData } from '../_components/action-row';

/* Figma 907:12642 "Dashboard" — presentation only; the data is fetched by
   page.tsx on the server and passed in. */

export type Kpi = {
  label: string;
  value: string;
  /** This metric's own last few days, oldest first, for its sparkline. */
  trend: number[];
};
export type GrowthBar = { label: string; count: number; pad: number };


export function DashboardView({
  places,
  kpis,
  actions,
  growth,
  growthTop,
  adminName
}: {
  /** Incidents that carry a coordinate, for the map card. */
  places: MapPlace[];
  kpis: Kpi[];
  actions: ActionRowData[];
  growth: GrowthBar[];
  /** The growth chart's axis top, so the ticks match the bars. */
  growthTop: number;
  adminName: string;
}) {
  const base = useOfficeBase();

  return (
    /*
      The Dashboard's tiles, charts and map each aggregate nationally from
      their own endpoint, none of which takes a state — honouring a picker here
      would mean threading one through eight separate queries. Removed rather
      than left disabled; the Map and Needs-action screens both filter by state
      and are one click away.
    */
    <Shell title="Dashboard">
      {/* Welcome + KPI grid — Figma 907:12646, pad 19/32 gap 15 */}
      <section className="flex flex-col gap-[15px] px-4 py-[19px] sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-[15px]">
          <div className="flex flex-col justify-center gap-[10px]">
            <h2 className="text-2xl font-medium leading-tight text-gray-500 sm:text-[32px] sm:leading-[39px]">
              Welcome back, <span className="text-gray-900">{adminName}</span> 👋
            </h2>
            <p className="text-base font-normal leading-[19px] text-gray-500">
              Here&apos;s what&apos;s happening across SafeRoute today.
            </p>
          </div>
          {/* /admin/overview takes this range, so it is a real filter. */}
          <Select
            label="Today"
            weight="semibold"
            className="w-[126px] shrink-0"
            param="range"
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This week' },
              { value: 'month', label: 'This month' },
              { value: 'all', label: 'All time' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-[15px] py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="edge flex flex-col gap-[23px] rounded-[15px] px-[19px] py-[23px]"
            >
              <span className="text-sm font-normal leading-[17px] text-gray-700">{kpi.label}</span>
              <div className="flex items-end justify-between gap-[23px]">
                <span className="text-2xl font-bold leading-[29px] text-navy">{kpi.value}</span>
                <Sparkline id={kpi.label} points={kpi.trend} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Needs Action + charts — Figma 907:12724, pad 20/32 gap 32 */}
      <section className="flex flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <Card>
          <div className="edge-bottom flex items-center justify-between gap-7 px-5 py-[18px]">
            <h2 className="text-xl font-semibold leading-5 tracking-[-0.4px] text-gray-700">
              Needs Action
            </h2>
            <Link
              href={officeHref(base, 'needs-action')}
              className="edge-gray200 flex items-center gap-2 rounded-lg px-[14px] py-[10px] text-sm font-semibold leading-6 text-gray-700 transition-colors hover:bg-gray-50"
            >
              See all
              <ArrowRightIcon className="h-4 w-4 text-gray-900" />
            </Link>
          </div>

          <ActionRowList rows={actions} />
        </Card>

        <div className="flex flex-col gap-[15px] xl:flex-row">
          {/* User growth — Figma 907:12830, 651 wide */}
          <Card className="w-full px-[19px] py-5 xl:w-[651px] xl:shrink-0">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-900">
                  User growth
                </h2>
                {/* /admin/user-growth takes a month count. */}
                <Select
                  label="Last 6 months"
                  className="w-[172px]"
                  param="months"
                  options={[
                    { value: '7', label: 'Last 7 months' },
                    { value: '12', label: 'Last 12 months' },
                    { value: '3', label: 'Last 3 months' }
                  ]}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-[2px] overflow-x-auto">
                <div className="relative h-[243px] min-w-[560px]">
                  {/* Grid lines: 5 plots, 52px apart, label + rule */}
                  <div className="flex h-full flex-col justify-between">
                    {axisTicks(growthTop).map((tick, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-7 shrink-0 text-right text-[10px] leading-[7px] text-[#6D7280]">
                          {tick}
                        </span>
                        <span className="plot-line flex-1" />
                      </div>
                    ))}
                  </div>

                  {/* Bars sit over the grid, bottom-aligned to the 00 rule */}
                  <div className="absolute inset-x-0 bottom-0 flex h-[140px] items-center justify-between px-[53px] py-1">
                    {growth.map((bar) => (
                      <div
                        key={bar.label}
                        title={`${bar.label}: ${bar.count}`}
                        className="flex h-[132px] w-[59px] flex-col bg-[#F3F4F6]"
                        style={{ paddingTop: bar.pad }}
                      >
                        <div className="flex-1 bg-success-600" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-[3px] min-w-[560px]">
                  <div className="flex justify-between px-[50px] py-[9px]">
                    {growth.map((bar) => (
                      <span
                        key={bar.label}
                        className="flex w-[59px] items-center justify-center px-[13px] py-[3px] text-center text-[10px] leading-[7px] text-[#6D7280]"
                      >
                        {bar.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/*
            Heat map — Figma 907:12884.

            The design's world SVG carried the designer's own per-country
            fills, so it showed the same tinted continents whatever had been
            reported; and the app records incidents in one country, which makes
            a world choropleth the wrong picture even when it is real. This is
            where the incidents actually are, on the same tile layer the Map
            screen uses, plus the real counts beside it.
          */}
          <Card className="flex min-w-0 flex-1 flex-col px-[19px] py-5">
            <div className="flex flex-1 flex-col gap-5">
              <div className="flex w-full items-center justify-between gap-1">
                <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-700">
                  Where incidents are
                </h2>
                <span className="text-xs font-normal leading-[15px] text-gray-500">
                  {places.length} located
                </span>
              </div>

              {places.length ? (
                <IncidentMiniMap places={places} />
              ) : (
                <p className="py-16 text-center text-sm leading-6 text-gray-500">
                  No incident on record carries a location yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
