'use client';

import Image from 'next/image';
import { useState } from 'react';

const FAQS = [
  {
    q: 'Is SafeRoute free to use?',
    a: 'Yes, SafeRoute offers a free plan with core navigation and safety alerts. For advanced features like real-time crime data, offline maps, and family tracking, upgrade to SafeRoute Pro.',
  },
  {
    q: 'How does SafeRoute determine safe routes?',
    a: 'SafeRoute analyzes verified community reports, historical incident data, and real-time alerts to score each route and recommend the safest path to your destination.',
  },
  {
    q: 'Does SafeRoute work offline?',
    a: "Core navigation and previously downloaded maps work offline. Real-time alerts and community reports require a connection and sync automatically once you're back online.",
  },
  {
    q: 'Can I share my live location with family?',
    a: 'Yes. Add trusted contacts to your Safety Circle to share your live journey, ETA, and location so the people who matter most stay informed.',
  },
  {
    q: 'Which cities does SafeRoute support?',
    a: 'SafeRoute currently supports major cities across Nigeria, with new regions being added regularly based on community demand.',
  },
  {
    q: 'How do I report an unsafe area?',
    a: 'Tap the report button, choose the incident type, and add a photo, video, or quick note. Your report is shared with nearby users and verified by the community.',
  },
];

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

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-16 px-8 py-24">
        <header className="flex max-w-[768px] flex-col items-center gap-5 text-center">
          <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-gray-950">
            Frequently asked questions
          </h2>
          <p className="text-[20px] leading-[30px] text-gray-600">
            Everything you need to know about the product and billing.
          </p>
        </header>

        <div className="flex w-full max-w-[768px] flex-col gap-8">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className={i === 0 ? '' : 'border-t border-gray-200 pt-6'}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-4 text-left"
                >
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-[16px] font-semibold leading-[24px] text-gray-900">
                      {item.q}
                    </span>
                    {open && (
                      <span className="text-[16px] leading-[24px] text-gray-600">{item.a}</span>
                    )}
                  </span>
                  <Icon open={open} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col items-center gap-8 rounded-2xl bg-gray-50 px-8 pb-10 pt-8">
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

          <button
            type="button"
            className="rounded-full bg-gray-800 px-[18px] py-3 text-[16px] font-semibold leading-6 text-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]"
          >
            Get in touch
          </button>
        </div>
      </div>
    </section>
  );
}
