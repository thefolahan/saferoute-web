import Image from 'next/image';
import Link from 'next/link';

import { SiteNav } from '../site-nav';

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-black">
      <Image
        src="/images/landing/hero-section.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />

      <SiteNav active="Home" theme="dark" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 pt-28 sm:px-10 sm:pt-32 lg:flex-row lg:items-center lg:gap-10 lg:px-16 lg:pt-24">
        <div className="lg:flex-1">
          <h1 className="text-[44px] font-bold leading-[48px] tracking-tightest text-white sm:text-[64px] sm:leading-[64px] lg:text-[96px] lg:leading-[88px]">
            Know Before
            <br />
            You Go
          </h1>

          <p className="mt-8 max-w-[680px] text-[16px] font-normal leading-[26px] text-gray-300 sm:text-[18px] sm:leading-[30px] lg:mt-10 lg:text-[20px]">
            SafeRoute helps you make safer travel decisions with real-time
            community reports, verified updates, live broadcasts, and route
            safety intelligence.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <Link
              href="/coming-soon"
              className="rounded-full bg-gray-25 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-950 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Download App
            </Link>
            <Link
              href="/#how-it-works"
              className="rounded-full border border-gray-700 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-100 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-auto h-[300px] w-[230px] shrink-0 sm:h-[380px] sm:w-[290px] lg:mx-0 lg:mr-[6%] lg:h-[580px] lg:w-[375px] lg:self-end">
          <Image
            src="/images/landing/hero-phone-live.png"
            alt="SafeRoute live broadcast of a road incident on the Lekki-Epe Expressway"
            width={490}
            height={1010}
            priority
            sizes="(min-width: 1024px) 375px, (min-width: 640px) 290px, 230px"
            className="absolute inset-x-0 top-0 h-auto w-full"
          />
        </div>
      </div>

      {/* Sits above the phone so its bottom dissolves into the fade too. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[24%] bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
