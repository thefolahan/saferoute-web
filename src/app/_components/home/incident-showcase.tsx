import Image from 'next/image';

/**
 * 488:18699 — the section directly under the hero: a hand holding a phone (a
 * live broadcast) surrounded by faded "Road Accident" incident cards. Exported
 * as one image for exact fidelity (transparent PNG on white). The hand overflows
 * the 928px frame; kept as-is so the cards sit at their designed positions.
 */
export function IncidentShowcase() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-[1280px]">
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
