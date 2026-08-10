import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '../reveal';
import { SiteNav } from '../site-nav';
import { HeroPhone } from './hero-phone';
import { ScrollToButton } from './scroll-to-button';

const CTA =
  'inline-flex w-[160px] items-center justify-center rounded-full border px-[18px] py-3 text-[16px] font-semibold leading-6 shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]';

export function Hero() {
  return (
    /* Stops short of a full viewport. Clipped on x only — the mobile phone box
       overruns its column and must not add a horizontal scrollbar — but y
       stays visible, since the phone hangs past the bottom edge onto the
       section below. */
    <section className="relative flex min-h-[88svh] flex-col overflow-x-clip bg-black">
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
          <Reveal
            as="h1"
            className="text-[44px] font-bold leading-[48px] tracking-tightest text-white sm:text-[64px] sm:leading-[64px] lg:text-[96px] lg:leading-[88px]"
          >
            Know Before
            <br />
            You Go
          </Reveal>

          <Reveal
            as="p"
            delay={140}
            className="mt-8 max-w-[680px] text-[16px] font-normal leading-[26px] text-gray-300 sm:text-[18px] sm:leading-[30px] lg:mt-10 lg:text-[20px]"
          >
            SafeRoute helps you make safer journey decisions with real-time
            community reports, verified updates, live broadcasts, and route
            safety intelligence.
          </Reveal>

          <Reveal delay={280} className="mt-10 flex items-center gap-3">
            <Link
              href="/coming-soon"
              className={`${CTA} border-transparent bg-gray-25 text-gray-950`}
            >
              Download App
            </Link>
            <ScrollToButton
              target="how-it-works"
              className={`${CTA} border-gray-700 text-gray-100`}
            >
              Learn More
            </ScrollToButton>
          </Reveal>
        </div>

        {/* On mobile the phone is width-driven and straddles the seam: at 9:16
            a min(99vw,396px) box is min(176vw,704px) tall, so hanging half of
            that — min(88vw,352px) — leaves half in the hero and half over the
            features section, which pads its top by the same amount. The clip
            trims 13.6% off the box, so the device itself lands ~85vw wide.
            Centering is self-center, not mx-auto: the box is wider than this
            padded column, and auto margins collapse to 0 against negative free
            space, which would shove the phone left of centre. From sm up the
            box fits again and it goes back to mx-auto and height-driven. */}
        <div className="-mb-[min(88vw,352px)] flex w-[min(99vw,396px)] shrink-0 items-end justify-center self-center sm:mx-auto sm:-mb-[10svh] sm:h-[min(70svh,780px)] sm:w-auto lg:mx-0 lg:-mb-[8svh] lg:mt-auto lg:h-[min(82svh,860px)] lg:flex-1">
          <Reveal delay={200} y={0} duration={1100} className="w-full sm:h-full sm:w-auto">
            <HeroPhone />
          </Reveal>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[14%] bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
