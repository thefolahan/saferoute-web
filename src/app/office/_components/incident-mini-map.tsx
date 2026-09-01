'use client';

import { useEffect, useRef, useState } from 'react';
import { TileMap, type MapMarker } from './tile-map';

/**
 * The Dashboard's map card: the same tile layer the Map screen uses, fitted to
 * wherever the incidents actually are.
 *
 * Its own component because `TileMap` needs pixel dimensions to know which
 * tiles to fetch, and this card is fluid — the panel changes width at three
 * breakpoints and again when the sidebar collapses.
 */
export type MapPlace = {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  severity: string;
};

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#B42318',
  high: '#F04438',
  medium: '#F79009',
  low: '#3DC47E'
};

export function IncidentMiniMap({ places }: { places: MapPlace[] }) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = 248;

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const markers: MapMarker[] = places.map((place) => ({
    id: place.id,
    latitude: place.latitude,
    longitude: place.longitude,
    label: place.label,
    color: SEVERITY_COLOR[place.severity] ?? SEVERITY_COLOR.medium!
  }));

  return (
    <div
      ref={frame}
      className="w-full overflow-hidden rounded-lg"
      style={{ height }}
    >
      {width > 0 ? (
        <TileMap
          markers={markers}
          width={width}
          height={height}
          showLabels={false}
        />
      ) : null}
    </div>
  );
}
