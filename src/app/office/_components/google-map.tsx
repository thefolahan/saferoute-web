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
  showLabels = true,
  className = ''
}: {
  apiKey: string;
  markers: MapMarker[];
  onSelect?: (id: string) => void;
  /** Told when Maps cannot load, so the caller can fall back to a map that can. */
  onFail?: (reason: string) => void;
  showLabels?: boolean;
  className?: string;
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
          // Lagos, so an empty map is not the middle of the Atlantic.
          center: { lat: 6.5244, lng: 3.3792 },
          zoom: 11,
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
  }, [apiKey, onFail]);

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

    if (markers.length === 1) {
      instance.setCenter(bounds.getCenter());
      instance.setZoom(14);
    } else {
      instance.fitBounds(bounds, 64);
    }
  }, [markers, onSelect, showLabels, ready]);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 bg-[#E8E8E8] px-6 text-center text-sm leading-6 text-gray-600 ${className}`}
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
