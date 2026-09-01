'use client';


import { Shell } from '../../_components/shell';
import { ActionRowList, type ActionRowData } from '../../_components/action-row';
import { GoBack, Tabs } from '../../_components/tabs';
import { Card, Select } from '../../_components/ui';

/* Figma 907:12969 (Pendings action) and 907:13222 (Verified reports) — one
   screen, two tab states. Body: pad 20/32, gap 20. */


export function NeedsActionView({
  rows,
  tabs,
  active,
  onSelect
}: {
  rows: ActionRowData[];
  tabs: { id: string; label: string; count: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {

  return (
    <Shell title="Dashboard" filters>
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <GoBack />

        <Card>
          <div className="edge-bottom flex flex-col gap-4 px-5 py-[18px] lg:flex-row lg:items-center lg:justify-between lg:gap-7">
            <Tabs tabs={tabs} active={active} onChange={onSelect} />
            <Select
              label="All types"
              weight="semibold"
              className="w-[126px] shrink-0"
              unavailable="The queue is not filtered by type yet; the tabs above are its only split."
            />
          </div>

          {rows.length ? (
            <ActionRowList rows={rows} />
          ) : (
            <div className="flex items-center justify-center bg-surface-muted px-[19px] py-20 text-sm text-gray-500">
              No rejected reports.
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
