'use client';

import { useEffect, useState } from 'react';

type AnimatedStat = {
  label: string;
  suffix?: string;
  target: number;
};

export function AnimatedStats({ stats }: { stats: AnimatedStat[] }) {
  const [values, setValues] = useState(() => stats.map(() => 0));

  useEffect(() => {
    let frameId = 0;
    const duration = 5000;
    const start = performance.now();

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);

      setValues(stats.map((stat) => Math.floor(stat.target * progress)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    frameId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(frameId);
  }, [stats]);

  return (
    <dl className="mt-14 grid gap-8 rounded-[18px] border border-white/12 bg-[var(--surface)] p-6 text-center shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:grid-cols-3 sm:p-8">
      {stats.map((stat, index) => (
        <div key={stat.label}>
          <dt className="text-4xl font-black text-white sm:text-5xl">
            {values[index]}
            {stat.suffix ?? ''}
          </dt>
          <dd className="mt-3 text-base font-bold text-white/54">{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}
