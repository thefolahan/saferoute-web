import Image from 'next/image';

type Alert = {
  src: string;
  label: string;
  position: string;
  focusDelay: string;
  floatDuration: string;
  floatDelay: string;
};

/**
 * Two drifting columns over a full-viewport map from sm up. On phones the
 * section is just the portrait plate — no viewport height of its own — so every
 * offset below is a share of that image and the cards stay inside its frame.
 */
const LEFT_COL = 'left-[9%] w-[26%] sm:left-[4%] sm:w-[33%] lg:left-[7%] lg:w-[22%]';
// Right-hand cards sit in the same mobile stack, so they need `top` on phones
// and have to hand back to `bottom` at sm.
const RIGHT_COL =
  'right-[9%] w-[26%] sm:right-[4%] sm:w-[33%] sm:top-auto lg:right-[7%] lg:w-[22%]';
const LEFT_ROWS = ['sm:top-0', 'sm:top-[27%]', 'sm:top-[54%]'];
const RIGHT_ROWS = ['sm:bottom-0', 'sm:bottom-[27%]', 'sm:bottom-[54%]'];
// Phones: all six alternate down one stack. A card is ~11% of the image tall,
// so a row every 15% leaves more clearance than the 14px float travel, and the
// last one ends at 90% — clear of the plate's bottom edge.
const MOBILE_ROWS = [
  'top-[4%]',
  'top-[19%]',
  'top-[34%]',
  'top-[49%]',
  'top-[64%]',
  'top-[79%]'
];

const ALERTS: Alert[] = [
  {
    src: '/images/landing/road-accident-alert.png',
    label: 'Road accident reported nearby',
    position: `${LEFT_COL} ${MOBILE_ROWS[0]} ${LEFT_ROWS[0]}`,
    focusDelay: '0s',
    floatDuration: '9s',
    floatDelay: '0s'
  },
  {
    src: '/images/landing/road-block-alert.png',
    label: 'Road block ahead',
    position: `${RIGHT_COL} ${MOBILE_ROWS[1]} ${RIGHT_ROWS[0]}`,
    focusDelay: '-4s',
    floatDuration: '10.5s',
    floatDelay: '-1s'
  },
  {
    src: '/images/landing/road-traffic-alert.png',
    label: 'Road traffic building up',
    position: `${LEFT_COL} ${MOBILE_ROWS[2]} ${LEFT_ROWS[1]}`,
    focusDelay: '-8s',
    floatDuration: '11s',
    floatDelay: '-2s'
  },
  {
    src: '/images/landing/flood-alert.png',
    label: 'Flood incident reported',
    position: `${RIGHT_COL} ${MOBILE_ROWS[3]} ${RIGHT_ROWS[1]}`,
    focusDelay: '-12s',
    floatDuration: '8.5s',
    floatDelay: '-3s'
  },
  {
    src: '/images/landing/police-harrassment-alert.png',
    label: 'Police harassment reported',
    position: `${LEFT_COL} ${MOBILE_ROWS[4]} ${LEFT_ROWS[2]}`,
    focusDelay: '-16s',
    floatDuration: '10s',
    floatDelay: '-5s'
  },
  {
    src: '/images/landing/unauthorized-checkpoint-alert.png',
    label: 'Unauthorized checkpoint spotted',
    position: `${RIGHT_COL} ${MOBILE_ROWS[5]} ${RIGHT_ROWS[2]}`,
    focusDelay: '-20s',
    floatDuration: '9.5s',
    floatDelay: '-6s'
  }
];

export function LiveAlerts() {
  return (
    <section
      aria-label="Live incident reports across the city"
      className="relative w-full overflow-hidden bg-[#0A0D12] sm:h-svh sm:min-h-[600px]"
    >
      {/* Phones: in flow, so the plate's own aspect ratio sets the section
          height and the absolutely-placed cards are measured against it. */}
      <Image
        src="/images/landing/live-alerts-section-mobile-view.png"
        alt=""
        width={804}
        height={968}
        sizes="100vw"
        className="h-auto w-full sm:hidden"
      />
      <Image
        src="/images/landing/map-section.png"
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover sm:block"
      />

      {ALERTS.map((alert) => (
        <div
          key={alert.src}
          className={`alert-float absolute ${alert.position}`}
          style={{
            animationDuration: alert.floatDuration,
            animationDelay: alert.floatDelay
          }}
        >
          <div
            className="alert-focus"
            style={{ animationDelay: alert.focusDelay }}
          >
            <Image
              src={alert.src}
              alt={alert.label}
              width={724}
              height={374}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 26vw"
              className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
