import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer — 346:9858 / 491:23435 (reworked "Copy" file). Dark #111112.
 * Brand block (globe wordmark + headline + sub + store badges) on the left,
 * three link columns on the right (Company, Support, Connect with us — the
 * last a row of social icon buttons). Bottom bar: copyright + legal + a
 * back-to-top arrow.
 */
const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '#' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Safety Tips', href: '#' },
      { label: 'Pricing', href: '#' }
    ]
  }
] as const;

const SOCIALS = [
  {
    label: 'X',
    href: '#',
    icon: (
      <path
        d="M13.9 2.5h2.5l-5.5 6.3 6.5 8.7h-5.1l-4-5.2-4.6 5.2H1.6l5.9-6.7L1.3 2.5h5.2l3.6 4.8L13.9 2.5Zm-.9 13.3h1.4L6.1 3.9H4.6l8.4 11.9Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'Email',
    href: '#',
    icon: (
      <path
        d="M2.5 4.5h15c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1v-9c0-.6.4-1 1-1Zm.5 2v.9l7 4.4 7-4.4V6.5l-7 4.4-7-4.4Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <path
        d="M13 2.5c.3 1.8 1.3 3 3 3.2v2.3c-1 .1-2-.2-3-.7v4.9c0 3-2.4 4.8-4.7 4.3-2.6-.5-3.6-3.6-1.9-5.6.9-1 2.2-1.3 3.4-1v2.4c-.5-.2-1.1-.1-1.5.3-.7.7-.5 2 .6 2.2.9.2 1.8-.4 1.8-1.5V2.5H13Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <path
        d="M6.1 7.5v9H3.3v-9h2.8Zm-1.4-4.3c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6Zm4 4.3h2.7v1.2c.4-.7 1.3-1.4 2.6-1.4 2.1 0 3.2 1.3 3.2 3.7v5.5h-2.8v-5c0-1.2-.4-1.9-1.5-1.9-1 0-1.5.7-1.5 1.9v5H8.7v-9Z"
        fill="currentColor"
      />
    )
  }
] as const;

const BADGES = (
  <>
    <a href="#download" aria-label="Get it on Google Play">
      <Image
        src="/images/landing/badge-google-play.png"
        alt="Get it on Google Play"
        width={135}
        height={40}
        className="h-10 w-auto"
      />
    </a>
    <a href="#download" aria-label="Download on the App Store">
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
          {/* Brand block */}
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
                  Navigate Every Journey with Confidence!
                </p>
                <p className="text-[16px] font-normal leading-6 text-white/45">
                  Plan safer routes, arrive with peace of mind.
                </p>
              </div>
            </div>
            <div className="flex gap-3">{BADGES}</div>
          </div>

          {/* Link columns */}
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

            {/* Connect with us */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[16px] font-semibold leading-5 text-white/55">
                Connect with us
              </h3>
              <div className="flex items-center gap-3">
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

        {/* Bottom bar */}
        <div className="relative mt-14 flex items-center justify-between md:mt-16">
          <p className="text-[14px] font-normal leading-5 text-white/30">
            All rights reserved
          </p>
          <div className="absolute left-1/2 hidden -translate-x-1/2 gap-6 sm:flex">
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' }
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
          <a
            href="#top"
            aria-label="Back to top"
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
          </a>
        </div>
      </div>
    </footer>
  );
}
