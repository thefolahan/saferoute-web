import { renderUserDetail } from '../_detail';

export const dynamic = 'force-dynamic';

export default async function AgencyDetailPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string; tab?: string; activityLimit?: string }>;
}) {
  const { id, tab, activityLimit } = await searchParams;
  return renderUserDetail({ id, tab, activityLimit, kind: 'agency' });
}
