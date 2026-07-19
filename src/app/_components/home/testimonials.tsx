import Image from 'next/image';

const CARDS = [
  {
    avatar: '/images/landing/346-9827.png',
    quote:
      '"I check SafeRoute before every single commute from Lekki. It\'s the only app that accurately tags localized road challenges instantly."',
    name: 'Folake A.',
    role: 'Journalist',
  },
  {
    avatar: '/images/landing/346-9835.png',
    quote:
      '"It helped me avoid a major protest and traffic jam on the Mainland yesterday. Saved me hours and protected my passengers."',
    name: 'Folake A.',
    role: 'Journalist',
  },
  {
    avatar: '/images/landing/346-9843.png',
    quote:
      '"Our newsroom now reaches people faster during transit emergencies. The verification system filters out fake reports beautifully."',
    name: 'Folake A.',
    role: 'Journalist',
  },
];

export function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-col gap-4 px-20">
          <p className="text-[11px] font-bold leading-[13px] tracking-[0.08em] text-[#475569]">
            TESTIMONIALS
          </p>
          <div className="flex flex-col gap-1">
            <h2 className="text-[48px] font-medium leading-[60px] tracking-tightest text-gray-950">
              Trusted by thousands of travelers.
            </h2>
            <p className="text-[24px] font-normal leading-[52px] text-[#475569]">
              See why people choose SafeRoute for every journey.
            </p>
          </div>
        </header>

        <div className="mt-14 flex gap-6 pl-20 pr-10">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="flex h-[490px] w-[360px] shrink-0 flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(16,24,40,0.07)]"
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
