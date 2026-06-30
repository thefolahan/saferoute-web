import {
  AlertTriangle,
  Apple,
  ArrowRight,
  Car,
  CheckCircle2,
  CirclePlay,
  Flame,
  MapPin,
  Play,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { betaMailto, siteConfig } from '../../lib/config';
import {
  formatCategory,
  formatRelativeTime,
  type PublicIncidentPreview
} from '../../lib/incidents';
import {
  enterpriseCapabilities,
  footerNav,
  homeSignals,
  primaryNav,
  type MarketingPage
} from '../_lib/marketing-content';

type ShellProps = {
  active?: string;
  children: ReactNode;
};

export function MarketingShell({ active, children }: ShellProps) {
  const mailto = betaMailto();

  return (
    <div className="min-h-screen bg-black text-white">
      <a
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-[8px] border border-white/20 bg-black px-4 py-2 text-sm font-bold text-white shadow-lg transition focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader active={active} mailto={mailto} />
      <main id="main">{children}</main>
      <MarketingFooter mailto={mailto} />
    </div>
  );
}

function SiteHeader({ active, mailto }: { active?: string; mailto: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/88 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <BrandMark />

        <nav
          className="hidden items-center gap-9 text-xs font-black uppercase tracking-[0.18em] text-white/58 lg:flex"
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
          <details className="group relative lg:hidden">
            <summary className="list-none rounded-[8px] border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/80 transition hover:border-white/35">
              Menu
            </summary>
            <div className="absolute right-0 top-12 grid w-56 gap-1 rounded-[8px] border border-white/12 bg-black p-2 shadow-2xl">
              {[...primaryNav, ...footerNav].map((item) => (
                <a
                  className="rounded-[6px] px-3 py-2 text-sm font-bold text-white/72 transition hover:bg-white/8 hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
          <a
            className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-500"
            href={mailto}
          >
            Get app
          </a>
        </div>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <a className="flex items-center gap-3" href="/" aria-label="SafeRoute home">
      <span className="grid size-9 place-items-center rounded-[8px] border border-white/25 bg-white/[0.03]">
        <Shield size={21} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className="text-xl font-black tracking-[-0.01em] sm:text-2xl">
        SafeRoute
      </span>
    </a>
  );
}

export function HomePageView({ incidents }: { incidents: PublicIncidentPreview[] }) {
  return (
    <MarketingShell>
      <HomeHero incidents={incidents} />
      <SignalSection />
      <EnterpriseSection />
      <HomeCta />
    </MarketingShell>
  );
}

function HomeHero({ incidents }: { incidents: PublicIncidentPreview[] }) {
  return (
    <section className="relative overflow-hidden bg-black pt-[72px]">
      <MapBackdrop />
      <div className="relative mx-auto grid min-h-[860px] w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px_330px] lg:items-center lg:px-10">
        <div className="sr-reveal max-w-2xl">
          <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-white/65">
            <span className="size-2 rounded-full bg-red-600 shadow-[0_0_24px_rgba(228,0,20,0.9)]" />
            Live safety network
          </div>
          <h1 className="max-w-[760px] text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Smarter alerts. Safer routes. Stronger communities.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Real-time safety alerts, verified by the community and local sources,
            so you can move with confidence across Nigerian cities.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <StoreLink
              href={siteConfig.appStoreUrl}
              label="App Store"
              sublabel="Download on the"
              icon={<Apple size={24} strokeWidth={2.3} />}
            />
            <StoreLink
              href={siteConfig.playStoreUrl}
              label="Google Play"
              sublabel="Get it on"
              icon={<Play size={23} strokeWidth={2.3} />}
            />
          </div>

          <div className="mt-11 grid max-w-xl grid-cols-3 divide-x divide-white/14 border-y border-white/10 py-5">
            <Metric value="250K+" label="Active members" />
            <Metric value="98%" label="Verified alerts" tone="green" />
            <Metric value="10K+" label="Alerts this week" />
          </div>
        </div>

        <div className="sr-reveal sr-delay-1 mx-auto w-full max-w-[390px]">
          <PhonePreview incidents={incidents} />
        </div>

        <div className="sr-reveal sr-delay-2 hidden lg:block">
          <LiveIncidentRail incidents={incidents} />
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
  tone = 'white'
}: {
  value: string;
  label: string;
  tone?: 'white' | 'green';
}) {
  return (
    <div className="px-5 first:pl-0">
      <strong className={tone === 'green' ? 'block text-2xl font-black text-green-500' : 'block text-2xl font-black text-white'}>
        {value}
      </strong>
      <span className="mt-2 block text-xs font-semibold leading-5 text-white/55">{label}</span>
    </div>
  );
}

function MapBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="sr-map-pan absolute inset-0 opacity-65"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.74) 50%, rgba(0,0,0,0.96) 100%), url("/images/safety-map-bg.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      <div className="sr-scan absolute inset-y-0 left-1/2 w-px bg-red-500/0" />
      <div className="absolute left-[40%] top-[24%] size-28 rounded-full border border-red-500/40">
        <span className="sr-pulse absolute inset-6 rounded-full border border-red-500/60" />
        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
      </div>
    </div>
  );
}

function StoreLink({
  href,
  label,
  sublabel,
  icon
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: ReactNode;
}) {
  return (
    <a
      className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[8px] border border-white/22 bg-black/50 px-5 text-white transition hover:border-white/55 hover:bg-white/8 sm:w-auto"
      href={href}
      aria-label={`${label} app link`}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="grid text-left leading-none">
        <small className="text-[10px] font-black uppercase tracking-[0.08em] text-white/58">
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
    <div className="sr-float relative mx-auto aspect-[0.58] w-full rounded-[42px] border border-white/20 bg-zinc-950 p-3 shadow-[0_30px_110px_rgba(0,0,0,0.85)] ring-8 ring-black">
      <div className="absolute left-1/2 top-4 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] border border-white/8 bg-[#050505] text-white">
        <div className="z-10 flex items-center justify-between px-5 pt-5 text-xs font-black">
          <span>9:41</span>
          <span>5G</span>
        </div>
        <div className="z-10 mt-5 flex items-start justify-between px-5">
          <div>
            <p className="text-sm font-black">Live incident</p>
            <p className="mt-1 text-xs font-bold text-red-500">
              {topIncident ? formatRelativeTime(topIncident.reportedAt) : '2 min ago'}
            </p>
          </div>
          <span className="text-xl leading-none text-white/70">x</span>
        </div>

        <PhoneMedia />

        <div className="mx-5 mt-4 rounded-[8px] border border-white/10 bg-white/[0.07] p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-red-600">
              <AlertTriangle size={20} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-black">
                {topIncident?.title ?? 'Road block'}
              </h2>
              <p className="mt-1 truncate text-xs font-semibold text-white/58">
                {topIncident
                  ? `${topIncident.city}${topIncident.state ? `, ${topIncident.state}` : ''}`
                  : 'Ikorodu Rd, Lagos'}
              </p>
            </div>
            <span className="text-xs font-black text-red-500">2.4 km</span>
          </div>
        </div>

        <div className="relative mx-5 mt-4 flex-1 overflow-hidden rounded-[8px] border border-white/10">
          <MiniMap />
          <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-red-600 text-white">
            <ArrowRight size={22} strokeWidth={2.4} aria-hidden="true" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 text-xs">
          <div className="bg-black px-5 py-4">
            <p className="font-semibold text-white/45">Witnesses</p>
            <p className="mt-1 font-black">23 nearby</p>
          </div>
          <div className="bg-black px-5 py-4">
            <p className="font-semibold text-white/45">Verified</p>
            <p className="mt-1 font-black text-green-500">Community</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMedia() {
  return (
    <div className="mx-5 mt-4 overflow-hidden rounded-[8px] border border-white/10 bg-zinc-950">
      <div
        className="relative aspect-video"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.54)), url("/images/safety-map-bg.png")',
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
  );
}

function MiniMap() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px), url("/images/safety-map-bg.png")',
          backgroundPosition: 'center',
          backgroundSize: '44px 44px, 44px 44px, cover'
        }}
      />
      <div className="absolute inset-0 bg-black/64" />
      <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600/20 ring-2 ring-red-500/50">
        <MapPin size={30} className="text-red-500" strokeWidth={2.5} aria-hidden="true" />
      </span>
    </>
  );
}

