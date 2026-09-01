'use client';

import { CarIcon, CloseIcon } from './icons';
import { PHOTO } from '../_lib/assets';

/* Figma 907:17084 — the "View Details" sheet on Feed & contents.
   723x1049 radius 6: header 168h pad 30/20, a 410h media grid (1 large + 2
   stacked, the last dimmed under a "5+" overlay), then the incident detail. */

export function ContentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Incident Detail"
        className="flex max-h-full w-[723px] flex-col overflow-auto rounded-md bg-white"
      >
        <div className="edge flex shrink-0 items-center gap-[7px] px-5 py-[30px]">
          <div className="flex flex-1 items-center py-2">
            <div className="flex flex-1 flex-col gap-[9px]">
              <div className="flex gap-[9px]">
                <span className="inline-flex items-center justify-center rounded-2xl bg-error-50 px-3 py-1 text-xs font-medium leading-[18px] text-error-700">
                  Fire report
                </span>
                <span className="inline-flex items-center rounded-2xl bg-success-50 py-1 pl-[9px] pr-3 text-xs font-medium leading-[18px] text-success-700">
                  Verified
                </span>
                <span className="inline-flex items-center justify-center rounded-2xl bg-rule px-3 py-1 text-xs font-medium leading-[18px] text-gray-600">
                  Submitted
                </span>
              </div>

              <p className="text-base font-semibold leading-7 text-gray-900">
                Incident reported by James Fabusoro
              </p>

              <div className="flex gap-[5px] text-xs font-normal leading-5 tracking-[-0.24px] text-gray-500">
                <span>INC-07182</span>
                <span aria-hidden>•</span>
                <span>Lekki Express way, lagos</span>
                <span aria-hidden>•</span>
                <span>50km away</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[33px] w-[33px] shrink-0 items-center justify-center self-start"
          >
            <CloseIcon className="h-[33px] w-[33px] text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col px-5 pb-[26px]">
          <div className="flex h-[410px] gap-[9px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTO.map} alt="" className="h-full w-0 flex-1 rounded object-cover" />
            <div className="flex w-0 flex-1 flex-col justify-center gap-[9px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTO.map} alt="" className="min-h-0 w-full flex-1 rounded object-cover" />
              <div className="relative min-h-0 flex-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PHOTO.map}
                  alt=""
                  className="h-full w-full rounded object-cover brightness-[0.33]"
                />
                <span className="absolute inset-0 flex items-center justify-center text-[70px] font-semibold leading-none text-white">
                  5+
                </span>
              </div>
            </div>
          </div>

          <div className="mt-[10px] flex flex-col items-center pt-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
            <div className="flex w-full items-center gap-[18px] py-[5px]">
              <h2 className="text-base font-semibold leading-6 text-gray-900">Incident Detail</h2>
            </div>

            <div className="flex w-full flex-col gap-[7px] py-1">
              <div className="flex gap-5 py-2">
                <div className="flex h-[49px] w-[49px] shrink-0 items-center justify-center rounded-[35px] bg-rule px-[3px] py-[7px]">
                  <CarIcon className="h-[35px] w-[43px]" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">Road Accident</h3>
                  <p className="text-[15px] font-normal leading-5 tracking-[-0.3px] text-gray-500">
                    2 vehicles involved in collision near Admiralty Way, Lekki. Road partially
                    blocked.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-center px-[186px] py-[18px]">
              <button
                type="button"
                className="edge flex h-[54px] w-full items-center justify-center rounded-lg px-8 py-[15px] text-base font-semibold leading-6 text-black shadow-[0_1px_9px_rgba(0,0,0,0.13)]"
              >
                Navigate map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
