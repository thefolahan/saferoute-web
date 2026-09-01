import { officeFetch } from '../../_lib/session';
import { ConfigurationView, type AdminProfile } from './configuration-view';

export const dynamic = 'force-dynamic';

type Me = {
  email: string;
  fullName: string | null;
  phone: string | null;
  department: string | null;
  avatarUrl: string | null;
  role: string;
  mfaEnabled: boolean;
};

export default async function ConfigurationPage() {
  const me = await officeFetch<Me>('/admin/auth/me');

  const profile: AdminProfile = {
    fullName: me?.fullName ?? me?.email.split('@')[0] ?? 'Administrator',
    email: me?.email ?? '—',
    // Nullable on admin_users: bootstrap creates an admin from an email alone.
    phone: me?.phone ?? '—',
    department: me?.department ?? '—',
    role: me?.role ?? 'admin',
    avatarUrl: me?.avatarUrl ?? null,
    mfaEnabled: me?.mfaEnabled ?? false
  };

  return <ConfigurationView profile={profile} />;
}
