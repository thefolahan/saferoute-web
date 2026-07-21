'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * "Navigate with absolute confidence" — 488:19649 / 19934 / 19963 / 19992.
 * Scroll-pinned reveal: the heading, feature list and phone panel stay fixed
 * while the active feature (and its phone) changes as you scroll through the
 * four steps. Text is verbatim from the frames.
 */
const FEATURES = [
  {
    title: 'Community Feed',
    description:
      'Stay informed with real-time updates and community-reported events directly on your path. From traffic anomalies to verified security alerts, nearby Lagos residents keep your route mapped perfectly.',
    phone: '/images/landing/489-20554.png'
  },
  {
    title: 'Route Safety Score',
    description:
      'We analyze historical trend data, local community flags, and real-time reports to give each path a dynamic Safety Score before you step out. Get optimal recommendations and bypass hot zones seamlessly.',
    phone: '/images/landing/491-20812.png'
  },
  {
    title: 'Live Broadcasts',
    description:
      'Create an active digital safety team. Securely share your live route with family or chosen emergency contacts. SafeRoute alerts them instantly if you deviate from your path or trigger an SOS signal.',
    phone: '/images/landing/491-21058.png'
  },
  {
    title: 'Safety Circle',
    description:
      'Create an active digital safety team. Securely share your live route with family or chosen emergency contacts. SafeRoute alerts them instantly if you deviate from your path or trigger an SOS signal.',
    phone: '/images/landing/491-21304.png'
  }
] as const;

export function FeatureShowcase() {
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

  return (
    <section
      ref={ref}
      className="relative bg-[#FDFDFD]"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 px-6 sm:px-10 lg:flex-row lg:gap-10 lg:px-20">
          {/* Left: heading + subtext + feature list */}
          <div className="w-full lg:w-[489px] lg:shrink-0">
            <h2 className="text-[36px] font-medium leading-[44px] tracking-tightest text-[#0A0D12] sm:text-[48px] sm:leading-[60px]">
              Navigate with
              <br />
              absolute confidence
            </h2>
            <p className="mt-6 text-[16px] font-normal leading-6 text-gray-500">
              SafeRoute provides 360-degree security tools designed specifically
              for urban African commutes.
            </p>

            <div className="mt-10">
              {FEATURES.map((feature, i) => {
                const isActive = i === active;
                return (
                  <div key={feature.title}>
                    {i > 0 ? <div className="h-px w-full bg-gray-200" /> : null}
                    <div
                      className={`w-full text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? 'rounded-2xl bg-gray-100 p-4' : 'px-4 py-[18px]'
                      }`}
                    >
                      <span
                        className={`block text-[20px] font-semibold leading-[26px] transition-colors duration-500 ${
                          isActive ? 'text-[#101828]' : 'text-gray-300'
                        }`}
                      >
                        {feature.title}
                      </span>
                      <div
                        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive ? 'mt-1.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <span className="overflow-hidden text-[14px] font-normal leading-5 text-gray-500">
                          {feature.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: phone panel */}
          <div className="relative h-[420px] w-full overflow-hidden rounded-[32px] bg-gray-200 sm:h-[560px] lg:flex-1">
            {FEATURES.map((feature, i) => (
              <Image
                key={feature.title}
                src={feature.phone}
                alt={`SafeRoute ${feature.title}`}
                width={397}
                height={818}
                priority={i === 0}
                className={`absolute left-1/2 top-16 w-[260px] -translate-x-1/2 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-20 sm:w-[300px] ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
