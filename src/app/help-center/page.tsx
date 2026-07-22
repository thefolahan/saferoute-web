import type { Metadata } from 'next';
import { SiteNav } from '../_components/site-nav';
import { SiteFooter } from '../_components/site-footer';
import { WaitlistForm } from '../_components/waitlist/waitlist-form';

export const metadata: Metadata = {
  title: 'Help Center'
};

export default function HelpCenterPage() {
  return (
    <main id="top" className="flex flex-col lg:h-screen lg:overflow-hidden">
      <section className="relative flex flex-1 flex-col bg-white">
        <SiteNav theme="light" />
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16 pt-28 text-center sm:px-10">
          <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-[#0A0D12] sm:text-[58px] sm:leading-[68px]">
            Need some help?
          </h1>
          <WaitlistForm variant="row" placeholder="Enter your email..." width={520} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
