import Image from 'next/image';

/* Six report cards float over the aerial map, three down each side. Each one
   drifts on its own loop and takes its turn at full opacity, so the section
   reads as a live feed rather than a static collage. Positions are percentages
   of the map frame, which keeps every card pinned to the same spot on the
   photo at any width. Cards alternate left/right down the screen on mobile,
   where two side-by-side columns would not fit. */
type Alert = {
  src: string;
  label: string;
  /* Where the card sits on the map, per breakpoint. */
  position: string;
  /* Seconds into the shared 24s cycle at which this card lights up. */
  focusDelay: string;
  /* Drift loop — varied so no two cards bob in lockstep. */
  floatDuration: string;
  floatDelay: string;
};

const ALERTS: Alert[] = [
  {
    src: '/images/landing/road-accident-alert.png',
    label: 'Road accident reported nearby',
    position:
      'left-[1.5%] top-[2%] w-[50%] sm:left-[3%] sm:top-[8%] sm:w-[32%] lg:left-[6%] lg:top-[16%] lg:w-[21%]',
    focusDelay: '0s',
    floatDuration: '9s',
    floatDelay: '0s'
  },
  {
    src: '/images/landing/road-traffic-alert.png',
    label: 'Road traffic building up',
    position:
      'left-[1.5%] top-[28%] w-[50%] sm:left-[1%] sm:top-[40%] sm:w-[32%] lg:left-[4%] lg:top-[41%] lg:w-[21%]',
    focusDelay: '-8s',
    floatDuration: '11s',
    floatDelay: '-2s'
  },
  {
    src: '/images/landing/police-harrassment-alert.png',
    label: 'Police harassment reported',
    position:
      'left-[1.5%] top-[54%] w-[50%] sm:left-[3%] sm:top-[71%] sm:w-[32%] lg:left-[6%] lg:top-[66%] lg:w-[21%]',
    focusDelay: '-16s',
    floatDuration: '10s',
    floatDelay: '-5s'
  },
  {
    src: '/images/landing/road-block-alert.png',
    label: 'Road block ahead',
    position:
      'right-[1.5%] top-[15%] w-[50%] sm:right-[1%] sm:top-[20%] sm:w-[32%] lg:right-[4%] lg:top-[26%] lg:w-[21%]',
    focusDelay: '-4s',
    floatDuration: '10.5s',
    floatDelay: '-1s'
  },
  {
    src: '/images/landing/flood-alert.png',
    label: 'Flood incident reported',
    position:
      'right-[1.5%] top-[41%] w-[50%] sm:right-[3%] sm:top-[52%] sm:w-[32%] lg:right-[6%] lg:top-[52%] lg:w-[21%]',
    focusDelay: '-12s',
    floatDuration: '8.5s',
    floatDelay: '-3s'
  },
  {
    src: '/images/landing/unauthorized-checkpoint-alert.png',
    label: 'Unauthorized checkpoint spotted',
    position:
      'right-[1.5%] top-[67%] w-[50%] sm:right-[1%] sm:top-[80%] sm:w-[32%] lg:right-[4%] lg:top-[76%] lg:w-[21%]',
    focusDelay: '-20s',
    floatDuration: '9.5s',
    floatDelay: '-6s'
  }
];

export function LiveAlerts() {
  return (
    <section
      aria-label="Live incident reports across the city"
      className="relative w-full overflow-hidden bg-[#0A0D12]"
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[3/2] lg:aspect-[9/5]">
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
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
