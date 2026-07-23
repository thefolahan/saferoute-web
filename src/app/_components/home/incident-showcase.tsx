'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Incident showcase — a single hand holding a phone stays put while you scroll;
 * the live broadcast INSIDE the phone changes through three states (accident →
 * flood → harassment), and the matching alert cards float in around it. Pinned
 * and scrubbed to scroll progress, so everything cross-fades with the scrollbar.
 */
const HAND = '/images/landing/hand-holding-phone.png';

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

// Desktop card slots — each state owns two, positioned so the active pair reads
// as the focal cards while the rest sit dimmed around them.
const SLOTS: { s: number; a: number; style: React.CSSProperties }[] = [
  { s: 0, a: 0, style: { left: '10%', top: '36%' } },
  { s: 0, a: 1, style: { right: '10%', top: '36%' } },
  { s: 1, a: 0, style: { left: '0%', top: '2%' } },
  { s: 1, a: 1, style: { right: '0%', top: '66%' } },
  { s: 2, a: 0, style: { left: '0%', top: '66%' } },
  { s: 2, a: 1, style: { right: '0%', top: '2%' } }
];

const SCREEN: React.CSSProperties = {
  left: '8.6%',
  top: '1.4%',
  width: '45.2%',
  height: '63.6%'
};

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

  // Screen cross-fade: crisp hold on each state, quick dissolve between.
  const screenOpacity = (i: number) =>
    ease(1 - clamp((Math.abs(p - i) - 0.28) / 0.44, 0, 1));
  // How "active" a state is right now (1 at its hold, fading to 0 either side).
  const prominence = (s: number) => ease(clamp(1 - Math.abs(p - s), 0, 1));

  const PhoneStack = ({ rounded }: { rounded: number }) => (
    <>
      <Image src={HAND} alt="Hand holding a SafeRoute live broadcast" fill priority className="object-contain" />
      {STATES.map((st, i) => (
        <div
          key={st.live}
          className="absolute overflow-hidden"
          style={{ ...SCREEN, borderRadius: rounded, opacity: screenOpacity(i) }}
          aria-hidden={Math.round(p) !== i}
        >
          <Image src={st.live} alt="" fill priority={i === 0} className="object-cover object-top" sizes="240px" />
        </div>
      ))}
    </>
  );

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{ height: `${STATES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Desktop: hand + phone centered, six alert cards floating behind it */}
        <div className="relative mx-auto hidden h-[640px] w-full max-w-[1200px] lg:block">
          {SLOTS.map((slot, idx) => {
            const pr = prominence(slot.s);
            return (
              <div
                key={idx}
                className="absolute w-[330px]"
                style={{
                  ...slot.style,
                  opacity: 0.22 + 0.78 * pr,
                  transform: `scale(${0.9 + 0.1 * pr})`,
                  zIndex: pr > 0.5 ? 5 : 1,
                  filter: pr > 0.5 ? 'none' : 'saturate(0.4)'
                }}
              >
                <Image
                  src={STATES[slot.s]!.alerts[slot.a]!}
                  alt=""
                  width={724}
                  height={374}
                  className="h-auto w-full drop-shadow-[0_18px_40px_rgba(16,24,40,0.12)]"
                />
              </div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 z-10 h-[640px] w-[451px] -translate-x-1/2 -translate-y-1/2">
            <PhoneStack rounded={28} />
          </div>
        </div>

        {/* Mobile: hand + phone with a stacked alert card overlapping the left */}
        <div className="relative mx-auto flex h-[600px] w-full max-w-[440px] items-center justify-center lg:hidden">
          {[
            { top: '10%', dim: true },
            { top: '30%', dim: false },
            { top: '58%', dim: true }
          ].map((row, r) => (
            <div
              key={r}
              className="absolute left-[-4%] w-[260px]"
              style={{ top: row.top, zIndex: row.dim ? 1 : 20 }}
            >
              {STATES.map((st, i) => (
                <Image
                  key={st.live}
                  src={st.alerts[1]!}
                  alt=""
                  width={724}
                  height={374}
                  className="absolute inset-0 h-auto w-full drop-shadow-[0_18px_40px_rgba(16,24,40,0.14)]"
                  style={{ opacity: (row.dim ? 0.3 : 1) * screenOpacity(i) }}
                />
              ))}
            </div>
          ))}

          <div className="relative z-10 h-[560px] w-[394px]">
            <PhoneStack rounded={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
