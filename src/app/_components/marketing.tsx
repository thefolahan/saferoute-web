import {
  ArrowRight,
  BellRing,
  Check,
  CircleDot,
  Radio,
  Search,
  ShieldCheck,
  Siren,
  UsersRound,
  Video
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { betaMailto, siteConfig } from '../../lib/config';
import { AnimatedStats } from './animated-stats';
import { EarthGlobe } from './earth-globe';
import { MobileMenu } from './mobile-menu';
import { SpaceBackground } from './space-background';
import { SupportFaqAccordion } from './support-faq-accordion';
import {
  copyrightPolicyText,
  privacyPolicyText,
  termsPolicyText
} from '../_lib/legal-policy-text';
import {
  enterpriseCapabilities,
  footerNav,
  journalistTools,
  premiumComparison,
  primaryNav,
  realStories,
  type MarketingPage,
  type Stat
} from '../_lib/marketing-content';

type ShellProps = {
  active?: string;
  children: ReactNode;
};

type AosProps = {
  'data-aos': string;
  'data-aos-delay': string;
  'data-aos-duration': string;
  'data-aos-easing': string;
  'data-aos-anchor-placement': string;
};

const scrollAnimations = ['fade-up', 'zoom-in-up', 'fade-right', 'fade-left', 'flip-up'] as const;
const headerSecondaryNav = footerNav.filter((item) => item.label !== 'About');
const companyFooterNav = footerNav.filter((item) => ['About', 'Support'].includes(item.label));
const legalFooterNav = footerNav.filter((item) =>
  ['Privacy Policy', 'Terms of Service', 'Copyright'].includes(item.label)
);
const aboutStats = [
  { target: 10, suffix: '+ billion', label: 'Alerts sent so far' },
  { target: 9, suffix: '+ million', label: 'Users' },
  { target: 60, label: 'Cities and counting' }
];
const supportFaqs = [
  {
    question: 'What is SafeRoute?',
    answer: 'SafeRoute is a safety awareness app that helps people see nearby reports, community alerts, route context, and responsible safety updates before they move.'
  },
  {
    question: 'Is SafeRoute an emergency service?',
    answer: 'No. SafeRoute is not police, ambulance, fire service, or emergency dispatch. In Nigeria, call 112 when there is an emergency.'
  },
  {
    question: 'When should I call 112 instead of using SafeRoute?',
    answer: 'Call 112 immediately if there is active danger, injury, fire, violence, medical distress, or any situation that needs official emergency response.'
  },
  {
    question: 'How does SafeRoute use my location?',
    answer: 'SafeRoute uses location to show nearby incidents, determine alert relevance, and help reports appear in the right area. Location should support safety, not public exposure.'
  },
  {
    question: 'Can other users see my exact location?',
    answer: 'SafeRoute is designed to avoid exposing private exact locations where possible. Public safety content may be rounded, limited, moderated, or otherwise protected.'
  },
  {
    question: 'How do I submit a report safely?',
    answer: 'Only report when you are away from danger. Do not approach a scene, chase suspects, interfere with responders, or record content that puts you or others at risk.'
  },
  {
    question: 'What kinds of incidents can I report?',
    answer: 'Reports may include road accidents, fire, flooding, security activity, missing-person notices, medical emergencies, road hazards, or other public-safety concerns.'
  },
  {
    question: 'What should I avoid posting?',
    answer: 'Avoid hoaxes, rumors presented as facts, private home addresses, graphic material, copyrighted media, hate speech, threats, suspect accusations, and anything that could trigger mob action.'
  },
  {
    question: 'Are reports verified?',
    answer: 'Some reports may be reviewed using moderation, multiple nearby reports, trusted sources, media evidence, official updates, or confidence signals. Not every report is guaranteed accurate.'
  },
  {
    question: 'Why might a report be removed or delayed?',
    answer: 'SafeRoute may remove, delay, or reduce visibility when content is unsafe, misleading, private, duplicate, illegal, unverified, or likely to cause panic or harm.'
  },
  {
    question: 'What is the difference between Alerts, Feed, and Trending?',
    answer: 'Alerts focus on nearby safety relevance, Feed shows broader community reports and posts, and Trending highlights reports gaining attention or activity.'
  },
  {
    question: 'Can I add photos or videos?',
    answer: 'Yes, when safe and lawful. Only upload media you created or have permission to use, and avoid showing sensitive private details or people in vulnerable situations.'
  },
  {
    question: 'Can journalists use SafeRoute?',
    answer: 'Journalists can use SafeRoute to monitor public safety signal, review context, and identify follow-up leads, but they should still verify independently before publishing.'
  },
  {
    question: 'Can organizations use SafeRoute for teams?',
    answer: 'Organizations can use SafeRoute for location-aware monitoring, employee awareness, incident context, and safety workflows for campuses, workplaces, venues, or field teams.'
  },
  {
    question: 'How does Premium work?',
    answer: 'Premium may include saved places, alert controls, incident history, ad-free scanning, priority notifications, and briefing-style updates for routes or cities you care about.'
  },
  {
    question: 'How do I manage notifications?',
    answer: 'Notification settings may let you control alert radius, categories, saved places, priority alerts, and how much nearby safety information you receive.'
  },
  {
    question: 'How do I correct a false report?',
    answer: 'Use the in-app report controls where available or send the report details, location, time, and correction reason to support.'
  },
  {
    question: 'How do I report copyright or media misuse?',
    answer: 'Send copyright concerns to the SafeRoute copyright contact with the content URL, proof of ownership or permission, and a clear description of the issue.'
  },
  {
    question: 'How can I delete or change my account data?',
    answer: 'You can request account support, correction, deletion, or other data-rights help by contacting SafeRoute with the email or phone tied to your account.'
  },
  {
    question: 'How do I reach SafeRoute support?',
    answer: 'Email the SafeRoute team with your account details, city, device, and a clear description of the issue so support can route the request properly.'
  }
];
const quickSafetyActions = [
  {
    title: 'Get Notified',
    body: "Receive push notifications when there's an incident nearby so you can avoid that area.",
    icon: BellRing,
    tone: 'text-[var(--gold)]'
  },
  {
    title: 'Go Live',
    body: "If you're nearby an incident unfolding, record video to help others stay safe.",
    icon: UsersRound,
    tone: 'text-[var(--gold)]'
  },
  {
    title: 'Search Incidents',
    body: "If there's commotion like police activity, emergency response, or road closures, pull up the app and instantly find out why.",
    icon: Search,
    tone: 'text-[var(--gold)]'
  }
];
const liveSafetyFeatures = [
  {
    title: 'Watch incidents unfold.',
    body: "Live videos show you what's really happening. See incidents unfold from different angles to get a clear view of the situation.",
    icon: Video,
    tone: 'text-[var(--gold)]'
  },
  {
    title: 'Know instantly.',
    body: 'Speed is critical for important events like missing-person reports, road closures, fires, and security activity. SafeRoute alerts are designed to reach nearby people quickly.',
    icon: Check,
    tone: 'text-[var(--gold)]'
  },
  {
    title: 'Broadcast to help others.',
    body: 'When it is safe, broadcast live video, add comments, and share relevant updates with your community.',
    icon: UsersRound,
    tone: 'text-[var(--gold)]'
  }
];
const publicSafetyPillars = [
  {
    title: 'Emergency responders move faster with better updates.',
    body: 'Verified live reports can help medical teams, fire teams, and community responders understand what is unfolding before official calls reach every desk.',
    icon: Siren,
    tone: 'text-[var(--gold)]'
  },
  {
    title: 'Increasing transparency between the city and its residents.',
    body: 'SafeRoute helps communities see the same public safety signal in real time, reducing rumor and helping people make calmer decisions.',
    icon: Radio,
    tone: 'text-[var(--gold)]'
  },
  {
    title: 'Everyone is safer when everyone has the same access.',
    body: 'SafeRoute is built for residents, journalists, organizations, and responders to see unbiased public safety context without sending people toward danger.',
    icon: ShieldCheck,
    tone: 'text-[var(--gold)]'
  }
];
const testimonials = [
  {
    quote: 'My brother texted me panicked from a store. People were being kept inside without knowing why. I checked SafeRoute, understood what was happening, and we followed the incident until it was safe for him to leave.',
    author: 'Joel M.',
    meta: 'Lagos user'
  },
  {
    quote: 'Because SafeRoute alerted me about a medical emergency near the hospital where I work, our team had extra time to prepare before the patient arrived. Those minutes matter.',
    author: 'Trauma Surgeon',
    meta: 'Emergency care professional'
  },
  {
    quote: 'SafeRoute helped me avoid a closed road before I entered traffic. The alert came early enough for me to choose another route and get home without stress.',
    author: 'Amaka O.',
    meta: 'Abuja commuter'
  },
  {
    quote: 'When there was smoke near our estate, SafeRoute gave us nearby context before rumors started flying around the group chat.',
    author: 'Tunde A.',
    meta: 'Lagos resident'
  },
  {
    quote: 'The app made it easier for our team to understand what was happening around a venue without sending staff toward the incident.',
    author: 'Operations Lead',
    meta: 'Event safety team'
  },
  {
    quote: 'I checked SafeRoute before leaving work and saw a security alert close to my usual junction. I waited, rerouted, and avoided the area.',
    author: 'Mariam B.',
    meta: 'Port Harcourt user'
  },
  {
    quote: 'As a journalist, the location context helps me separate early signal from noise before I start making calls.',
    author: 'News Editor',
    meta: 'Independent newsroom'
  },
  {
    quote: 'SafeRoute gave our family a calmer way to follow an incident nearby instead of relying on forwarded messages.',
    author: 'Chinedu N.',
    meta: 'Enugu user'
  },
  {
    quote: 'The nearby alert helped us close our storefront early during a developing situation and reopen once the area settled.',
    author: 'Retail Manager',
    meta: 'Ikeja business'
  },
  {
    quote: 'I like that the app keeps reminding people not to move toward danger. The information is useful without pushing panic.',
    author: 'Safety Volunteer',
    meta: 'Community response group'
  }
];
const journalistWorkflow = [
  {
    title: 'Incident Reported',
    body: 'A user reports an incident on SafeRoute. Nearby users are alerted and begin capturing footage often within seconds of the event.'
  },
  {
    title: 'Search & Filter',
    body: 'Your team searches SafeRoute by category, location, or date range. Filter to your beat, your geography, and your story window.'
  },
  {
    title: 'Download or Embed',
    body: 'Download footage for broadcast or embed it directly in your digital story, fully attributed and covered under your licensing agreement.'
  },
  {
    title: 'Publish With Confidence',
    body: 'Your legal indemnification is in place. Your attribution is built in. Your editors can approve and your audience will instantly see it.'
  }
];
const journalistAccessCards = [
  {
    title: 'SafeRoute Explore is retiring soon',
    body: 'Newsrooms that rely on SafeRoute video for breaking news coverage need to contact SafeRoute for continued access.'
  },
  {
    title: 'Schedule a call with our team',
    body: "Our team is available to walk through your newsroom's specific coverage needs and help identify the right plan for your team."
  }
];

function aos(
  index = 0,
  animation: string = scrollAnimations[index % scrollAnimations.length] ?? 'fade-up'
): AosProps {
  return {
    'data-aos': animation,
    'data-aos-delay': String(Math.min(index * 90, 360)),
    'data-aos-duration': String(780 + (index % 3) * 110),
    'data-aos-easing': index % 2 === 0 ? 'ease-out-cubic' : 'ease-out-back',
    'data-aos-anchor-placement': 'top-bottom'
  };
}

export function MarketingShell({ active, children }: ShellProps) {
  const mailto = betaMailto();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000204] text-white">
      <SpaceBackground />
      <a
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full border border-white/25 bg-black px-4 py-2 text-sm font-extrabold text-white shadow-lg transition focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader active={active} mailto={mailto} />
      <main id="main" className="relative z-10">{children}</main>
      <MarketingFooter />
    </div>
  );
}

