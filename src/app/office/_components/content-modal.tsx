'use client';

import { CarIcon, CheckIcon, CloseIcon, XMarkIcon } from './icons';
import { useAction } from './use-action';
import { setContentStatus } from '../_lib/actions';

/* Figma 907:17084 — the "View Details" sheet on Feed & contents.
   723x1049 radius 6: header 168h pad 30/20, a media grid (1 large + 2 stacked,
   the last dimmed under an "n+" overlay), then the incident detail. */

export type ContentDetail = {
  id: string;
  caption: string;
  author: string;
  city: string | null;
  status: string;
  posted: string;
  /** The linked incident, where the post was filed against one. */
  incident: {
    publicId: string;
    title: string;
    category: string;
    city: string;
    addressText: string | null;
  } | null;
  media: { id: string; url: string | null }[];
};

const STATUS_TONE: Record<string, string> = {
  published: 'bg-success-50 text-success-700',
  pending_review: 'bg-rule text-gray-600',
  rejected: 'bg-error-50 text-error-700',
  removed: 'bg-warning-50 text-warning-700'
};

export function ContentModal({
  open,
  detail,
  onClose
}: {
  open: boolean;
  detail: ContentDetail | null;
  onClose: () => void;
}) {
  const { pending, error, run } = useAction();

  if (!open || !detail) return null;

  const shown = detail.media.filter((item) => item.url).slice(0, 3);
  const overflow = detail.media.length - shown.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Incident Detail"
        className="flex max-h-full w-full max-w-[723px] flex-col overflow-auto rounded-md bg-white"
      >
        <div className="edge flex shrink-0 items-center gap-[7px] px-5 py-[30px]">
          <div className="flex flex-1 items-center py-2">
            <div className="flex flex-1 flex-col gap-[9px]">
              <div className="flex flex-wrap gap-[9px]">
                {detail.incident ? (
                  <span className="inline-flex items-center justify-center rounded-2xl bg-error-50 px-3 py-1 text-xs font-medium capitalize leading-4 text-error-700">
                    {detail.incident.category.replace(/_/g, ' ')}
                  </span>
                ) : null}
                <span
                  className={`inline-flex items-center rounded-2xl py-1 pl-[9px] pr-3 text-xs font-medium capitalize leading-4 ${
                    STATUS_TONE[detail.status] ?? STATUS_TONE.pending_review
                  }`}
                >
                  {detail.status.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-base font-semibold leading-6 text-gray-900">
                Posted by {detail.author}
              </p>

              <div className="flex flex-wrap gap-[5px] text-xs font-normal leading-4 tracking-[-0.24px] text-gray-500">
                {detail.incident ? <span>{detail.incident.publicId}</span> : null}
                {detail.incident ? <span aria-hidden>•</span> : null}
                <span>{detail.city ?? detail.incident?.city ?? 'Location not set'}</span>
                <span aria-hidden>•</span>
                <span>{detail.posted}</span>
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
          {shown.length === 0 ? (
            <div className="flex h-[180px] items-center justify-center rounded bg-[#F4F4F4] text-sm leading-5 text-gray-500">
              This post has no photographs.
            </div>
          ) : (
            <div className="flex h-[410px] gap-[9px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shown[0]!.url!}
                alt=""
                className="h-full w-0 flex-1 rounded object-cover"
              />
              {shown.length > 1 ? (
                <div className="flex w-0 flex-1 flex-col justify-center gap-[9px]">
                  {shown.slice(1).map((item, index) => {
                    const isLast = index === shown.length - 2;
                    const dim = isLast && overflow > 0;

                    return (
                      <div key={item.id} className="relative min-h-0 flex-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url!}
                          alt=""
                          className={`h-full w-full rounded object-cover ${
                            dim ? 'brightness-[0.33]' : ''
                          }`}
                        />
                        {dim ? (
                          <span className="absolute inset-0 flex items-center justify-center text-[70px] font-semibold leading-none text-white">
                            {overflow}+
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-[10px] flex flex-col items-center pt-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
            <div className="flex w-full items-center gap-[18px] py-[5px]">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                {detail.incident ? 'Incident Detail' : 'Post'}
              </h2>
            </div>

            <div className="flex w-full flex-col gap-[7px] py-1">
              <div className="flex gap-5 py-2">
                <div className="flex h-[49px] w-[49px] shrink-0 items-center justify-center rounded-[35px] bg-rule px-[3px] py-[7px]">
                  <CarIcon className="h-[35px] w-[43px]" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {detail.incident?.title ?? 'Community post'}
                  </h3>
                  <p className="text-base font-normal leading-6 tracking-[-0.3px] text-gray-500">
                    {detail.caption}
                  </p>
                </div>
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="w-full rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
              >
                {error}
              </p>
            ) : null}

            {/* The decision the screen exists to take (Figma 907:16496). */}
            <div className="flex w-full flex-wrap items-center justify-center gap-[10px] py-[18px]">
              <button
                type="button"
                disabled={pending || detail.status === 'published'}
                onClick={() => run(() => setContentStatus(detail.id, 'published'), onClose)}
                className="flex h-11 items-center justify-center gap-[3px] rounded-lg bg-success-800 py-[10px] pl-[6px] pr-4 text-sm font-semibold leading-5 text-gray-25 disabled:opacity-50"
              >
                <CheckIcon className="h-5 w-5 text-gray-25" />
                {detail.status === 'published' ? 'Verified' : 'Verify post'}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => setContentStatus(detail.id, 'rejected'), onClose)}
                className="flex h-11 items-center justify-center gap-[3px] rounded-lg bg-error-500 py-[10px] pl-[6px] pr-4 text-sm font-semibold leading-5 text-white disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
                Reject
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => setContentStatus(detail.id, 'removed'), onClose)}
                className="edge-gray200 flex h-11 items-center justify-center rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-700 disabled:opacity-50"
              >
                Take down
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
