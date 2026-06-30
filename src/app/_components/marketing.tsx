import {
  Apple,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Globe2,
  Menu,
  Play,
  Search,
  ShieldCheck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { betaMailto, siteConfig } from '../../lib/config';
import {
  formatCategory,
  formatRelativeTime,
  type PublicIncidentPreview
} from '../../lib/incidents';
import {
  commonQuestions,
  enterpriseCapabilities,
  footerNav,
  homeNarratives,
  homeSignals,
  homeStats,
  iconBank,
  journalistTools,
  liveTicker,
  premiumComparison,
  primaryNav,
  realStories,
  supportTopics,
  type MarketingPage,
  type Stat
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
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-[4px] border border-white/25 bg-black px-4 py-2 text-sm font-bold text-white shadow-lg transition focus:translate-y-0"
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/12 bg-black/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <BrandMark />

        <nav
          className="hidden items-center gap-10 text-xs font-black uppercase tracking-[0.18em] text-white/62 lg:flex"
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
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-[4px] border border-white/18 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/82 transition hover:border-white/45">
              <Menu size={16} strokeWidth={2.2} aria-hidden="true" />
              Menu
            </summary>
            <div className="absolute right-0 top-12 grid w-60 gap-1 rounded-[4px] border border-white/14 bg-black p-2 shadow-2xl">
              {[...primaryNav, ...footerNav].map((item) => (
                <a
                  className="rounded-[3px] px-3 py-2 text-sm font-bold text-white/72 transition hover:bg-white/8 hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
          <a
            className="inline-flex min-h-10 items-center justify-center rounded-[4px] border border-white/28 px-4 text-sm font-black text-white transition hover:border-white hover:bg-white/8"
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
      <img
        className="size-10 shrink-0"
        src="/images/logo.svg"
        alt=""
        width="40"
        height="40"
      />
      <span className="text-xl font-black uppercase tracking-[0.04em] sm:text-2xl">
        SafeRoute
      </span>
    </a>
  );
}

export function HomePageView({ incidents }: { incidents: PublicIncidentPreview[] }) {
  return (
    <MarketingShell>
      <HomeHero incidents={incidents} />
      <LiveTicker incidents={incidents} />
      <SignalSection />
      <NarrativeSection />
      <MissionSection />
      <PremiumPreview />
      <AudienceSection />
      <SupportLegalSection />
      <HomeCta />
    </MarketingShell>
  );
}

function HomeHero({ incidents }: { incidents: PublicIncidentPreview[] }) {
  return (
    <section className="relative overflow-hidden border-b border-white/12 bg-black pt-[72px]">
      <KineticGrid />
      <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1440px] gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:px-10 lg:py-20">
        <div className="sr-reveal max-w-2xl">
          <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Where people protect each other.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            SafeRoute is a real-time community safety network. Get alerted. Go
            live. Share what you see. Together, we make every route safer.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[4px] border border-white/34 px-6 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-white hover:bg-white/8"
              href="#join-beta"
            >
              Get the app <ArrowRight size={16} strokeWidth={2.4} />
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-[4px] border border-white/16 px-6 text-sm font-black uppercase tracking-[0.08em] text-white/76 transition hover:border-white/45 hover:text-white"
              href="/about"
            >
              Learn more
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-white/14 border-y border-white/12 py-5">
            {homeStats.map((stat) => (
              <Metric key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>

        <div className="sr-reveal sr-delay-1">
          <GlobeNetwork incidents={incidents} />
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: Stat) {
  return (
    <div className="px-4 first:pl-0 sm:px-6">
      <strong className="block text-xl font-black text-white sm:text-2xl">{value}</strong>
      <span className="mt-2 block text-xs font-semibold leading-5 text-white/52">{label}</span>
    </div>
  );
}

function KineticGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="sr-drift-grid absolute inset-0 opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(90deg,#000_0%,rgba(0,0,0,0.66)_48%,#000_100%)]" />
      <div className="sr-scan-white absolute inset-y-0 left-1/2 w-px bg-white/0" />
    </div>
  );
}

function GlobeNetwork({ incidents }: { incidents: PublicIncidentPreview[] }) {
  const rows = incidents.slice(0, 4);

  return (
    <div className="relative min-h-[520px] overflow-hidden border border-white/14 bg-black/52 p-5 shadow-[0_34px_120px_rgba(0,0,0,0.9)]">
      <div className="absolute inset-0 opacity-35">
        <GridSurface />
      </div>
      <div className="relative grid min-h-[480px] gap-5 lg:grid-cols-[1fr_290px]">
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border border-white/10 bg-white/[0.015]">
          <div className="sr-orbit absolute size-[460px] rounded-full border border-white/12" />
          <div className="absolute size-[360px] rounded-full border border-white/18" />
          <div className="absolute size-[250px] rounded-full border border-white/12" />
          <svg className="absolute inset-0 size-full text-white/42" viewBox="0 0 640 480" aria-hidden="true">
            <path
              className="sr-draw"
              d="M118 290 C220 190 301 390 432 220 S548 184 590 126"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray="7 10"
            />
            <path
              className="sr-draw sr-delay-2"
              d="M92 158 C206 96 310 159 403 118 S520 104 574 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 12"
            />
          </svg>
          <img
            className="relative z-10 w-[min(62vw,340px)] opacity-95"
            src="/images/logo.svg"
            alt=""
            width="340"
            height="340"
          />
          {['left-[24%] top-[30%]', 'left-[51%] top-[21%]', 'left-[70%] top-[42%]', 'left-[38%] top-[69%]'].map((pos) => (
            <span className={`sr-pulse-white absolute ${pos} size-3 rounded-full bg-white`} key={pos} />
          ))}
        </div>

        <aside className="grid content-between border border-white/10 bg-black/64">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/78">
              <CircleDot size={15} strokeWidth={2.5} aria-hidden="true" />
              Live around you
            </div>
          </div>
          <div className="grid">
            {rows.map((incident) => (
              <a
                className="group grid gap-2 border-b border-white/10 p-5 transition hover:bg-white/[0.035]"
                href="/solutions"
                key={incident.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="line-clamp-2 text-sm font-black leading-5">
                    {incident.title}
                  </h2>
                  <ChevronRight className="mt-1 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-white" size={16} />
                </div>
                <p className="text-xs font-semibold text-white/50">
                  {formatCategory(incident.category)} · {formatRelativeTime(incident.reportedAt)}
                </p>
                <p className="text-xs text-white/40">
                  {incident.city}
                  {incident.state ? `, ${incident.state}` : ''}
                </p>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function GridSurface() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '56px 56px'
      }}
    />
  );
}

function LiveTicker({ incidents }: { incidents: PublicIncidentPreview[] }) {
  const fallback = liveTicker.map((title, index) => ({
    id: `ticker-${index}`,
    title,
    category: 'community_alert',
    reportedAt: new Date(Date.now() - (index + 2) * 60_000).toISOString()
  }));
  const rows = [
    ...incidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      category: formatCategory(incident.category),
      reportedAt: incident.reportedAt
    })),
    ...fallback
  ].slice(0, 8);

  return (
    <section className="overflow-hidden border-b border-white/12 bg-black" aria-label="Live safety ticker">
      <div className="sr-marquee flex w-max">
        {[...rows, ...rows].map((item, index) => (
          <div
            className="grid min-w-[310px] gap-1 border-r border-white/14 px-6 py-5 sm:min-w-[410px]"
            key={`${item.id}-${index}`}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/44">
              {formatRelativeTime(item.reportedAt)}
            </p>
            <p className="truncate text-sm font-black text-white">{item.title}</p>
            <p className="text-xs font-semibold text-white/46">{item.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SignalSection() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-2 lg:grid-cols-3">
        {homeSignals.map((signal, index) => (
          <a
            className="sr-reveal group relative min-h-[330px] overflow-hidden border border-white/14 bg-black p-8 transition hover:bg-white/[0.03]"
            href="/solutions"
            key={signal.title}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GridSurface />
            <span className="relative z-10 text-xs font-black uppercase tracking-[0.18em] text-white/46">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="relative z-10 mt-14 grid size-24 place-items-center rounded-full border border-white/22">
              <span className="sr-pulse-white absolute inset-3 rounded-full border border-white/16" />
              <signal.icon size={42} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <h2 className="relative z-10 mt-10 text-3xl font-black tracking-[-0.035em]">
              {signal.title}
            </h2>
            <p className="relative z-10 mt-4 max-w-sm text-sm leading-7 text-white/62">{signal.body}</p>
            <span className="relative z-10 mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-white">
              Learn more <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function NarrativeSection() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.74fr_1.1fr] lg:items-start">
        <div className="sr-reveal lg:sticky lg:top-28">
          <h2 className="max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            Get the full story, faster.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-white/62">
            Real safety is not just an alert. It is context, confirmation, and
            a clear way to help without creating panic.
          </p>
        </div>
        <div className="grid gap-4">
          {homeNarratives.map((item, index) => (
            <article
              className="sr-reveal grid gap-4 border border-white/14 p-6 sm:grid-cols-[96px_1fr]"
              key={item.title}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/42">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-2xl font-black tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-10 border border-white/14 p-6 lg:grid-cols-[0.74fr_1.1fr_0.72fr] lg:p-10">
        <div className="sr-reveal">
          <p className="text-sm font-black text-white/58">Our Mission</p>
          <h2 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            Technology connects us. Community protects us.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/64">
            SafeRoute exists to empower communities with real-time information
            and tools that promote awareness, accountability, and collective action.
          </p>
          <a
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-[4px] border border-white/24 px-5 text-sm font-black uppercase tracking-[0.08em] transition hover:border-white hover:bg-white/8"
            href="/about"
          >
            About SafeRoute <ArrowRight size={16} />
          </a>
        </div>

        <div className="relative min-h-[320px] overflow-hidden border border-white/10 bg-white/[0.012]">
          <GridSurface />
          <svg className="absolute inset-0 size-full text-white/34" viewBox="0 0 740 380" aria-hidden="true">
            <path className="sr-draw" d="M70 220 C150 100 260 250 370 120 S590 70 690 178" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path className="sr-draw sr-delay-1" d="M90 298 C210 190 288 330 442 218 S640 220 710 90" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="7 10" />
          </svg>
          <img
            className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 opacity-90"
            src="/images/logo.svg"
            alt=""
            width="224"
            height="224"
          />
        </div>

        <div className="sr-reveal sr-delay-1 grid gap-6">
          {[
            ['Community First', 'Built for people, by people.'],
            ['Transparency', 'Verify, share, and trust.'],
            ['Privacy by Design', 'Your data stays protected.'],
            ['Global Impact', 'Safer routes for everyone.']
          ].map(([title, body]) => (
            <div className="grid grid-cols-[40px_1fr] gap-4" key={title}>
              <span className="grid size-10 place-items-center rounded-full border border-white/18">
                <ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-black">{title}</h3>
                <p className="mt-1 text-sm text-white/54">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumPreview() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] border border-white/14 lg:grid-cols-[0.35fr_0.65fr_0.34fr]">
        <div className="border-b border-white/12 p-8 lg:border-b-0 lg:border-r">
          <h2 className="text-3xl font-black tracking-[-0.035em]">SafeRoute Premium</h2>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/58">
            More tools. More awareness. More protection.
          </p>
          <a
            className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-[4px] border border-white/24 px-5 text-sm font-black uppercase tracking-[0.08em] transition hover:border-white hover:bg-white/8"
            href="/premium"
          >
            Start Premium <ArrowRight size={16} />
          </a>
        </div>

        <ComparisonTable />

        <div className="p-8">
          <div className="border border-white/16 p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/62">
              Premium is for
            </h3>
            <div className="mt-6 grid gap-5">
              {['Daily commuters', 'Families', 'Power users', 'Community leaders'].map((item) => (
                <div className="flex gap-3" key={item}>
                  <CircleDot size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-black">{item}</p>
                    <p className="mt-1 text-xs leading-5 text-white/48">Stay informed with more context.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/12 text-[11px] font-black uppercase tracking-[0.16em] text-white/52">
            <th className="px-5 py-4">Features</th>
            <th className="px-5 py-4 text-center">Free</th>
            <th className="px-5 py-4 text-center">Premium</th>
          </tr>
        </thead>
        <tbody>
          {premiumComparison.map((row) => (
            <tr className="border-b border-white/10 last:border-b-0" key={row.feature}>
              <td className="px-5 py-3 font-semibold text-white/72">{row.feature}</td>
              <td className="px-5 py-3 text-center">{row.free ? <CheckMark /> : <Minus />}</td>
              <td className="px-5 py-3 text-center">{row.premium ? <CheckMark /> : <Minus />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CheckMark() {
  return <Check className="mx-auto" size={17} strokeWidth={2.5} aria-label="Included" />;
}

function Minus() {
  return <span className="text-white/38" aria-label="Not included">—</span>;
}

function AudienceSection() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-2">
        <AudiencePanel
          href="/journalist"
          title="For Journalists"
          description="Real-time access. Verified content. Powerful tools for faster stories."
          items={journalistTools.map((tool) => tool.label)}
        />
        <AudiencePanel
          href="/enterprise"
          title="For Organizations & Enterprise"
          description="Awareness at scale. Action that saves lives."
          items={enterpriseCapabilities.map((item) => item.label)}
          orbit
        />
      </div>
    </section>
  );
}

function AudiencePanel({
  title,
  description,
  items,
  href,
  orbit = false
}: {
  title: string;
  description: string;
  items: string[];
  href: string;
  orbit?: boolean;
}) {
  return (
    <a className="group relative min-h-[420px] overflow-hidden border border-white/14 bg-black p-8 transition hover:bg-white/[0.025]" href={href}>
      <GridSurface />
      <div className="relative z-10 grid h-full gap-8 lg:grid-cols-[0.82fr_1fr]">
        <div>
          <h2 className="text-3xl font-black tracking-[-0.035em]">{title}</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/62">{description}</p>
          <span className="mt-7 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.08em]">
            Learn more <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </span>
          <div className="mt-8 grid gap-4">
            {items.slice(0, 4).map((item) => (
              <div className="flex items-center gap-3 text-sm font-semibold text-white/70" key={item}>
                <span className="grid size-7 place-items-center rounded-full border border-white/20">
                  <Check size={15} strokeWidth={2.5} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden min-h-[300px] items-center justify-center lg:flex">
          {orbit ? <OrbitSystem /> : <RouteLattice />}
        </div>
      </div>
    </a>
  );
}

function RouteLattice() {
  return (
    <div className="relative size-full">
      <svg className="absolute inset-0 size-full text-white/34" viewBox="0 0 420 320" aria-hidden="true">
        <path className="sr-draw" d="M30 250L120 140L190 190L298 70L388 132" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path className="sr-draw sr-delay-1" d="M48 86L146 230L242 112L370 248" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 9" />
      </svg>
      {['left-[17%] top-[67%]', 'left-[36%] top-[40%]', 'left-[54%] top-[58%]', 'left-[72%] top-[22%]', 'left-[88%] top-[42%]'].map((pos) => (
        <span className={`absolute ${pos} grid size-12 place-items-center rounded-full border border-white/18 bg-black`} key={pos}>
          <CircleDot size={18} />
        </span>
      ))}
    </div>
  );
}

function OrbitSystem() {
  return (
    <div className="relative grid size-72 place-items-center">
      <div className="sr-orbit absolute inset-0 rounded-full border border-white/16" />
      <div className="absolute inset-10 rounded-full border border-white/12" />
      <div className="absolute inset-20 rounded-full border border-white/12" />
      <img className="relative z-10 size-28" src="/images/logo.svg" alt="" width="112" height="112" />
      {enterpriseCapabilities.slice(0, 5).map((item, index) => {
        const positions = ['left-1/2 top-0 -translate-x-1/2', 'right-1 top-[25%]', 'right-8 bottom-4', 'left-8 bottom-4', 'left-1 top-[25%]'];
        const Icon = item.icon;
        return (
          <span
            className={`absolute ${positions[index]} grid size-11 place-items-center rounded-full border border-white/20 bg-black`}
            key={item.label}
          >
            <Icon size={18} strokeWidth={1.9} />
          </span>
        );
      })}
    </div>
  );
}

function SupportLegalSection() {
  const HelpIcon = iconBank.help;
  const AgencyIcon = iconBank.agency;
  const ReportIcon = iconBank.report;
  const helpCards: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: HelpIcon,
      title: 'Account & Profile',
      body: 'Manage your account and preferences.'
    },
    {
      icon: Globe2,
      title: 'Using SafeRoute',
      body: 'Learn how features work.'
    },
    {
      icon: AgencyIcon,
      title: 'Partnerships',
      body: 'Work with our team.'
    },
    {
      icon: ReportIcon,
      title: 'Report an Issue',
      body: 'Let us know so we can fix it.'
    }
  ];

  return (
    <section className="border-b border-white/12 bg-black px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-4">
        <div className="grid gap-4 border border-white/14 p-6 lg:grid-cols-[0.4fr_1fr] lg:p-8">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.035em]">Need Help?</h2>
            <p className="mt-3 text-sm text-white/58">We are here for you.</p>
            <a
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-[4px] border border-white/24 px-5 text-sm font-black uppercase tracking-[0.08em] transition hover:border-white hover:bg-white/8"
              href="/support"
            >
              Visit help center <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {helpCards.map(({ icon: Icon, title, body }) => (
              <div className="border-l border-white/12 pl-5" key={title}>
                <Icon size={22} strokeWidth={1.8} />
                <h3 className="mt-4 text-sm font-black">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ['Privacy at SafeRoute', 'We collect only what we need to operate safety features and keep you safe.', '/privacy'],
            ['Terms of Service', 'Use SafeRoute responsibly and understand what the platform can and cannot do.', '/terms'],
            ['Your Data. Your Trust.', 'Limited access, security logging, and privacy review for sensitive workflows.', '/privacy']
          ].map(([title, body, href]) => (
            <a
              className="group border border-white/14 p-7 transition hover:bg-white/[0.025]"
              href={href}
              key={title}
            >
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-4 min-h-16 text-sm leading-7 text-white/56">{body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-white">
                Learn more <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCta() {
  return (
    <section id="join-beta" className="bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-8 border-b border-white/12 pb-16 lg:grid-cols-[0.82fr_1fr_0.9fr] lg:items-center">
        <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          Protect your world.
        </h2>
        <p className="max-w-md text-base leading-8 text-white/62">
          Download SafeRoute for free and join a community built around real-time
          alerts, responsible reporting, and shared safety.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <StoreLink
            href={siteConfig.appStoreUrl}
            label="App Store"
            sublabel="Download for free"
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
      className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[4px] border border-white/24 bg-black px-5 text-white transition hover:border-white hover:bg-white/8 sm:w-auto"
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

export function MarketingFooter({ mailto }: { mailto: string }) {
  return (
    <footer className="bg-black px-4 pb-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-12 border-b border-white/12 pb-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-6 max-w-64 text-sm leading-7 text-white/58">
            A real-time community safety network. Information, awareness, action. Safer together.
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
          <FooterColumn title="Support" links={footerNav.slice(2)} />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 SafeRoute. All rights reserved.</p>
        <a className="font-bold text-white/60 transition hover:text-white" href={mailto}>
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
  const mailto = betaMailto();

  return (
    <MarketingShell active={active}>
      <section className="relative overflow-hidden border-b border-white/12 bg-black pt-[72px]">
        <KineticGrid />
        <div className="relative mx-auto grid min-h-[720px] max-w-[1440px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-10">
          <div className="sr-reveal">
            <div className="mb-8 flex items-center gap-3 text-sm font-black text-white/64">
              <page.icon size={19} strokeWidth={1.9} aria-hidden="true" />
              <span className="uppercase tracking-[0.16em]">{page.label}</span>
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              {page.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[4px] border border-white/30 px-6 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-white hover:bg-white/8"
                href={page.visual === 'legal' || page.visual === 'support' ? mailto : '#join-beta'}
              >
                {page.cta} <ArrowRight size={16} />
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-[4px] border border-white/16 px-6 text-sm font-black uppercase tracking-[0.08em] text-white/74 transition hover:border-white/45 hover:text-white"
                href="/"
              >
                Back home
              </a>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-white/14 border-y border-white/12 py-5">
              {page.stats.map((stat) => (
                <Metric key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
          <PageVisual page={page} />
        </div>
      </section>

      <PageSections page={page} />

      {page.visual === 'premium' ? <PremiumPreview /> : null}
      {page.visual === 'journalist' ? <JournalistDetail /> : null}
      {page.visual === 'enterprise' || page.visual === 'solutions' ? <EnterpriseDetail /> : null}
      {page.visual === 'about' ? <AboutDetail /> : null}
      {page.visual === 'support' ? <SupportDetail /> : null}
      {page.visual === 'legal' ? <LegalDetail page={page} /> : null}
      <HomeCta />
    </MarketingShell>
  );
}

function PageVisual({ page }: { page: MarketingPage }) {
  if (page.visual === 'premium') {
    return (
      <div className="sr-reveal sr-delay-1 border border-white/14 bg-black/64 p-4">
        <ComparisonTable />
      </div>
    );
  }

  if (page.visual === 'support') {
    return <SupportVisual />;
  }

  if (page.visual === 'legal') {
    return <LegalVisual />;
  }

  if (page.visual === 'journalist') {
    return <JournalistVisual />;
  }

  if (page.visual === 'enterprise' || page.visual === 'solutions') {
    return <EnterpriseVisual />;
  }

  return (
    <div className="sr-reveal sr-delay-1 relative min-h-[480px] overflow-hidden border border-white/14 bg-black/52 p-8">
      <GridSurface />
      <div className="relative z-10 flex h-full items-center justify-center">
        <OrbitSystem />
      </div>
    </div>
  );
}

function JournalistVisual() {
  return (
    <div className="sr-reveal sr-delay-1 relative min-h-[500px] overflow-hidden border border-white/14 bg-black p-6">
      <GridSurface />
      <div className="relative z-10 grid gap-4">
        <div className="flex items-center justify-between border-b border-white/12 pb-5">
          <h2 className="text-xl font-black">Media Operations</h2>
          <Search size={18} className="text-white/58" />
        </div>
        {journalistTools.map((tool, index) => (
          <article className="grid grid-cols-[48px_1fr] gap-4 border border-white/12 p-4" key={tool.label}>
            <span className="grid size-12 place-items-center rounded-full border border-white/18">
              {index + 1}
            </span>
            <div>
              <h3 className="font-black">{tool.label}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{tool.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function EnterpriseVisual() {
  return (
    <div className="sr-reveal sr-delay-1 border border-white/14 bg-black p-4">
      <div className="grid min-h-[520px] overflow-hidden border border-white/10 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-2 text-sm font-black">
            <img src="/images/logo.svg" className="size-7" alt="" width="28" height="28" />
            Enterprise
          </div>
          <div className="grid gap-1 text-sm font-semibold text-white/54">
            {['Overview', 'Incidents', 'Map', 'Alerts', 'Reports', 'Teams'].map((item, index) => (
              <span className={`px-3 py-3 ${index === 0 ? 'border border-white/16 text-white' : ''}`} key={item}>
                {item}
              </span>
            ))}
          </div>
        </aside>
        <div className="relative overflow-hidden p-5">
          <GridSurface />
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">Overview</h2>
                <p className="mt-1 text-xs text-white/45">Live incident and alert operations</p>
              </div>
              <Search size={18} className="text-white/50" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <DashboardMetric value="128" label="Active incidents" />
              <DashboardMetric value="96%" label="Verified alerts" />
              <DashboardMetric value="24" label="Responding teams" />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              <RouteCanvas />
              <div className="border border-white/12 p-4">
                <h3 className="mb-3 text-sm font-black">Recent incidents</h3>
                {['Road hazard', 'Smoke report', 'Traffic obstruction'].map((item) => (
                  <div className="border-b border-white/10 py-3 last:border-b-0" key={item}>
                    <p className="text-xs font-black">{item}</p>
                    <p className="mt-1 text-[11px] text-white/45">Lagos · 7 min ago</p>
                  </div>
                ))}
                <span className="mt-4 inline-flex min-h-9 w-full items-center justify-center border border-white/16 text-xs font-black">
                  View all
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteCanvas() {
  return (
    <div className="relative min-h-[310px] overflow-hidden border border-white/12">
      <GridSurface />
      <svg className="absolute inset-0 size-full text-white/35" viewBox="0 0 420 310" aria-hidden="true">
        <path className="sr-draw" d="M48 244C110 128 190 278 252 118S350 74 388 144" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path className="sr-draw sr-delay-2" d="M42 94C128 190 203 78 302 238" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 9" />
      </svg>
      {['left-[23%] top-[25%]', 'left-[49%] top-[57%]', 'left-[66%] top-[34%]', 'left-[78%] top-[70%]'].map((pos) => (
        <span className={`absolute ${pos} grid size-11 place-items-center rounded-full border border-white/28 bg-black`} key={pos}>
          <span className="size-2 rounded-full bg-white" />
        </span>
      ))}
    </div>
  );
}

function DashboardMetric({ value, label }: Stat) {
  return (
    <div className="border border-white/12 p-4">
      <strong className="block text-3xl font-black">{value}</strong>
      <span className="mt-2 block text-xs text-white/48">{label}</span>
      <span className="mt-2 block text-[11px] font-black text-white/60">Updated live</span>
    </div>
  );
}

function SupportVisual() {
  return (
    <div className="sr-reveal sr-delay-1 border border-white/14 bg-black p-6">
      <div className="border border-white/12 p-5">
        <div className="flex items-center gap-3 border-b border-white/12 pb-5">
          <Search size={18} />
          <span className="text-sm font-semibold text-white/55">Search for your question</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {supportTopics.map((topic) => (
            <div className="border border-white/12 p-4 text-sm font-black" key={topic}>
              {topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalVisual() {
  return (
    <div className="sr-reveal sr-delay-1 relative overflow-hidden border border-white/14 bg-black p-6">
      <GridSurface />
      <div className="relative z-10 grid gap-4">
        {['Last updated', 'Policy scope', 'User responsibilities', 'Contact and review'].map((item, index) => (
          <div className="flex items-center justify-between border border-white/12 p-5" key={item}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">
                0{index + 1}
              </p>
              <h2 className="mt-2 text-lg font-black">{item}</h2>
            </div>
            <ScrollTextIcon />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollTextIcon() {
  const Icon = iconBank.download;
  return <Icon size={20} className="text-white/58" strokeWidth={1.8} aria-hidden="true" />;
}

function PageSections({ page }: { page: MarketingPage }) {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-2">
        {page.sections.map((section, index) => (
          <article
            className="sr-reveal border border-white/14 p-7 lg:p-9"
            key={section.title}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.035em]">{section.title}</h2>
            <p className="mt-5 text-base leading-8 text-white/62">{section.body}</p>
            <ul className="mt-8 grid gap-3">
              {section.points.map((point) => (
                <li className="flex gap-3 text-sm font-semibold text-white/72" key={point}>
                  <Check className="mt-0.5 shrink-0" size={17} strokeWidth={2.4} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function JournalistDetail() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.72fr_1fr]">
        <div>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Built for speed, volume and scale.</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/62">
            When an incident happens, people nearby are often there first.
            SafeRoute organizes the signal so newsrooms can search, verify, and act quickly.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {journalistTools.map((tool) => (
            <article className="border border-white/14 p-6" key={tool.label}>
              <h3 className="text-xl font-black">{tool.label}</h3>
              <p className="mt-4 text-sm leading-7 text-white/58">{tool.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnterpriseDetail() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-3">
        {enterpriseCapabilities.map((capability) => (
          <article className="border border-white/14 p-7" key={capability.label}>
            <capability.icon size={32} strokeWidth={1.8} />
            <h2 className="mt-8 text-2xl font-black tracking-[-0.025em]">{capability.label}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              Deliver the right information to the right team at the moment decisions need to be made.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutDetail() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-5">
        {realStories.map((story) => (
          <article className="min-h-48 border border-white/14 p-5" key={story}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/38">
              Real stories
            </p>
            <h2 className="mt-10 text-xl font-black leading-tight">{story}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupportDetail() {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.35fr_0.65fr]">
        <div>
          <h2 className="text-4xl font-black tracking-[-0.04em]">Common Questions</h2>
          <p className="mt-5 text-base leading-8 text-white/62">
            Still have questions? Send us an email and the SafeRoute team will help.
          </p>
        </div>
        <div className="grid gap-3">
          {commonQuestions.map((question) => (
            <details className="border border-white/14 p-5" key={question}>
              <summary className="cursor-pointer list-none text-base font-black">{question}</summary>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Our support team can help with this. Contact SafeRoute with your account email, city, and any relevant incident details.
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalDetail({ page }: { page: MarketingPage }) {
  return (
    <section className="border-b border-white/12 bg-black px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl border border-white/14 p-6 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/42">
          Last updated: June 30, 2026
        </p>
        <h2 className="mt-5 text-4xl font-black tracking-[-0.04em]">{page.title}</h2>
        <div className="mt-8 grid gap-6 text-base leading-8 text-white/64">
          <p>
            This page is written as product policy content for SafeRoute. It should
            be reviewed by qualified counsel before launch if it will be treated as
            a binding public legal document.
          </p>
          <p>
            SafeRoute is designed for safety awareness, responsible reporting, and
            operational context. It does not replace emergency services, official
            public instructions, or professional judgment.
          </p>
        </div>
      </div>
    </section>
  );
}
