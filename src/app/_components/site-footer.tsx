import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer — 346:9858. Dark (#111112), pad 80/80/40, gap 48. Headline 28/36 w600,
 * subhead 16/19 white@50%. Three link columns (title 14/17 w600 white@50%,
 * links 14/17 w500 white@30%). Bottom bar: copyright + legal + back-to-top.
 */
const COLUMNS = [
  {
    title: 'Sitemap',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Route Planner', href: '#' },
      { label: 'Contact', href: '#' }
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'LinkedIn', href: '#' }
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

export function SiteFooter() {
  return (
    <footer className="bg-[#111112]">
      <div className="mx-auto max-w-[1280px] px-20 pb-10 pt-20">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          {/* Brand block */}
          <div className="flex w-full max-w-[400px] flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-[28px] font-semibold leading-9 text-white">
                Navigate Every Journey with Confidence!
              </h2>
              <p className="text-[16px] font-normal leading-[19px] text-white/50">
                Plan safer routes, arrive with peace of mind.
              </p>
            </div>
            <div className="flex gap-3">
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
            </div>
          </div>

          {/* Link columns */}
          <div className="flex gap-12">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex w-40 flex-col gap-4">
                <h3 className="text-[14px] font-semibold leading-[17px] text-white/50">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] font-medium leading-[17px] text-white/30 transition-colors hover:text-white/60"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex items-center justify-between">
          <p className="text-[14px] font-normal leading-[17px] text-white/30">
            All rights reserved
          </p>
          <div className="flex gap-4">
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' }
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[14px] font-normal leading-[17px] text-white/30 transition-colors hover:text-white/60"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href="#top"
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M12 5l-6 6M12 5l6 6"
                stroke="#fff"
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
