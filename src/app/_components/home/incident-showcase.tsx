'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Incident showcase — a big hand holding a phone, centered on the PHONE (the
 * hand/wrist runs off the frame). The live broadcast inside the phone changes
 * through three states (accident → flood → harassment) as you scroll, and the
 * alert cards ride a vertical carousel: the active pair sits sharp on the
 * phone's mid-line while the others drift above/below, blurred.
 */
const HAND = '/images/landing/hand-holding-phone.png';

// hand-holding-phone.png geometry (measured): image is 1012x1438, the phone
// screen at x88-547 / y8-952 (fractions below). This box is used to center the
// phone and align the hand.
const RATIO = 1012 / 1438;
const SL = 88 / 1012; // screen left
const ST = 8 / 1438; // screen top
const SW = 459 / 1012; // screen width
const SH = 944 / 1438; // screen height
const SCREEN_ASPECT = (SW * RATIO) / SH; // screenW / screenH
// The live broadcast sits INSIDE the screen at its natural aspect, smaller than
// the screen, leaving a black bezel margin around it before the phone's frame.
const MOCKUP_ASPECT = 804 / 1748;
const LIVE_SCALE = 0.985; // live image height as a fraction of the screen height

const STATES = [
  {
    live: '/images/landing/live-mockup-accident.png',
    alerts: [
      '/images/landing/alert-for-live-mockup-accident-1.png',
      '/images/landing/alert-for-live-mockup-accident-2.png'
    ]
  },
  {
    live: '/images/landing/live-mockup-flood.png',
    alerts: [
      '/images/landing/alert-for-live-mockup-flood-1.png',
      '/images/landing/alert-for-live-mockup-flood-2.png'
    ]
  },
  {
    live: '/images/landing/live-mockup-harrasment.png',
    alerts: [
      '/images/landing/alert-for-live-mockup-harrasment-1.png',
      '/images/landing/alert-for-live-mockup-harrasment-2.png'
    ]
  }
] as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IncidentShowcase() {
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
      setP((scrolled / range) * (STATES.length - 1));
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

  const screenOpacity = (i: number) =>
    ease(1 - clamp((Math.abs(p - i) - 0.28) / 0.44, 0, 1));

  // Circular vertical-carousel style for an alert card of state i: the active
  // state is always centered, its neighbours sit one above and one below (the
  // offset wraps around so it never bunches all cards on one side).
  const N = STATES.length;
  const carousel = (i: number, gap: number, zMax: number): React.CSSProperties => {
    // signed offset in [-N/2, N/2): 0 = centered/active.
    const o = (((i - p + N / 2) % N) + N) % N - N / 2;
    const ao = Math.abs(o);
    return {
      top: '50%',
      transform: `translateY(calc(-50% + ${o * gap}px)) scale(${1 - Math.min(ao, 1) * 0.14})`,
      // Active card stays crisp/opaque; neighbours dim, shrink and blur more so
      // the centered pair reads clearly. Fades to 0 near the wrap edge.
      opacity: clamp(1 - ao * 0.82, 0, 1),
      filter: `blur(${Math.min(ao, 1) * 9}px)`,
      zIndex: Math.round(Math.max(0, N / 2 - ao) * zMax),
      willChange: 'transform, opacity, filter'
    };
  };

  // Renders the phone (centered on its screen) plus the surrounding alert cards.
  const Stage = ({
    screenH,
    cardW,
    gap,
    mobile
  }: {
    screenH: number;
    cardW: number;
    gap: number;
    mobile: boolean;
  }) => {
    const screenW = screenH * SCREEN_ASPECT;
    const imgH = screenH / SH;
    const imgW = imgH * RATIO;
    // The live broadcast, inset within the screen (natural aspect, black margin).
    const liveH = screenH * LIVE_SCALE;
    const liveW = liveH * MOCKUP_ASPECT;
    return (
      // Box == the phone screen; the flex parent centers THIS, so the phone
      // (not the whole hand image) lands in the middle.
      <div className="relative" style={{ width: screenW, height: screenH }}>
        {/* Alert cards */}
        {mobile
          ? STATES.map((st, i) => (
              <div
                key={`m${i}`}
                className="absolute"
                style={{ left: '-8%', width: cardW, ...carousel(i, gap, 12) }}
              >
                <Image
                  src={st.alerts[1]}
                  alt=""
                  width={724}
                  height={374}
                  className="h-auto w-full drop-shadow-[0_18px_40px_rgba(16,24,40,0.14)]"
                />
              </div>
            ))
          : STATES.flatMap((st, i) => [
              <div
                key={`l${i}`}
                className="absolute"
                style={{ right: '100%', marginRight: 22, width: cardW, ...carousel(i, gap, 6) }}
              >
                <Image
                  src={st.alerts[0]}
                  alt=""
                  width={724}
                  height={374}
                  className="h-auto w-full drop-shadow-[0_18px_40px_rgba(16,24,40,0.12)]"
                />
              </div>,
              <div
                key={`r${i}`}
                className="absolute"
                style={{ left: '100%', marginLeft: 22, width: cardW, ...carousel(i, gap, 6) }}
              >
                <Image
                  src={st.alerts[1]}
                  alt=""
                  width={724}
                  height={374}
                  className="h-auto w-full drop-shadow-[0_18px_40px_rgba(16,24,40,0.12)]"
                />
              </div>
            ])}

        {/* Hand image, offset so its screen aligns with this box */}
        <div
          className="absolute"
          style={{ width: imgW, height: imgH, left: -SL * imgW, top: -ST * imgH, zIndex: 10 }}
        >
          <Image src={HAND} alt="Hand holding a SafeRoute live broadcast" fill priority className="object-contain" />
        </div>

        {/* Live broadcasts, inset within the screen with a black bezel margin */}
        {STATES.map((st, i) => (
          <div
            key={st.live}
            className="absolute overflow-hidden"
            style={{
              left: '50%',
              top: '50%',
              width: liveW,
              height: liveH,
              transform: 'translate(-50%, -50%)',
              borderRadius: liveW * 0.12,
              opacity: screenOpacity(i),
              zIndex: 11
            }}
            aria-hidden={Math.round(p) !== i}
          >
            <Image src={st.live} alt="" fill priority={i === 0} sizes="320px" className="object-cover" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{ height: `${STATES.length * 100}vh` }}
    >
      {/* One snap point per state so scrolling settles (pauses) on each active
          state, giving the viewer a beat to read it before moving on. */}
      {STATES.map((_, i) => (
        <div
          key={`snap${i}`}
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${i * 100}vh`, scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
        />
      ))}

      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="hidden lg:block">
          <Stage screenH={700} cardW={336} gap={236} mobile={false} />
        </div>
        <div className="lg:hidden">
          <Stage screenH={560} cardW={244} gap={182} mobile />
        </div>
      </div>
    </section>
  );
}
