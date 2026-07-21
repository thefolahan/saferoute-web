import Image from 'next/image';

/**
 * "Download SafeRoute." — download-norma (home 346:9850 / features 491:23427 /
 * about). Light section: heading + supporting copy + store badges on the left,
 * the live-broadcast / route-map phone pair on the right. Shared across pages.
 */
export function DownloadCta() {
  return (
    <section id="download" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-20 md:py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex max-w-[520px] flex-col gap-8 text-center lg:text-left">
            <div className="flex flex-col gap-4">
              <h2 className="text-[40px] font-medium leading-[1.1] tracking-tightest text-gray-950 sm:text-[48px] sm:leading-[60px]">
                Download SafeRoute.
              </h2>
              <p className="text-[18px] font-normal leading-7 text-gray-500">
                SafeRoute helps you make safer travel decisions with real-time
                community reports, verified updates, live broadcasts, and route
                safety intelligence.
              </p>
            </div>
            <div className="flex justify-center gap-3 lg:justify-start">
              <a href="#" aria-label="Get it on Google Play">
                <Image
                  src="/images/landing/badge-google-play.png"
                  alt="Get it on Google Play"
                  width={148}
                  height={44}
                  className="h-11 w-auto"
                />
              </a>
              <a href="#" aria-label="Download on the App Store">
                <Image
                  src="/images/landing/badge-app-store.png"
                  alt="Download on the App Store"
                  width={132}
                  height={44}
                  className="h-11 w-auto"
                />
              </a>
            </div>
          </div>

          <div className="w-full max-w-[560px] shrink-0 lg:w-[600px] lg:max-w-none">
            <Image
              src="/images/landing/download-phones-v2.png"
              alt="SafeRoute live broadcast and route planning screens"
              width={1290}
              height={1268}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
