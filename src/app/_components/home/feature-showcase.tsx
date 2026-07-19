'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * "Navigate with absolute confidence" — 488:19649 / 19934 / 19963 / 19992.
 * A scroll-pinned reveal: the heading, list and phone panel stay fixed while the
 * active feature (and its phone) changes as you scroll through four steps. Text
 * is verbatim from the frames (Live Broadcasts and Safety Circle share the same
 * description in the file).
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
    const onScroll = () => {
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
      setActive(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-[#FDFDFD]"
      style={{ height: `${FEATURES.length * 90}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto flex w-full max-w-[1280px] flex-row items-center gap-10 px-20">
          {/* Left: heading + subtext + feature list */}
          <div className="w-[489px] shrink-0">
            <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-[#0A0D12]">
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
                    <button
                      type="button"
                      onClick={() => {
                        const el = ref.current;
                        if (!el) return;
                        const range = el.offsetHeight - window.innerHeight;
                        window.scrollTo({
                          top: el.offsetTop + (range * (i + 0.5)) / FEATURES.length,
                          behavior: 'smooth'
                        });
                      }}
                      className={`block w-full text-left transition-all duration-300 ${
                        isActive ? 'rounded-2xl bg-gray-100 p-4' : 'px-4 py-[18px]'
                      }`}
                    >
                      <span
                        className={`block text-[20px] font-semibold leading-[26px] ${
                          isActive ? 'text-[#101828]' : 'text-gray-300'
                        }`}
                      >
                        {feature.title}
                      </span>
                      {isActive ? (
                        <span className="mt-1.5 block text-[14px] font-normal leading-5 text-gray-500">
                          {feature.description}
                        </span>
                      ) : null}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: phone panel */}
          <div className="relative h-[560px] flex-1 overflow-hidden rounded-[32px] bg-gray-200">
            {FEATURES.map((feature, i) => (
              <Image
                key={feature.title}
                src={feature.phone}
                alt={`SafeRoute ${feature.title}`}
                width={397}
                height={818}
                priority={i === 0}
                className={`absolute left-1/2 top-20 w-[300px] -translate-x-1/2 transition-opacity duration-300 ${
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
