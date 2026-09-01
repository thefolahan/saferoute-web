'use client';

import Link from 'next/link';
import { officeHref, useOfficeBase } from '../_lib/office-path';
import { Shell } from '../_components/shell';
import { ArrowRightIcon, Card, Select, Sparkline } from '../_components/ui';
import { WorldHeatMap } from '../_components/world-heat-map';
import { ActionRowList } from '../_components/action-row';
import type { ActionRowData } from '../_components/action-row';

/* Figma 907:12642 "Dashboard" — presentation only; the data is fetched by
   page.tsx on the server and passed in. */

export type Kpi = { label: string; value: string; down?: boolean };
export type GrowthBar = { label: string; pad: number };


export function DashboardView({
  kpis,
  actions,
  growth,
  adminName
}: {
  kpis: Kpi[];
  actions: ActionRowData[];
  growth: GrowthBar[];
  adminName: string;
}) {
  const base = useOfficeBase();

  return (
    <Shell title="Dashboard" filters>
      {/* Welcome + KPI grid — Figma 907:12646, pad 19/32 gap 15 */}
      <section className="flex flex-col gap-[15px] px-8 py-[19px]">
        <div className="flex items-center justify-between gap-[15px]">
          <div className="flex flex-col justify-center gap-[10px]">
            <h2 className="text-[32px] font-medium leading-[39px] text-gray-500">
              Welcome back, <span className="text-gray-900">{adminName}</span> 👋
            </h2>
            <p className="text-base font-normal leading-[19px] text-gray-500">
              Here&apos;s what&apos;s happening across SafeRoute today.
            </p>
          </div>
          <Select label="Today" weight="semibold" className="w-[126px] shrink-0" />
        </div>

        <div className="grid grid-cols-5 gap-[15px] py-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="edge flex flex-col gap-[23px] rounded-[15px] px-[19px] py-[23px]"
            >
              <span className="text-sm font-normal leading-[17px] text-gray-700">{kpi.label}</span>
              <div className="flex items-end justify-between gap-[23px]">
                <span className="text-2xl font-bold leading-[29px] text-navy">{kpi.value}</span>
                <Sparkline id={kpi.label} down={kpi.down} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Needs Action + charts — Figma 907:12724, pad 20/32 gap 32 */}
      <section className="flex flex-col gap-8 px-8 py-5">
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

        <div className="flex gap-[15px]">
          {/* User growth — Figma 907:12830, 651 wide */}
          <Card className="w-[651px] shrink-0 px-[19px] py-5">
            <div className="flex flex-col gap-7">
              <div className="flex items-center justify-between gap-1">
                <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-900">
                  User growth
                </h2>
                <Select label="Last 6 months" className="w-[172px]" />
              </div>

              <div className="flex flex-col gap-[2px]">
                <div className="relative h-[243px]">
                  {/* Grid lines: 5 plots, 52px apart, label + rule */}
                  <div className="flex h-full flex-col justify-between">
                    {['80k', '60k', '40k', '20k', '00'].map((tick) => (
                      <div key={tick} className="flex items-center gap-1">
                        <span className="w-[19px] shrink-0 text-[10px] leading-[7px] text-[#6D7280]">
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
                        className="flex h-[132px] w-[59px] flex-col bg-[#F3F4F6]"
                        style={{ paddingTop: bar.pad }}
                      >
                        <div className="flex-1 bg-success-600" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-[3px]">
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

          {/* Heat map — Figma 907:12884 */}
          <Card className="flex flex-1 flex-col px-[19px] py-5">
            <div className="flex flex-1 flex-col items-center gap-[50px]">
              <div className="flex w-full items-center justify-between gap-1">
                <h2 className="text-sm font-semibold uppercase leading-[17px] text-gray-700">
                  Heat map of incidents
                </h2>
                <Select label="Today" className="w-[101px]" />
              </div>
              <WorldHeatMap className="h-auto w-[378px] max-w-full" />
            </div>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
