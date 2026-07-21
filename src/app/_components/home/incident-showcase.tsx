import Image from 'next/image';

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
