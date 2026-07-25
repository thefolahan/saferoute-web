import Image from 'next/image';

/* A full-viewport aerial map with six report cards floating over it — three
   down each side, the left stack hanging from the top edge and the right stack
   rising from the bottom. Each card drifts on its own loop and takes its turn
   at full opacity, so the section reads as a live feed rather than a static
   collage. Every position is a percentage of the section, which keeps the
   layout intact at any viewport size. */
type Alert = {
  src: string;
  label: string;
  /* Column inset and width per breakpoint, plus the row anchor. */
  position: string;
  /* Offset into the shared 24s cycle at which this card lights up. */
  focusDelay: string;
  /* Drift loop — varied so no two cards bob in lockstep. */
  floatDuration: string;
  floatDelay: string;
};

/* Column insets, sized so the outer margin and the channel between the two
   columns stay balanced and the centre of the map stays clear. The left column
   is anchored to the top of the section and runs down; the right column is
   anchored to the bottom and runs up, so the two stacks are offset from each
   other rather than sitting in matched rows. */
const LEFT_COL = 'left-[1%] w-[45%] sm:left-[4%] sm:w-[33%] lg:left-[7%] lg:w-[22%]';
const RIGHT_COL =
  'right-[1%] w-[45%] sm:right-[4%] sm:w-[33%] lg:right-[7%] lg:w-[22%]';
const LEFT_ROWS = ['top-0', 'top-[27%]', 'top-[54%]'];
const RIGHT_ROWS = ['bottom-0', 'bottom-[27%]', 'bottom-[54%]'];

const ALERTS: Alert[] = [
  {
    src: '/images/landing/road-accident-alert.png',
    label: 'Road accident reported nearby',
    position: `${LEFT_COL} ${LEFT_ROWS[0]}`,
    focusDelay: '0s',
    floatDuration: '9s',
    floatDelay: '0s'
  },
  {
    src: '/images/landing/road-block-alert.png',
    label: 'Road block ahead',
    position: `${RIGHT_COL} ${RIGHT_ROWS[0]}`,
    focusDelay: '-4s',
    floatDuration: '10.5s',
    floatDelay: '-1s'
  },
  {
    src: '/images/landing/road-traffic-alert.png',
    label: 'Road traffic building up',
    position: `${LEFT_COL} ${LEFT_ROWS[1]}`,
    focusDelay: '-8s',
    floatDuration: '11s',
    floatDelay: '-2s'
  },
  {
    src: '/images/landing/flood-alert.png',
    label: 'Flood incident reported',
    position: `${RIGHT_COL} ${RIGHT_ROWS[1]}`,
    focusDelay: '-12s',
    floatDuration: '8.5s',
    floatDelay: '-3s'
  },
  {
    src: '/images/landing/police-harrassment-alert.png',
    label: 'Police harassment reported',
    position: `${LEFT_COL} ${LEFT_ROWS[2]}`,
    focusDelay: '-16s',
    floatDuration: '10s',
    floatDelay: '-5s'
  },
  {
    src: '/images/landing/unauthorized-checkpoint-alert.png',
    label: 'Unauthorized checkpoint spotted',
    position: `${RIGHT_COL} ${RIGHT_ROWS[2]}`,
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
      <Image
        src="/images/landing/map-section.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
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
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 46vw"
              className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
