import { officeFetch } from '../../_lib/session';
import type { ContentDetail } from '../../_components/content-modal';
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

type ApiPage = {
  page: number;
  pageSize: number;
  total: number;
  /** Every city with a post in it, for the City filter's options. */
  cities: string[];
  rows: ApiPost[];
};

type ApiDetail = {
  id: string;
  caption: string;
  author: string;
  city: string | null;
  status: string;
  createdAt: string;
  incident: {
    publicId: string;
    title: string;
    category: string;
    city: string;
    addressText: string | null;
  } | null;
  media: { id: string; type: string; url: string | null }[];
};

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
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    city?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? '1', 10) || 1;

  const query = new URLSearchParams({ page: String(page) });
  for (const key of ['q', 'status', 'city'] as const) {
    const value = params[key];
    if (value) query.set(key, value);
  }

  const data = await officeFetch<ApiPage>(`/admin/contents?${query.toString()}`);
  const rows = data?.rows ?? [];

  /**
   * The sheet's media are signed URLs that expire in five minutes, so they are
   * fetched when a row is opened rather than minted for all fifteen rows on
   * every page render.
   */
  async function loadDetail(id: string): Promise<ContentDetail | null> {
    'use server';

    const post = await officeFetch<ApiDetail>(`/admin/contents/${id}`).catch(
      () => null
    );

    if (!post) return null;

    return {
      id: post.id,
      caption: post.caption,
      author: post.author,
      city: post.city,
      status: post.status,
      posted: new Date(post.createdAt).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      incident: post.incident,
      media: post.media.map((item) => ({ id: item.id, url: item.url }))
    };
  }

  return (
    <ContentsView
      loadDetail={loadDetail}
      cities={data?.cities ?? []}
      page={data?.page ?? 1}
      pageCount={pageCount(data)}
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

function pageCount(data: ApiPage | null): number {
  if (!data || data.total === 0) return 1;
  return Math.max(1, Math.ceil(data.total / data.pageSize));
}

function pageLabel(data: ApiPage | null): string {
  if (!data || data.total === 0) return 'No content yet';
  const first = (data.page - 1) * data.pageSize + 1;
  const last = Math.min(data.page * data.pageSize, data.total);
  return `Showing ${first}–${last} of ${data.total}`;
}
