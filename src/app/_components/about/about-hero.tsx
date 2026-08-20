import { Reveal } from '../reveal';
import { SiteNav } from '../site-nav';
import { AboutStats } from './about-stats';

export function AboutHero() {
  return (
    <section className="relative flex min-h-screen flex-col bg-white">
      <SiteNav active="About" theme="light" />

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-6 pb-16 pt-[104px] sm:px-10 lg:px-20 lg:pt-[120px]">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="text-[16px] font-medium uppercase leading-6 tracking-[-0.02em] text-[#717680]">
            About us
          </Reveal>
          <Reveal as="h1" delay={90} className="mt-4 max-w-[760px] text-[32px] font-medium leading-[40px] tracking-[-0.02em] text-[#0A0D12] sm:text-[56px] sm:leading-[62px] lg:text-[72px] lg:leading-[79px]">
            We are helping people move with confidence.
          </Reveal>
          <Reveal as="p" delay={180} className="mt-4 max-w-[720px] text-[14px] font-normal leading-6 text-[#717680] sm:text-[16px]">
            The warnings that matter most, a blocked road, a flooded junction,
            an incident two streets ahead, are scattered across group chats and
            usually arrive too late to be useful. SafeRoute gathers them in one
            place, checks them, and puts them on a map while they still change
            your decision.
          </Reveal>
          <Reveal
            as="a"
            delay={270}
            href="/download"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#181D27] px-8 py-3.5 text-[16px] font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] transition-opacity hover:opacity-90"
          >
            Get the App
          </Reveal>
        </div>

        <AboutStats />
      </div>
    </section>
  );
}
