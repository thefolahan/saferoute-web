import Image from 'next/image';
import Link from 'next/link';

import { SiteNav } from '../site-nav';
import { MapIncidents } from './map-incidents';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0D12]">
      {/* Map background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing/map.svg')] bg-cover bg-center bg-no-repeat opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D12] via-[#0A0D12]/55 to-[#0A0D12]" />
      </div>

      {/* Randomly popping incident markers over the map */}
      <MapIncidents />

      <SiteNav active="Home" theme="dark" />

      <div className="relative mx-auto h-[740px] w-full sm:h-[906px]">
        <div className="absolute inset-x-0 top-[73px] bottom-[188px] flex flex-col items-center justify-center gap-8 px-6 text-center sm:bottom-auto sm:top-[160px] sm:justify-start sm:gap-12 sm:px-8">
          <div className="flex max-w-[880px] flex-col items-center gap-4 sm:gap-6">
            <h1 className="text-[36px] font-bold leading-[44px] tracking-[-0.02em] text-white sm:text-[56px] sm:leading-[64px] lg:text-[72px] lg:leading-[86px]">
              Know what&apos;s ahead before you get there.
            </h1>
            <p className="max-w-[880px] text-[16px] font-normal leading-[24px] text-gray-300 sm:text-[20px] sm:leading-[30px]">
              SafeRoute gives you real-time road intelligence, helping you avoid
              incidents, flooding, criminal activities, roadblocks, accidents,
              unauthorized checkpoints, traffic disruptions, and other hazards
              through verified community reports and AI-powered insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/coming-soon"
              className="rounded-full bg-gray-25 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-950 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              Get the App
            </Link>
            <Link
              href="/features"
              className="rounded-full border border-gray-700 px-[18px] py-3 text-[16px] font-semibold leading-6 text-gray-100 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]"
            >
              How it works
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 top-[566px] h-[270px] w-[340px] -translate-x-1/2 sm:top-[520px] sm:h-[440px] sm:w-[554px] lg:top-[576px] lg:h-[540px] lg:w-[680px]">
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
