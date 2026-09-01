import { renderUserDetail } from '../_detail';

export const dynamic = 'force-dynamic';

export default async function AgencyDetailPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return renderUserDetail({ id, kind: 'agency' });
}
