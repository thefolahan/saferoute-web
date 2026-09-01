'use client';

import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '../../_components/sidebar';
import { GoogleMap } from '../../_components/google-map';
import { TileMap, type MapMarker } from '../../_components/tile-map';
import {
  ArrowDownIcon,
  ChevronDownIcon,
  DistanceIcon,
  IcCarBadge,
  MapPinIcon,
  SearchLgIcon
} from '../../_components/icons';

/* Figma 907:17335 "Map" — a full-bleed map with no topbar: a floating black
   control bar (907:17461) and a horizontal card rail (907:17486).

   The basemap is a real tile layer now rather than the designer's export, so
   a marker sits where its incident actually is. See _components/tile-map.tsx
   for why that needed replacing and why there is no mapping dependency. */

export type MapCard = {
  id: string;
  title: string;
  place: string;
  away: string;
  latitude: number;
  longitude: number;
  severity: string;
};

/** The severity ramp the rest of the dashboard uses. */
const SEVERITY_COLOR: Record<string, string> = {
  critical: '#B42318',
  high: '#F04438',
  medium: '#F79009',
  low: '#3DC47E'
};

export function MapView({
  cards,
  mapsApiKey
}: {
  cards: MapCard[];
  /** Google Maps browser key; falls back to OSM tiles when absent. */
  mapsApiKey: string | null;
}) {
  const [selected, setSelected] = useState(cards[0]?.id ?? '');
  /**
   * Set when Google Maps cannot load — a key still propagating, a referrer
   * restriction, a quota. The screen drops to the OSM tile layer rather than
   * showing an apology: a working map of the right places beats a message
   * about why there is no map.
   */
  const [googleFailed, setGoogleFailed] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  /**
   * The tile grid needs pixel dimensions to know which tiles to fetch, and the
   * panel is fluid, so it is measured rather than assumed. Re-measured on
   * resize because the sidebar collapses at `lg` and the panel jumps ~250px.
   */
  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const measure = () =>
      setSize({
        width: element.clientWidth,
        height: element.clientHeight
      });

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const markers: MapMarker[] = cards.map((card) => ({
    id: card.id,
    latitude: card.latitude,
    longitude: card.longitude,
    label: card.title,
    color: SEVERITY_COLOR[card.severity] ?? SEVERITY_COLOR.medium!,
    selected: card.id === selected
  }));

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div ref={frame} className="relative min-w-0 flex-1 overflow-hidden bg-[#E8E8E8]">
        {/*
          Google Maps where a key is configured, the OSM tile layer where it is
          not — so the screen works in local development and on a preview
          deploy without one, rather than showing a grey box and a console
          error.
        */}
        {mapsApiKey && !googleFailed ? (
          <GoogleMap
            apiKey={mapsApiKey}
            markers={markers}
            onSelect={setSelected}
            onFail={() => setGoogleFailed(true)}
            className="absolute inset-0"
          />
        ) : size.width > 0 ? (
          <TileMap
            markers={markers}
            width={size.width}
            height={size.height}
            onSelect={setSelected}
          />
        ) : null}

        {cards.length === 0 ? (
          <p className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm leading-6 text-gray-600">
            No incidents have been reported with a location yet.
          </p>
        ) : null}

        {/* Control bar — 929x74, pad 16/30, #000 @ radius 39 */}
        {/*
          Centred, as the design has it: Figma 907:17461 sits at x=440 in a
          panel starting at x=250, i.e. inset from both edges rather than flush
          left. It was pinned to `left-4`, which read as a bar shoved into the
          corner.
        */}
        <div
          className="absolute left-1/2 z-10 flex h-[74px] w-[calc(100%-32px)] max-w-[929px] -translate-x-1/2 items-center justify-between gap-4 overflow-hidden rounded-[39px] bg-black px-5 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:gap-[30px] lg:px-[30px]"
          style={{ top: 23, boxShadow: 'inset 0 0 0 1px #414141' }}
        >
          {/*
            The bar's four controls still have nothing behind them:
            /admin/map/incidents takes no parameters, and there is no heat-map
            layer or second basemap style. They stay because the design's bar is
            this screen's whole chrome, and say so on hover rather than looking
            live. The map itself is real; these are not.
          */}
          <span
            className="flex items-center gap-[6px]"
            title="The map shows every incident with a location; there is no state filter yet."
          >
            <MapPinIcon className="h-[18px] w-[18px] text-[#999999]" />
            <span className="text-sm font-bold leading-5 text-[#999999]">All states</span>
            <ArrowDownIcon className="h-[7px] w-3 text-[#999999] opacity-50" />
          </span>

          <div
            className="hidden h-[42px] w-[384px] items-center gap-2 rounded-lg bg-black px-[13px] py-[9px] md:flex"
            style={{ boxShadow: 'inset 0 0 0 1px #535862' }}
          >
            <SearchLgIcon className="h-[19px] w-[19px] shrink-0 text-gray-400" />
            <span
              className="flex-1 text-[15px] font-normal leading-[23px] text-gray-400 opacity-60"
              title="Searching the map is not built; the Incidents and Users screens have working search."
            >
              Search users, incidents
            </span>
          </div>

          <div className="hidden items-center gap-[30px] lg:flex">
            <span
              className="text-sm font-bold leading-5 text-[#999999] opacity-60"
              title="A heat-map layer has not been built; the markers are the incidents."
            >
              Heat map
            </span>
            <span
              className="flex items-center gap-[19px] opacity-60"
              title="Only one basemap style is loaded, so there are no modes to switch between."
            >
              <span className="text-sm font-bold leading-5 text-[#999999]">Standard mode</span>
              <ChevronDownIcon className="h-4 w-4 text-[#999999]" />
            </span>
          </div>
        </div>

        {/* Card rail — 372x137 modals, gap 11 */}
        <div className="no-scrollbar absolute bottom-6 left-1 right-0 z-10 flex gap-[11px] overflow-x-auto py-[11px] pr-[19px]">
          {cards.map((card) => {
            const isSelected = card.id === selected;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelected(card.id)}
                className="flex h-[137px] w-[372px] max-w-[85vw] shrink-0 flex-col items-center rounded-[15px] bg-[#161616] px-5 py-[14px] text-left"
                style={isSelected ? { boxShadow: 'inset 0 0 0 4px #FE646F' } : undefined}
              >
                <div className="flex w-full min-w-0 flex-col gap-[7px] py-1">
                  <div className="flex items-center gap-[10px] py-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[28px] bg-rule px-[3px] py-[5px]">
                      <IcCarBadge className="h-[30px] w-[34px]" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-base font-semibold leading-7 text-white">
                      {card.title}
                    </span>
                  </div>
                  <div className="flex min-w-0 items-center justify-center gap-3 py-[5px]">
                    <span className="flex min-w-0 items-center justify-center gap-1 py-1">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate text-sm font-normal leading-5 text-gray-400">
                        {card.place}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center justify-center gap-1 py-1">
                      <DistanceIcon className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="whitespace-nowrap text-sm font-normal leading-5 text-gray-400">
                        {card.away}
                      </span>
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
