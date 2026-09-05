import { renderUserDetail } from '../_detail';

export const dynamic = 'force-dynamic';

export default async function CommunityUserPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string; tab?: string }>;
}) {
  const { id, tab } = await searchParams;
  return renderUserDetail({ id, tab, kind: 'community' });
}
