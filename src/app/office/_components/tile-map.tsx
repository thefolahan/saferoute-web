'use client';

import { useMemo, useState, type ReactNode } from 'react';

/**
 * A real slippy map: OpenStreetMap raster tiles under markers placed by
 * projecting each incident's own latitude and longitude.
 *
 * What it replaces was a picture. The Map screen drew a Figma export of a map
 * with eight markers at hardcoded pixel offsets, then labelled those markers
 * with the titles of real incidents — so a report in Ikeja and a report in
 * Lekki appeared wherever the designer had happened to put a pin, and the
 * coordinates the API returns were never read. Moving an incident could not
 * move its marker, because nothing connected them.
 *
 * No mapping library: Web Mercator is about fifteen lines, the tiles are plain
 * <img>, and a dependency for that is not worth the bundle. OSM's tile policy
 * asks for attribution and light use, both of which an internal dashboard with
 * a handful of viewers satisfies — the notice is rendered bottom-right and is
 * not optional.
 */

const TILE = 256;

/**
 * Where tiles come from, per basemap mode.
 *
 * OpenStreetMap draws no imagery, so satellite is Esri's World Imagery — the
 * same free service its own basemap gallery serves, attributed below as their
 * terms require. `terrain` has no free equivalent worth the dependency, so it
 * falls back to the standard map rather than showing an empty grid; the Map
 * screen only offers the modes a given basemap can actually draw.
 */
const TILE_SOURCES = {
  roadmap: {
    url: (z: number, x: number, y: number) =>
      `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    url: (z: number, x: number, y: number) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
  }
} as const;

export type TileMode = keyof typeof TILE_SOURCES;

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  /** Marker tint — the incident's severity colour. */
  color: string;
  selected?: boolean;
};

/** Longitude to world-pixel x at a given zoom. */
function lngToX(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * TILE * 2 ** zoom;
}

/** Latitude to world-pixel y at a given zoom (Web Mercator). */
function latToY(lat: number, zoom: number): number {
  const clamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const sin = Math.sin((clamped * Math.PI) / 180);
  return (
    (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * TILE * 2 ** zoom
  );
}

/**
 * The zoom and centre that fit every marker inside the viewport, with a little
 * air around the edges. One marker falls back to a street-level zoom, since
 * there is no extent to fit.
 */
function fit(
  markers: MapMarker[],
  width: number,
  height: number
): { zoom: number; centre: { lat: number; lng: number } } {
  if (markers.length === 0) {
    // The country, not a city — see NIGERIA in google-map.tsx for why.
    return { zoom: 6, centre: { lat: 9.082, lng: 8.6753 } };
  }

  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  const centre = {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
  };

  if (markers.length === 1) return { zoom: 13, centre };

  for (let zoom = 16; zoom >= 2; zoom -= 1) {
    const xs = lngs.map((lng) => lngToX(lng, zoom));
    const ys = lats.map((lat) => latToY(lat, zoom));
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);

    if (spanX < width * 0.8 && spanY < height * 0.8) {
      return { zoom, centre };
    }
  }

  return { zoom: 2, centre };
}

export function TileMap({
  markers,
  width,
  height,
  onSelect,
  showLabels = true,
  mode = 'roadmap',
  fitToMarkers = true,
  children
}: {
  markers: MapMarker[];
  width: number;
  height: number;
  onSelect?: (id: string) => void;
  mode?: TileMode;
  /** Off on the Map screen, which opens on the country rather than the pins. */
  fitToMarkers?: boolean;
  /**
   * Whether markers carry their title. Off on the Dashboard's card, where the
   * panel is a few hundred pixels wide and eight labels land on top of each
   * other; the full Map screen has room for them.
   */
  showLabels?: boolean;
  /** Overlaid chrome — the control bar, the card rail. */
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const { zoom, centre } = useMemo(
    () => (fitToMarkers ? fit(markers, width, height) : fit([], width, height)),
    [markers, width, height, fitToMarkers]
  );

  const source = TILE_SOURCES[mode] ?? TILE_SOURCES.roadmap;

  // World pixels of the viewport's top-left corner.
  const originX = lngToX(centre.lng, zoom) - width / 2;
  const originY = latToY(centre.lat, zoom) - height / 2;

  const firstTileX = Math.floor(originX / TILE);
  const firstTileY = Math.floor(originY / TILE);
  const columns = Math.ceil(width / TILE) + 1;
  const rows = Math.ceil(height / TILE) + 1;
  const span = 2 ** zoom;

  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = firstTileX + column;
      const y = firstTileY + row;
      // Wrap east-west; drop rows above the north pole or below the south.
      if (y < 0 || y >= span) continue;
      const wrappedX = ((x % span) + span) % span;

      tiles.push({
        key: `${zoom}/${x}/${y}`,
        src: source.url(zoom, wrappedX, y),
        left: x * TILE - originX,
        top: y * TILE - originY
      });
    }
  }

  return (
    <div
      className="relative overflow-hidden bg-[#E8E8E8]"
      style={{ width, height }}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm leading-5 text-gray-500">
          The map tiles could not be loaded. The incidents below are still
          listed with their locations.
        </div>
      ) : (
        tiles.map((tile) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            width={TILE}
            height={TILE}
            loading="lazy"
            onError={() => setFailed(true)}
            className="pointer-events-none absolute max-w-none select-none"
            style={{ left: tile.left, top: tile.top }}
          />
        ))
      )}

      {markers.map((marker) => {
        const left = lngToX(marker.longitude, zoom) - originX;
        const top = latToY(marker.latitude, zoom) - originY;

        // Off-screen markers would otherwise pile up on the edges.
        if (left < -40 || left > width + 40 || top < -60 || top > height + 40) {
          return null;
        }

        return (
          <button
            key={marker.id}
            type="button"
            onClick={() => onSelect?.(marker.id)}
            className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
            style={{ left, top }}
            title={marker.label}
          >
            <span
              className={`flex items-center justify-center rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.35)] ${
                marker.selected ? 'h-5 w-5' : 'h-3.5 w-3.5'
              }`}
              style={{ backgroundColor: marker.color }}
            />
            {showLabels || marker.selected ? (
              <span
                className={`mt-1 max-w-[150px] truncate rounded bg-white/90 px-1.5 py-0.5 text-xs font-semibold leading-4 text-black shadow-sm ${
                  marker.selected ? '' : 'hidden xl:block'
                }`}
              >
                {marker.label}
              </span>
            ) : null}
          </button>
        );
      })}

      {/* OSM asks for this, and it is the honest credit for the imagery. */}
      {/*
        Attribution names whoever actually drew these tiles. Both services
        require it, and leaving OpenStreetMap's credit on Esri's imagery would
        be crediting the wrong people.
      */}
      {!failed ? (
        <a
          href={
            mode === 'satellite'
              ? 'https://www.esri.com/en-us/legal/terms/full-master-agreement'
              : 'https://www.openstreetmap.org/copyright'
          }
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-0 right-0 bg-white/75 px-1 text-xs leading-4 text-gray-700"
        >
          {source.attribution}
        </a>
      ) : null}

      {children}
    </div>
  );
}
