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

// hand-holding-phone.png geometry (measured): image is 1012x1438 and the phone
// screen's straight edges sit at x92-541 / y9-951, with a corner radius of ~14.3%
// of the screen width. Expressed as fractions of the image below.
const RATIO = 1012 / 1438;
const SL = 92 / 1012; // screen left
const ST = 9 / 1438; // screen top
const SW = 449 / 1012; // screen width
const SH = 942 / 1438; // screen height
const SCREEN_ASPECT = (SW * RATIO) / SH; // screenW / screenH
const SCREEN_RADIUS = 0.143; // corner radius as a fraction of the screen width

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

  // Vertical-carousel style for an alert card of state i.
  const carousel = (i: number, gap: number, zMax: number): React.CSSProperties => {
    const d = p - i;
    const ad = Math.abs(d);
    return {
      top: '50%',
      transform: `translateY(calc(-50% + ${d * gap}px)) scale(${1 - Math.min(ad, 1) * 0.1})`,
      opacity: clamp(1 - ad * 0.58, 0.1, 1),
      filter: `blur(${Math.min(ad, 1.3) * 7}px)`,
      zIndex: Math.round((1 - Math.min(ad, 1)) * zMax),
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
    const rounded = screenW * SCREEN_RADIUS;
    const imgH = screenH / SH;
    const imgW = imgH * RATIO;
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
                style={{ left: '-24%', width: cardW, ...carousel(i, gap, 30) }}
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
                style={{ right: '100%', marginRight: -46, width: cardW, ...carousel(i, gap, 8) }}
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
                style={{ left: '100%', marginLeft: -46, width: cardW, ...carousel(i, gap, 8) }}
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

        {/* Live broadcasts, filling the screen */}
        {STATES.map((st, i) => (
          <div
            key={st.live}
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: rounded, opacity: screenOpacity(i), zIndex: 11 }}
            aria-hidden={Math.round(p) !== i}
          >
            <Image src={st.live} alt="" fill priority={i === 0} sizes="360px" className="object-cover object-top" />
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
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="hidden lg:block">
          <Stage screenH={700} cardW={336} gap={236} mobile={false} />
        </div>
        <div className="lg:hidden">
          <Stage screenH={600} cardW={250} gap={190} mobile />
        </div>
      </div>
    </section>
  );
}
