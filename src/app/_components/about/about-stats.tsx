'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The hero stats strip. Figures count up from zero the first time the strip
 * scrolls into view.
 */
const STATS = [
  { prefix: '', target: 20, suffix: 'k+', label: 'Active users' },
  { prefix: '', target: 300, suffix: 'K+', label: 'Incidents reported' },
  { prefix: '', target: 60, suffix: '%', label: 'Fewer travel delays' },
  { prefix: '$', target: 1, suffix: 'B+', label: 'Losses prevented' }
] as const;

export function AboutStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<number[]>(STATS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setVals(STATS.map((s) => Math.round(s.target * eased)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="mt-14 grid grid-cols-2 overflow-hidden rounded-[17px] border border-[#D5D7DA] lg:grid-cols-4"
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center justify-center px-6 py-7 text-center sm:px-[42px] sm:py-[30px] ${
            i % 2 === 1 ? 'border-l border-[#D5D7DA]' : ''
          } ${i >= 2 ? 'border-t border-[#D5D7DA] lg:border-t-0' : ''} ${
            i % 4 !== 0 ? 'lg:border-l lg:border-[#D5D7DA]' : ''
          }`}
        >
          <p className="text-[32px] font-semibold leading-none tracking-[-0.02em] text-[#0A0D12] tabular-nums sm:text-[48px]">
            {stat.prefix}
            {vals[i]}
            {stat.suffix}
          </p>
          <p className="mt-3 text-[12px] font-normal leading-5 tracking-[-0.02em] text-[#717680] sm:text-[14px]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
