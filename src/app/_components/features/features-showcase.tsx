'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Features — the dark section under the hero. A single pinned section: the
 * panel stays fixed while you scroll and the active feature's copy + phone
 * cross-fade, the phone sliding smoothly between sides. Content is verbatim
 * from the 491:* frames.
 */
const FEATURES = [
  {
    eyebrow: undefined,
    heading: 'Stay informed in real time.',
    description:
      'View reports from nearby residents, verified organizations, and trusted news outlets as incidents unfold.',
    phone: '/images/landing/491-22714.png',
    phoneLeft: false
  },
  {
    eyebrow: undefined,
    heading: "See what's happening before you arrive.",
    description:
      'Watch live broadcasts from people at the scene to better understand traffic, flooding, accidents, and other incidents.',
    phone: '/images/landing/491-25783.png',
    phoneLeft: true
  },
  {
    eyebrow: undefined,
    heading: 'Choose the safest route.',
    description:
      'Every route is analyzed using community reports, live activity, and neighborhood intelligence to help you make informed travel decisions.',
    phone: '/images/landing/491-26551.png',
    phoneLeft: false
  },
  {
    eyebrow: 'Explore Neighborhoods',
    heading: 'Know an area before you visit.',
    description:
      'Watch live broadcasts from people at the scene to better understand traffic, flooding, accidents, and other incidents.',
    phone: '/images/landing/491-26798.png',
    phoneLeft: true
  },
  {
    eyebrow: undefined,
    heading: 'Share every journey with people you trust.',
    description:
      'Keep family and friends informed with live journey sharing and emergency notifications whenever you need them.',
    phone: '/images/landing/491-27059.png',
    phoneLeft: false
  },
  {
    eyebrow: undefined,
    heading: 'Built on trusted community intelligence.',
    description:
      'Reports become more reliable as nearby users verify incidents with photos, videos, and live updates.',
    phone: '/images/landing/491-26031.png',
    phoneLeft: true
  }
] as const;

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function Copy({ f }: { f: (typeof FEATURES)[number] }) {
  return (
    <>
      {f.eyebrow ? (
        <p className="mb-4 text-base font-normal text-[#0BA5EC]">{f.eyebrow}</p>
      ) : null}
      <h2 className="text-[36px] font-medium leading-[44px] tracking-tightest text-gray-25 sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]">
        {f.heading}
      </h2>
      <p className="mt-4 max-w-[440px] text-base font-normal text-gray-200">
        {f.description}
      </p>
    </>
  );
}

export function FeaturesShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), range);
      const idx = Math.min(
        FEATURES.length - 1,
        Math.floor((scrolled / range) * FEATURES.length)
      );
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const phoneLeft = FEATURES[active]?.phoneLeft ?? false;

  return (
    <section
      ref={ref}
      className="relative bg-gray-950"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden py-16">
        {/* Desktop: smoothly sliding phone + cross-fading copy */}
        <div className="relative mx-auto hidden h-[620px] w-full max-w-[1280px] lg:block">
          <div
            className="absolute top-1/2 h-[560px] w-[46%] -translate-y-1/2 overflow-hidden rounded-[32px] bg-gray-900"
            style={{
              left: phoneLeft ? '6%' : '48%',
              transition: `left 0.7s ${EASE}`
            }}
          >
            {FEATURES.map((f, i) => (
              <Image
                key={f.phone}
                src={f.phone}
                alt=""
                width={397}
                height={818}
                priority={i === 0}
                className="absolute left-1/2 top-20 h-[818px] w-[300px] -translate-x-1/2"
                style={{
                  opacity: i === active ? 1 : 0,
                  transition: `opacity 0.6s ${EASE}`
                }}
              />
            ))}
          </div>

          <div
            className="absolute top-1/2 w-[38%] -translate-y-1/2"
            style={{
              left: phoneLeft ? '58%' : '6%',
              transition: `left 0.7s ${EASE}`
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.heading}
                className={i === active ? 'relative' : 'pointer-events-none absolute inset-0'}
                style={{
                  opacity: i === active ? 1 : 0,
                  transition: `opacity 0.6s ${EASE}`
                }}
              >
                <Copy f={f} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked, cross-fading */}
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-8 px-6 sm:px-10 lg:hidden">
          <div className="relative min-h-[200px] w-full">
            {FEATURES.map((f, i) => (
              <div
                key={`m-${f.heading}`}
                className={i === active ? 'relative' : 'pointer-events-none absolute inset-0'}
                style={{ opacity: i === active ? 1 : 0, transition: `opacity 0.6s ${EASE}` }}
              >
                <Copy f={f} />
              </div>
            ))}
          </div>
          <div className="relative h-[380px] w-full overflow-hidden rounded-[32px] bg-gray-900">
            {FEATURES.map((f, i) => (
              <Image
                key={`mp-${f.phone}`}
                src={f.phone}
                alt=""
                width={397}
                height={818}
                className="absolute left-1/2 top-12 h-[818px] w-[240px] -translate-x-1/2"
                style={{ opacity: i === active ? 1 : 0, transition: `opacity 0.6s ${EASE}` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
