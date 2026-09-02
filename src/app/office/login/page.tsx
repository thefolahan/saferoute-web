import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageShell } from '../../_components/waitlist/page-shell';
import { Reveal } from '../../_components/reveal';
import { getSessionToken, officeBase, officeFetch } from '../_lib/session';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

export default async function OfficeLoginPage() {
  const base = await officeBase();

  if (await getSessionToken()) {
    const me = await officeFetch<{ id: string }>('/admin/auth/me').catch(
      () => null
    );
    if (me) redirect(base);
  }

  return (
    <PageShell
      className="font-sans"
      footer={{ copyright: 'SafeRoute Africa. All rights reserved.' }}
    >
      <div className="flex w-full max-w-[680px] flex-col items-center gap-4 lg:max-w-[940px]">
        <Reveal
          as="h1"
          className="text-[34px] font-bold leading-[42px] tracking-[-0.02em] text-[#0A0D12] sm:text-[60px] sm:leading-[68px]"
        >
          Sign in to the office
        </Reveal>
      </div>

      <Reveal delay={200} className="flex flex-col items-center gap-2.5">
        <span className="text-[13px] font-normal leading-4 text-gray-400 sm:text-[14px]">
          Authorised staff only.
        </span>
      </Reveal>

      <Reveal delay={280} className="flex w-full justify-center">
        <LoginForm base={base} />
      </Reveal>

    </PageShell>
  );
}
