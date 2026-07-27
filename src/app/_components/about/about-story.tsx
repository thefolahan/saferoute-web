import Image from 'next/image';

export function AboutStory() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-[#0A0D12]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-20 md:py-24">
        <h2 className="text-center text-[32px] font-medium leading-[40px] tracking-tightest text-white sm:text-[48px] sm:leading-[60px]">
          Why We Built SafeRoute
        </h2>

        <p className="mt-10 max-w-[1040px] text-[18px] font-normal leading-[30px] text-white/90 sm:text-[22px] sm:leading-[36px]">
          SafeRoute began with a simple realization: people don&apos;t just need
          directions, they need awareness. A roadblock, a flooded underpass, a
          protest on the bridge or an unauthorised checkpoint can turn a
          twenty-minute trip into a three-hour ordeal, and the people already
          sitting in it are the only ones who know.
        </p>

        <div className="mt-14 flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="relative aspect-[1502/1120] w-full max-w-[480px] shrink-0 overflow-hidden rounded-[32px] bg-gray-200">
            <Image
              src="/images/landing/Community-Feed.png"
              alt="SafeRoute community feed with live incident reports"
              width={1502}
              height={1120}
              sizes="(min-width: 1024px) 480px, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex max-w-[600px] flex-col gap-4">
            <p className="text-[18px] font-normal leading-[30px] text-white/90 lg:text-[15px] lg:leading-[24px]">
              Traditional navigation apps are excellent at finding the fastest
              route, but they rarely tell you what is actually happening on it.
              We believed road users deserved better.
            </p>
            <p className="text-[18px] font-normal leading-[30px] text-white/90 lg:text-[15px] lg:leading-[24px]">
              So we built it the other way round. Someone on the road reports
              what they see. AI and other users nearby check it within minutes.
              The map updates for everyone heading the same way.
            </p>
            <p className="text-[18px] font-normal leading-[30px] text-white/90 lg:text-[15px] lg:leading-[24px]">
              Commuters, dispatch riders, fleet operators, families travelling
              between cities. The question is always the same: is the way clear
              right now, and if not, what are my options?
            </p>
            <p className="mt-2 text-[18px] font-bold italic leading-[30px] text-white lg:text-[15px] lg:leading-[24px]">
              Navigation apps tell you how to reach your destination. SafeRoute
              tells you what you&apos;ll meet on the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
