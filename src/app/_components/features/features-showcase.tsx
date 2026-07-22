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

  // Per-layer transform envelope, shared by desktop + mobile. `d` is the signed
  // distance from the active point; a layer is on-screen only within |d| < 1.
  const layerStyle = (i: number, drift: number): React.CSSProperties => {
    const d = p - i;
    const ad = Math.abs(d);
    // Hold each feature crisp within a plateau (|d| < 0.32), then cross-dissolve
    // quickly at the segment boundary — `t` is 0 while held, 1 once gone.
    const t = clamp((ad - 0.32) / 0.34, 0, 1);
    return {
      opacity: ease(1 - t),
      // Gentle continuous parallax + a shrink/blur that only kicks in on the swap.
      transform: `translate3d(0, ${-d * drift * 0.4}px, 0) scale(${1 - t * 0.05})`,
      filter: t > 0.02 ? `blur(${t * 6}px)` : 'none',
      pointerEvents: ad < 0.5 ? 'auto' : 'none',
      zIndex: Math.round(100 - ad * 100),
      willChange: 'opacity, transform'
    };
  };

  return (
    <section
      ref={ref}
      className="relative bg-gray-950"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Desktop: cross-dissolving full-width layers, phone alternating sides */}
        <div className="relative mx-auto hidden h-full w-full max-w-[1280px] lg:block">
          {FEATURES.map((f, i) => (
            <div
              key={f.heading}
              className="absolute inset-0 flex items-center py-16"
              style={layerStyle(i, 64)}
              aria-hidden={Math.round(p) !== i}
            >
              {/* Phone */}
              <div
                className="absolute top-1/2 h-[560px] w-[46%] -translate-y-1/2 overflow-hidden rounded-[32px] bg-gray-900"
                style={{ left: f.phoneLeft ? '6%' : '48%' }}
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
              {/* Copy */}
              <div
                className="absolute top-1/2 w-[38%] -translate-y-1/2"
                style={{ left: f.phoneLeft ? '58%' : '6%' }}
              >
                <Copy f={f} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked, cross-dissolving layers */}
        <div className="relative flex h-full w-full flex-col lg:hidden">
          {FEATURES.map((f, i) => (
            <div
              key={`m-${f.heading}`}
              className="absolute inset-0 mx-auto flex w-full max-w-[560px] flex-col items-center justify-center gap-8 px-6 sm:px-10"
              style={layerStyle(i, 40)}
              aria-hidden={Math.round(p) !== i}
            >
              <div className="w-full">
                <Copy f={f} />
              </div>
              <div className="relative h-[380px] w-full overflow-hidden rounded-[32px] bg-gray-900">
                <Image
                  src={f.phone}
                  alt=""
                  width={397}
                  height={818}
                  className="absolute left-1/2 top-12 h-[818px] w-[240px] -translate-x-1/2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress rail — subtle affordance that this section scrubs on scroll */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {FEATURES.map((f, i) => {
            const on = clamp(1 - Math.abs(p - i), 0, 1);
            return (
              <span
                key={`dot-${f.heading}`}
                className="h-1.5 rounded-full bg-white transition-[width,opacity] duration-300"
                style={{ width: 6 + on * 18, opacity: 0.25 + on * 0.6 }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
