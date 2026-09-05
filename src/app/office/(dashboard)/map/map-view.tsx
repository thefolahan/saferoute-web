'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '../../_components/sidebar';
import { GoogleMap, type BasemapMode } from '../../_components/google-map';
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

/** One row in the bar's dark dropdowns. */
function MenuItem({
  label,
  meta,
  active,
  onClick
}: {
  label: string;
  meta?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      /*
        The bar is dark by design (Figma 907:17461), so the palette is its own —
        but the type is the dashboard's: the same 14/20 the tables and menus
        use everywhere else, rather than a third scale invented for this screen.
      */
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal leading-5 ${
        active ? 'bg-white/10 font-medium text-white' : 'text-gray-300'
      }`}
    >
      <span className="truncate">{label}</span>
      {meta ? <span className="shrink-0 text-xs text-gray-500">{meta}</span> : null}
    </button>
  );
}

/** The severity ramp the rest of the dashboard uses. */
const SEVERITY_COLOR: Record<string, string> = {
  critical: '#B42318',
  high: '#F04438',
  medium: '#F79009',
  low: '#3DC47E'
};

/**
 * The basemap styles on offer.
 *
 * Google draws all four. The OSM fallback has no terrain or hybrid source
 * worth a dependency, so when it is in use the list is trimmed rather than
 * offering a mode that would draw an empty grid.
 */
const MODES: { id: BasemapMode; label: string; osm: boolean }[] = [
  { id: 'roadmap', label: 'Standard mode', osm: true },
  { id: 'satellite', label: 'Satellite', osm: true },
  { id: 'hybrid', label: 'Hybrid', osm: false },
  { id: 'terrain', label: 'Terrain', osm: false }
];

export function MapView({
  cards,
  mapsApiKey,
  states,
  activeState,
  total,
  truncated
}: {
  cards: MapCard[];
  /** Google Maps browser key; falls back to OSM tiles when absent. */
  mapsApiKey: string | null;
  /** Every state with an incident, and how many — the picker's options. */
  states: { name: string; count: number }[];
  activeState: string;
  total: number;
  truncated: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [selected, setSelected] = useState(cards[0]?.id ?? '');

  /**
   * Basemap style is a view setting, not a filter — it changes how the same
   * incidents are drawn, so it stays in component state. The state picker is
   * the opposite: it decides which incidents are fetched at all, so it lives
   * in the URL and the server reads it.
   */
  const [mode, setMode] = useState<BasemapMode>('roadmap');
  const [modeOpen, setModeOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [term, setTerm] = useState('');
  /**
   * Set when Google Maps cannot load — a key still propagating, a referrer
   * restriction, a quota. The screen drops to the OSM tile layer rather than
   * showing an apology: a working map of the right places beats a message
   * about why there is no map.
   */
  const [googleFailed, setGoogleFailed] = useState(false);
  /**
   * Whether Google has actually painted tiles.
   *
   * The screen used to mount Google alone and wait five seconds before
   * deciding it had failed — five seconds of grey, every visit, whenever Maps
   * was not going to render. OpenStreetMap now draws from the first frame and
   * Google is layered over it only once it proves it can draw, so the map is
   * immediate and correct either way.
   */
  const [googleDrew, setGoogleDrew] = useState(false);
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

  /**
   * Search narrows what is already loaded rather than refetching.
   *
   * The state filter has already decided the set; typing should mark pins as
   * you type, not wait for a round trip per keystroke. A state with more
   * incidents than the cap says so on the bar, which is the honest limit.
   */
  const visible = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(q) ||
        card.place.toLowerCase().includes(q)
    );
  }, [cards, term]);

  const markers: MapMarker[] = visible.map((card) => ({
    id: card.id,
    latitude: card.latitude,
    longitude: card.longitude,
    label: card.title,
    color: SEVERITY_COLOR[card.severity] ?? SEVERITY_COLOR.medium!,
    selected: card.id === selected
  }));

  /** Narrowing means "show me what I asked for"; otherwise, show the country. */
  const narrowed = Boolean(activeState) || term.trim().length > 0;

  function setState(next: string) {
    const query = new URLSearchParams(params.toString());
    if (next) query.set('state', next);
    else query.delete('state');
    const text = query.toString();
    router.push(text ? `?${text}` : '?', { scroll: false });
    setStateOpen(false);
  }

  /**
   * Hybrid and terrain exist only on Google's layer, so they are offered only
   * once Google is the one drawing — otherwise choosing one would silently do
   * nothing, which is the thing this screen has just stopped doing.
   */
  const availableModes = MODES.filter((m) => googleDrew || m.osm);

  /**
   * A menu left open behind a click elsewhere feels stuck, so an outside click
   * closes it — but "outside" has to mean outside, tested by containment.
   *
   * The first version closed on any document mousedown and relied on the menu
   * items calling `stopPropagation`. That closed the menu before the click
   * landed, so choosing a mode did nothing at all: the row was already
   * unmounted by the time the click event resolved. This is the same
   * ref-containment pattern the topbar and the global search already use.
   */
  const stateMenu = useRef<HTMLDivElement>(null);
  const modeMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stateOpen && !modeOpen) return;

    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (stateOpen && !stateMenu.current?.contains(target)) setStateOpen(false);
      if (modeOpen && !modeMenu.current?.contains(target)) setModeOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [stateOpen, modeOpen]);

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
        {/*
          Both layers, not one or the other. OpenStreetMap is underneath and
          always drawn; Google sits on top and stays invisible until it reports
          tiles. Whichever can render, the screen has a map from the first
          frame.
        */}
        {size.width > 0 ? (
          <TileMap
            markers={markers}
            width={size.width}
            height={size.height}
            onSelect={setSelected}
            /* Only two of the four modes have a free tile source. */
            mode={mode === 'satellite' ? 'satellite' : 'roadmap'}
            fitToMarkers={narrowed}
            showLabels={narrowed && visible.length <= 40}
          />
        ) : null}

        {mapsApiKey && !googleFailed ? (
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              googleDrew ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <GoogleMap
              apiKey={mapsApiKey}
              markers={markers}
              onSelect={setSelected}
              onFail={() => setGoogleFailed(true)}
              onReady={() => setGoogleDrew(true)}
              mode={mode}
              fitToMarkers={narrowed}
              showLabels={narrowed && visible.length <= 40}
              className="absolute inset-0"
            />
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm leading-5 text-gray-600">
            {cards.length === 0
              ? activeState
                ? `No incidents on record in ${activeState}.`
                : 'No incidents have been reported with a location yet.'
              : `Nothing on this map matches “${term.trim()}”.`}
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
          /*
            No `overflow-hidden` here. It was clipping the pill's corners
            neatly and clipping both dropdowns out of existence with them —
            a menu that opens below the bar has to be allowed to leave it.
            The children are rounded or inset, so nothing spills without it.
          */
          className="absolute left-1/2 z-10 flex h-[74px] w-[calc(100%-32px)] max-w-[929px] -translate-x-1/2 items-center justify-between gap-4 rounded-[39px] bg-black px-5 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:gap-[30px] lg:px-[30px]"
          style={{ top: 23, boxShadow: 'inset 0 0 0 1px #414141' }}
        >
          {/* State picker — drives the query, so it lives in the URL. */}
          <div ref={stateMenu} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setStateOpen((v) => !v);
                setModeOpen(false);
              }}
              aria-expanded={stateOpen}
              className="flex items-center gap-[6px]"
            >
              <MapPinIcon className="h-[18px] w-[18px] text-white" />
              <span className="whitespace-nowrap text-sm font-bold leading-5 text-white">
                {activeState || 'All states'}
              </span>
              <ArrowDownIcon className="h-[7px] w-3 text-white" />
            </button>

            {stateOpen ? (
              <div className="absolute left-0 top-[34px] z-30 max-h-[60vh] w-[260px] overflow-y-auto rounded-xl bg-[#161616] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <MenuItem
                  active={!activeState}
                  onClick={() => setState('')}
                  label="All states"
                  meta={String(total)}
                />
                {states.map((entry) => (
                  <MenuItem
                    key={entry.name}
                    active={entry.name === activeState}
                    onClick={() => setState(entry.name)}
                    label={entry.name}
                    meta={String(entry.count)}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* Search — narrows the loaded set as you type. */}
          <div
            className="hidden h-[42px] w-[384px] items-center gap-2 rounded-lg bg-black px-[13px] py-[9px] md:flex"
            style={{ boxShadow: 'inset 0 0 0 1px #535862' }}
          >
            <SearchLgIcon className="h-[19px] w-[19px] shrink-0 text-gray-400" />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search incidents on this map"
              aria-label="Search incidents on this map"
              className="w-full bg-transparent text-base font-normal leading-6 text-white outline-none placeholder:text-gray-400"
            />
            {term ? (
              <button
                type="button"
                onClick={() => setTerm('')}
                aria-label="Clear search"
                className="shrink-0 text-xs font-semibold text-gray-400"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-[22px] lg:gap-[30px]">
            <div ref={modeMenu} className="relative">
              <button
                type="button"
                onClick={() => {
                  setModeOpen((v) => !v);
                  setStateOpen(false);
                }}
                aria-expanded={modeOpen}
                className="flex items-center gap-[19px]"
              >
                <span className="whitespace-nowrap text-sm font-bold leading-5 text-white">
                  {MODES.find((m) => m.id === mode)?.label ?? 'Standard mode'}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-white" />
              </button>

              {modeOpen ? (
                <div className="absolute right-0 top-[34px] z-30 w-[200px] rounded-xl bg-[#161616] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  {availableModes.map((option) => (
                    <MenuItem
                      key={option.id}
                      active={option.id === mode}
                      onClick={() => {
                        setMode(option.id);
                        setModeOpen(false);
                      }}
                      label={option.label}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/*
          The cap is 800 rows; a filter that would return more says so rather
          than letting a partial map read as the whole picture.
        */}
        {truncated ? (
          <p className="absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-4 py-1 text-xs font-medium text-white" style={{ top: 105 }}>
            Showing the {cards.length} most recent of {total}. Pick a state to
            narrow it.
          </p>
        ) : null}

        {/* Card rail — 372x137 modals, gap 11 */}
        {/*
          The rail lists what the map is showing, not what was fetched. It
          rendered `cards` while the pins rendered the filtered set, so a
          search left one marker above eight cards describing incidents that
          were no longer on the map.
        */}
        <div className="no-scrollbar absolute bottom-6 left-1 right-0 z-10 flex gap-[11px] overflow-x-auto py-[11px] pr-[19px]">
          {visible.map((card) => {
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
                    <span className="min-w-0 flex-1 truncate text-base font-semibold leading-6 text-white">
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
