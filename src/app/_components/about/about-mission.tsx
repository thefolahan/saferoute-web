/**
 * Mission / Vision — light gray-25 section holding a single dark gray-950 card
 * (~544px tall) split into two columns by a hairline. Each column: an asterisk
 * mark, an uppercase label, and a bold white statement.
 */
const ITEMS = [
  {
    label: 'Our Mission',
    text: 'To empower every road user with real-time road intelligence that makes every journey safer, smarter, and more predictable.',
    support:
      'We exist to help people make informed travel decisions by providing trusted, community-driven information about road conditions, safety incidents, emergencies, and disruptions across Africa.'
  },
  {
    label: 'Our Vision',
    text: "To become Africa's most trusted road intelligence and travel safety platform.",
    support:
      "We envision a future where no one starts a journey without knowing what's ahead, where communities work together, technology verifies information, and every traveler has access to reliable, real-time road intelligence that saves time, reduces risk, and protects lives."
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
    <section className="flex min-h-screen flex-col justify-center bg-[#FCFCFC]">
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
              <p className="mt-5 max-w-full text-[24px] font-bold leading-9 tracking-[-0.01em] text-white sm:max-w-[380px] sm:text-[28px] sm:leading-[40px]">
                {item.text}
              </p>
              <p className="mt-5 max-w-full text-[16px] font-normal leading-7 text-gray-400 sm:max-w-[420px]">
                {item.support}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
