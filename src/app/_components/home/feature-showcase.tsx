'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const FEATURES = [
  {
    title: 'Community Feed',
    description:
      'Stay informed with real-time updates and community-reported events directly on your path. From traffic anomalies to verified security alerts, nearby Lagos residents keep your route mapped perfectly.',
    image: '/images/landing/Community-Feed.png'
  },
  {
    title: 'Route Safety Score',
    description:
      'We analyze historical trend data, local community flags, and real-time reports to give each path a dynamic Safety Score before you step out. Get optimal recommendations and bypass hot zones seamlessly.',
    image: '/images/landing/Route-Safety-Score.png'
  },
  {
    title: 'Live Broadcasts',
    description:
      'Create an active digital safety team. Securely share your live route with family or chosen emergency contacts. SafeRoute alerts them instantly if you deviate from your path or trigger an SOS signal.',
    image: '/images/landing/Live-Broadcasts.png'
  },
  {
    title: 'Safety Circle',
    description:
      'Create an active digital safety team. Securely share your live route with family or chosen emergency contacts. SafeRoute alerts them instantly if you deviate from your path or trigger an SOS signal.',
    image: '/images/landing/Safety-Circle.png'
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
      {/* The pinned pane clips whatever doesn't fit. Centring it on phones cut
          the heading off the top, so below lg the stack is top-aligned (and
          svh-tall, to survive the mobile toolbar) and any shortfall comes off
          the bottom of the image instead. */}
      <div className="sticky top-0 flex h-svh items-start overflow-hidden pt-10 lg:items-center lg:pt-0">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-6 sm:px-10 lg:flex-row lg:gap-10 lg:px-20">
          <div className="w-full lg:w-[489px] lg:shrink-0">
            <h2 className="text-[30px] font-medium leading-[38px] tracking-tightest text-[#0A0D12] sm:text-[48px] sm:leading-[60px]">
              Navigate with
              <br />
              absolute confidence
            </h2>
            <p className="mt-4 text-[14px] font-normal leading-5 text-gray-500 sm:mt-6 sm:text-[16px] sm:leading-6">
              SafeRoute provides 360-degree security tools designed specifically
              for urban African commutes.
            </p>

            <div className="mt-6 sm:mt-10">
              {FEATURES.map((feature, i) => {
                const isActive = i === active;
                return (
                  <div key={feature.title}>
                    {i > 0 ? <div className="h-px w-full bg-gray-200" /> : null}
                    <div
                      className={`w-full text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? 'rounded-2xl bg-gray-100 p-3 sm:p-4'
                          : 'px-3 py-3 sm:px-4 sm:py-[18px]'
                      }`}
                    >
                      <span
                        className={`block text-[17px] font-semibold leading-[24px] transition-colors duration-500 sm:text-[20px] sm:leading-[26px] ${
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

          <div className="relative aspect-[1502/1120] max-h-[30svh] w-full overflow-hidden rounded-2xl bg-gray-200 sm:rounded-[32px] lg:max-h-none lg:flex-1">
            {FEATURES.map((feature, i) => (
              <Image
                key={feature.title}
                src={feature.image}
                alt={`SafeRoute ${feature.title}`}
                width={1502}
                height={1120}
                priority={i === 0}
                sizes="(min-width: 1024px) 600px, 100vw"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === active
                    ? 'scale-100 opacity-100'
                    : 'scale-[0.97] opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
