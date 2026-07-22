'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Incident showcase — a pinned section that scrubs through the three states the
 * designer drew (Road Accident → Flood → Police harassment). The hand/phone and
 * the surrounding alert cards sit in the same place in every frame, so the live
 * broadcast and the reports simply cross-dissolve as you scroll. Each state is a
 * flattened export (desktop + mobile) exported at the same crop, so they align.
 */
const STATES = [
  {
    desktop: '/images/landing/incident-state-1.png',
    mobile: '/images/landing/incident-state-1-mobile.png',
    alt: 'Live road-accident broadcast surrounded by community incident reports'
  },
  {
    desktop: '/images/landing/incident-state-2.png',
    mobile: '/images/landing/incident-state-2-mobile.png',
    alt: 'Live flood broadcast surrounded by community incident reports'
  },
  {
    desktop: '/images/landing/incident-state-3.png',
    mobile: '/images/landing/incident-state-3-mobile.png',
    alt: 'Live police-harassment broadcast surrounded by community incident reports'
  }
] as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// easeInOutCubic
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function IncidentShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  // Continuous scroll progress across the states, 0 … STATES.length - 1.
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

  // Hold each state crisp within a plateau (|d| < 0.28), then cross-dissolve to
  // the next with a hair of depth-scale so the swap reads as motion.
  const style = (i: number): React.CSSProperties => {
    const d = p - i;
    const ad = Math.abs(d);
    const t = clamp((ad - 0.28) / 0.44, 0, 1);
    return {
      opacity: ease(1 - t),
      transform: `scale(${1 - t * 0.04})`,
      zIndex: Math.round(100 - ad * 100),
      willChange: 'opacity, transform'
    };
  };

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{ height: `${STATES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Desktop keyframes */}
        <div className="relative mx-auto hidden aspect-[1280/928] w-full max-w-[1280px] lg:block">
          {STATES.map((s, i) => (
            <Image
              key={s.desktop}
              src={s.desktop}
              alt={i === 0 ? s.alt : ''}
              fill
              priority={i === 0}
              sizes="1280px"
              className="select-none object-contain"
              style={style(i)}
              aria-hidden={Math.round(p) !== i}
            />
          ))}
        </div>

        {/* Mobile keyframes */}
        <div className="relative mx-auto aspect-[402/559] w-full max-w-[440px] px-4 lg:hidden">
          {STATES.map((s, i) => (
            <Image
              key={s.mobile}
              src={s.mobile}
              alt={i === 0 ? s.alt : ''}
              fill
              priority={i === 0}
              sizes="440px"
              className="select-none object-contain"
              style={style(i)}
              aria-hidden={Math.round(p) !== i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
