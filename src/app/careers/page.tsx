import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers'
};

/**
 * Careers — same UI as the enterprise waitlist page (light, brand orbs, logo-left
 * + back-right header), with a "no open roles" message.
 */
export default function CareersPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-24 h-[380px] w-[440px] rounded-full bg-[#F9C5D1] opacity-30 blur-[100px] sm:h-[500px] sm:w-[600px] sm:opacity-40" />
        <div className="absolute -right-40 -top-20 h-[420px] w-[480px] rounded-full bg-[#C4B5FD] opacity-30 blur-[100px] sm:h-[600px] sm:w-[700px] sm:opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[440px] -translate-x-1/2 rounded-full bg-[#FBCFE8] opacity-25 blur-[100px] sm:h-[400px] sm:w-[500px] sm:opacity-30" />
      </div>

      <div className="relative flex min-h-screen w-full flex-col">
        <header className="relative z-10 flex h-[73px] items-center px-6 sm:h-[88px] sm:px-12">
          <Link
            href="/"
            className="absolute left-6 text-[13px] font-medium leading-4 text-gray-500 transition-opacity hover:opacity-70 sm:hidden"
          >
            Back
          </Link>
          <div className="mx-auto flex items-center gap-1 sm:mx-0">
            <Image
              src="/images/landing/logo-mark-dark.png"
              alt="SafeRoute"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-[22px] font-medium leading-[29px] tracking-[-0.03em] text-[#1C1C1C] sm:text-[24px]">
              SafeRoute
            </span>
          </div>
          <Link
            href="/"
            className="ml-auto hidden text-[13px] font-medium leading-4 text-gray-500 transition-opacity hover:opacity-70 sm:block"
          >
            Back to SafeRoute
          </Link>
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 text-center">
          <h1 className="text-[34px] font-bold leading-[42px] tracking-[-0.02em] text-[#0A0D12] sm:text-[60px] sm:leading-[68px]">
            Careers
          </h1>
          <p className="max-w-[520px] text-[17px] font-normal leading-[26px] text-gray-500 sm:text-[18px]">
            There are currently no jobs available. Please check back soon.
          </p>
        </div>
      </div>
    </main>
  );
}
