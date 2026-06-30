import {
  AlertTriangle,
  Apple,
  BellRing,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  MapPin,
  Megaphone,
  Play,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UsersRound
} from 'lucide-react';
import type { ReactNode } from 'react';
import { betaMailto, siteConfig } from '../lib/config';
import {
  formatRelativeTime,
  getIncidentPreview,
  type PublicIncidentPreview
} from '../lib/incidents';

const navItems = [
  { label: 'Premium', href: '#premium' },
  { label: 'Journalist', href: '#journalist' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Enterprise', href: '#enterprise' }
];

const stories = [
  {
    title: 'Avoided a late night road block',
    city: 'Lagos',
    initials: 'LA',
    tone: 'from-zinc-950 via-zinc-700 to-zinc-300'
  },
  {
    title: 'Found a safer route to work',
    city: 'Abuja',
    initials: 'AB',
    tone: 'from-neutral-900 via-stone-600 to-zinc-200'
  },
  {
    title: 'Reported an incident, community verified',
    city: 'Kano',
    initials: 'KN',
    tone: 'from-zinc-950 via-red-950 to-zinc-300'
  },
  {
    title: 'Got real-time alert near my area',
    city: 'Port Harcourt',
    initials: 'PH',
    tone: 'from-black via-zinc-700 to-white'
  },
  {
    title: 'Warned others, kept my area safe',
    city: 'Ibadan',
    initials: 'IB',
    tone: 'from-neutral-950 via-emerald-950 to-zinc-200'
  },
  {
    title: 'Walked home with confidence',
    city: 'Enugu',
    initials: 'EN',
    tone: 'from-black via-zinc-800 to-zinc-300'
  }
];

const alertCards = [
  {
    title: 'Road Block',
    location: 'Ikorodu Rd, Anthony',
    status: 'Updated 2 min ago',
    distance: '2.4 km',
    icon: ShieldAlert,
    tone: 'text-red-600 bg-red-50'
  },
  {
    title: 'Accident',
    location: 'Third Mainland Bridge',
    status: 'Updated 3 min ago',
    distance: '1.2 km',
    icon: AlertTriangle,
    tone: 'text-red-600 bg-red-50'
  },
  {
    title: 'Area Safe',
    location: 'VGC, Lekki',
    status: 'Updated 5 min ago',
    distance: 'Verified',
    icon: ShieldCheck,
    tone: 'text-green-700 bg-green-50'
  }
] as const;

const features = [
  {
    title: 'Get Notified',
    body: 'Receive instant alerts about incidents near you so you can plan ahead and avoid danger.',
    icon: BellRing
  },
  {
    title: 'Report Safely',
    body: 'Share what you see without exposing your identity publicly. Reports stay structured and useful.',
    icon: Megaphone
  },
  {
    title: 'Search Incidents',
    body: 'Check past and current incidents anywhere in Nigeria before you choose a route.',
    icon: Search
  }
];

const trustStats = [
  { value: '250K+', label: 'Active community members', icon: UsersRound },
  { value: '98%', label: 'Verified alerts from trusted sources', icon: ShieldCheck }
];

const coverageCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'];

export default async function HomePage() {
  const incidentPreview = await getIncidentPreview();
  const mailto = betaMailto();

  return (
    <div className="min-h-screen bg-white text-black">
      <a
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-[8px] bg-white px-4 py-2 text-sm font-bold text-black shadow-lg transition focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader mailto={mailto} />
      <main id="main">
        <Hero incidents={incidentPreview} mailto={mailto} />
        <StoryStrip />
        <CoverageSection />
        <FeatureBand />
        <TrustSection />
        <SafetySection />
        <FooterCta mailto={mailto} />
      </main>
    </div>
  );
}

function SiteHeader({ mailto }: { mailto: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-[76px] lg:px-10">
        <a className="flex items-center gap-3" href="#main" aria-label="SafeRoute home">
          <span className="grid size-9 place-items-center rounded-[8px] border border-white/25">
            <Shield size={21} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="text-xl font-black tracking-[-0.01em] sm:text-2xl">
            SafeRoute
          </span>
        </a>

        <nav
          className="hidden items-center gap-10 text-xs font-black uppercase tracking-[0.18em] text-white/60 lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <a className="transition hover:text-white" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <a
            className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-white px-4 text-sm font-black text-black transition hover:bg-zinc-200"
            href={mailto}
          >
            Get app
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({
  incidents,
  mailto
}: {
  incidents: PublicIncidentPreview[];
  mailto: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.82) 48%, rgba(0,0,0,0.72) 100%), url("/images/safety-map-bg.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[720px] w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:min-h-[760px] lg:grid-cols-[minmax(0,1fr)_440px] lg:px-10 lg:py-10">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.12em] text-white/75">
            <span className="size-2 rounded-full bg-red-600" aria-hidden="true" />
            Live safety network
          </div>
          <h1 className="max-w-[780px] text-5xl font-black leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Where safer routes start with everyone.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            SafeRoute connects you to real-time safety alerts, verified by the
            community and local sources so you can move with confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <StoreLink
              href={siteConfig.appStoreUrl}
              label="App Store"
              sublabel="Download on the"
              icon={<Apple size={24} strokeWidth={2.3} />}
              dark
            />
            <StoreLink
              href={siteConfig.playStoreUrl}
              label="Google Play"
              sublabel="Get it on"
              icon={<Play size={23} strokeWidth={2.3} />}
              dark
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 text-sm text-white/75 sm:flex-row sm:items-center">
            <div className="flex -space-x-3" aria-hidden="true">
              {stories.slice(0, 4).map((story) => (
                <span
                  className={`grid size-10 place-items-center rounded-full border-2 border-black bg-gradient-to-br text-[10px] font-black text-white ${story.tone}`}
                  key={story.initials}
                >
                  {story.initials}
                </span>
              ))}
            </div>
            <p className="max-w-xs">
              Join <strong className="text-red-500">250,000+</strong> Nigerians
              building safer communities.
            </p>
          </div>

          <a
            className="mt-8 inline-flex items-center gap-2 text-sm font-black text-white underline-offset-4 hover:underline"
            href={mailto}
          >
            Request beta access
            <ChevronRight size={17} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>

        <div className="mx-auto w-full max-w-[390px] lg:max-w-none">
          <PhonePreview incidents={incidents} />
        </div>
      </div>
    </section>
  );
}

function StoreLink({
  href,
  label,
  sublabel,
  icon,
  dark = false
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: ReactNode;
  dark?: boolean;
}) {
  return (
    <a
      className={`inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[8px] border px-5 transition sm:w-auto ${
        dark
          ? 'border-white/30 bg-black/45 text-white hover:border-white/55'
          : 'border-zinc-300 bg-white text-black hover:border-black'
      }`}
      href={href}
      aria-label={`${label} app link`}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="grid text-left leading-none">
        <small
          className={`text-[10px] font-black uppercase tracking-[0.08em] ${
            dark ? 'text-white/70' : 'text-zinc-500'
          }`}
        >
          {sublabel}
        </small>
        <strong className="text-lg font-black">{label}</strong>
      </span>
    </a>
  );
}

function PhonePreview({ incidents }: { incidents: PublicIncidentPreview[] }) {
  const topIncident = incidents[0];

  return (
    <div className="relative mx-auto aspect-[0.58] w-full max-w-[390px] rounded-[44px] border border-white/25 bg-zinc-950 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.72)] ring-8 ring-zinc-950/95">
      <div className="absolute left-1/2 top-4 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[34px] bg-[#090909] text-white">
        <div className="z-10 flex items-center justify-between px-5 pt-5 text-xs font-black">
          <span>9:41</span>
          <span className="rounded-full bg-black/60 px-8 py-3" aria-hidden="true" />
          <span>5G</span>
        </div>

        <div className="z-10 mt-4 flex items-start justify-between px-5">
          <div>
            <p className="text-sm font-black">Live Incident</p>
            <p className="mt-1 text-xs font-bold text-red-500">
              {topIncident ? formatRelativeTime(topIncident.reportedAt) : '2.4 km away'}
            </p>
          </div>
          <span className="text-xl leading-none text-white/70">x</span>
        </div>

        <div className="mx-5 mt-4 overflow-hidden rounded-[8px] border border-white/10 bg-zinc-900">
          <div
            className="relative aspect-video"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.48)), url("/images/safety-map-bg.png")',
              backgroundPosition: 'center bottom',
              backgroundSize: 'cover'
            }}
          >
            <span className="absolute left-3 top-3 rounded-[6px] bg-red-600 px-2 py-1 text-[10px] font-black uppercase">
              Live
            </span>
            <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/45">
              <CirclePlay size={38} strokeWidth={1.8} aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="mx-5 mt-4 rounded-[8px] border border-white/10 bg-zinc-900/96 p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-red-600">
              <AlertTriangle size={20} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-black">
                {topIncident?.title ?? 'Road Block'}
              </h2>
              <p className="mt-1 truncate text-xs font-semibold text-white/60">
                {topIncident
                  ? `${topIncident.city}${topIncident.state ? `, ${topIncident.state}` : ''}`
                  : 'Ikorodu Rd, Anthony, Lagos'}
              </p>
            </div>
            <span className="text-xs font-black text-red-500">2.4 km</span>
          </div>
        </div>

        <div className="relative mx-5 mt-4 flex-1 overflow-hidden rounded-[8px] border border-white/10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), url("/images/safety-map-bg.png")',
              backgroundPosition: 'center',
              backgroundSize: '44px 44px, 44px 44px, cover'
            }}
          />
          <div className="absolute inset-0 bg-black/58" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600/20 ring-2 ring-red-500/50">
            <MapPin size={30} className="text-red-500" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-white text-black">
            <ChevronRight size={22} strokeWidth={2.4} aria-hidden="true" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 text-xs">
          <div className="bg-zinc-950 px-5 py-4">
            <p className="font-semibold text-white/50">Witnesses</p>
            <p className="mt-1 font-black">23 nearby</p>
          </div>
          <div className="bg-zinc-950 px-5 py-4">
            <p className="font-semibold text-white/50">Verified</p>
            <p className="mt-1 font-black text-green-500">Community</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryStrip() {
  return (
    <section
      id="premium"
      className="bg-white px-4 py-14 text-black sm:px-6 lg:px-10 lg:py-16"
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-black tracking-[-0.02em] sm:text-4xl">
          See how SafeRoute helps people move smarter
        </h2>
        <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {stories.map((story) => (
            <article className="mx-auto max-w-36" key={story.title}>
              <div
                className={`relative mx-auto grid size-24 place-items-center rounded-full bg-gradient-to-br ${story.tone} text-white shadow-sm ring-1 ring-black/15`}
              >
                <CirclePlay size={38} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-sm font-black leading-tight">{story.title}</h3>
              <p className="mt-1 text-xs font-semibold text-zinc-500">{story.city}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverageSection() {
  return (
    <section
      id="solutions"
      className="bg-white px-4 pb-16 pt-8 text-black sm:px-6 lg:px-10 lg:pb-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.03em] sm:text-5xl">
            Real-time alerts.
            <br />
            Real places.
            <br />
            Real people.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-zinc-600">
            From road blocks to accidents and security threats, get verified
            alerts from people around you before you choose a route.
          </p>

          <div className="mt-8 grid gap-4">
            <ProofPoint
              icon={<MapPin size={18} strokeWidth={2.5} />}
              title="Verified by community and local sources"
              tone="bg-red-600 text-white"
            />
            <ProofPoint
              icon={<CirclePlay size={18} strokeWidth={2.3} />}
              title="See what is happening around you"
              tone="bg-black text-white"
            />
            <ProofPoint
              icon={<CheckCircle2 size={18} strokeWidth={2.5} />}
              title="Make smarter, safer decisions"
              tone="bg-green-600 text-white"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2" aria-label="Coverage cities">
            {coverageCities.map((city) => (
              <span
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-zinc-700"
                key={city}
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[430px] lg:min-h-[560px]">
          <div
            className="absolute inset-x-0 bottom-0 top-8 overflow-hidden rounded-t-full bg-zinc-950 shadow-[0_28px_80px_rgba(0,0,0,0.16)]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.40)), url("/images/safety-map-bg.png")',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
            aria-hidden="true"
          />
          <AlertCard className="left-2 top-20 sm:left-10 lg:left-0 lg:top-32" card={alertCards[1]} />
          <AlertCard className="right-0 top-6 sm:right-6 lg:right-14 lg:top-16" card={alertCards[0]} />
          <AlertCard className="bottom-8 right-2 sm:right-10 lg:right-0 lg:bottom-16" card={alertCards[2]} />
        </div>
      </div>
    </section>
  );
}

function ProofPoint({
  icon,
  title,
  tone
}: {
  icon: ReactNode;
  title: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${tone}`}>
        {icon}
      </span>
      <span className="text-sm font-bold text-zinc-800">{title}</span>
    </div>
  );
}

function AlertCard({
  card,
  className
}: {
  card: (typeof alertCards)[number];
  className: string;
}) {
  return (
    <article
      className={`absolute z-10 w-[min(78vw,250px)] rounded-[8px] border border-zinc-200 bg-white p-4 text-black shadow-[0_18px_48px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="flex gap-3">
        <span className={`grid size-9 shrink-0 place-items-center rounded-[8px] ${card.tone}`}>
          <card.icon size={18} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black">{card.title}</h3>
          <p className="mt-1 text-xs font-semibold text-zinc-600">{card.location}</p>
          <div className="mt-3 flex items-center gap-3 text-[11px] font-black">
            <span className="text-zinc-500">{card.status}</span>
            <span className={card.distance === 'Verified' ? 'text-green-700' : 'text-red-600'}>
              {card.distance}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeatureBand() {
  return (
    <section id="enterprise" className="bg-black px-4 py-14 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3 lg:divide-x lg:divide-white/20">
        {features.map((feature) => (
          <article className="lg:px-12 lg:first:pl-0 lg:last:pr-0" key={feature.title}>
            <feature.icon size={44} strokeWidth={1.8} aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-black tracking-[-0.02em]">
              {feature.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="journalist" className="bg-white px-4 py-16 text-black sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_360px] lg:items-center">
        <blockquote>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
            Trusted by communities
          </p>
          <div className="mt-8 text-5xl font-black leading-none text-red-600">&quot;</div>
          <p className="-mt-2 max-w-3xl text-3xl font-black leading-[1.18] tracking-[-0.02em] sm:text-4xl">
            SafeRoute has changed how I move around Lagos. The alerts are fast,
            accurate and most importantly, they come from real people like me.
          </p>
          <footer className="mt-8 border-t border-black pt-5 text-sm font-bold text-zinc-700">
            Adaeze M.
            <span className="block pt-1 font-semibold text-zinc-500">
              Business Owner, Lagos
            </span>
          </footer>
        </blockquote>

        <div className="grid gap-6">
          {trustStats.map((stat) => (
            <article
              className="border-b border-zinc-300 pb-6 last:border-b-0"
              key={stat.value}
            >
              <div className="flex items-center gap-5">
                <stat.icon size={38} strokeWidth={2.1} aria-hidden="true" />
                <div>
                  <strong className="block text-3xl font-black">{stat.value}</strong>
                  <span className="mt-1 block max-w-48 text-sm font-semibold leading-5 text-zinc-600">
                    {stat.label}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="border-y border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-[-0.02em] sm:text-4xl">
            Built to reduce panic, not create it.
          </h2>
        </div>
        <p className="max-w-3xl text-base leading-8 text-zinc-600">
          SafeRoute keeps emergency guidance simple: avoid danger, report
          responsibly, and call 112 in an emergency. Reports are shaped for
          moderation, location privacy, and responsible community updates.
        </p>
      </div>
    </section>
  );
}

function FooterCta({ mailto }: { mailto: string }) {
  return (
    <footer id="join-beta" className="bg-black px-4 pt-16 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <h2 className="text-5xl font-black leading-none tracking-[-0.03em] sm:text-6xl">
            Protect your route.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/70">
            Join thousands of Nigerians building safer streets, one alert at a
            time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <StoreLink
              href={siteConfig.appStoreUrl}
              label="App Store"
              sublabel="Download on the"
              icon={<Apple size={24} strokeWidth={2.3} />}
              dark
            />
            <StoreLink
              href={siteConfig.playStoreUrl}
              label="Google Play"
              sublabel="Get it on"
              icon={<Play size={23} strokeWidth={2.3} />}
              dark
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-[1fr_1fr] sm:items-center">
          <div
            className="min-h-48 rounded-[8px] border border-white/10 bg-zinc-950"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.64)), url("/images/safety-map-bg.png")',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
            aria-hidden="true"
          />
          <div>
            <h3 className="text-3xl font-black leading-tight tracking-[-0.02em]">
              Safer together.
              <br />
              Stronger together.
            </h3>
            <span className="mt-5 block h-1 w-12 bg-green-500" aria-hidden="true" />
            <a
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[8px] bg-white px-5 text-sm font-black text-black transition hover:bg-zinc-200"
              href={mailto}
            >
              Request beta access
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 py-10 text-sm text-white/65 lg:grid-cols-[1fr_2fr]">
        <div>
          <a className="flex items-center gap-3 text-white" href="#main" aria-label="SafeRoute home">
            <span className="grid size-8 place-items-center rounded-[8px] border border-white/25">
              <Shield size={18} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="text-lg font-black">SafeRoute</span>
          </a>
          <p className="mt-4 max-w-44 leading-6">Building safer routes across Nigeria.</p>
          <p id="copyright" className="mt-10 text-xs">
            &copy; 2026 SafeRoute. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <FooterLinks
            title="Company"
            links={[
              { label: 'About', href: '#journalist' },
              { label: 'Partnership', href: '#enterprise' }
            ]}
          />
          <FooterLinks
            title="Support"
            links={[
              { label: 'Support', href: mailto },
              { label: 'Privacy', href: '#privacy', id: 'privacy' },
              { label: 'Terms', href: '#terms', id: 'terms' },
              { label: 'Copyright', href: '#copyright' }
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links
}: {
  title: string;
  links: { label: string; href: string; id?: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white">
        {title}
      </h3>
      <ul className="mt-4 grid gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a className="transition hover:text-white" href={link.href} id={link.id}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
