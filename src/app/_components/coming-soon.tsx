import Image from 'next/image';
import Link from 'next/link';
import { AvatarStack } from './waitlist/avatar-stack';
import { WaitlistForm } from './waitlist/waitlist-form';

/**
 * Coming Soon — Figma 2059:11227 (desktop) / 2059:11283 (mobile). Light #FAFAFA,
 * faint brand orbs. Desktop: logo left + "Back to SafeRoute" right, and just the
 * big centered heading. Mobile: logo centred, heading + subtitle, and (for the
 * live Coming Soon page) social proof + email form. Also backs the 404.
 */
export function ComingSoon({
  heading = 'Coming Soon!',
  subtitle = 'Are you Ready to get something new from us. Then subscribe the news latter to get latest updates?',
  waitlist = true
}: {
  heading?: string;
  subtitle?: string;
  waitlist?: boolean;
}) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-24 h-[380px] w-[440px] rounded-full bg-[#F9C5D1] opacity-30 blur-[100px] sm:h-[500px] sm:w-[600px] sm:opacity-40" />
        <div className="absolute -right-40 -top-20 h-[420px] w-[480px] rounded-full bg-[#C4B5FD] opacity-30 blur-[100px] sm:h-[600px] sm:w-[700px] sm:opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[440px] -translate-x-1/2 rounded-full bg-[#FBCFE8] opacity-25 blur-[100px] sm:h-[400px] sm:w-[500px] sm:opacity-30" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full flex-col">
        {/* Header: logo centred on mobile, logo-left + back-right on desktop */}
        <header className="relative z-10 flex h-[73px] items-center px-4 sm:h-[88px] sm:px-12">
          <div className="mx-auto flex items-center gap-1 sm:mx-0">
            <Image
              src="/images/landing/logo-mark-dark.png"
              alt="SafeRoute"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-[22px] font-medium leading-[29px] tracking-[-0.03em] text-[#1C1C1C] sm:text-[24px]">
              SafeRoute
            </span>
          </div>
          <Link
            href="/"
            className="ml-auto hidden text-[13px] font-medium leading-4 text-gray-500 transition-opacity hover:opacity-70 sm:block"
          >
            Back to SafeRoute
          </Link>
        </header>

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-4 pb-16 text-center sm:px-10">
          <div className="flex max-w-[680px] flex-col items-center gap-4">
            <h1 className="text-[36px] font-bold leading-tight tracking-[-0.02em] text-[#0A0D12] sm:text-[58px] sm:leading-[68px]">
              {heading}
            </h1>
            <p className="max-w-[370px] text-[14px] font-normal leading-[30px] text-[#4E545F] sm:hidden">
              {subtitle}
            </p>
          </div>

          {waitlist && (
            <div className="flex flex-col items-center gap-10 sm:hidden">
              <div className="flex items-center gap-3">
                <AvatarStack
                  avatars={[
                    '/images/landing/496-18346.png',
                    '/images/landing/496-18347.png',
                    '/images/landing/496-18348.png'
                  ]}
                  size={32}
                  overlap={10}
                  countText="+14"
                  countBg="#F3F4F6"
                  countColor="#6B7280"
                  countSize={10}
                  countLineHeight={12}
                />
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-semibold leading-[17px] text-[#0A0D12]">
                    Join 200+ journalists
                  </span>
                  <span className="text-[13px] font-normal leading-4 text-gray-400">
                    from Reuters, AP, BBC and more
                  </span>
                </div>
              </div>
              <WaitlistForm variant="card" placeholder="Enter your email..." width={370} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
