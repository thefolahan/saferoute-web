'use client';

import type { ReactNode } from 'react';
import { NavProvider } from './nav-state';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

/**
 * Every screen on canvas 907:2 is 1440 wide = 250 sidebar + 1190 content, and
 * that is exactly what renders at `lg` and above.
 *
 * Below `lg` the sidebar becomes an off-canvas drawer and the content takes the
 * full width — the design has no small-screen frames, so this is the standard
 * pattern rather than a drawn one.
 */
export function Shell({
  title,
  filters,
  children
}: {
  title: string;
  filters?: boolean;
  children: ReactNode;
}) {
  return (
    <NavProvider>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <Topbar title={title} filters={filters} />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </NavProvider>
  );
}
