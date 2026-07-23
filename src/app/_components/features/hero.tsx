import Image from 'next/image';
import { SiteNav } from '../site-nav';

/**
 * Features hero — Figma 491:21550. Light bg. Centered 72/79 heading + subtext
 * (max 696), then a full-column dusk-cityscape image (1120x560, radius 16) with
 * floating incident pins baked in. Nav is absolute/80 tall, so pad the top.
 */
export function FeaturesHero() {
  return (
    <section className="relative bg-white">
      <SiteNav active="Features" theme="light" />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-16 pt-[104px] sm:px-10 lg:px-20 lg:pt-[120px]">
        {/* Heading block */}
        <div className="flex max-w-[660px] flex-col items-center gap-4 text-center">
          <h1 className="text-[40px] font-bold leading-[50px] tracking-tightest text-gray-950 sm:text-[56px] sm:leading-[62px] lg:text-[72px] lg:leading-[79px]">
            Everything you need to travel safer.
          </h1>
          <p className="text-base font-normal text-gray-500">
            From real-time incident reports to route safety scores, SafeRoute
            gives you the information you need before and during every journey.
          </p>
        </div>

        {/* Dusk cityscape with live incident pins (2:1) */}
        <div className="relative mt-10 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-200">
          <Image
            src="/images/landing/features-hero-image.webp"
            alt="SafeRoute live incident map over a Lagos cityscape at dusk"
            fill
            priority
            sizes="(min-width: 1024px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
