import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageShell } from '../../_components/waitlist/page-shell';
import { Reveal } from '../../_components/reveal';
import { SOCIALS } from '../../_components/social-icons';
import { getSessionToken, officeBase, officeFetch } from '../_lib/session';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

/**
 * The same surface as /enterprise — orbs, wordmark header, centred column,
 * card, socials, footer — rendered from the shared `PageShell` rather than a
 * copy of its markup, so the two cannot drift apart.
 *
 * `font-sans` is deliberate: this route sits under app/office, whose layout
 * scopes the dashboard's VARIABLE Inter to the whole subtree, and this page is
 * measured against the site's static instances like every other public page.
 */
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
    <PageShell
      className="font-sans"
      footer={{
        copyright: 'SafeRoute Africa. All rights reserved.',
        links: [
          { label: 'Privacy Policy', href: '/privacy-policy' },
          { label: 'Terms of Use', href: '/terms-of-use' },
          { label: 'Community Guidelines', href: '/community-guidelines' }
        ]
      }}
    >
      {/* Hero text */}
      <div className="flex w-full max-w-[680px] flex-col items-center gap-4 lg:max-w-[940px]">
        <Reveal
          as="h1"
          className="text-[34px] font-bold leading-[42px] tracking-[-0.02em] text-[#0A0D12] sm:text-[60px] sm:leading-[68px]"
        >
          <span className="lg:block">Know before you go. </span>
          <span className="lg:block">Sign in to the office.</span>
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          className="max-w-[680px] text-[17px] font-normal leading-[26px] text-gray-500"
        >
          Incidents, broadcasts, verification and support for SafeRoute — in one
          place.
        </Reveal>
      </div>

      {/* Where the waitlist pages put their social proof */}
      <Reveal delay={200} className="flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-[14px] font-semibold leading-[17px] text-[#0A0D12]">
            SafeRoute operations dashboard
          </span>
          <span className="text-[13px] font-normal leading-4 text-gray-400 sm:text-[14px]">
            Authorised staff only. Every account uses two-factor authentication.
          </span>
        </div>
      </Reveal>

      {/* Form */}
      <Reveal delay={280} className="flex w-full justify-center">
        <LoginForm base={base} />
      </Reveal>

      {/* Socials */}
      <Reveal delay={360} className="flex flex-col items-center gap-4">
        <h3 className="text-[14px] font-semibold leading-[17px] text-[#181D27]">
          Connect with us
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                {s.icon}
              </svg>
            </a>
          ))}
        </div>
      </Reveal>
    </PageShell>
  );
}
