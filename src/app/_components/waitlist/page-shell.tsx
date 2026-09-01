import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The chrome every full-page marketing surface shares: the gradient orbs, the
 * wordmark header with its back link, and the desktop footer.
 *
 * Extracted from waitlist-page.tsx when the admin sign-in page was asked to
 * look like /enterprise. Copying the markup would have meant two of it, and
 * the copy would drift the first time an orb moved — so both render this.
 */

export type ShellFooter = {
  copyright: string;
  links: { label: string; href: string }[];
};

export function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-32 -top-24 h-[380px] w-[440px] rounded-full bg-[#F9C5D1] opacity-30 blur-[100px] sm:h-[500px] sm:w-[600px] sm:opacity-40" />
      <div className="absolute -right-40 -top-20 h-[420px] w-[480px] rounded-full bg-[#C4B5FD] opacity-30 blur-[100px] sm:h-[600px] sm:w-[700px] sm:opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[440px] -translate-x-1/2 rounded-full bg-[#FBCFE8] opacity-25 blur-[100px] sm:h-[400px] sm:w-[500px] sm:opacity-30" />
    </div>
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/images/saferoute-icon-black.svg"
        alt="SafeRoute"
        width={32}
        height={32}
        className="h-8 w-8"
        priority
        unoptimized
      />
      <span className="text-[22px] font-medium leading-[29px] tracking-[-0.03em] text-[#1C1C1C] sm:text-[24px]">
        SafeRoute
      </span>
    </Link>
  );
}

export function PageShell({
  background = '#FFFFFF',
  footer,
  className = '',
  children
}: {
  background?: string;
  footer?: ShellFooter;
  /**
   * Extra classes on <main>. The admin sign-in page needs `font-sans` here:
   * it lives under app/office, whose layout scopes the dashboard's variable
   * Inter to the whole subtree, and this surface is measured against the
   * site's static instances.
   */
  className?: string;
  children: ReactNode;
}) {
  const back = (
    <Link
      href="/"
      className="text-[13px] font-medium leading-4 text-gray-500 transition-opacity hover:opacity-70 sm:text-[14px]"
    >
      <span className="sm:hidden">Back</span>
      <span className="hidden sm:inline">Back to SafeRoute</span>
    </Link>
  );

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ backgroundColor: background }}
    >
      <div className="relative flex min-h-screen w-full flex-col">
        <Orbs />

        {/* Header — mobile: back left + logo centre; desktop: logo left + back
            right. Same for every page on this surface. */}
        <header className="relative z-10 flex h-[73px] items-center px-6 sm:h-[88px] sm:px-12">
          <div className="absolute left-6 sm:hidden">{back}</div>
          <div className="mx-auto sm:mx-0">
            <Wordmark />
          </div>
          <div className="ml-auto hidden sm:block">{back}</div>
        </header>

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-9 px-6 pb-16 pt-6 text-center sm:gap-10 sm:px-10 sm:pb-20">
          {children}
        </div>

        {/* Footer — desktop only (the mobile design has no footer) */}
        {footer && (
          <footer className="relative z-10 hidden items-center justify-between px-6 py-5 sm:flex sm:px-12">
            <span className="text-[12px] leading-[15px] text-[#73737A]">
              © {new Date().getFullYear()} {footer.copyright}
            </span>
            <div className="flex items-center gap-5">
              {footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[12px] leading-[15px] text-gray-400 transition-colors hover:text-gray-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
