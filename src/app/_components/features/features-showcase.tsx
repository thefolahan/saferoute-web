'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Features — the dark section under the hero. A single pinned section: the
 * panel stays fixed while you scroll and the feature layers cross-dissolve.
 * The transition is *scrubbed* to scroll progress (not fired on a discrete
 * index change), so adjacent features blend continuously with a gentle depth
 * drift + scale + blur — smooth instead of snapping. Content is verbatim from
 * the 491:* frames.
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

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// easeInOutCubic — softens the linear crossfade so layers ease in/out.
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Copy({ f }: { f: (typeof FEATURES)[number] }) {
  return (
    <>
      {f.eyebrow ? (
        <p className="mb-4 text-base font-normal text-[#0BA5EC]">{f.eyebrow}</p>
      ) : null}
      <h2 className="text-[32px] font-medium leading-[42px] tracking-tightest text-gray-25 sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]">
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
  // Continuous scroll progress across the features, 0 … FEATURES.length - 1.
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const scrolled = clamp(-rect.top, 0, range);
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

  // For a layer i, return the shared envelope plus the signed "leave" amount `s`
  // (0 while the feature is held on-screen, ramping to ±1 as it slides away).
  // Phone and copy use `s` with opposite signs so they enter/exit from opposite
  // edges as you scroll.
  const layer = (i: number) => {
    const d = p - i;
    const ad = Math.abs(d);
    // Hold crisp within a plateau (|d| < 0.3), then transition at the boundary.
    const t = clamp((ad - 0.3) / 0.4, 0, 1);
    const s = ease(t) * Math.sign(d || 1); // signed slide progress, -1 … 1
    return {
      opacity: ease(1 - t),
      s,
      pointerEvents: (ad < 0.5 ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
      zIndex: Math.round(100 - ad * 100)
    };
  };

  return (
    <section
      ref={ref}
      className="relative bg-gray-950"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Desktop: phone + copy slide in from opposite sides as you scroll. */}
        <div className="relative mx-auto hidden h-full w-full max-w-[1280px] lg:block">
          {FEATURES.map((f, i) => {
            const { opacity, s, pointerEvents, zIndex } = layer(i);
            const dir = f.phoneLeft ? -1 : 1; // phone rests on left (-) or right (+)
            return (
              <div
                key={f.heading}
                className="absolute inset-0 flex items-center py-16"
                style={{ opacity, pointerEvents, zIndex, willChange: 'opacity' }}
                aria-hidden={Math.round(p) !== i}
              >
                {/* Phone — enters from its own side */}
                <div
                  className="absolute top-1/2 h-[560px] w-[46%] -translate-y-1/2"
                  style={{ left: f.phoneLeft ? '6%' : '48%' }}
                >
                  <div
                    className="h-full w-full overflow-hidden rounded-[32px] bg-gray-900"
                    style={{ transform: `translate3d(${dir * s * 220}px, 0, 0)`, willChange: 'transform' }}
                  >
                    <Image
                      src={f.phone}
                      alt=""
                      width={397}
                      height={818}
                      priority={i === 0}
                      className="absolute left-1/2 top-20 h-[818px] w-[300px] -translate-x-1/2"
                    />
                  </div>
                </div>
                {/* Copy — enters from the opposite side */}
                <div
                  className="absolute top-1/2 w-[38%] -translate-y-1/2"
                  style={{ left: f.phoneLeft ? '58%' : '6%' }}
                >
                  <div style={{ transform: `translate3d(${-dir * s * 160}px, 0, 0)`, willChange: 'transform' }}>
                    <Copy f={f} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: copy slides in from the left, phone from the right. */}
        <div className="relative flex h-full w-full flex-col lg:hidden">
          {FEATURES.map((f, i) => {
            const { opacity, s, pointerEvents, zIndex } = layer(i);
            return (
              <div
                key={`m-${f.heading}`}
                className="absolute inset-0 mx-auto flex w-full max-w-[560px] flex-col items-center justify-center gap-8 px-6 sm:px-10"
                style={{ opacity, pointerEvents, zIndex, willChange: 'opacity' }}
                aria-hidden={Math.round(p) !== i}
              >
                <div
                  className="w-full"
                  style={{ transform: `translate3d(${-s * 80}px, 0, 0)`, willChange: 'transform' }}
                >
                  <Copy f={f} />
                </div>
                <div
                  className="relative h-[380px] w-full overflow-hidden rounded-[32px] bg-gray-900"
                  style={{ transform: `translate3d(${s * 80}px, 0, 0)`, willChange: 'transform' }}
                >
                  <Image
                    src={f.phone}
                    alt=""
                    width={397}
                    height={818}
                    className="absolute left-1/2 top-12 h-[818px] w-[240px] -translate-x-1/2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
