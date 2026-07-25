import Image from 'next/image';

const CARDS = [
  {
    avatar: '/images/landing/346-9827.png',
    quote:
      '"I check it before every shift. It flags flooded stretches and closures on the Lekki axis long before I reach them, so my passengers actually get where they are going."',
    name: 'Chidera Okonkwo',
    role: 'Driver',
  },
  {
    avatar: '/images/landing/346-9835.png',
    quote:
      '"I close rounds at 11pm and my family used to worry the whole way home. Now they follow my route on my Safety Circle, and I get alerted if anything is happening ahead."',
    name: 'Aisha Bello',
    role: 'Nurse',
  },
  {
    avatar: '/images/landing/346-9843.png',
    quote:
      '"We route a dozen dispatch riders across Lagos every day. Community reports reach us faster than the radio, and the verification means we are not reacting to rumours."',
    name: 'Tunde Adeyemi',
    role: 'Logistics coordinator',
  },
];

export function Testimonials() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-gray-50 py-24">
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="flex flex-col gap-4 px-6 sm:px-10 lg:px-20">
          <p className="text-[11px] font-bold leading-[13px] tracking-[0.08em] text-[#475569]">
            TESTIMONIALS
          </p>
          <div className="flex flex-col gap-1">
            <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-gray-950">
              Trusted by thousands of people on the move.
            </h2>
            <p className="text-[24px] font-normal leading-[52px] text-[#475569]">
              See why people choose SafeRoute for every journey.
            </p>
          </div>
        </header>

        <div className="mt-14 flex gap-6 overflow-x-auto px-6 pb-4 sm:px-10 lg:pl-20 lg:pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="flex h-[440px] w-[300px] shrink-0 flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(16,24,40,0.07)] sm:h-[490px] sm:w-[360px]"
            >
              <div className="flex">
                <Image
                  src={card.avatar}
                  alt={card.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <p className="text-[20px] leading-[32px] text-gray-600">{card.quote}</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-[24px] font-medium leading-[32px] text-gray-900">{card.name}</p>
                <p className="text-[13px] leading-[16px] text-gray-600">{card.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
