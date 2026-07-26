import Image from 'next/image';
import Link from 'next/link';

import { SiteNav } from '../site-nav';
import { HeroPhone } from './hero-phone';

const CTA =
  'inline-flex w-[160px] items-center justify-center rounded-full border px-[18px] py-3 text-[16px] font-semibold leading-6 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]';

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

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pb-8 pt-24 sm:px-10 sm:pt-32 lg:flex-row lg:items-center lg:justify-start lg:gap-10 lg:px-16 lg:pb-0 lg:pt-24">
        <div className="pb-10 lg:flex-1 lg:pb-0">
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
              className={`${CTA} border-transparent bg-gray-25 text-gray-950`}
            >
              Download App
            </Link>
            <Link
              href="/#how-it-works"
              className={`${CTA} border-gray-700 text-gray-100`}
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mx-auto flex h-[min(58svh,520px)] shrink-0 items-end justify-center sm:h-[min(70svh,780px)] lg:mx-0 lg:mb-[6svh] lg:mt-auto lg:h-[min(82svh,860px)] lg:flex-1">
          <HeroPhone />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[14%] bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
