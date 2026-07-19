import Image from 'next/image';

import { SiteNav } from '../site-nav';

export function Hero() {
  return (
    // 346:8995 clipsContent — the phone cluster is cut at the hero's bottom
    // edge (only its top ~60% shows), so this section clips its overflow.
    <section className="relative overflow-hidden bg-[#0A0D12]">
      {/* Faint map-lines background — full-bleed, anchored low, clipped to the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/images/landing/486-18019.png"
          alt=""
          width={1636}
          height={919}
          priority
          className="absolute bottom-0 left-1/2 w-[1636px] max-w-none -translate-x-1/2 select-none"
        />
      </div>

      <SiteNav active="Home" theme="dark" />

      <div className="relative mx-auto h-[906px] max-w-[1280px]">
        {/* Heading + supporting text + actions (nav 80 + section pad 80 = 160 top) */}
        <div className="absolute inset-x-0 top-[160px] flex flex-col items-center gap-12 px-8 text-center">
          <div className="flex max-w-[880px] flex-col items-center gap-6">
            <h1 className="text-[72px] font-normal leading-[86px] tracking-[-0.02em] text-white">
              Know what&apos;s happening before you get there.
            </h1>
            <p className="max-w-[880px] text-[20px] font-normal leading-[30px] text-gray-300">
              SafeRoute helps you make safer travel decisions with real-time
              community reports, verified updates, live broadcasts, and route
              safety intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-gray-25 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-950 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Download App
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-700 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-100 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* 3-phone cluster at y=576 (346:9023); the hero clips it at 906 so
            only the top portion shows. */}
        <div className="absolute left-1/2 top-[576px] h-[540px] w-[680px] -translate-x-1/2">
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
