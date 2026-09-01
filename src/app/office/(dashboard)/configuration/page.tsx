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
  passwordChangedAt: string | null;
  preferences: AdminProfile['preferences'] | null;
};

export default async function ConfigurationPage() {
  const me = await officeFetch<Me>('/admin/auth/me');

  const profile: AdminProfile = {
    fullName: me?.fullName ?? me?.email.split('@')[0] ?? 'Administrator',
    email: me?.email ?? '—',
    /**
     * Empty, not an em dash: these feed editable inputs now, and "—" would be
     * saved back as the admin's actual phone number the first time anyone
     * touched the form.
     */
    phone: me?.phone ?? '',
    department: me?.department ?? '',
    role: me?.role ?? 'admin',
    avatarUrl: me?.avatarUrl ?? null,
    mfaEnabled: me?.mfaEnabled ?? false,
    passwordChangedAt: me?.passwordChangedAt
      ? new Date(me.passwordChangedAt).toLocaleDateString('en', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      : null,
    preferences: me?.preferences ?? {}
  };

  return <ConfigurationView profile={profile} />;
}
