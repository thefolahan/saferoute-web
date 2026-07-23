import Image from 'next/image';

const STEPS = [
  {
    n: 1,
    img: '/images/landing/486-18468.png',
    title: 'Report an Incident',
    body: 'Spot an incident? Share it with the community using a photo, video, live broadcast, or a quick update.',
  },
  {
    n: 2,
    img: '/images/landing/489-20306.png',
    title: 'Verified by the Community',
    body: "Nearby users help confirm reports, while SafeRoute combines community confirmations, to determine what's happening in real time.",
  },
  {
    n: 3,
    img: '/images/landing/489-20308.png',
    title: 'Travel with Confidence',
    body: 'View safer routes, receive live alerts, and share your journey with your Safety Circle so the people who matter most stay informed.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="flex min-h-screen scroll-mt-20 flex-col justify-center bg-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 py-16 sm:px-10 lg:gap-16 lg:px-20 lg:py-24">
        <header className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-[32px] font-medium leading-[40px] tracking-tightest text-gray-950 sm:text-[48px] sm:leading-[60px]">
            How SafeRoute works
          </h2>
          <p className="max-w-[640px] text-[18px] leading-[28px] text-[#666668]">
            A seamless cycle of community input, algorithmic analysis, and verified safety outcomes.
          </p>
        </header>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          {STEPS.map((step) => (
            <div key={step.n} className="flex flex-col gap-5">
              <div className="relative aspect-[363/480] w-full overflow-hidden rounded-2xl">
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  sizes="363px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200">
                  <span className="text-[14px] font-bold leading-[17px] text-gray-900">
                    {step.n}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold leading-[28px] text-gray-950">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[20px] text-gray-500">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
