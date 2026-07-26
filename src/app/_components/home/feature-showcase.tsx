import Image from 'next/image';

const FEATURES = [
  {
    title: 'Community Feed',
    description:
      'Stay informed with real-time updates and community-reported events directly on your path. From traffic anomalies to verified security alerts, nearby Lagos residents keep your route mapped perfectly.',
    image: '/images/landing/Community-Feed.png'
  },
  {
    title: 'Route Safety Score',
    description:
      'We analyze historical trend data, local community flags, and real-time reports to give each path a dynamic Safety Score before you step out. Get optimal recommendations and bypass hot zones seamlessly.',
    image: '/images/landing/Route-Safety-Score.png'
  },
  {
    title: 'Live Broadcasts',
    description:
      'Go live from the road and show the community exactly what you are seeing. Viewers nearby watch, comment, and confirm as it unfolds, turning a single report into shared awareness for everyone headed your way.',
    image: '/images/landing/Live-Broadcasts.png'
  },
  {
    title: 'Safety Circle',
    description:
      'Create an active digital safety team. Securely share your live route with family or chosen emergency contacts. SafeRoute alerts them instantly if you deviate from your path or trigger an SOS signal.',
    image: '/images/landing/Safety-Circle.png'
  }
] as const;

export function FeatureShowcase() {
  return (
    <section className="bg-[#FDFDFD]">
      {/* Extra headroom up top: the hero's phone hangs over this section. On
          mobile that overhang is half the phone — the min() below mirrors the
          negative margin in Hero, so the two stay in step. */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 py-16 pt-[calc(min(88vw,352px)+3rem)] sm:px-10 sm:pt-28 lg:gap-20 lg:px-20 lg:py-24 lg:pt-36">
        <header className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-[30px] font-medium leading-[38px] tracking-tightest text-[#0A0D12] sm:text-[48px] sm:leading-[60px]">
            Navigate with
            {/* Two lines while the column is narrow, one from lg up. */}
            <br className="lg:hidden" /> absolute confidence
          </h2>
          <p className="max-w-[640px] text-[16px] font-normal leading-6 text-[#666668] sm:text-[18px] sm:leading-[28px] lg:max-w-none">
            SafeRoute provides 360-degree security tools designed specifically
            for urban African commutes.
          </p>
        </header>

        <div className="flex w-full flex-col gap-14 lg:gap-24">
          {FEATURES.map((feature, i) => (
            /* Rows alternate: image right on the first, left on the next, and
               so on down. Below lg they all stack image-then-text. */
            <article
              key={feature.title}
              className={`flex flex-col items-center gap-8 lg:gap-16 ${
                i % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              <div className="relative aspect-[1502/1120] w-full max-w-[480px] shrink-0 overflow-hidden rounded-[32px] bg-gray-200 lg:max-w-none lg:flex-1">
                <Image
                  src={feature.image}
                  alt={`SafeRoute ${feature.title}`}
                  width={1502}
                  height={1120}
                  sizes="(min-width: 1024px) 600px, (min-width: 640px) 480px, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="w-full max-w-[480px] lg:max-w-none lg:flex-1">
                <h3 className="text-[22px] font-semibold leading-[30px] text-[#101828] sm:text-[28px] sm:leading-[38px]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[16px] font-normal leading-[26px] text-gray-500 sm:text-[18px] sm:leading-[30px]">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
