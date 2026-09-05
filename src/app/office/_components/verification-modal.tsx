'use client';

import Link from 'next/link';
import { Avatar } from './avatar';
import { useAction } from './use-action';
import { officeHref, useOfficeBase } from '../_lib/office-path';
import { decideVerification } from '../_lib/actions';
import {
  CheckIcon,
  CloseIcon,
  MessageIcon,
  PendingIcon,
  UserGroupIcon,
  XMarkIcon
} from './icons';

/* Figma 907:19428 "Verification details popup" — 782x1049, radius 6.
   Header 58h, applicant strip 161h, then two sections separated by a 1px
   top hairline, and a sticky action bar. */

/**
 * The applicant under review. `documents` are signed URLs from the API; an
 * applicant who uploaded nothing gets the empty state rather than the design's
 * two placeholder cards.
 */
export type VerificationSubject = {
  id: string;
  reference: string;
  name: string;
  kind: string;
  status: string;
  submitted: string;
  city: string | null;
  documentType: string | null;
  avatarUrl: string | null;
  documents: string[];
};

const CHECKS = [
  ['Identity match', 'Document validity'],
  ['Government issued', 'Information match']
];

export function VerificationModal({
  open,
  subject,
  onClose
}: {
  open: boolean;
  subject: VerificationSubject | null;
  onClose: () => void;
}) {
  const { pending, error, run } = useAction();
  const base = useOfficeBase();

  if (!open || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Verification Center"
        className="flex max-h-full w-full max-w-[782px] flex-col overflow-auto rounded-md bg-white"
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
        <div className="flex flex-col gap-[19px] px-5 py-[10px] sm:flex-row sm:items-center">
          <div className="flex h-[141px] w-[149px] shrink-0 items-center justify-center rounded-md p-2 shadow-[inset_0_0_0_1px_rgba(238,238,238,0.52)]">
            <Avatar
              src={subject.avatarUrl}
              name={subject.name}
              size={125}
              rounded="4px"
              className="h-full w-full"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-[25px]">
            <div className="flex flex-col justify-center gap-[11px]">
              <div className="flex flex-col gap-[9px]">
                <span className="text-sm font-medium leading-5 text-gray-500">
                  Application ID: {subject.reference}
                </span>
                <span className="text-xl font-semibold leading-7 text-black">
                  {subject.name}
                </span>
              </div>

              <div className="flex items-center gap-[9px]">
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-rule px-3 py-1">
                  <UserGroupIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium leading-5 tracking-[-0.28px] text-gray-500">
                    {subject.kind}
                  </span>
                </span>
                <span className="inline-flex items-center justify-center gap-1 rounded-2xl bg-warning-50 px-3 py-[10px]">
                  <PendingIcon className="h-6 w-6" />
                  <span className="text-sm font-medium leading-5 text-warning-700">
                    {subject.status}
                  </span>
                </span>
              </div>

              <span className="text-sm font-medium leading-5 text-gray-500">
                Submitted {subject.submitted}
                {subject.city ? ` · ${subject.city}` : ''}
              </span>
            </div>
          </div>

          <Link
            href={`${officeHref(base, profileRoute(subject.kind))}?id=${subject.id}`}
            className="shrink-0 self-center text-base font-semibold leading-6 text-black underline"
          >
            View profile
          </Link>
        </div>

        {/* AI / System Check — Figma 907:19470 */}
        <div className="px-5">
          <div className="flex flex-col items-center gap-[10px] py-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
            <div className="flex w-full items-center py-[5px]">
              <h3 className="text-base font-semibold leading-6 text-gray-900">AI / System Check</h3>
            </div>

            <div className="flex w-full flex-col items-center gap-[34px] lg:flex-row">
              <div
                className="flex h-[154px] w-full shrink-0 items-center gap-[9px] rounded-[13px] px-[18px] py-[15px] lg:w-[291px]"
                style={{ background: 'linear-gradient(180deg, #3DC47E 0%, rgba(237,162,23,0.22) 100%)' }}
              >
                <div className="flex flex-1 flex-col gap-[30px]">
                  <div className="flex flex-col justify-center">
                    <span
                      className="bg-clip-text text-base font-bold leading-6 text-transparent"
                      style={{ backgroundImage: 'linear-gradient(90deg, #2F1A1A 0%, #E94B3E 100%)' }}
                    >
                      AI Verification Checker
                    </span>
                    <span className="text-xs font-medium leading-4 text-black">
                      Powered By SafeRoute AI
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-[13px]">
                    {/*
                      No document-checking model runs against these uploads, so
                      there is no score to show. Drawing the design's 60% would
                      be inventing the one number a reviewer would trust most.
                    */}
                    <span className="text-[40px] font-bold leading-[48px] text-success-950">
                      —
                    </span>
                    <span className="text-xs font-medium leading-4 text-success-950">
                      Automated checks
                      <br />
                      are not running yet
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <p className="max-w-[420px] text-sm font-normal leading-5 text-gray-500">
                  {CHECKS.flat().join(', ')} and duplicate-account detection are
                  the checks this panel is built for. Until they exist, the
                  decision below rests entirely on the documents and the
                  applicant&rsquo;s record.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Document upload */}
        <div className="px-5">
          <div className="flex flex-col justify-center gap-[10px] py-[14px] shadow-[inset_0_1px_0_0_#EEEEEE]">
            <div className="flex w-full items-center py-[5px]">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Document Upload
                {subject.documentType ? (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {subject.documentType.replace(/_/g, ' ')}
                  </span>
                ) : null}
              </h3>
            </div>

            {subject.documents.length === 0 ? (
              <p className="py-8 text-sm leading-5 text-gray-500">
                This applicant has not uploaded a document. Request one before
                deciding.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-5">
                {subject.documents.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative flex h-[169px] w-full max-w-[294px] items-center justify-center rounded-[10px] bg-[#EEF6F7]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Identity document"
                      className="h-[145px] w-[227px] rounded-[9px] object-cover opacity-50"
                    />
                    <span className="absolute flex h-[30px] items-center justify-center rounded-[7px] bg-white px-[10px] py-[7px] text-sm font-semibold leading-5 text-gray-700 shadow-[inset_0_0_0_1px_#D5D7DA]">
                      Preview
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-rule px-5 pb-[26px] pt-5">
          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-error-50 px-[14px] py-[10px] text-sm font-medium leading-5 text-error-700"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/*
              "Request info" would message the applicant, and there is no
              admin→user message endpoint. Rather than a button that silently
              does nothing, it is disabled and says why on hover.
            */}
            <button
              type="button"
              disabled
              title="Messaging an applicant from the dashboard is not built yet."
              className="edge-gray200 flex h-11 cursor-not-allowed items-center gap-2 rounded-lg bg-white px-[14px] py-[10px] text-sm font-medium leading-5 text-gray-400"
            >
              <MessageIcon className="h-4 w-4 text-gray-400" />
              Request info
            </button>

            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(() => decideVerification(subject.id, 'approved'), onClose)
                }
                className="flex h-11 items-center justify-center gap-[3px] rounded-lg bg-success-800 py-[10px] pl-[6px] pr-4 text-sm font-semibold leading-5 text-gray-25 disabled:opacity-60"
              >
                <CheckIcon className="h-5 w-5 text-gray-25" />
                {pending ? 'Working…' : 'Approve'}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(() => decideVerification(subject.id, 'rejected'), onClose)
                }
                className="flex h-11 items-center justify-center gap-[3px] rounded-lg bg-error-500 py-[10px] pl-[6px] pr-4 text-sm font-semibold leading-5 text-white disabled:opacity-60"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** An agency's detail screen is a different route from a person's. */
function profileRoute(kind: string): string {
  return kind === 'Individual' ? 'users/community' : 'users/agency';
}
