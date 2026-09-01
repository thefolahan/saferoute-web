import { officeFetch } from '../../_lib/session';
import { ContentsView, type ContentRow, type Status } from './contents-view';

export const dynamic = 'force-dynamic';

type ApiPost = {
  id: string;
  caption: string;
  author: string;
  city: string | null;
  status: 'pending_review' | 'published' | 'rejected' | 'removed';
  mediaCount: number;
  createdAt: string;
};

type ApiPage = { page: number; pageSize: number; total: number; rows: ApiPost[] };

/**
 * A feed post's moderation state, in the vocabulary the design uses.
 * `published` means it passed review, which the screen calls "Verified".
 */
const STATUS_LABEL: Record<ApiPost['status'], Status> = {
  published: 'Verified',
  pending_review: 'Pending review',
  rejected: 'Rejected',
  removed: 'Needs evidence'
};

export default async function ContentsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? '1', 10) || 1;

  const query = new URLSearchParams({ page: String(page) });
  if (params.q) query.set('q', params.q);

  const data = await officeFetch<ApiPage>(`/admin/contents?${query.toString()}`);
  const rows = data?.rows ?? [];

  return (
    <ContentsView
      pageLabel={pageLabel(data)}
      rows={rows.map((post): ContentRow => ({
        id: post.id,
        title: post.caption,
        author: `by ${post.author}`,
        place: post.city ?? 'Location not set',
        images: `${post.mediaCount} ${post.mediaCount === 1 ? 'image' : 'images'}`,
        posted: `Posted - ${new Date(post.createdAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        status: STATUS_LABEL[post.status]
      }))}
    />
  );
}

function pageLabel(data: ApiPage | null): string {
  if (!data || data.total === 0) return 'No content yet';
  const first = (data.page - 1) * data.pageSize + 1;
  const last = Math.min(data.page * data.pageSize, data.total);
  return `Showing ${first}–${last} of ${data.total}`;
}
