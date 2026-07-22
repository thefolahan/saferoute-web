'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Features — one single pinned section. The panel stays put while you scroll and
 * the six features advance through it; each feature's phone + copy *morph* in and
 * out — scaling up out of a soft blur as it becomes active, then blurring/shrinking
 * away as the next takes its place. Everything is scrubbed to scroll progress, so
 * the motion tracks the scrollbar exactly. Content is verbatim from the 491:* frames.
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

// easeInOutCubic
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

  // Morph envelope: crisp while held (|d| < 0.3), then fade + scale-down into a
  // blur as the feature leaves (and the reverse as the next one arrives).
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
    <section
      ref={ref}
      className="relative bg-gray-950"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Desktop: phone one side, copy the other; the whole feature morphs. */}
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
                  src={f.phone}
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

        {/* Mobile: copy above phone, the whole feature morphs. */}
        <div className="relative mx-auto h-[620px] w-full max-w-[560px] px-6 sm:px-10 lg:hidden">
          {FEATURES.map((f, i) => (
            <div
              key={`m-${f.heading}`}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8"
              style={morph(i)}
              aria-hidden={Math.round(p) !== i}
            >
              <div className="w-full">
                <Copy f={f} />
              </div>
              <div className="relative h-[360px] w-full overflow-hidden rounded-[32px] bg-gray-900">
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
      </div>
    </section>
  );
}
