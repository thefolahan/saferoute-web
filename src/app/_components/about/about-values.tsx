import { BadgeCheck, Shield, Siren, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * "What We Stand For" — light section (#F6FBFF). A left heading + subtitle beside
 * a 2×2 grid of principle cards (from the About copy pack).
 */
const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BadgeCheck,
    title: 'Verified, not viral',
    body: "Nothing is presented as fact until it has been checked. Every report carries its status openly: reported, under review, or verified."
  },
  {
    icon: Siren,
    title: "Inform, don't alarm",
    body: 'We surface risk so people can avoid it. We do not publish anything that invites panic, vigilantism, profiling, or doxxing.'
  },
  {
    icon: Shield,
    title: 'Privacy by design',
    body: 'Your precise location never leaves your device unnecessarily. Sensitive incidents are pinned to an area, not a doorstep.'
  },
  {
    icon: Users,
    title: 'Better with every voice',
    body: 'A single report is a signal. Three people confirming it with photos and updates is something you can act on.'
  }
];

export function AboutValues() {
  return (
    <section className="bg-[#F6FBFF] py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 sm:px-10 lg:grid-cols-3 lg:gap-16 lg:px-20">
        <div className="lg:col-span-1">
          <h2 className="whitespace-nowrap text-center text-[30px] font-medium leading-[40px] tracking-tightest text-gray-950 sm:text-[48px] sm:leading-[60px] lg:text-left">
            What We{' '}
            {/* Desktop breaks the heading onto two lines; below lg it stays on
                one (whitespace-nowrap above keeps it from wrapping mid-phrase).
                `lg:inline` rather than `lg:block` — a br with display:block
                stops producing a line break in some browsers. */}
            <br className="hidden lg:inline" />
            Stand For
          </h2>
          <p className="mx-auto mt-5 max-w-[420px] text-center text-[18px] leading-[28px] text-gray-600 lg:mx-0 lg:text-left">
            The rules we hold ourselves to, and the ones that decide what makes
            it onto your map.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(16,24,40,0.06)] ring-1 ring-black/[0.03]"
            >
              <Icon className="h-10 w-10 text-gray-950" strokeWidth={1.75} />
              <h3 className="mt-8 text-[20px] font-semibold leading-[30px] text-gray-950">
                {title}
              </h3>
              <p className="mt-3 text-[16px] leading-[24px] text-gray-600">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
