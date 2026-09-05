'use client';

import { useEffect, useRef, useState } from 'react';
import type { MapMarker } from './tile-map';

/**
 * Google Maps, loaded from the browser with a referrer-locked key.
 *
 * The key is public by necessity — the Maps JavaScript API runs in the page —
 * so it is restricted at Google's end to this app's own hostnames and to the
 * two Maps services it needs. That restriction is the security boundary, not
 * the secrecy of the string.
 *
 * `TileMap` stays as the fallback for when there is no key configured (local
 * development, a preview deploy without env), so the Map screen is never blank
 * and never needs a key to be worked on.
 */

declare global {
  interface Window {
    google?: typeof google;
    __srMapsPromise?: Promise<void>;
  }
}

/**
 * One loader for the whole app; a second <script> tag throws.
 *
 * Deliberately NOT `loading=async`. That flag makes the tag install a
 * bootstrap whose `importLibrary` is the only way to reach `Map` — and it is
 * not defined yet when the script's `onload` fires, so the obvious code
 * (`onload` then construct) dies with "importLibrary is not a function". The
 * classic loader with an explicit `libraries` list has `google.maps.Map` and
 * `google.maps.Marker` ready on load, which is exactly what this component
 * constructs and needs no shim to reach.
 *
 * Google logs a console suggestion to use `loading=async` for a slightly
 * faster first paint. On an internal dashboard that is not worth a load path
 * with a race in it.
 */
