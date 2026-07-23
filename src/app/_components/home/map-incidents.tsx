'use client';

import { useEffect, useState } from 'react';

/**
 * Randomly pops incident markers (alarm / flood / road block) at random spots
 * across the hero map background. Each marker fades in, holds, and fades out
 * over ~2 seconds, then a new one appears somewhere else.
 */
const ICONS = [
  '/images/landing/alarm.svg',
  '/images/landing/flood.svg',
  '/images/landing/road-block.svg'
];

type Marker = { id: number; icon: string; top: number; left: number };

export function MapIncidents() {
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    let nextId = 0;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const spawn = () => {
      if (stopped) return;
      const marker: Marker = {
        id: nextId++,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)]!,
        top: 8 + Math.random() * 74, // percent, keep within the frame
        left: 4 + Math.random() * 88
      };
      setMarkers((prev) => [...prev, marker]);
      // Remove after its 2s life so the DOM stays small.
      setTimeout(() => {
        setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
      }, 2000);
      // Next marker after a short random gap.
      timer = setTimeout(spawn, 450 + Math.random() * 650);
    };

    timer = setTimeout(spawn, 300);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {markers.map((m) => (
        <span
          key={m.id}
          className="map-incident absolute h-11 w-11 bg-contain bg-center bg-no-repeat sm:h-14 sm:w-14"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            backgroundImage: `url(${m.icon})`
          }}
        />
      ))}
    </div>
  );
}
