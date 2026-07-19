import Image from 'next/image';
import { SiteNav } from '../site-nav';

/**
 * Features hero — Figma 491:21550. Light bg. Centered 72/79 heading + subtext
 * (max 696), then a full-column Lagos cityscape (1120x560, radius 16) with a
 * small carousel-dot indicator. Nav is absolute/80 tall, so pad the top.
 */
export function FeaturesHero() {
  return (
    <section className="relative bg-white">
      <SiteNav active="Features" theme="light" />
      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-20 pb-10 pt-[120px]">
        {/* Heading block */}
        <div className="flex max-w-[660px] flex-col items-center gap-4 text-center">
          <h1 className="text-[72px] font-medium leading-[79px] tracking-tightest text-gray-950">
            Everything you need to travel safer.
          </h1>
          <p className="text-base font-normal text-gray-500">
            From real-time incident reports to route safety scores, SafeRoute
            gives you the information you need before and during every journey.
          </p>
        </div>

        {/* Cityscape */}
        <div className="relative mt-10 h-[560px] w-full overflow-hidden rounded-2xl bg-gray-200">
          <Image
            src="/images/landing/491-24604.png"
            alt="Aerial view of the Lagos cityscape"
            fill
            priority
            sizes="1120px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
