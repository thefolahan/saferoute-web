import Image from 'next/image';

type Card = {
  avatar?: string;
  quote: string;
  name: string;
  role: string;
};

const TINTS = [
  'var(--color-gray-900)',
  'var(--color-gray-700)',
  'var(--color-gray-600)',
  'var(--color-gray-800)',
  'var(--color-gray-500)'
];

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

const CARDS: Card[] = [
  {
    quote:
      '"I check it before every shift. It flags flooded stretches and closures on the Lekki axis long before I reach them, so my passengers actually get where they are going."',
    name: 'Chidera Okonkwo',
    role: 'Driver'
  },
  {
    quote:
      '"I close rounds at 11pm and my family used to worry the whole way home. Now they follow my route on my Safety Circle, and I get alerted if anything is happening ahead."',
    name: 'Aisha Bello',
    role: 'Nurse'
  },
  {
    quote:
      '"We route a dozen dispatch riders across Lagos every day. Community reports reach us faster than the radio, and the verification means we are not reacting to rumours."',
    name: 'Tunde Adeyemi',
    role: 'Logistics coordinator'
  },
  {
    quote:
      '"I leave for Balogun before 5am with goods. Knowing which roads are blocked that early decides whether I open my stall by eight or sit in traffic till noon."',
    name: 'Ngozi Eze',
    role: 'Market trader'
  },
  {
    quote:
      '"On the Kano to Abuja run I used to hear about a bad stretch only after I was already in it. Now the alerts reach me early enough to pull over and take another road."',
    name: 'Ibrahim Musa',
    role: 'Long-haul driver'
  },
  {
    quote:
      '"The school run used to be guesswork. I can see what happened on our route before I load the children into the bus, and parents get told why we are running late."',
    name: 'Funmilayo Adebayo',
    role: 'Teacher'
  },
  {
    quote:
      '"Twenty drops a day on a bike. The live broadcasts show me the flooding at Ojota before I turn into it, which is the difference between a full day and a wasted one."',
    name: 'Emeka Nwachukwu',
    role: 'Dispatch rider'
  },
  {
    quote:
      '"My hostel is off campus and I move at odd hours. Sharing my route with my roommates costs me nothing and means somebody always knows where I am."',
    name: 'Halima Yusuf',
    role: 'Student'
  },
  {
    quote:
      '"I send stock across the city constantly. When a road goes bad I know within minutes, so I can call my rider and reroute him before he burns fuel sitting still."',
    name: 'Segun Oladipo',
    role: 'Small business owner'
  },
  {
    quote:
      '"I was posted somewhere I did not know at all. The community reports told me which routes people actually avoid after dark, which no map was ever going to tell me."',
    name: 'Blessing Etim',
    role: 'Corps member'
  }
];

function TestimonialCard({ card, index }: { card: Card; index: number }) {
  return (
    <div className="flex h-[440px] w-[300px] shrink-0 flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(16,24,40,0.07)] sm:h-[490px] sm:w-[360px]">
      <div className="flex">
        {card.avatar ? (
          <Image
            src={card.avatar}
            alt={card.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-semibold leading-none text-white"
            style={{ background: TINTS[index % TINTS.length] }}
          >
            {initialsOf(card.name)}
          </div>
        )}
      </div>
      <p className="text-[20px] leading-[32px] text-gray-600">{card.quote}</p>
      <div className="flex flex-col gap-0.5">
        <p className="text-[24px] font-medium leading-[32px] text-gray-900">
          {card.name}
        </p>
        <p className="text-[13px] leading-[16px] text-gray-600">{card.role}</p>
      </div>
    </div>
  );
}

function Deck({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="flex shrink-0 gap-6 pr-6" aria-hidden={duplicate || undefined}>
      {CARDS.map((card, i) => (
        <TestimonialCard key={card.name} card={card} index={i} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-gray-50 py-24">
      <div className="w-full">
        <header className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-6 sm:px-10 lg:px-20">
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

        <div className="marquee relative mt-14 overflow-hidden pb-4 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
          <div className="marquee-track flex w-max">
            <Deck />
            <Deck duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
