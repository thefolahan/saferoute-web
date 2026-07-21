import { SiteNav } from '../site-nav';

const STATS = [
  { value: '20k+', label: 'Processed for customers' },
  { value: '300K+', label: 'Processed for customers' },
  { value: '60%', label: 'Processed for customers' },
  { value: '$1B+', label: 'Processed for customers' }
] as const;

export function AboutHero() {
  return (
    <section className="relative min-h-screen bg-white">
      <SiteNav theme="light" />

      <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-[120px] sm:px-10 md:px-20">
        <div className="flex flex-col items-center text-center">
          <p className="text-[16px] font-medium uppercase leading-6 tracking-[0.08em] text-gray-500">
            About us
          </p>
          <h1 className="mt-5 max-w-[820px] text-[44px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0A0D12] sm:text-[56px] lg:text-[72px] lg:leading-[86px]">
            We&apos;re helping people<br className="hidden lg:block" /> travel with
            confidence.
          </h1>
          <p className="mt-6 max-w-[820px] text-[18px] font-normal leading-7 text-gray-500">
            SafeRoute provides real-time road intelligence that helps travelers
            avoid delays, navigate disruptions, and make smarter decisions before
            they hit the road.
          </p>
          <a
            href="#download"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#181D27] px-8 py-3.5 text-[16px] font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] transition-opacity hover:opacity-90"
          >
            Download App
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`px-6 py-7 sm:px-8 ${
                i % 2 === 1 ? 'border-l border-gray-200' : ''
              } ${i >= 2 ? 'border-t border-gray-200 lg:border-t-0' : ''} ${
                i % 4 !== 0 ? 'lg:border-l lg:border-gray-200' : ''
              }`}
            >
              <p className="text-[34px] font-bold leading-none tracking-[-0.02em] text-gray-950 sm:text-[40px] lg:text-[48px]">
                {stat.value}
              </p>
              <p className="mt-3 text-[16px] font-normal leading-6 text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
