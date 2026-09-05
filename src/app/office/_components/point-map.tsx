'use client';

import { useEffect, useRef, useState } from 'react';
import { TileMap, type MapMarker } from './tile-map';
import { SOURCE_COLOR, SOURCE_LABEL } from '../_lib/map-sources';

/**
 * Every coordinate one account has produced, on the same OSM tile layer the
 * rest of the dashboard uses.
 *
 * Its own component rather than `IncidentMiniMap` because that one colours by
 * incident severity, and these points are not incidents — they are a device
 * fix, an SOS, a saved place, a search. The colour has to say which.
 */
export type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  source: string;
};

export function PointMap({
  points,
  height = 320
}: {
  points: MapPoint[];
  height?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const markers: MapMarker[] = points.map((point, i) => ({
    // Several sources can share an id-less row, so the index keeps keys apart.
    id: `${point.source}-${point.id ?? i}`,
    latitude: point.latitude,
    longitude: point.longitude,
    label: point.label,
    color: SOURCE_COLOR[point.source] ?? '#667085'
  }));

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={frame}
        className="edge w-full overflow-hidden rounded-[10px]"
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

      {/* A legend, because seven colours with no key is decoration. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {[...new Set(points.map((p) => p.source))].map((source) => (
          <span key={source} className="flex items-center gap-2">
            <span
              className="h-[10px] w-[10px] shrink-0 rounded-full"
              style={{ background: SOURCE_COLOR[source] ?? '#667085' }}
            />
            <span className="text-xs font-normal leading-4 text-gray-600">
              {SOURCE_LABEL[source] ?? source}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
