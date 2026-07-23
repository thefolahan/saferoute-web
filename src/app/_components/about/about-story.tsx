import Image from 'next/image';

/**
 * "How SafeRoute Started" — dark gray-950 section. A centered heading, a
 * full-width intro paragraph, then a map-phone card (left) beside the closing
 * narrative (right) with a brand-blue accent line.
 */
export function AboutStory() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-[#0A0D12]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-20 md:py-24">
        <h2 className="text-center text-[32px] font-medium leading-[40px] tracking-tightest text-white sm:text-[48px] sm:leading-[60px]">
          How SafeRoute Started
        </h2>

        <p className="mt-10 max-w-[1040px] text-[18px] font-normal leading-[30px] text-white/90 sm:text-[22px] sm:leading-[36px]">
          Today, news of accidents, floods, fires, robberies, protests, and road
          hazards spreads through WhatsApp groups, Twitter/X, and radio. It&apos;s
          fast, but it&apos;s fragmented, hard to verify, difficult to filter by
          where you actually are, and it too often spreads panic and false alarms.
          SafeRoute brings that information into one trusted place. Community
          members report incidents as they happen; nearby users and SafeRoute
          verify them before they&apos;re shown as fact; and travelers see
          what&apos;s ahead on a live map and alert feed.
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

          <div className="flex max-w-[600px] flex-col gap-8">
            <p className="text-[18px] font-normal leading-[30px] text-white/90 sm:text-[20px]">
              You can choose safer routes, get alerts for the places and people
              you care about, share your journey with your Safety Circle, and reach
              emergency help in a single tap. Built for Nigeria and launching
              across Lagos, Abuja, Port Harcourt, Ibadan, Kano, Benin City, Enugu,
              Abeokuta, Ilorin, and Kaduna with privacy, verification, and
              responsible reporting built into the foundation.
            </p>
            <p className="text-[18px] font-bold italic leading-[30px] text-white sm:text-[20px]">
              Navigation apps tell you where to go. We tell you what you&apos;ll
              find when you get there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
