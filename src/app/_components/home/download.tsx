import Image from 'next/image';

export function Download() {
  return (
    <section id="download" className="bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-10 px-10 py-20 text-center">
        <div className="flex max-w-[600px] flex-col items-center gap-4">
          <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-gray-950">
            Download SafeRoute.
          </h2>
          {/* FIXME: leftover juice-template copy — replace before launch. */}
          <p className="max-w-[480px] text-[15px] leading-[22px] text-[#666668]">
            Squeeze your grapefruit, then let the juice do the rest — one sip to refresh you, another
            to feel your best.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <a href="#" aria-label="Get it on Google Play">
            <Image
              src="/images/landing/badge-google-play.png"
              alt="Get it on Google Play"
              width={135}
              height={40}
              className="h-10 w-auto"
            />
          </a>
          <a href="#" aria-label="Download on the App Store">
            <Image
              src="/images/landing/badge-app-store.png"
              alt="Download on the App Store"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
