'use client';

import { Shell } from '../../_components/shell';
import { useAction } from '../../_components/use-action';
import { revokeVerification } from '../../_lib/actions';
import { ActionRowList, type ActionRowData } from '../../_components/action-row';
import { GoBack, Tabs } from '../../_components/tabs';
import { Card, Select } from '../../_components/ui';

/* Figma 907:12969 (Pendings action) and 907:13222 (Verified reports) — one
   screen, two tab states. Body: pad 20/32, gap 20. */


export function NeedsActionView({
  rows,
  tabs,
  active,
  onSelect,
  categories,
  states,
  regions
}: {
  rows: ActionRowData[];
  tabs: { id: string; label: string; count: string }[];
  active: string;
  onSelect: (id: string) => void;
  /** The values present in the queue — the pickers offer only these. */
  categories: string[];
  states: string[];
  regions: string[];
}) {
  const { pending, error, run } = useAction();

  return (
    <Shell title="Dashboard" filters={{ regions, states }}>
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <GoBack />

        <Card>
          <div className="edge-bottom flex flex-col gap-4 px-5 py-[18px] lg:flex-row lg:items-center lg:justify-between lg:gap-7">
            <Tabs tabs={tabs} active={active} onChange={onSelect} />
            {/* "Type" here is the incident's category — what a moderator triages by. */}
            <Select
              label="All types"
              weight="semibold"
              className="w-[176px] shrink-0"
              param="category"
              options={[
                { value: '', label: 'All types' },
                ...categories.map((category) => ({
                  value: category,
                  label: category
                    .replace(/_/g, ' ')
                    .replace(/^./, (c) => c.toUpperCase())
                }))
              ]}
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="bg-surface-muted px-[19px] pt-[14px] text-sm font-medium leading-5 text-error-700"
            >
              {error}
            </p>
          ) : null}

          {rows.length ? (
            <ActionRowList
              rows={rows}
              pending={pending}
              onRevoke={(row) => run(() => revokeVerification(row.id))}
            />
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
