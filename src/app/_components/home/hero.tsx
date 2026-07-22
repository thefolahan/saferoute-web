import Image from 'next/image';
import Link from 'next/link';

import { SiteNav } from '../site-nav';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0D12]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/images/landing/486-18019.png"
          alt=""
          width={1636}
          height={919}
          priority
          className="absolute bottom-0 left-1/2 w-full min-w-[1280px] max-w-none -translate-x-1/2 select-none"
        />
      </div>

      <SiteNav active="Home" theme="dark" />

      <div className="relative mx-auto h-[840px] w-full max-w-[1280px] sm:h-[906px]">
        <div className="absolute inset-x-0 top-[104px] flex flex-col items-center gap-8 px-6 text-center sm:top-[160px] sm:gap-12 sm:px-8">
          <div className="flex max-w-[880px] flex-col items-center gap-4 sm:gap-6">
            <h1 className="text-[36px] font-normal leading-[44px] tracking-[-0.02em] text-white sm:text-[56px] sm:leading-[64px] lg:text-[72px] lg:leading-[86px]">
              Know what's happening before you get there.
            </h1>
            <p className="max-w-[880px] text-[16px] font-normal leading-[24px] text-gray-300 sm:text-[20px] sm:leading-[30px]">
              SafeRoute helps you make safer travel decisions with real-time
              community reports, verified updates, live broadcasts, and route
              safety intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/coming-soon"
              className="rounded-full bg-gray-25 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-950 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Download App
            </Link>
            <Link
              href="/features"
              className="rounded-full border border-gray-700 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-100 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 top-[520px] h-[300px] w-[378px] -translate-x-1/2 sm:top-[520px] sm:h-[440px] sm:w-[554px] lg:top-[576px] lg:h-[540px] lg:w-[680px]">
          <Image
            src="/images/landing/346-9023.png"
            alt="SafeRoute app screens"
            fill
            priority
            className="object-contain object-top"
          />
        </div>
      </div>
    </section>
  );
}