function loadMaps(key: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps?.Map) return Promise.resolve();
  if (window.__srMapsPromise) return window.__srMapsPromise;

  window.__srMapsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=marker&v=weekly`;
    script.async = true;
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    script.onload = () => {
      if (window.google?.maps?.Map) resolve();
      else reject(new Error('Google Maps loaded without the maps library'));
    };
    document.head.appendChild(script);
  });

  return window.__srMapsPromise;
}

/**
 * The country this dashboard is for.
 *
 * The map opened on Lagos at street zoom and then fitted itself to whatever
 * markers had loaded, so a national picture only appeared by accident of where
 * the reports happened to be. Incidents are spread across all 37 states; the
 * default view should be the country, and zooming is what a filter is for.
 */
export const NIGERIA = {
  center: { lat: 9.082, lng: 8.6753 },
  zoom: 6,
  bounds: { south: 4.0, west: 2.6, north: 13.95, east: 14.7 }
};

/** The basemap styles the control bar can switch between. */
export type BasemapMode = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

/** A severity-tinted pin, as an inline SVG data URI. */
function pinIcon(color: string, selected: boolean): string {
  const r = selected ? 9 : 7;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${r * 2 + 6}" height="${r * 2 + 6}" viewBox="0 0 ${r * 2 + 6} ${r * 2 + 6}"><circle cx="${r + 3}" cy="${r + 3}" r="${r}" fill="${color}" stroke="#fff" stroke-width="2.5"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function GoogleMap({
  apiKey,
  markers,
  onSelect,
  onFail,
  onReady,
  showLabels = true,
  className = '',
  mode = 'roadmap',
  /**
   * Whether to zoom to the markers.
   *
   * Off by default so the map opens on the country. The Map screen turns it on
   * once a filter or a search has narrowed the set, because at that point
   * "show me what I asked for" beats "show me Nigeria".
   */
  fitToMarkers = false
}: {
  apiKey: string;
  markers: MapMarker[];
  onSelect?: (id: string) => void;
  /** Told when Maps cannot load, so the caller can fall back to a map that can. */
  onFail?: (reason: string) => void;
  /**
   * Told the moment Maps actually paints tiles.
   *
   * The Map screen shows the OpenStreetMap layer from the first frame and only
   * reveals this one once it fires — so there is never a grey rectangle while
   * Google decides whether it is going to work, and never a five-second wait
   * before the fallback appears.
   */
  onReady?: () => void;
  showLabels?: boolean;
  className?: string;
  mode?: BasemapMode;
  fitToMarkers?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const drawn = useRef<google.maps.Marker[]>([]);
  const [failed, setFailed] = useState<string | null>(null);
  /**
   * Flips once the Map instance exists. The marker effect below runs on first
   * render — long before an async script has loaded — so without a dependency
   * that changes when the map appears, it finds `map.current` null, bails, and
   * never runs again for an unchanged marker list. That is a silently empty
   * map, which is worse than a broken one.
   */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadMaps(apiKey)
      .then(() => {
        if (cancelled || !container.current || !window.google?.maps) return;

        map.current ??= new window.google.maps.Map(container.current, {
          // The whole country — see NIGERIA above for why not Lagos.
          center: NIGERIA.center,
          zoom: NIGERIA.zoom,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          // Google's own dashboards hide business POIs on data maps; the
          // incidents are the content here, not the restaurants.
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setReady(true);

        /**
         * Maps can initialise and then draw nothing — the container gets its
         * `.gm-style` scaffolding and no imagery ever arrives, with no error
         * thrown and nothing on the console. A key that is still propagating
         * does exactly this, and so does a quota or a service that is enabled
         * but not yet serving.
         *
         * `tilesloaded` is the API's own "I have drawn something" signal, so
         * not hearing it inside a few seconds is the honest test for a map
         * that is never going to appear. The caller then falls back to a map
         * that works rather than leaving a grey rectangle.
         */
        const drewSomething = { yes: false };
        map.current.addListener('tilesloaded', () => {
          if (!drewSomething.yes) onReady?.();
          drewSomething.yes = true;
        });

        window.setTimeout(() => {
          if (!cancelled && !drewSomething.yes) {
            const reason = 'Google Maps drew no tiles';
            console.error(`[office/map] ${reason}`);
            setFailed(reason);
            onFail?.(reason);
          }
        }, 5000);
      })
      .catch((error: unknown) => {
        // Carry the reason rather than swallowing it: "could not be loaded"
        // with no cause cost an hour once, when the real answer was that the
        // Maps JavaScript API had never been enabled on the project.
        const reason = error instanceof Error ? error.message : String(error);
        console.error('[office/map] Google Maps failed:', error);
        if (!cancelled) {
          setFailed(reason);
          onFail?.(reason);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, onFail, onReady]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !window.google?.maps) return;

    for (const marker of drawn.current) marker.setMap(null);
    drawn.current = [];

    if (markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    for (const marker of markers) {
      const position = { lat: marker.latitude, lng: marker.longitude };
      bounds.extend(position);

      const pin = new window.google.maps.Marker({
        position,
        map: instance,
        title: marker.label,
        zIndex: marker.selected ? 2 : 1,
        icon: {
          url: pinIcon(marker.color, Boolean(marker.selected)),
          anchor: new window.google.maps.Point(10, 10)
        },
        ...(showLabels
          ? {
              label: {
                text: marker.label.slice(0, 28),
                className: 'sr-map-label',
                color: '#111827',
                fontSize: '11px',
                fontWeight: '600'
              }
            }
          : {})
      });

      pin.addListener('click', () => onSelect?.(marker.id));
      drawn.current.push(pin);
    }

    if (!fitToMarkers) return;

    if (markers.length === 1) {
      instance.setCenter(bounds.getCenter());
      instance.setZoom(14);
    } else {
      instance.fitBounds(bounds, 64);
    }
  }, [markers, onSelect, showLabels, ready, fitToMarkers]);

  /** Basemap style. Google owns satellite imagery; this is a one-line switch. */
  useEffect(() => {
    if (!ready || !map.current) return;
    map.current.setMapTypeId(mode);
  }, [mode, ready]);


  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 bg-[#E8E8E8] px-6 text-center text-sm leading-5 text-gray-600 ${className}`}
      >
        <span>
          Google Maps could not be loaded. The incidents are still listed below
          with their locations.
        </span>
        <span className="text-xs text-gray-500">{failed}</span>
      </div>
    );
  }

  return <div ref={container} className={className} />;
}
