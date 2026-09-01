'use client';

import { useState } from 'react';
import { Shell } from '../_components/shell';
import { ActionRowList } from '../_components/action-row';
import { GoBack, Tabs } from '../_components/tabs';
import { Card, Select } from '../_components/ui';
import { PENDING_ACTIONS, REJECTED_ACTIONS, VERIFIED_ACTIONS } from '../_lib/needs-action';

/* Figma 907:12969 (Pendings action) and 907:13222 (Verified reports) — one
   screen, two tab states. Body: pad 20/32, gap 20. */

const TABS = [
  { id: 'pending', label: 'Pendings action', count: '10' },
  { id: 'verified', label: 'Verified reports', count: '6' },
  { id: 'rejected', label: 'Rejected reports', count: '0' }
];

const ROWS = {
  pending: PENDING_ACTIONS,
  verified: VERIFIED_ACTIONS,
  rejected: REJECTED_ACTIONS
} as const;

export default function NeedsActionPage() {
  const [active, setActive] = useState<keyof typeof ROWS>('pending');
  const rows = ROWS[active];

  return (
    <Shell title="Dashboard" filters>
      <div className="flex flex-col gap-5 px-8 py-5">
        <GoBack />

        <Card>
          <div className="edge-bottom flex items-center justify-between gap-7 px-5 py-[18px]">
            <Tabs tabs={TABS} active={active} onChange={(id) => setActive(id as keyof typeof ROWS)} />
            <Select label="All types" weight="semibold" className="w-[126px] shrink-0" />
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
