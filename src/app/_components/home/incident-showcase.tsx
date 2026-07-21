import Image from 'next/image';

/**
 * Incident showcase — the composited image (hand holding the live broadcast,
 * surrounded by community report cards). The Figma frame (488:18699) is
 * 1280x928 while the export runs 1280x1211, so we clip the bottom ~283px of
 * the image to match the shorter hand shown in Figma.
 */
export function IncidentShowcase() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-white">
      <div className="mx-auto aspect-[1280/928] w-full max-w-[1280px] overflow-hidden">
        <Image
          src="/images/landing/hand-phone-cards.png"
          alt="SafeRoute live incident broadcast surrounded by community reports"
          width={1280}
          height={1211}
          priority
          className="h-auto w-full select-none"
        />
      </div>
    </section>
  );
}