function LiveIncidentRail({ incidents }: { incidents: PublicIncidentPreview[] }) {
  const fallback = incidents.length > 0 ? incidents : [];
  const rows = fallback.slice(0, 5);

  return (
    <aside className="rounded-[8px] border border-white/10 bg-black/48 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
          <span className="size-2 rounded-full bg-red-500" />
          Live incidents
        </div>
        <a className="text-xs font-black text-red-500" href="/solutions">
          View all
        </a>
      </div>
      <div className="grid gap-1">
        {rows.map((incident, index) => (
          <IncidentRailRow incident={incident} index={index} key={incident.id} />
        ))}
      </div>
      <a
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[8px] border border-white/18 text-sm font-black text-white transition hover:bg-white/8"
        href="/solutions"
      >
        See all incidents
      </a>
    </aside>
  );
}

function IncidentRailRow({
  incident,
  index
}: {
  incident: PublicIncidentPreview;
  index: number;
}) {
  const Icon = incident.category.includes('fire')
    ? Flame
    : incident.category.includes('road') || incident.category.includes('accident')
      ? Car
      : ShieldAlert;

  return (
    <article className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-3 border-b border-white/10 py-4 last:border-b-0">
      <span
        className={`grid size-12 place-items-center rounded-[8px] ${
          index % 2 === 0 ? 'bg-red-600 text-white' : 'border border-white/14 text-white'
        }`}
      >
        <Icon size={21} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-black">{formatCategory(incident.category)}</h3>
        <p className="mt-1 truncate text-xs font-semibold text-white/50">
          {incident.city}
          {incident.state ? `, ${incident.state}` : ''}
        </p>
        <p className="mt-2 text-xs text-white/38">{formatRelativeTime(incident.reportedAt)}</p>
      </div>
      <span className="self-center text-xs font-black text-red-500">
        {(index + 1) * 0.6 + 0.6} km
      </span>
    </article>
  );
}

