import Image from 'next/image';

/**
 * "How SafeRoute Started" — dark gray-950 section. A clipped map-phone in a
 * gray-900 rounded card on the left, the origin story on the right (the closing
 * line accented in brand blue #2563EB).
 */
export function AboutStory() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-[#0A0D12]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-20 md:py-[72px]">
        <h2 className="text-center text-[32px] font-medium leading-tight tracking-[-0.02em] text-white sm:text-[40px]">
          How SafeRoute Started
        </h2>

        <div className="mt-14 flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          <div className="w-full max-w-[536px] shrink-0">
            <Image
              src="/images/landing/about-started-card.png"
              alt="SafeRoute incident map"
              width={1072}
              height={1123}
              className="h-auto w-full"
            />
          </div>

          <div className="flex max-w-[600px] flex-col gap-8 pt-2">
            <p className="text-[22px] font-normal leading-8 text-white sm:text-[24px]">
              SafeRoute began with a simple question
            </p>
            <p className="text-[18px] font-normal leading-[30px] text-white/90 sm:text-[20px]">
              What if travelers could know what was happening on the road before
              starting their journey ? We recognized that navigation tools tell
              people where to go, but often fail to tell them what&apos;s actually
              happening along the way.
            </p>
            <p className="text-[18px] font-normal leading-[30px] text-white/90 sm:text-[20px]">
              By combining real-time reports, community contributions, and
              location-based insights, we built a platform that helps travelers
              make informed decisions every day.
            </p>
            <p className="text-[18px] font-bold leading-[30px] text-[#2563EB] sm:text-[20px]">
              Navigation apps tell you where to go.&nbsp; We tell you what you&apos;ll
              find when you get there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
