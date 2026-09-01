'use client';

import {
  CheckIcon,
  CheckLineIcon,
  CloseIcon,
  MessageIcon,
  PendingIcon,
  UserGroupIcon,
  XMarkIcon
} from './icons';
import { AVATAR, PHOTO } from '../_lib/assets';

/* Figma 907:19428 "Verification details popup" — 782x1049, radius 6.
   Header 58h, applicant strip 161h, then two sections separated by a 1px
   top hairline, and a sticky action bar. */

const CHECKS = [
  ['Identity match', 'Document validity'],
  ['Government issued', 'Information match']
];

export function VerificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Verification Center"
        className="flex max-h-full w-[782px] flex-col overflow-auto rounded-md bg-white"
      >
        <div className="edge flex shrink-0 items-center gap-[7px] px-5 py-[7px]">
          <div className="flex flex-1 items-center py-2">
            <h2 className="flex-1 text-xl font-semibold leading-7 text-gray-900">
              Verification Center
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[33px] w-[33px] shrink-0 items-center justify-center"
          >
            <CloseIcon className="h-[33px] w-[33px] text-gray-500" />
          </button>
        </div>

        {/* Applicant */}
        <div className="flex items-center gap-[19px] px-5 py-[10px]">
          <div className="flex h-[141px] w-[149px] shrink-0 items-center justify-center rounded-md p-2 shadow-[inset_0_0_0_1px_rgba(238,238,238,0.52)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AVATAR.user} alt="" className="h-full w-full rounded object-cover" />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-[25px]">
            <div className="flex flex-col justify-center gap-[11px]">
              <div className="flex flex-col gap-[9px]">
                <span className="text-sm font-medium leading-[17px] text-gray-500">
                  Application ID: VER-028491
                </span>
                <span className="text-xl font-semibold leading-6 text-black">
                  Tomiwa Oyeledu Dolapo
                </span>
              </div>

              <div className="flex items-center gap-[9px]">
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-rule px-3 py-1">
                  <UserGroupIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium leading-5 tracking-[-0.28px] text-gray-500">
                    Community Member
                  </span>
                </span>
                <span className="inline-flex items-center justify-center gap-1 rounded-2xl bg-warning-50 px-3 py-[10px]">
                  <PendingIcon className="h-6 w-6" />
                  <span className="text-sm font-medium leading-[18px] text-warning-700">
                    Pending Review
                  </span>
                </span>
              </div>

              <span className="text-sm font-medium leading-[17px] text-gray-500">
                Submitted Aug 7, 2026 · 09:42 AM
              </span>
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 self-center text-base font-semibold leading-6 text-black underline"
          >
            View profile
          </button>
        </div>

        {/* AI / System Check */}
        <div className="px-5">
          <div className="flex flex-col items-center gap-[10px] py-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
            <div className="flex w-full items-center py-[5px]">
              <h3 className="text-base font-semibold leading-6 text-gray-900">AI / System Check</h3>
            </div>

            <div className="flex w-full items-center gap-[34px]">
              <div
                className="flex h-[154px] w-[291px] shrink-0 items-center gap-[9px] rounded-[13px] px-[18px] py-[15px]"
                style={{ background: 'linear-gradient(180deg, #3DC47E 0%, rgba(237,162,23,0.22) 100%)' }}
              >
                <div className="flex flex-1 flex-col gap-[30px]">
                  <div className="flex flex-col justify-center">
                    <span
                      className="bg-clip-text text-base font-bold leading-[21px] text-transparent"
                      style={{ backgroundImage: 'linear-gradient(90deg, #2F1A1A 0%, #E94B3E 100%)' }}
                    >
                      AI Verification Checker
                    </span>
                    <span className="text-xs font-medium leading-[21px] text-black">
                      Powered By SafeRoute AI
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-[13px]">
                    <span className="text-[40px] font-bold leading-[48px] text-success-950">
                      60%
                    </span>
                    <button
                      type="button"
                      className="flex h-8 items-center justify-center rounded-lg bg-success-800 px-4 py-1 text-sm font-semibold leading-6 text-gray-25"
                    >
                      Recheck
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                {CHECKS.map((row, i) => (
                  <div key={i} className="flex gap-[7px] py-1">
                    {row.map((c) => (
                      <span
                        key={c}
                        className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-success-50 px-3 py-[10px]"
                      >
                        <CheckLineIcon className="h-5 w-5 text-success-600" />
                        <span className="text-sm font-semibold leading-[18px] text-success-600">
                          {c}
                        </span>
                      </span>
                    ))}
                  </div>
                ))}
                <div className="flex gap-[7px] py-1">
                  <span className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-success-50 px-3 py-[10px]">
                    <CheckLineIcon className="h-5 w-5 text-success-600" />
                    <span className="text-sm font-semibold leading-[18px] text-success-600">
                      Non duplicate account
                    </span>
                  </span>
                  <span className="inline-flex h-[38px] items-center justify-center rounded-md bg-warning-50 px-3 py-[10px] text-sm font-semibold leading-[18px] text-warning-500">
                    Risk level: Low
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document upload */}
        <div className="px-5">
          <div className="flex flex-col justify-center gap-[10px] py-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
            <div className="flex w-full items-center py-[5px]">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Document Upload</h3>
            </div>
            <div className="flex items-center gap-5">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative flex h-[169px] w-[294px] items-center justify-center rounded-[10px] bg-[#EEF6F7]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTO.mapWide}
                    alt=""
                    className="h-[145px] w-[227px] rounded-[9px] object-cover opacity-50"
                  />
                  <button
                    type="button"
                    className="absolute flex h-[30px] items-center justify-center rounded-[7px] bg-white px-[10px] py-[7px] text-sm font-semibold leading-[17px] text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA]"
                  >
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-rule px-5 pb-[26px] pt-5">
          <button
            type="button"
            className="edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-6 text-gray-700"
          >
            <MessageIcon className="h-4 w-4 text-gray-700" />
            Request info
          </button>

          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-[3px] rounded-lg bg-success-800 py-[10px] pl-[6px] pr-4 text-sm font-semibold leading-6 text-gray-25"
            >
              <CheckIcon className="h-5 w-5 text-gray-25" />
              Approve
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center justify-center gap-[3px] rounded-lg bg-error-500 py-[10px] pl-[6px] pr-4 text-sm font-semibold leading-6 text-white"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