function SignalSection() {
  return (
    <section className="border-y border-white/10 bg-black px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3 lg:divide-x lg:divide-white/12">
        {homeSignals.map((signal, index) => (
          <article
            className="sr-reveal lg:px-12 lg:first:pl-0 lg:last:pr-0"
            key={signal.title}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <signal.icon className="text-red-500" size={42} strokeWidth={1.85} aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-black tracking-[-0.02em]">{signal.title}</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">{signal.body}</p>
            <a className="mt-7 inline-flex items-center gap-2 text-sm font-black text-white" href="/solutions">
              Learn more <ArrowRight size={16} className="text-red-500" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function EnterpriseSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div className="sr-reveal">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/42">
            Built for organizations
          </p>
          <h2 className="mt-8 max-w-xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
            Real-time intelligence for safety teams and newsrooms.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-white/62">
            SafeRoute Enterprise gives organizations the tools to monitor, respond,
            and communicate with speed and accuracy.
          </p>
          <div className="mt-8 grid gap-4">
            {enterpriseCapabilities.slice(0, 4).map((capability) => (
              <div className="flex items-center gap-3 text-sm font-semibold text-white/72" key={capability.label}>
                <span className="grid size-6 place-items-center rounded-full bg-red-600 text-white">
                  <CheckCircle2 size={15} strokeWidth={2.4} />
                </span>
                {capability.label}
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-500" href="/solutions">
              Explore solutions
            </a>
            <a className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-white/18 px-6 text-sm font-black text-white transition hover:bg-white/8" href="/enterprise">
              Book a demo
            </a>
          </div>
        </div>

        <CommandPanel />
      </div>
    </section>
  );
}

function CommandPanel() {
  return (
    <div className="sr-reveal sr-delay-1 rounded-[8px] border border-white/12 bg-white/[0.025] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.85)]">
      <div className="grid min-h-[520px] overflow-hidden rounded-[6px] border border-white/8 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-white/8 bg-black/70 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-2 text-sm font-black">
            <Shield size={17} />
            SafeRoute Enterprise
          </div>
          <div className="grid gap-1 text-sm font-semibold text-white/54">
            {['Overview', 'Incidents', 'Map', 'Alerts', 'Reports', 'Teams', 'Settings'].map((item, index) => (
              <span
                className={`rounded-[6px] px-3 py-3 ${index === 0 ? 'bg-white/10 text-white' : ''}`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </aside>
        <div className="bg-black p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black">Overview</h3>
              <p className="mt-1 text-xs text-white/45">Live overview of incidents and alerts</p>
            </div>
            <Search size={18} className="text-white/50" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <DashboardMetric value="128" label="Active incidents" />
            <DashboardMetric value="96%" label="Verified alerts" />
            <DashboardMetric value="24" label="Responding teams" />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative min-h-[310px] overflow-hidden rounded-[8px] border border-white/10">
              <MiniMap />
              {['left-[30%] top-[22%]', 'left-[62%] top-[38%]', 'left-[48%] top-[68%]', 'left-[78%] top-[70%]'].map((pos, index) => (
                <span
                  className={`absolute ${pos} grid size-8 place-items-center rounded-full ${
                    index === 2 ? 'bg-green-500/25 ring-green-500/50' : 'bg-red-600/25 ring-red-500/50'
                  } ring-2`}
                  key={pos}
                >
                  <span className={`size-2 rounded-full ${index === 2 ? 'bg-green-500' : 'bg-red-500'}`} />
                </span>
              ))}
            </div>
            <div className="rounded-[8px] border border-white/10 p-4">
              <h4 className="mb-3 text-sm font-black">Recent incidents</h4>
              {['Road block', 'Fire reported', 'Car accident'].map((item) => (
                <div className="border-b border-white/8 py-3 last:border-b-0" key={item}>
                  <p className="text-xs font-black">{item}</p>
                  <p className="mt-1 text-[11px] text-white/45">Lagos - 7 min ago</p>
                </div>
              ))}
              <a className="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-[6px] border border-white/16 text-xs font-black" href="/enterprise">
                View all
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 p-4">
      <strong className="block text-3xl font-black">{value}</strong>
      <span className="mt-2 block text-xs text-white/48">{label}</span>
      <span className="mt-2 block text-[11px] font-black text-green-500">+2% vs last 24h</span>
    </div>
  );
}

function HomeCta() {
  return (
    <section className="bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 border-b border-white/10 pb-16 lg:grid-cols-[0.8fr_1fr_0.9fr] lg:items-center">
        <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          Let us build a safer Nigeria.
        </h2>
        <p className="max-w-md text-base leading-8 text-white/62">
          Join thousands of Nigerians and organizations using SafeRoute to stay
          informed, prepared, and protected.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <StoreLink
            href={siteConfig.appStoreUrl}
            label="App Store"
            sublabel="Download on the"
            icon={<Apple size={24} strokeWidth={2.3} />}
          />
          <StoreLink
            href={siteConfig.playStoreUrl}
            label="Google Play"
            sublabel="Get it on"
            icon={<Play size={23} strokeWidth={2.3} />}
          />
        </div>
      </div>
    </section>
  );
}

export function MarketingFooter({ mailto }: { mailto: string }) {
  return (
    <footer className="bg-black px-4 pb-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-6 max-w-56 text-sm leading-7 text-white/58">
            Verified safety intelligence powered by communities across Nigeria.
          </p>
          <div className="mt-8 flex gap-5 text-sm font-black text-white/70">
            <span>X</span>
            <span>IG</span>
            <span>FB</span>
            <span>YT</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <FooterColumn title="Company" links={footerNav.slice(0, 2)} />
          <FooterColumn
            title="Support"
            links={[
              { label: 'Support', href: '/support' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Copyright', href: '/copyright' }
            ]}
          />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 SafeRoute. All rights reserved.</p>
        <a className="font-bold text-white/60" href={mailto}>
          Contact SafeRoute
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
        {title}
      </h3>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a className="text-sm font-semibold text-white/55 transition hover:text-white" href={link.href}>
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
    : undefined;

  return (
    <MarketingShell active={active}>
      <section className="relative overflow-hidden bg-black px-4 pb-16 pt-32 sm:px-6 lg:px-10 lg:pb-24 lg:pt-40">
        <MapBackdrop />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,1fr)] lg:items-center">
          <div className="sr-reveal">
            <div className="mb-7 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/52">
              <page.icon size={17} className="text-red-500" />
              {page.kicker}
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              {page.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-500" href={betaMailto()}>
                {page.cta}
              </a>
              <a className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-white/18 px-6 text-sm font-black text-white transition hover:bg-white/8" href="/support">
                Talk to us
              </a>
            </div>
            <div className="mt-11 grid max-w-2xl gap-4 sm:grid-cols-3">
              {page.stats.map((stat) => (
                <div className="border-t border-white/14 pt-4" key={stat.label}>
                  <strong className="block text-2xl font-black">{stat.value}</strong>
                  <span className="mt-2 block text-xs font-semibold leading-5 text-white/52">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <PageVisual page={page} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          {page.sections.map((section, index) => (
            <article
              className="sr-reveal rounded-[8px] border border-white/10 bg-white/[0.025] p-6 lg:p-8"
              key={section.title}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <h2 className="text-3xl font-black tracking-[-0.03em]">{section.title}</h2>
              <p className="mt-5 text-base leading-8 text-white/62">{section.body}</p>
              <div className="mt-7 grid gap-3">
                {section.points.map((point) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-white/72" key={point}>
                    <span className="grid size-6 place-items-center rounded-full bg-red-600">
                      <CheckCircle2 size={15} strokeWidth={2.4} />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[8px] border border-white/10 bg-white/[0.025] p-6 lg:grid-cols-[0.75fr_1fr] lg:p-10">
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.04em]">
            Built for speed. Designed for restraint.
          </h2>
          <p className="text-base leading-8 text-white/62">
            Every SafeRoute surface keeps the same operating principle: make the
            signal fast, make the context verifiable, and never encourage people
            to move toward danger.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

function PageVisual({ page }: { page: MarketingPage }) {
  if (page.visual === 'enterprise') {
    return <CommandPanel />;
  }

  if (page.visual === 'legal') {
    return <LegalVisual page={page} />;
  }

  const rows =
    page.visual === 'journalist'
      ? ['Police activity confirmed', 'Road closure developing', 'Source media under review']
      : page.visual === 'partnership'
        ? ['Campus watch zone', 'Mobility route sync', 'Community partner channel']
        : page.visual === 'support'
          ? ['Report correction', 'Account support', 'Privacy request']
          : ['Priority route alert', 'Verified area update', 'Saved place watch'];

  return (
    <div className="sr-reveal sr-delay-1 rounded-[8px] border border-white/12 bg-white/[0.025] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.85)]">
      <div className="relative min-h-[520px] overflow-hidden rounded-[6px] border border-white/8 bg-black">
        <MiniMap />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between text-xs font-black">
          <span>{page.label} console</span>
          <span className="text-green-500">Verified</span>
        </div>
        <div className="absolute inset-x-5 bottom-5 grid gap-3">
          {rows.map((row, index) => (
            <div className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-[8px] border border-white/10 bg-black/80 p-3" key={row}>
              <span className={index === 0 ? 'grid size-11 place-items-center rounded-[8px] bg-red-600' : 'grid size-11 place-items-center rounded-[8px] border border-white/12'}>
                {index === 0 ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black">{row}</h3>
                <p className="mt-1 text-xs text-white/45">Lagos corridor - updated now</p>
              </div>
              <ArrowRight size={17} className="text-white/45" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalVisual({ page }: { page: MarketingPage }) {
  return (
    <div className="sr-reveal sr-delay-1 rounded-[8px] border border-white/12 bg-white/[0.025] p-5">
      <div className="rounded-[6px] border border-white/10 bg-black p-6">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <page.icon size={22} className="text-red-500" />
            <span className="text-sm font-black">{page.label}</span>
          </div>
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/42">
            SafeRoute
          </span>
        </div>
        <div className="grid gap-5">
          {page.sections.flatMap((section) => section.points).slice(0, 5).map((point, index) => (
            <div className="grid grid-cols-[32px_1fr] gap-4 border-b border-white/8 pb-5 last:border-b-0" key={point}>
              <span className="text-sm font-black text-white/40">0{index + 1}</span>
              <p className="text-sm font-semibold leading-7 text-white/72">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
