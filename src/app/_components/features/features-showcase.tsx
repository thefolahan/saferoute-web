'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const PHONE = '/images/landing/491-26551.png';

const FEATURES = [
  {
    heading: 'Stay informed in real time.',
    description:
      'See reports from nearby residents, verified organizations, and trusted news outlets the moment incidents unfold, each one growing more reliable as people nearby confirm it with photos, videos, and live updates.',
    phoneLeft: false
  },
  {
    heading: "See what's happening before you arrive.",
    description:
      'Watch live broadcasts from people at the scene to understand traffic, flooding, accidents, and other incidents, so you know an area before you ever set foot in it.',
    phoneLeft: true
  },
  {
    heading: 'Choose the safest route.',
    description:
      'Every route is analyzed using community reports, live activity, and neighborhood intelligence to help you make informed travel decisions.',
    phoneLeft: false
  },
  {
    heading: 'Share every journey with people you trust.',
    description:
      'Keep family and friends informed with live journey sharing and emergency notifications whenever you need them.',
    phoneLeft: true
  }
] as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Copy({ f }: { f: (typeof FEATURES)[number] }) {
  return (
    <>
      <h3 className="text-[28px] font-medium leading-[36px] tracking-tightest text-gray-25 sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]">
        {f.heading}
      </h3>
      <p className="mt-3 max-w-[460px] text-[15px] font-normal leading-[22px] text-gray-200 sm:mt-4 sm:text-base sm:leading-normal">
        {f.description}
      </p>
    </>
  );
}

export function FeaturesShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const scrolled = clamp(-el.getBoundingClientRect().top, 0, range);
      setP((scrolled / range) * (FEATURES.length - 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const morph = (i: number): React.CSSProperties => {
    const d = p - i;
    const ad = Math.abs(d);
    const t = clamp((ad - 0.3) / 0.42, 0, 1);
    return {
      opacity: ease(1 - t),
      transform: `scale(${1 - t * 0.09})`,
      filter: t > 0.01 ? `blur(${t * 22}px)` : 'none',
      pointerEvents: ad < 0.5 ? 'auto' : 'none',
      zIndex: Math.round(100 - ad * 100),
      willChange: 'opacity, transform, filter'
    };
  };

  return (
    <section className="bg-gray-950">
      <div className="mx-auto max-w-[1280px] px-6 pt-20 text-center sm:px-10 lg:px-20 lg:pt-28">
        <h2 className="mx-auto max-w-[640px] text-[32px] font-medium leading-[40px] tracking-tightest text-white sm:text-[48px] sm:leading-[60px]">
          Everything Working Together for Your Journey
        </h2>
      </div>

      <div ref={ref} className="relative" style={{ height: `${FEATURES.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto hidden h-[620px] w-full max-w-[1280px] px-6 sm:px-10 lg:block lg:px-20">
            {FEATURES.map((f, i) => (
              <div
                key={f.heading}
                className="absolute inset-0 flex items-center"
                style={morph(i)}
                aria-hidden={Math.round(p) !== i}
              >
                <div
                  className="absolute top-1/2 h-[560px] w-[44%] -translate-y-1/2 overflow-hidden rounded-[32px] bg-gray-900"
                  style={{ left: f.phoneLeft ? '4%' : '52%' }}
                >
                  <Image
                    src={PHONE}
                    alt=""
                    width={397}
                    height={818}
                    priority={i === 0}
                    className="absolute left-1/2 top-20 h-[818px] w-[300px] -translate-x-1/2"
                  />
                </div>
                <div
                  className="absolute top-1/2 w-[38%] -translate-y-1/2"
                  style={{ left: f.phoneLeft ? '56%' : '4%' }}
                >
                  <Copy f={f} />
                </div>
              </div>
            ))}
          </div>

          <div className="relative mx-auto h-full w-full max-w-[560px] px-6 sm:px-10 lg:hidden">
            {FEATURES.map((f, i) => (
              <div
                key={`m-${f.heading}`}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                style={morph(i)}
                aria-hidden={Math.round(p) !== i}
              >
                <div className="w-full">
                  <Copy f={f} />
                </div>
                <div className="relative h-[300px] w-full overflow-hidden rounded-[28px] bg-gray-900">
                  <Image
                    src={PHONE}
                    alt=""
                    width={397}
                    height={818}
                    className="absolute left-1/2 top-10 h-[720px] w-[212px] -translate-x-1/2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
