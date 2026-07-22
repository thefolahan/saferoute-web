import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from './mobile-menu';

/**
 * Top navigation — 346:8996. 1280 max, 80 tall, pad 16/40, space-between.
 * A dark pill on the (dark) Home hero, a light pill on the light pages.
 * Logo mark 32, wordmark 24/29 w500; Download App is a Gray/25 pill,
 * Text md/Semibold in Gray/950.
 */
const TABS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Journalist', href: '/journalist' },
  { label: 'Enterprise', href: '/enterprise' }
] as const;

export function SiteNav({
  active,
  theme = 'light'
}: {
  active?: 'Home' | 'Features' | 'Journalist' | 'Enterprise';
  theme?: 'dark' | 'light';
}) {
  const dark = theme === 'dark';
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="flex h-20 w-full items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={dark ? '/images/landing/logo-mark-white.png' : '/images/landing/logo-mark-dark.png'}
            alt="SafeRoute"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span
            className={`text-[24px] font-medium leading-[29px] ${
              dark ? 'text-white' : 'text-[#1C1C1C]'
            }`}
          >
            SafeRoute
          </span>
        </Link>

        {/* Tab pill — 346:8996 (dark) / 491:21551 (light). Hidden below lg where
            the four-tab pill would overflow narrow viewports (the design is
            desktop-only; brand + Download App remain). */}
        <nav
          className={`hidden items-center gap-0.5 rounded-full p-1 lg:flex ${
            dark
              ? 'border border-[#1C1C1E] bg-[#121214]'
              : 'border border-[#E2E2E6] bg-[#ECECEF]'
          }`}
        >
          {TABS.map((tab, i) => {
            const isActive = tab.label === active;
            // A divider sits between two consecutive inactive tabs (346:8996).
            const showDivider =
              i > 0 && !isActive && TABS[i - 1]?.label !== active;
            return (
              <div key={tab.label} className="flex items-center">
                {showDivider ? (
                  <span
                    className={`h-4 w-px ${dark ? 'bg-[#2C2C2E]' : 'bg-gray-300'}`}
                    aria-hidden
                  />
                ) : null}
                <Link
                  href={tab.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-5 py-2.5 text-[14px] leading-5 transition-colors ${
                    isActive
                      ? dark
                        ? 'bg-[#1A1A1E] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]'
                        : 'bg-white font-medium text-gray-950 shadow-[0_2px_6px_rgba(0,0,0,0.08)]'
                      : dark
                        ? 'font-medium text-[#8E8E93]'
                        : 'font-medium text-gray-500'
                  }`}
                >
                  {tab.label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Download App — desktop */}
        <Link
          href="/coming-soon"
          className="hidden items-center justify-center rounded-full bg-gray-25 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-950 shadow-[0_1px_2px_rgba(10,13,18,0.05)] ring-1 ring-inset ring-black/[0.08] lg:flex"
        >
          Download App
        </Link>

        {/* Hamburger — mobile / tablet */}
        <MobileMenu tabs={TABS} active={active} dark={dark} />
      </div>
    </header>
  );
}
