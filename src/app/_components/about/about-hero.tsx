import { SiteNav } from '../site-nav';

const STATS = [
  { value: '20k+', label: 'Processed for customers' },
  { value: '300K+', label: 'Processed for customers' },
  { value: '60%', label: 'Processed for customers' },
  { value: '$1B+', label: 'Processed for customers' }
] as const;

export function AboutHero() {
  return (
    <section className="relative flex min-h-screen flex-col bg-white">
      <SiteNav theme="light" />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-6 pb-16 pt-[104px] sm:px-10 lg:flex-1 lg:justify-center lg:px-20 lg:pt-[120px]">
        <div className="flex flex-col items-center text-center">
          <p className="text-[16px] font-medium uppercase leading-6 tracking-[-0.02em] text-[#717680]">
            About us
          </p>
          <h1 className="mt-4 max-w-[760px] text-[32px] font-medium leading-[40px] tracking-[-0.02em] text-[#0A0D12] sm:text-[56px] sm:leading-[62px] lg:text-[72px] lg:leading-[79px]">
            We are helping people travel with confidence.
          </h1>
          <p className="mt-4 max-w-[680px] text-[14px] font-normal leading-6 text-[#717680] sm:text-[16px]">
            SafeRoute provides real-time road intelligence that helps travelers
            avoid delays, navigate disruptions, and make smarter decisions before
            they hit the road.
          </p>
          <a
            href="/coming-soon"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#181D27] px-8 py-3.5 text-[16px] font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] transition-opacity hover:opacity-90"
          >
            Download App
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 overflow-hidden rounded-[17px] border border-[#D5D7DA] lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`px-6 py-7 sm:px-[42px] sm:py-[30px] ${
                i % 2 === 1 ? 'border-l border-[#D5D7DA]' : ''
              } ${i >= 2 ? 'border-t border-[#D5D7DA] lg:border-t-0' : ''} ${
                i % 4 !== 0 ? 'lg:border-l lg:border-[#D5D7DA]' : ''
              }`}
            >
              <p className="text-[32px] font-semibold leading-none tracking-[-0.02em] text-[#0A0D12] sm:text-[48px]">
                {stat.value}
              </p>
              <p className="mt-3 text-[12px] font-normal leading-5 tracking-[-0.02em] text-[#717680] sm:text-[14px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
