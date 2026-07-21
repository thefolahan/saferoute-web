/**
 * Mission / Vision — light gray-25 section holding a single dark gray-950 card
 * (~544px tall) split into two columns by a hairline. Each column: an asterisk
 * mark, an uppercase label, and a bold white statement.
 */
const ITEMS = [
  {
    label: 'Our Mission',
    text: 'To make travel safer, smarter, and more predictable through real-time road intelligence.'
  },
  {
    label: 'Our Vision',
    text: "Become Africa's most trusted road information platform."
  }
] as const;

function Asterisk() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <path
        d="M22 6v32M8 13l28 18M36 13L8 31"
        stroke="#252B37"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AboutMission() {
  return (
    <section className="bg-[#FCFCFC]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-20 md:py-24">
        <div className="grid grid-cols-1 gap-y-12 rounded-[32px] bg-[#0A0D12] px-8 py-14 sm:px-12 md:min-h-[544px] md:grid-cols-2 md:gap-x-16 md:px-14">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`flex flex-col ${
                i === 1 ? 'md:border-l md:border-white/10 md:pl-16' : ''
              }`}
            >
              <Asterisk />
              <p className="mt-12 text-[18px] font-normal uppercase leading-6 tracking-[0.04em] text-gray-500">
                {item.label}
              </p>
              <p className="mt-5 max-w-full text-[24px] font-bold leading-9 tracking-[-0.01em] text-white sm:max-w-[370px] sm:text-[28px] sm:leading-[40px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
