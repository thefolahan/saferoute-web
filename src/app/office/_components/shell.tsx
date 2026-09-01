import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

/* Every screen on canvas 907:2 is 1440 wide = 250 sidebar + 1190 content.
   The sidebar column paints its black the full height of the document (as the
   design shows) while the menu itself stays pinned to the viewport. */
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
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <Topbar title={title} filters={filters} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