function SiteHeader({ active, mailto }: { active?: string; mailto: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black text-white">
      <div className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center justify-between gap-5 px-5 sm:px-8 xl:px-0">
        <BrandMark imageClassName="size-20 shrink-0 sm:size-24" />

        <nav
          className="hidden items-center gap-9 text-sm font-extrabold text-white/58 lg:flex"
          aria-label="Primary navigation"
        >
          {primaryNav.map((item) => (
            <a
              className={`transition hover:text-white ${
                active === item.label.toLowerCase() ? 'text-white' : ''
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            className="hidden min-h-11 items-center justify-center rounded-full bg-[var(--gold)] px-7 text-sm font-black text-black transition hover:bg-[var(--gold-strong)] sm:inline-flex"
            href={mailto}
          >
            Get app
          </a>
          <MobileMenu
            active={active}
            ctaHref={mailto}
            primaryLinks={primaryNav}
            secondaryLinks={headerSecondaryNav}
          />
        </div>
      </div>
    </header>
  );
}

function BrandMark({
  imageClassName = 'size-12 shrink-0 sm:size-14'
}: {
  imageClassName?: string;
}) {
  return (
    <a className="flex items-center" href="/" aria-label="SafeRoute home">
      <img
        className={imageClassName}
        src="/images/logo.svg"
        alt=""
        width="160"
        height="160"
      />
    </a>
  );
}

export function HomePageView() {
  return (
    <MarketingShell>
      <HomeHero />
      <QuickSafetyActionsSection />
      <LiveSafetyFeaturesSection />
      <PublicSafetyImpactSection />
      <TestimonialsMarqueeSection />
      <HomeCta />
    </MarketingShell>
  );
}

function SectionShell({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  const spacingClass = className || 'py-20 lg:py-28';

  return (
    <section className={`relative px-5 sm:px-8 ${spacingClass}`}>
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </section>
  );
}

function HomeHero() {
  return (
    <section className="relative overflow-hidden px-5 pt-[76px] sm:px-8">
      <div className="relative mx-auto h-[calc(100svh-76px)] min-h-[620px] w-full max-w-[1280px] text-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" {...aos(0, 'zoom-in')}>
          <EarthGlobe />
        </div>
        <h1
          className="absolute inset-x-0 bottom-7 mx-auto max-w-5xl text-5xl font-black leading-[1.02] text-white sm:bottom-8 sm:text-7xl lg:text-8xl"
          {...aos(1, 'zoom-out')}
        >
          Know before you go.
        </h1>
      </div>
    </section>
  );
}

function QuickSafetyActionsSection() {
  return (
    <SectionShell className="py-10 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        {quickSafetyActions.map((item, index) => (
          <IconTextBlock item={item} key={item.title} index={index} />
        ))}
      </div>
    </SectionShell>
  );
}

function IconTextBlock({
  item,
  index
}: {
  item: { body: string; icon: LucideIcon; title: string; tone: string };
  index: number;
}) {
  const Icon = item.icon;

  return (
    <article className="grid gap-5 sm:grid-cols-[48px_1fr]" {...aos(index, 'fade-up')}>
      <Icon className={item.tone} size={34} strokeWidth={2} aria-hidden="true" />
      <div>
        <h2 className="text-2xl font-black leading-tight text-white">{item.title}</h2>
        <p className="mt-4 max-w-sm text-lg font-semibold leading-8 text-white/58">{item.body}</p>
      </div>
    </article>
  );
}

function LiveSafetyFeaturesSection() {
  return (
    <SectionShell className="py-10 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        {liveSafetyFeatures.map((item, index) => (
          <IconTextBlock item={item} key={item.title} index={index} />
        ))}
      </div>
    </SectionShell>
  );
}

function PublicSafetyImpactSection() {
  return (
    <section className="relative overflow-hidden px-5 py-10 sm:px-8 lg:py-12">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[20px] border border-white/12 bg-[var(--surface)] px-6 py-14 shadow-[0_28px_110px_rgba(0,0,0,0.42)] sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(16,16,16,0.98),rgba(21,21,21,0.88)_54%,rgba(0,0,0,0.72))]" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-3">
          {publicSafetyPillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <article className="grid gap-5 sm:grid-cols-[48px_1fr] lg:grid-cols-1 lg:grid-rows-[34px_5.75rem_auto]" key={pillar.title} {...aos(index, 'fade-up')}>
                <Icon className={pillar.tone} size={34} strokeWidth={2} aria-hidden="true" />
                <div className="lg:contents">
                  <h2 className="text-2xl font-black leading-tight text-white">{pillar.title}</h2>
                  <p className="mt-5 text-lg font-semibold leading-8 text-white/68 lg:mt-0">{pillar.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsMarqueeSection() {
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden py-10 text-white lg:py-12">
      <div className="testimonial-marquee" {...aos(0, 'fade-up')}>
        <div className="testimonial-marquee__track">
          {marqueeItems.map((testimonial, index) => (
            <article className="testimonial-card" key={`${testimonial.author}-${index}`}>
              <p className="text-6xl font-black leading-none text-[var(--gold)]">&ldquo;</p>
              <blockquote className="mt-6 text-xl font-semibold leading-[1.38] text-white sm:text-2xl lg:text-[1.65rem]">
                {testimonial.quote}
              </blockquote>
              <p className="mt-7 text-sm font-black text-white sm:text-base">
                {testimonial.author}
                <span className="font-bold text-white/42">, {testimonial.meta}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumPreview({ stats }: { stats: Stat[] }) {
  return (
    <SectionShell className="pb-20 pt-[116px] lg:pb-28 lg:pt-[132px]">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center" {...aos(0, 'fade-up')}>
          <p className="section-label justify-center">Premium</p>
          <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl">
            No commitment. Cancel anytime.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3" {...aos(1, 'zoom-in-up')}>
          {stats.map((stat) => (
            <div className="rounded-[18px] border border-white/12 bg-[var(--surface)] p-6 text-center" key={stat.label}>
              <strong className="block text-3xl font-black text-white">{stat.value}</strong>
              <span className="mt-3 block text-sm font-bold leading-6 text-white/50">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PremiumPlanCard title="Free" plan="free" />
          <PremiumPlanCard title="Premium" plan="premium" highlighted />
        </div>

        <div className="mt-10 flex justify-center" {...aos(3, 'zoom-in')}>
          <a className="gold-button w-full sm:w-auto" href="#join-beta">
            Start Free 30 Day Trial <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

function PremiumPlanCard({
  title,
  plan,
  highlighted = false
}: {
  title: string;
  plan: 'free' | 'premium';
  highlighted?: boolean;
}) {
  return (
    <article
      className={`rounded-[18px] border p-7 sm:p-9 ${
        highlighted
          ? 'border-[var(--gold)]/50 bg-[linear-gradient(145deg,rgba(237,203,138,0.14),rgba(16,16,16,0.94))]'
          : 'border-white/12 bg-[var(--surface)]'
      }`}
      {...aos(highlighted ? 2 : 1, highlighted ? 'fade-left' : 'fade-right')}
    >
      <h3 className="inline-flex rounded-full border border-white/28 px-5 py-2 text-2xl font-black text-white">
        {title}
      </h3>
      <ul className="mt-8 grid gap-5">
        {premiumComparison.map((row) => {
          const included = row[plan];

          return (
            <li className="flex gap-4 text-base font-bold leading-7 sm:text-lg" key={`${title}-${row.feature}`}>
              <PlanFeatureIcon included={included} />
              <span className={included ? 'text-white/84' : 'text-white/34'}>{row.feature}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function PlanFeatureIcon({ included }: { included: boolean }) {
  return included ? (
    <Check className="mt-1 shrink-0 text-[var(--gold)]" size={20} strokeWidth={2.5} aria-label="Included" />
  ) : (
    <span className="mt-0.5 shrink-0 text-2xl leading-none text-white/36" aria-label="Not included">
      x
    </span>
  );
}

function HomeCta() {
  return (
    <section id="join-beta" className="relative scroll-mt-[92px] px-5 py-10 sm:px-8 lg:py-12">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 pb-16 text-center">
        <div {...aos(0, 'fade-right')}>
          <h2 className="whitespace-nowrap text-[1.35rem] font-black leading-tight text-white min-[390px]:text-2xl sm:text-5xl lg:text-6xl">
            Download SafeRoute for free.
          </h2>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row" {...aos(1, 'zoom-in-left')}>
          <StoreLink
            href={siteConfig.appStoreUrl}
            platform="apple"
          />
          <StoreLink
            href={siteConfig.playStoreUrl}
            platform="google"
          />
        </div>
      </div>
    </section>
  );
}

function StoreLink({
  href,
  platform
}: {
  href: string;
  platform: 'apple' | 'google';
}) {
  const isApple = platform === 'apple';

  return (
    <a
      className="store-badge"
      href={href}
      aria-label={isApple ? 'Download SafeRoute on the App Store' : 'Get SafeRoute on Google Play'}
    >
      {isApple ? <AppleStoreIcon /> : <GooglePlayIcon />}
      {isApple ? (
        <span className="grid text-left leading-none">
          <small className="text-[10px] font-bold uppercase tracking-[0.01em] text-white">
            Download on the
          </small>
          <strong className="mt-1 text-[23px] font-black leading-none text-white">
            App Store
          </strong>
        </span>
      ) : (
        <span className="grid text-left leading-none">
          <small className="text-[10px] font-bold uppercase tracking-[0.04em] text-white">
            Get it on
          </small>
          <strong className="mt-1 text-[22px] font-black leading-none text-white">
            Google Play
          </strong>
        </span>
      )}
    </a>
  );
}

function AppleStoreIcon() {
  return (
    <svg className="size-10 shrink-0 text-white" viewBox="4 3 16 18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.94 12.42c-.02-2.05 1.68-3.05 1.76-3.1-.96-1.4-2.44-1.6-2.96-1.62-1.24-.13-2.45.74-3.08.74-.65 0-1.63-.72-2.69-.7-1.37.02-2.65.8-3.36 2.03-1.45 2.52-.37 6.22 1.02 8.25.7 1 1.51 2.12 2.58 2.08 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.7.65 1.12-.02 1.82-1 2.49-2.01.8-1.15 1.12-2.29 1.13-2.35-.03-.01-2.26-.86-2.28-3.3Zm-2.01-6.04c.56-.7.95-1.64.84-2.6-.82.04-1.85.57-2.43 1.25-.52.6-.99 1.58-.86 2.51.93.07 1.86-.47 2.45-1.16Z"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg className="size-10 shrink-0" viewBox="0 0 31 35" aria-hidden="true">
      <path fill="#34A853" d="M1.7 1.1c-.5.5-.8 1.3-.8 2.4v28c0 1 .3 1.8.8 2.4l.1.1 15.7-16.4v-.4L1.8 1l-.1.1Z" />
      <path fill="#FBBC04" d="m22.7 23.1-5.2-5.4v-.4l5.2-5.4.1.1 6.2 3.7c1.8 1.1 1.8 2.8 0 3.9l-6.2 3.6-.1-.1Z" />
      <path fill="#EA4335" d="m22.8 23-5.3-5.5L1.7 33.9c.8.8 2 .9 3.4.1l17.7-11Z" />
      <path fill="#4285F4" d="M22.8 12 5.1 1C3.7.2 2.5.3 1.7 1.1l15.8 16.4L22.8 12Z" />
    </svg>
  );
}

function MarketingFooter() {
  return (
    <footer className="relative z-10 bg-transparent px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-10 pb-12 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="flex flex-col items-center" {...aos(0, 'fade-right')}>
          <BrandMark imageClassName="size-24 shrink-0 sm:size-28 lg:size-32" />
          <p className="-mt-5 text-center text-2xl font-black leading-none text-white sm:-mt-6 sm:text-3xl lg:-mt-8">
            SafeRoute
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3" {...aos(1, 'fade-left')}>
          <FooterColumn title="Product" links={primaryNav} />
          <FooterColumn title="Company" links={companyFooterNav} />
          <FooterColumn title="Legal" links={legalFooterNav} />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] justify-center pt-8 text-center text-sm font-bold text-white/55">
        <p>&copy; SafeRoute 2026. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-black text-white">{title}</h3>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a className="text-sm font-bold text-white/50 transition hover:text-white" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingPageView({ page }: { page: MarketingPage }) {
  const active = primaryNav.some((item) => item.label.toLowerCase() === page.slug)
    ? page.slug
    : page.slug === 'about'
      ? 'about'
      : undefined;
  const mailto = betaMailto();
  const hideGenericHero = ['premium', 'journalist', 'enterprise'].includes(page.slug);
  const hideGenericSections = ['premium', 'journalist'].includes(page.slug);

  const legalText =
    page.slug === 'copyright'
      ? copyrightPolicyText
      : page.slug === 'privacy'
        ? privacyPolicyText
        : page.slug === 'terms'
          ? termsPolicyText
          : undefined;

  if (page.slug === 'about') {
    return (
      <MarketingShell active={active}>
        <AboutOnlyPage />
      </MarketingShell>
    );
  }

  if (page.slug === 'support') {
    return (
      <MarketingShell active={active}>
        <SupportFaqPage />
      </MarketingShell>
    );
  }

  if (legalText) {
    return (
      <MarketingShell active={active}>
        <LegalPolicyPage text={legalText} />
      </MarketingShell>
    );
  }

  return (
    <MarketingShell active={active}>
      {hideGenericHero ? null : <PageHero page={page} mailto={mailto} />}
      {hideGenericSections ? null : <PageSections page={page} />}
      {page.visual === 'premium' ? <PremiumPreview stats={page.stats} /> : null}
      {page.visual === 'journalist' ? <JournalistDetail /> : null}
      {page.visual === 'enterprise' ? <EnterpriseDetail /> : null}
      {page.visual === 'about' ? <AboutDetail /> : null}
      <HomeCta />
    </MarketingShell>
  );
}

function AboutOnlyPage() {
  return (
    <section className="relative px-5 pb-20 pt-[116px] sm:px-8 lg:pb-28 lg:pt-[132px]">
      <div className="mx-auto max-w-4xl">
        <p className="section-label" {...aos(0, 'fade-right')}>
          About
        </p>
        <h1 className="mt-5 text-5xl font-black leading-tight text-white sm:text-7xl" {...aos(1, 'zoom-in-left')}>
          Who are we?
        </h1>
        <div className="mt-10 grid gap-8 text-lg font-semibold leading-9 text-white/68 sm:text-xl sm:leading-10">
          <p {...aos(2, 'fade-left')}>
            At SafeRoute, we believe that stronger communities are safer communities. We live in a world where people can access information quickly, share effortlessly, and connect easily — but we have yet to see the power of bringing people together to watch out for each other. At SafeRoute, we’re developing cutting edge technology so you can take care of the people and places you love.
          </p>
          <p {...aos(3, 'fade-right')}>
            SafeRoute is on a mission to make your world a safer place. We believe in public information for the good of the public. In being able to act on safety alerts in real time. In transparency that bonds and that empowers everyone in a community, from city council to residents.
          </p>
          <p {...aos(4, 'fade-left')}>
            We believe in giving people a way to use their phones to protect a neighbor, to prevent a tragedy, and to count on one another.
          </p>
          <p {...aos(5, 'fade-right')}>
            And to create a safer world for each other, with each other.
          </p>
        </div>
        <div {...aos(6, 'flip-up')}>
          <AnimatedStats stats={aboutStats} />
        </div>
      </div>
    </section>
  );
}

function SupportFaqPage() {
  return (
    <section className="relative px-5 pb-20 pt-[116px] sm:px-8 lg:pb-28 lg:pt-[132px]">
      <div className="mx-auto max-w-4xl">
        <p className="section-label" {...aos(0, 'fade-up')}>
          Support
        </p>
        <h1 className="mt-5 text-5xl font-black leading-tight text-white sm:text-7xl" {...aos(1, 'fade-up')}>
          SafeRoute FAQs.
        </h1>
        <div {...aos(2, 'zoom-in-up')}>
          <SupportFaqAccordion faqs={supportFaqs} />
        </div>
      </div>
    </section>
  );
}

function PageHero({ page, mailto }: { page: MarketingPage; mailto: string }) {
  const Icon = page.icon;
  const targetHref = page.visual === 'legal' || page.visual === 'support' ? mailto : '#join-beta';

  return (
    <section className="relative overflow-hidden px-5 pt-[76px] sm:px-8">
      <div className="relative mx-auto grid min-h-[650px] max-w-[1280px] gap-12 py-20 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label inline-flex items-center gap-3">
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
            {page.label}
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.04] text-white sm:text-7xl">
            {page.title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/58">
            {page.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="gold-button w-full sm:w-auto" href={targetHref}>
              {page.cta} <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="ghost-button w-full sm:w-auto" href="/">
              Back home
            </a>
          </div>
        </div>

        <div className="rounded-[18px] border border-white/12 bg-[var(--surface)] p-6 sm:p-8" {...aos(1, 'zoom-in-left')}>
          <div className="grid gap-6">
            {page.stats.map((stat) => (
              <MetricRow key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalPolicyPage({ text }: { text: string }) {
  return (
    <section className="relative px-5 pb-20 pt-[116px] sm:px-8 lg:pb-28 lg:pt-[132px]">
      <article
        className="mx-auto max-w-4xl whitespace-pre-wrap text-base font-semibold leading-8 text-white/72 sm:text-lg sm:leading-9"
        {...aos(0, 'fade-up')}
      >
        {text}
      </article>
    </section>
  );
}

function MetricRow({ value, label }: Stat) {
  return (
    <div className="pb-6 last:pb-0">
      <strong className="block text-3xl font-black text-white">{value}</strong>
      <span className="mt-2 block text-base font-bold leading-7 text-white/48">{label}</span>
    </div>
  );
}

function PageSections({ page }: { page: MarketingPage }) {
  return (
    <SectionShell>
      <div className="grid gap-5 lg:grid-cols-2">
        {page.sections.map((section, index) => (
          <article
            className="rounded-[18px] border border-white/12 bg-[var(--surface)] p-7 sm:p-9"
            key={section.title}
            {...aos(index, index % 2 === 0 ? 'fade-up-right' : 'fade-up-left')}
          >
            {section.points.length > 0 ? (
              <p className="text-sm font-black text-[var(--gold)]">
                {String(index + 1).padStart(2, '0')}
              </p>
            ) : null}
            <h2 className={`${section.points.length > 0 ? 'mt-5' : ''} text-3xl font-black leading-tight text-white`}>
              {section.title}
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-white/55">{section.body}</p>
            {section.points.length > 0 ? (
              <ul className="mt-8 grid gap-3">
                {section.points.map((point) => (
                  <li className="flex gap-3 text-sm font-bold leading-6 text-white/66" key={point}>
                    <Check className="mt-0.5 shrink-0 text-[var(--gold)]" size={17} strokeWidth={2.4} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function JournalistDetail() {
  return (
    <>
      <SectionShell className="pb-20 pt-[116px] lg:pb-28 lg:pt-[132px]">
        <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:items-center">
          <div {...aos(0, 'fade-right')}>
            <p className="section-label">Newsroom workflow</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Make SafeRoute your unfair advantage.
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-white/55">
              From incident to publish, you can move fast with SafeRoute using the workflow your newsroom is most comfortable with.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {journalistWorkflow.map((step, index) => (
              <article className="min-h-64 rounded-[18px] border border-white/12 bg-[var(--surface)] p-7" key={step.title} {...aos(index, 'fade-up')}>
                <p className="text-sm font-black text-[var(--gold)]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-7 text-2xl font-black leading-tight text-white">{step.title}</h3>
                <p className="mt-4 text-base font-semibold leading-7 text-white/54">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="py-10 lg:py-14">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl" {...aos(0, 'fade-up')}>
            Don't lose access.
          </h2>
          <div className="mt-8 grid gap-5 text-left sm:grid-cols-2">
            {journalistAccessCards.map((card, index) => (
              <article className="rounded-[18px] border border-white/12 bg-[var(--surface)] p-7" key={card.title} {...aos(index, 'zoom-in-up')}>
                <h3 className="text-xl font-black leading-tight text-[var(--gold)]">{card.title}</h3>
                <p className="mt-4 text-base font-semibold leading-7 text-white/58">{card.body}</p>
              </article>
            ))}
          </div>
          <a className="gold-button mt-8 w-full sm:w-auto" href="#join-beta" {...aos(2, 'zoom-in')}>
            Book a Meeting
          </a>
        </div>
      </SectionShell>

      <SectionShell className="py-10 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-4">
          {journalistTools.map((tool, index) => (
            <article className="rounded-[18px] border border-white/12 bg-[var(--surface)] p-7" key={tool.label} {...aos(index, 'fade-up')}>
              <p className="text-sm font-black text-[var(--gold)]">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-8 text-2xl font-black leading-tight text-white">{tool.label}</h3>
              <p className="mt-4 text-base font-semibold leading-7 text-white/52">{tool.body}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-8 rounded-[20px] border border-white/12 bg-[var(--surface)] p-7 sm:p-10 lg:grid-cols-[0.52fr_0.48fr] lg:items-center" {...aos(0, 'zoom-in-up')}>
          <div>
            <p className="section-label">Speed, volume & scale</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              SafeRoute is built for speed, volume & scale.
            </h2>
            <div className="mt-6 grid gap-5 text-base font-semibold leading-8 text-white/58">
              <p>
                SafeRoute is being built as a real-time public safety network for Nigeria. When an incident happens, nearby users can share reports and media before formal coverage reaches the scene.
              </p>
              <p>
                SafeRoute for Journalists gives your newsroom searchable access to that footage, with the attribution and permissions needed to publish it responsibly.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Searchable incident footage', 'Location and category filters', 'Attribution built in', 'Responsible publishing flow'].map((item, index) => (
              <div className="rounded-[16px] border border-white/12 bg-black/40 p-5" key={item} {...aos(index, 'fade-up')}>
                <Check className="text-[var(--gold)]" size={22} strokeWidth={2.4} aria-hidden="true" />
                <p className="mt-5 text-lg font-black leading-tight text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </>
  );
}

function EnterpriseDetail() {
  return (
    <SectionShell>
      <div className="grid gap-5 lg:grid-cols-3">
        {enterpriseCapabilities.map((capability, index) => (
          <article className="rounded-[18px] border border-white/12 bg-black p-7" key={capability.label} {...aos(index, 'zoom-in-up')}>
            <capability.icon className="text-[var(--gold)]" size={32} strokeWidth={1.8} aria-hidden="true" />
            <h2 className="mt-8 text-2xl font-black leading-tight text-white">{capability.label}</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-white/52">
              Deliver the right information to the right team at the moment decisions need to be made.
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function AboutDetail() {
  return (
    <SectionShell>
      <div className="mx-auto max-w-4xl text-center" {...aos(0, 'zoom-in')}>
        <p className="section-label">Real stories</p>
        <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
          The outcomes SafeRoute is built to support.
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {realStories.map((story, index) => (
          <article className="min-h-44 rounded-[18px] border border-white/12 bg-black p-5" key={story} {...aos(index, 'flip-up')}>
            <CircleDot className="text-[var(--gold)]" size={21} strokeWidth={2} aria-hidden="true" />
            <h2 className="mt-10 text-xl font-black leading-tight text-white">{story}</h2>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
