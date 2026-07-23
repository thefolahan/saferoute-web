import Image from 'next/image';

export function AboutStory() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-[#0A0D12]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-20 md:py-24">
        <h2 className="text-center text-[32px] font-medium leading-[40px] tracking-tightest text-white sm:text-[48px] sm:leading-[60px]">
          Why We Built SafeRoute
        </h2>

        <p className="mt-10 max-w-[1040px] text-[18px] font-normal leading-[30px] text-white/90 sm:text-[22px] sm:leading-[36px]">
          SafeRoute began with a simple but powerful realization: people don&apos;t
          just need directions, they need awareness. Every day, thousands of
          commuters set out without knowing what lies ahead. Roadblocks, flooding,
          accidents, security incidents, protests, traffic disruptions,
          unauthorized checkpoints, and other hazards can change a journey
          entirely.
        </p>

        <div className="mt-14 flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="relative h-[440px] w-full max-w-[460px] shrink-0 overflow-hidden rounded-[32px] bg-gray-900 sm:h-[520px]">
            <Image
              src="/images/landing/491-26551.png"
              alt="SafeRoute live incident map"
              width={397}
              height={818}
              className="absolute left-1/2 top-14 h-[720px] w-[264px] -translate-x-1/2 sm:top-16 sm:h-[818px] sm:w-[300px]"
            />
          </div>

          <div className="flex max-w-[600px] flex-col gap-4">
            <p className="text-[18px] font-normal leading-[30px] text-white/90 lg:text-[15px] lg:leading-[24px]">
              Traditional navigation apps are excellent at finding the fastest
              route, but they rarely tell you what is actually happening on it. We
              believed road users deserved better.
            </p>
            <p className="text-[18px] font-normal leading-[30px] text-white/90 lg:text-[15px] lg:leading-[24px]">
              So we built SafeRoute, a community-powered road intelligence platform
              that combines real-time reports, AI verification, location-based
              insights, and trusted community contributions to help people make
              safer, smarter decisions before and during every trip.
            </p>
            <p className="text-[18px] font-normal leading-[30px] text-white/90 lg:text-[15px] lg:leading-[24px]">
              Whether you are driving to work, running a business, delivering
              goods, or travelling across the country, SafeRoute gives you the
              information you need to stay informed, avoid unnecessary risks, and
              travel with confidence.
            </p>
            <p className="mt-2 text-[18px] font-bold italic leading-[30px] text-white lg:text-[15px] lg:leading-[24px]">
              Navigation apps tell you how to reach your destination. SafeRoute
              tells you what you will meet on the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
