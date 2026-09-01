import { renderUserDetail } from '../_detail';

export const dynamic = 'force-dynamic';

export default async function CommunityUserPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return renderUserDetail({ id, kind: 'community' });
}
