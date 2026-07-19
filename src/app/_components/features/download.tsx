import Image from 'next/image';

/**
 * Download section — Figma 491:23427. Light bg, centered stack: 48/60 heading,
 * 15/22 sub-paragraph (leftover juice-template copy), two app-store badges.
 */
export function FeaturesDownload() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-10 px-10 py-20">
        <div className="flex max-w-[600px] flex-col items-center gap-4 text-center">
          <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-gray-950">
            Download SafeRoute.
          </h2>
          <p className="max-w-[480px] text-[15px] font-normal leading-[22px] text-[#666668]">
            Squeeze your grapefruit, then let the juice do the rest — one sip to
            refresh you, another to feel your best.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Image
            src="/images/landing/badge-google-play.png"
            alt="Get it on Google Play"
            width={148}
            height={44}
            className="h-11 w-auto"
          />
          <Image
            src="/images/landing/badge-app-store.png"
            alt="Download on the App Store"
            width={132}
            height={44}
            className="h-11 w-auto"
          />
        </div>
      </div>
    </section>
  );
}
