'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Reveal } from '../reveal';
import { FAQS } from '../../_lib/faq';

const AVATAR_LEFT = '/images/landing/346-10252.png';
const AVATAR_RIGHT = '/images/landing/346-10253.png';
const AVATAR_CENTER = '/images/landing/346-10254.png';

function Icon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="shrink-0 text-gray-400"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
      {!open && <line x1="12" y1="8" x2="12" y2="16" />}
    </svg>
  );
}

export function Faq({
  showContact = true,
  fullHeight = true
}: {
  /** Show the "Still have questions?" contact card below the list. */
  showContact?: boolean;
  /** Fill the viewport (home) vs. sit inline in the flow (help-center). */
  fullHeight?: boolean;
} = {}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className={`flex flex-col justify-center bg-white ${
        fullHeight ? 'min-h-screen' : ''
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-8 py-24">
        <Reveal as="header" className="flex max-w-[768px] flex-col items-center gap-5 text-center">
          <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-gray-950">
            Frequently asked questions
          </h2>
          <p className="text-[20px] leading-[30px] text-gray-600">
            Everything you need to know about the product and billing.
          </p>
        </Reveal>

        <div className="flex w-full max-w-[768px] flex-col gap-8">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal
                key={i}
                delay={i * 70}
                y={18}
                className={i === 0 ? '' : 'border-t border-gray-200 pt-6'}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-4 text-left"
                >
                  <span className="flex flex-1 flex-col">
                    <span className="text-[16px] font-semibold leading-[24px] text-gray-900">
                      {item.q}
                    </span>
                    {/* The answer stays mounted and is collapsed with CSS rather
                        than removed from the tree. Unmounting it left five of the
                        six answers out of the HTML entirely, so a crawler reading
                        the page — and the FAQPage structured data that claims
                        these answers are on it — saw only the first one. */}
                    <span
                      className={`grid transition-[grid-template-rows] duration-200 ${
                        open ? 'grid-rows-[1fr] pt-1' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block text-[16px] leading-[24px] text-gray-600">
                          {item.a}
                        </span>
                      </span>
                    </span>
                  </span>
                  <Icon open={open} />
                </button>
              </Reveal>
            );
          })}
        </div>

        {showContact && (
        <Reveal className="flex w-full flex-col items-center gap-8 rounded-2xl bg-gray-50 px-8 pb-10 pt-8">
          <div className="relative h-14 w-[120px]">
            <Image
              src={AVATAR_LEFT}
              alt=""
              width={48}
              height={48}
              className="absolute left-0 top-2 z-0 h-12 w-12 rounded-full object-cover ring-[1.5px] ring-white"
            />
            <Image
              src={AVATAR_RIGHT}
              alt=""
              width={48}
              height={48}
              className="absolute left-[72px] top-2 z-0 h-12 w-12 rounded-full object-cover ring-[1.5px] ring-white"
            />
            <Image
              src={AVATAR_CENTER}
              alt=""
              width={56}
              height={56}
              className="absolute left-8 top-0 z-10 h-14 w-14 rounded-full object-cover ring-[1.5px] ring-white"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-[20px] font-semibold leading-[30px] text-gray-900">
              Still have questions?
            </h3>
            <p className="text-[18px] leading-[28px] text-gray-600">
              Can’t find the answer you’re looking for? Please chat to our friendly team.
            </p>
          </div>

          <Link
            href="/help-center"
            className="inline-flex items-center justify-center rounded-full bg-gray-800 px-[18px] py-3 text-[16px] font-semibold leading-6 text-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]"
          >
            Get in touch
          </Link>
        </Reveal>
        )}
      </div>
    </section>
  );
}
