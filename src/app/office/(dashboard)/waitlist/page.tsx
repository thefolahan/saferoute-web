import { officeFetch } from '../../_lib/session';
import { WaitlistView, type WaitlistRow } from './waitlist-view';

export const dynamic = 'force-dynamic';

type ApiWaitlist = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  totals: { all: number; thisWeek: number };
  bySource: { source: string; count: number }[];
  sources: string[];
  rows: WaitlistRow[];
};

export default async function WaitlistPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const query = new URLSearchParams({ page: params.page ?? '1' });
  const exportQuery = new URLSearchParams();

  for (const key of ['q', 'source'] as const) {
    const value = params[key];
    if (value) {
      query.set(key, value);
      exportQuery.set(key, value);
    }
  }

  const data = await officeFetch<ApiWaitlist>(`/admin/waitlist?${query.toString()}`);

  return (
    <WaitlistView
      rows={data?.rows ?? []}
      sources={data?.sources ?? []}
      bySource={data?.bySource ?? []}
      totals={data?.totals ?? { all: 0, thisWeek: 0 }}
      page={data?.page ?? 1}
      pageCount={data?.pageCount ?? 1}
      pageLabel={pageLabel(data)}
      exportHref={`/api/office/waitlist/export?${exportQuery.toString()}`}
    />
  );
}

function pageLabel(data: ApiWaitlist | null): string {
  if (!data || data.total === 0) return 'No signups yet';
  const first = (data.page - 1) * data.pageSize + 1;
  const last = Math.min(data.page * data.pageSize, data.total);
  return `Showing ${first}–${last} of ${data.total}`;
}
