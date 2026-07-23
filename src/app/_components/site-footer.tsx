import Image from 'next/image';
import Link from 'next/link';
import { SOCIALS } from './social-icons';
import { ScrollButton } from './scroll-button';

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' }
    ]
  },
  {
    title: 'Support',
    links: [{ label: 'Help Center', href: '/help-center' }]
  }
] as const;

const BADGES = (
  <>
    <a href="/coming-soon" aria-label="Get it on Google Play">
      <Image
        src="/images/landing/badge-google-play.png"
        alt="Get it on Google Play"
        width={135}
        height={40}
        className="h-10 w-auto"
      />
    </a>
    <a href="/coming-soon" aria-label="Download on the App Store">
      <Image
        src="/images/landing/badge-app-store.png"
        alt="Download on the App Store"
        width={120}
        height={40}
        className="h-10 w-auto"
      />
    </a>
  </>
);

export function SiteFooter() {
  return (
    <footer className="bg-[#111112]">
      <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-16 sm:px-10 md:px-20 md:pt-20">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="flex w-full max-w-[400px] flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/landing/logo-mark-white.png"
                  alt="SafeRoute"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-[22px] font-semibold leading-none text-white">
                  SafeRoute
                </span>
              </Link>
              <div className="flex flex-col gap-2">
                <p className="text-[20px] font-bold leading-[26px] text-white">
                  Know before you go.
                </p>
                <p className="text-[16px] font-normal leading-6 text-white/45">
                  Plan safer routes, arrive with peace of mind.
                </p>
              </div>
            </div>
            <div className="flex gap-3">{BADGES}</div>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-5">
                <h3 className="text-[16px] font-semibold leading-5 text-white/55">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[16px] font-normal leading-5 text-white/40 transition-colors hover:text-white/70"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-5">
              <h3 className="text-[16px] font-semibold leading-5 text-white/55">
                Connect with us
              </h3>
              <div className="flex flex-wrap items-center gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.07] text-white transition-colors hover:bg-white/15"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden fill="none">
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-14 flex items-center justify-between md:mt-16">
          <p className="text-[14px] font-normal leading-5 text-white/30">
            © {new Date().getFullYear()} SafeRoute. All rights reserved.
          </p>
          <div className="absolute left-1/2 hidden -translate-x-1/2 gap-6 sm:flex">
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' }
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[14px] font-normal leading-5 text-white/40 transition-colors hover:text-white/70"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <ScrollButton
            target="top"
            ariaLabel="Back to top"
            className="flex h-10 w-10 items-center justify-center text-white transition-opacity hover:opacity-70"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 19V5M12 5l-6 6M12 5l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ScrollButton>
        </div>
      </div>
    </footer>
  );
}
