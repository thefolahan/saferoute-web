import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Logo } from '../_components/icons';
import { getSessionToken, officeBase, officeFetch } from '../_lib/session';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

export default async function OfficeLoginPage() {
  const base = await officeBase();

  // Already signed in — skip the form rather than letting someone log in twice.
  if (await getSessionToken()) {
    const me = await officeFetch<{ id: string }>('/admin/auth/me').catch(
      () => null
    );
    if (me) redirect(base);
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel — the dashboard's own sidebar colour, so signing in and
          landing on the dashboard feel like one surface. Hidden on small
          screens, where the form should own the viewport. */}
      <div className="hidden w-[42%] max-w-[560px] flex-col justify-between bg-sidebar p-12 lg:flex">
        <Logo className="h-[25px] w-[121px] text-white" />
        <div className="flex flex-col gap-4">
          <p className="text-[32px] font-semibold leading-[42px] text-white">
            Know before you go.
          </p>
          <p className="max-w-[380px] text-[15px] leading-[24px] text-sidebar-label">
            Incidents, broadcasts, verification and support for SafeRoute —
            in one place.
          </p>
        </div>
        <p className="text-xs leading-5 text-sidebar-label">
          © {new Date().getFullYear()} SafeRoute
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <LoginForm base={base} />
      </div>
    </div>
  );
}
