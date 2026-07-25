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
 * Two drifting columns from sm up. Phones are too narrow for that: at 45% the
 * card art renders under a quarter of its design size and the report text is
 * unreadable, so below sm the cards become one wide alternating stack and the
 * two least-distinct reports drop out to make room.
 */
const LEFT_COL = 'left-[4%] w-[50%] sm:w-[33%] lg:left-[7%] lg:w-[22%]';
// Right-hand cards sit in the same mobile stack, so they need `top` on phones
// and have to hand back to `bottom` at sm.
const RIGHT_COL =
  'right-[4%] w-[50%] sm:w-[33%] sm:top-auto lg:right-[7%] lg:w-[22%]';
const LEFT_ROWS = ['sm:top-0', 'sm:top-[27%]', 'sm:top-[54%]'];
const RIGHT_ROWS = ['sm:bottom-0', 'sm:bottom-[27%]', 'sm:bottom-[54%]'];
// Phones: all six in one alternating stack, a card every 16% so none collide
// while they float (a card is ~15% tall at the 600px minimum height).
const MOBILE_ROWS = [
  'top-[1%]',
  'top-[17%]',
  'top-[33%]',
  'top-[49%]',
  'top-[65%]',
  'top-[81%]'
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
      className="relative h-svh min-h-[600px] w-full overflow-hidden bg-[#0A0D12]"
    >
      {/* Portrait crop of the interchange for phones; the wide plate from sm up,
          where object-cover would otherwise throw most of it away. */}
      <Image
        src="/images/landing/live-alerts-section-mobile-view.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover sm:hidden"
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
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 68vw"
              className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
