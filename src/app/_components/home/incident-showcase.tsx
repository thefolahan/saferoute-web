'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const HAND = '/images/landing/hand-holding-phone.png';

const RATIO = 1012 / 1438;
const SL = 88 / 1012;
const ST = 8 / 1438;
const SW = 459 / 1012;
const SH = 944 / 1438;
const SCREEN_ASPECT = (SW * RATIO) / SH;
const MOCKUP_ASPECT = 804 / 1748;
const LIVE_SCALE = 0.985;

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

export function IncidentShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [vh, setVh] = useState(0);
  const [vw, setVw] = useState(0);

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
    const onResize = () => {
      setVh(window.innerHeight);
      onScroll();
    };
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Progressive cross-fade: state 0 stays fully opaque underneath, later states
  // fade in on top. There's always a solid image, so the black phone screen
  // never shows through during a transition.
  const screenOpacity = (i: number) => clamp(p - i + 1, 0, 1);

  const N = STATES.length;
  const carousel = (i: number, gap: number, zMax: number): React.CSSProperties => {
    const o = (((i - p + N / 2) % N) + N) % N - N / 2;
    const ao = Math.abs(o);
    return {
      top: '50%',
      transform: `translateY(calc(-50% + ${o * gap}px)) scale(${1 - Math.min(ao, 1) * 0.14})`,
      opacity: clamp(1 - ao * 0.82, 0, 1),
      filter: `blur(${Math.min(ao, 1) * 9}px)`,
      zIndex: Math.round(Math.max(0, N / 2 - ao) * zMax),
      willChange: 'transform, opacity, filter'
    };
  };

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
    const liveH = screenH * LIVE_SCALE;
    const liveW = liveH * MOCKUP_ASPECT;
    return (
      <div className="relative" style={{ width: screenW, height: screenH }}>
        {mobile
          ? // A single-column vertical carousel (like the desktop columns): the
            // active alert sits centered on the phone, the others blurred above
            // and below.
            STATES.map((st, i) => (
              <div
                key={`m${i}`}
                className="absolute left-[-6%]"
                style={{ width: cardW, ...carousel(i, gap, 20) }}
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

        <div
          className="absolute"
          style={{ width: imgW, height: imgH, left: -SL * imgW, top: -ST * imgH, zIndex: 10 }}
        >
          <Image src={HAND} alt="Hand holding a SafeRoute live broadcast" fill priority className="object-contain" />
        </div>

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

  // Size the phone to the viewport height so it never gets too big on short
  // laptops (leaving room for margins), with sensible fallbacks before mount.
  const dH = vh ? clamp(400, vh - 190, 560) : 520;
  const mH = vh ? clamp(320, vh - 320, 420) : 400;

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{ height: `${STATES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="hidden lg:block">
          <Stage
            screenH={dH}
            cardW={Math.round(dH * 0.48)}
            gap={Math.round(dH * 0.34)}
            mobile={false}
          />
        </div>
        <div className="lg:hidden">
          <Stage
            screenH={mH}
            cardW={Math.round(mH * 0.44)}
            gap={Math.round(mH * 0.33)}
            mobile
          />
        </div>
      </div>
    </section>
  );
}
