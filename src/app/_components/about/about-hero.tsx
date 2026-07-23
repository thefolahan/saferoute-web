import { SiteNav } from '../site-nav';
import { AboutStats } from './about-stats';

export function AboutHero() {
  return (
    <section className="relative flex min-h-screen flex-col bg-white">
      <SiteNav theme="light" />

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-6 pb-16 pt-[104px] sm:px-10 lg:px-20 lg:pt-[120px]">
        <div className="flex flex-col items-center text-center">
          <p className="text-[16px] font-medium uppercase leading-6 tracking-[-0.02em] text-[#717680]">
            About us
          </p>
          <h1 className="mt-4 max-w-[760px] text-[32px] font-medium leading-[40px] tracking-[-0.02em] text-[#0A0D12] sm:text-[56px] sm:leading-[62px] lg:text-[72px] lg:leading-[79px]">
            We are helping people travel with confidence.
          </h1>
          <p className="mt-4 max-w-[720px] text-[14px] font-normal leading-6 text-[#717680] sm:text-[16px]">
            SafeRoute is Africa's road intelligence platform, helping people
            travel with confidence. We turn scattered, hard-to-verify safety
            chatter into real-time, community-verified road intelligence, so you
            know what's happening on your route before you set out, not after
            you are stuck in it.
          </p>
          <a
            href="/coming-soon"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#181D27] px-8 py-3.5 text-[16px] font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] transition-opacity hover:opacity-90"
          >
            Get the App
          </a>
        </div>

        <AboutStats />
      </div>
    </section>
  );
}
