'use client';

import { useState } from 'react';
import { Sidebar } from '../../_components/sidebar';
import {
  ArrowDownIcon,
  ChevronDownIcon,
  DistanceIcon,
  IcCarBadge,
  MapPinIcon,
  PinAccident,
  PinCheckpoint,
  PinRoadBlock,
  PinTraffic,
  SearchLgIcon
} from '../../_components/icons';
import { PHOTO } from '../../_lib/assets';

/* Figma 907:17335 "Map" — a full-bleed map with no topbar: a floating black
   control bar (907:17461) and a horizontal card rail (907:17486).

   NOTE: the designer's map panel is 1390 wide inside a 1440 frame, so it
   overflows the canvas by 200px in Figma. Here it fills the content column. */

/* Pin art + label, positioned in the map frame's own coordinates (Figma
   907:17339 / 17355 / 17406 / 17443). `art` is the pin's own box; the label
   sits under it in a `w`-wide, centred column. */
const PINS = [
  { id: 'accident', label: 'Road accident', Art: PinAccident, left: 213, top: 170, w: 78, art: [54, 81] },
  { id: 'traffic', label: 'Road traffic', Art: PinTraffic, left: 675, top: 106, w: 63, art: [54, 79] },
  { id: 'checkpoint', label: 'Unauthorized Checkpoint', Art: PinCheckpoint, left: 903, top: 138, w: 139, art: [63, 94] },
  { id: 'block', label: 'Road Block', Art: PinRoadBlock, left: 953, top: 381, w: 61, art: [58, 85] }
] as const;

export type MapCard = {
  id: string;
  title: string;
  place: string;
  away: string;
};

export function MapView({
  cards,
  pins
}: {
  cards: MapCard[];
  pins: { id: string; label: string }[];
}) {
  const [selected, setSelected] = useState(cards[0]?.id ?? '');

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="relative min-w-0 flex-1 overflow-hidden bg-[#E8E8E8]">
        {/* Base map — exported from Figma at 2x, anchored top-left like the design */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO.mapBase}
          alt=""
          className="pointer-events-none absolute left-0 top-0 h-[1108px] w-[1406px] max-w-none select-none"
        />

        <div className="relative min-h-screen">
          <span
            className="absolute rounded-full"
            style={{ left: 102, top: 67, width: 301, height: 301, boxShadow: 'inset 0 0 0 1px #FE646F', background: 'rgba(254,100,111,0.04)' }}
          />

          {PINS.slice(0, pins.length || 0).map((pin, pinIndex) => {
            const Art = pin.Art;
            return (
              <div
                key={pin.id}
                className="absolute flex flex-col items-center"
                style={{ left: pin.left, top: pin.top, width: pin.w }}
              >
                <Art style={{ width: pin.art[0], height: pin.art[1] }} />
                <span className="mt-[2px] whitespace-nowrap text-xs font-semibold leading-[15px] tracking-[-0.48px] text-black">
                  {pins[pinIndex]?.label ?? pin.label}
                </span>
              </div>
            );
          })}

          {/* Control bar — 929x74, pad 16/30, #000 @ radius 39 */}
          <div
            className="absolute left-4 flex h-[74px] w-[calc(100%-32px)] max-w-[929px] items-center justify-between gap-4 overflow-hidden rounded-[39px] bg-black px-5 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:gap-[30px] lg:px-[30px]"
            style={{ top: 23, boxShadow: 'inset 0 0 0 1px #414141' }}
          >
            {/*
              The control bar's four controls — state picker, search, heat map
              and basemap mode — have nothing behind them: /admin/map/incidents
              takes no parameters and the map is a static basemap image, not a
              tile layer with modes. They stay because the design's bar is the
              screen's whole chrome, and say so on hover rather than looking
              live.
            */}
            <span className="flex items-center gap-[6px]" title="The map shows every incident; there is no state filter yet.">
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
                title="A heat map layer has not been built; the pins are the incidents."
              >
                Heat map
              </span>
              <span
                className="flex items-center gap-[19px] opacity-60"
                title="The basemap is a single static image, so there are no modes to switch between."
              >
                <span className="text-sm font-bold leading-5 text-[#999999]">Standard mode</span>
                <ChevronDownIcon className="h-4 w-4 text-[#999999]" />
              </span>
            </div>
          </div>

          {/* Card rail — 372x137 modals, gap 11 */}
          <div
            className="no-scrollbar absolute left-1 right-0 flex gap-[11px] overflow-x-auto py-[11px] pr-[19px]"
            style={{ top: 655 }}
          >
            {cards.map((card) => {
              const Icon = IcCarBadge;
              const isSelected = card.id === selected;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelected(card.id)}
                  className="flex h-[137px] w-[372px] shrink-0 flex-col items-center rounded-[15px] bg-[#161616] px-5 py-[14px] text-left"
                  style={isSelected ? { boxShadow: 'inset 0 0 0 4px #FE646F' } : undefined}
                >
                  <div className="flex w-full flex-col gap-[7px] py-1">
                    <div className="flex items-center gap-[10px] py-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[28px] bg-rule px-[3px] py-[5px]">
                        <Icon className="h-[30px] w-[34px]" />
                      </span>
                      <span className="flex-1 text-base font-semibold leading-7 text-white">
                        {card.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3 px-[47px] py-[5px]">
                      <span className="flex items-center justify-center gap-1 py-1">
                        <MapPinIcon className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="whitespace-nowrap text-sm font-normal leading-5 text-gray-400">
                          {card.place}
                        </span>
                      </span>
                      <span className="flex items-center justify-center gap-1 py-1">
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
    </div>
  );
}
