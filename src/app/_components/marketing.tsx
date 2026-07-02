import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
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
import { MobileMenu } from './mobile-menu';
import {
  commonQuestions,
  enterpriseCapabilities,
  footerNav,
  homeNarratives,
  homeSignals,
  homeStats,
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

type AosProps = {
  'data-aos': string;
  'data-aos-delay': string;
  'data-aos-duration': string;
  'data-aos-easing': string;
  'data-aos-anchor-placement': string;
};

const scrollAnimations = ['fade-up', 'zoom-in-up', 'fade-right', 'fade-left', 'flip-up'] as const;
const headerSecondaryNav = footerNav.filter((item) => item.label !== 'About');

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
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <a
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full border border-white/25 bg-black px-4 py-2 text-sm font-extrabold text-white shadow-lg transition focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader active={active} mailto={mailto} />
      <main id="main">{children}</main>
      <MarketingFooter />
    </div>
  );
}

function SiteHeader({ active, mailto }: { active?: string; mailto: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-neutral-800/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.24)]">
      <div className="mx-auto flex min-h-[96px] w-full max-w-[1280px] items-center justify-between gap-5 px-5 sm:px-8 xl:px-0">
        <BrandMark imageClassName="size-16 shrink-0 sm:size-20" />

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

export function HomePageView({ incidents }: { incidents: PublicIncidentPreview[] }) {
  return (
    <MarketingShell>
      <HomeHero />
      <SignalPanel />
      <IncidentPreviewSection incidents={incidents} />
      <SignalSection />
      <NarrativeSection />
      <MissionSection />
      <PremiumPreview />
      <AudienceSection />
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
  return (
    <section className={`border-b border-white/10 bg-black px-5 py-20 sm:px-8 lg:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </section>
  );
}

function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black px-5 pt-[96px] sm:px-8">
      <HeroGlow />
      <div className="relative mx-auto flex min-h-[720px] w-full max-w-[1280px] flex-col items-center justify-center py-20 text-center">
        <h1
          className="max-w-5xl text-5xl font-black leading-[1.02] text-white sm:text-7xl lg:text-8xl"
          {...aos(0, 'zoom-out')}
        >
          Know before you go.
        </h1>
        <p
          className="mt-8 max-w-3xl text-lg font-semibold leading-8 text-white/58 sm:text-xl sm:leading-9"
          {...aos(1)}
        >
          SafeRoute shows nearby incidents, community alerts, route context,
          and safe reporting tools for people moving through Nigerian cities.
        </p>
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row" {...aos(2)}>
          <a className="gold-button w-full sm:w-auto" href="#join-beta">
            Launch app <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </a>
          <a className="ghost-button w-full sm:w-auto" href="/about">
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}

function HeroGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="size-[520px] rounded-full bg-[radial-gradient(circle,rgba(237,203,138,0.22),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.02)_62%,transparent_72%)] sm:size-[760px] lg:size-[920px]" />
    </div>
  );
}

function SignalPanel() {
  return (
    <section className="-mt-24 border-b border-white/10 bg-black px-5 pb-20 sm:px-8">
      <div
        className="relative mx-auto grid w-full max-w-[1280px] gap-8 rounded-[18px] border border-white/12 bg-[var(--surface)] px-6 py-9 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:grid-cols-3 sm:px-10"
        {...aos(0, 'zoom-in-up')}
      >
        {homeStats.map((stat) => (
          <Metric key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}

function Metric({ value, label }: Stat) {
  return (
    <div className="text-center">
      <strong className="block text-2xl font-black text-white sm:text-3xl">{value}</strong>
      <span className="mt-3 block text-sm font-bold leading-6 text-white/48">{label}</span>
    </div>
  );
}

function IncidentPreviewSection({ incidents }: { incidents: PublicIncidentPreview[] }) {
  const fallback = liveTicker.map((title, index) => ({
    id: `ticker-${index}`,
    title,
    meta: 'Community alert',
    time: `${index + 2} min ago`
  }));
  const rows = incidents.length
    ? incidents.slice(0, 3).map((incident) => ({
        id: incident.id,
        title: incident.title,
        meta: formatCategory(incident.category),
        time: formatRelativeTime(incident.reportedAt)
      }))
    : fallback.slice(0, 3);

  return (
    <SectionShell className="py-16 lg:py-20">
      <div className="grid gap-8">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label">Nearby safety context</p>
          <h2 className="mt-4 max-w-lg text-4xl font-black leading-tight text-white sm:text-5xl">
            Alerts, feed posts, and route signal before you move.
          </h2>
        </div>
        <div className="grid gap-4">
          {rows.map((row, index) => (
            <a
              className="group grid gap-3 rounded-[16px] border border-white/12 bg-[var(--surface)] p-5 transition hover:border-[var(--gold)]/55"
              href="/solutions"
              key={row.id}
              {...aos(index + 1)}
            >
              <div className="flex items-start justify-between gap-5">
                <h3 className="text-xl font-black leading-snug text-white">{row.title}</h3>
                <ChevronRight
                  className="mt-1 shrink-0 text-[var(--gold)] transition group-hover:translate-x-1"
                  size={20}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-bold text-white/45">
                {row.meta} · {row.time}
              </p>
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function SignalSection() {
  return (
    <SectionShell>
      <div className="mx-auto max-w-4xl text-center" {...aos(0, 'zoom-in')}>
        <p className="section-label">Core app flows</p>
        <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">
          Built for fast, calm safety decisions.
        </h2>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {homeSignals.map((signal, index) => (
          <FeatureCard
            body={signal.body}
            href="/solutions"
            icon={signal.icon}
            index={index}
            key={signal.title}
            title={signal.title}
          />
        ))}
      </div>
    </SectionShell>
  );
}

function FeatureCard({
  title,
  body,
  href,
  icon: Icon,
  index
}: {
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
  index: number;
}) {
  return (
    <a
      className="group flex min-h-[300px] flex-col justify-between rounded-[18px] border border-white/12 bg-[var(--surface)] p-7 transition hover:-translate-y-1 hover:border-[var(--gold)]/60"
      href={href}
      {...aos(index, 'flip-up')}
    >
      <span className="grid size-14 place-items-center rounded-full border border-[var(--gold)]/45 text-[var(--gold)]">
        <Icon size={25} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-2xl font-black leading-tight text-white">{title}</h3>
        <p className="mt-4 text-base font-semibold leading-7 text-white/54">{body}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[var(--gold)]">
          Learn more <ArrowRight className="transition group-hover:translate-x-1" size={16} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}

function NarrativeSection() {
  return (
    <SectionShell>
      <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label">How the app works</p>
          <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Nearby context without panic.
          </h2>
          <p className="mt-6 max-w-md text-lg font-semibold leading-8 text-white/52">
            SafeRoute turns map data, community posts, Broadcast reports, and
            citizen alerts into information people can use responsibly.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {homeNarratives.map((item, index) => (
            <article
              className="rounded-[18px] border border-white/12 bg-black p-7"
              key={item.title}
              {...aos(index, index % 2 === 0 ? 'fade-up-right' : 'fade-up-left')}
            >
              <p className="text-sm font-black text-[var(--gold)]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-6 text-2xl font-black leading-tight text-white">{item.title}</h3>
              <p className="mt-4 text-base font-semibold leading-7 text-white/50">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function MissionSection() {
  const values = [
    ['Map first', 'See what is happening near you.'],
    ['Broadcast safely', 'Report only when you are out of danger.'],
    ['Location privacy', 'Use location for safety, not tracking.'],
    ['Call 112', 'Escalate emergencies to official help.']
  ];

  return (
    <SectionShell>
      <div className="grid gap-12 rounded-[20px] border border-white/12 bg-[var(--surface)] p-7 sm:p-10 lg:grid-cols-[0.52fr_0.48fr] lg:p-14">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label">Our mission</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Community signal is useful only when it stays responsible.
          </h2>
          <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/55">
            SafeRoute is built around calm awareness: nearby reports, alert radius
            controls, media moderation, and clear reminders not to move toward danger.
          </p>
          <a className="gold-button mt-9 w-full sm:w-auto" href="/about">
            About SafeRoute <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-5">
          {values.map(([title, body], index) => (
            <div
              className="grid grid-cols-[46px_1fr] gap-4 rounded-[16px] border border-white/10 bg-black/55 p-5"
              key={title}
              {...aos(index + 1, 'fade-left')}
            >
              <span className="grid size-11 place-items-center rounded-full border border-[var(--gold)]/42 text-[var(--gold)]">
                <ShieldCheck size={19} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-black text-white">{title}</h3>
                <p className="mt-1 text-sm font-semibold text-white/48">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function PremiumPreview() {
  return (
    <SectionShell>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label">Premium</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            More control over your safety signal.
          </h2>
          <p className="mt-5 max-w-md text-base font-semibold leading-8 text-white/52">
            Unlock saved places, custom alert radius, notification preferences,
            incident history, and briefing-style updates.
          </p>
          <a className="gold-button mt-8 w-full sm:w-auto" href="/premium">
            Start Premium <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="min-w-0 rounded-[18px] border border-white/12 bg-[var(--surface)] p-3 sm:p-5" {...aos(1, 'zoom-in-left')}>
          <ComparisonTable />
        </div>
      </div>
    </SectionShell>
  );
}

function ComparisonTable() {
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-black text-white/42">
            <th className="px-4 py-4">Features</th>
            <th className="px-4 py-4 text-center">Free</th>
            <th className="px-4 py-4 text-center">Premium</th>
          </tr>
        </thead>
        <tbody>
          {premiumComparison.map((row) => (
            <tr className="border-b border-white/10 last:border-b-0" key={row.feature}>
              <td className="px-4 py-4 font-bold text-white/68">{row.feature}</td>
              <td className="px-4 py-4 text-center">{row.free ? <CheckMark /> : <Minus />}</td>
              <td className="px-4 py-4 text-center">{row.premium ? <CheckMark /> : <Minus />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CheckMark() {
  return <Check className="mx-auto text-[var(--gold)]" size={18} strokeWidth={2.5} aria-label="Included" />;
}

function Minus() {
  return <span className="text-white/30" aria-label="Not included">—</span>;
}

function AudienceSection() {
  return (
    <SectionShell>
      <div className="grid gap-5 lg:grid-cols-2">
        <AudiencePanel
          href="/journalist"
          index={0}
          items={journalistTools.map((tool) => tool.label)}
          title="For Journalists"
          description="Follow nearby alerts, feed posts, trending incidents, media, and category context."
        />
        <AudiencePanel
          href="/enterprise"
          index={1}
          items={enterpriseCapabilities.map((item) => item.label)}
          title="For Organizations & Enterprise"
          description="Location-aware incident monitoring and alert workflows for teams responsible for people."
        />
      </div>
    </SectionShell>
  );
}

function AudiencePanel({
  title,
  description,
  items,
  href,
  index
}: {
  title: string;
  description: string;
  items: string[];
  href: string;
  index: number;
}) {
  return (
    <a
      className="group rounded-[18px] border border-white/12 bg-[var(--surface)] p-7 transition hover:border-[var(--gold)]/55 sm:p-9"
      href={href}
      {...aos(index, index % 2 === 0 ? 'fade-up-right' : 'fade-up-left')}
    >
      <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-5 max-w-lg text-base font-semibold leading-8 text-white/52">{description}</p>
      <div className="mt-8 grid gap-4">
        {items.slice(0, 4).map((item) => (
          <div className="flex items-center gap-3 text-sm font-bold text-white/65" key={item}>
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--gold)]/40 text-[var(--gold)]">
              <Check size={15} strokeWidth={2.5} aria-hidden="true" />
            </span>
            {item}
          </div>
        ))}
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[var(--gold)]">
        Learn more <ArrowRight className="transition group-hover:translate-x-1" size={16} aria-hidden="true" />
      </span>
    </a>
  );
}

function HomeCta() {
  return (
    <section id="join-beta" className="bg-black px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 border-b border-white/10 pb-16 text-center">
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
    <svg className="h-9 w-8 shrink-0 text-white" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.94 12.42c-.02-2.05 1.68-3.05 1.76-3.1-.96-1.4-2.44-1.6-2.96-1.62-1.24-.13-2.45.74-3.08.74-.65 0-1.63-.72-2.69-.7-1.37.02-2.65.8-3.36 2.03-1.45 2.52-.37 6.22 1.02 8.25.7 1 1.51 2.12 2.58 2.08 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.7.65 1.12-.02 1.82-1 2.49-2.01.8-1.15 1.12-2.29 1.13-2.35-.03-.01-2.26-.86-2.28-3.3Zm-2.01-6.04c.56-.7.95-1.64.84-2.6-.82.04-1.85.57-2.43 1.25-.52.6-.99 1.58-.86 2.51.93.07 1.86-.47 2.45-1.16Z"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg className="h-9 w-8 shrink-0" viewBox="0 0 31 35" aria-hidden="true">
      <path fill="#34A853" d="M1.7 1.1c-.5.5-.8 1.3-.8 2.4v28c0 1 .3 1.8.8 2.4l.1.1 15.7-16.4v-.4L1.8 1l-.1.1Z" />
      <path fill="#FBBC04" d="m22.7 23.1-5.2-5.4v-.4l5.2-5.4.1.1 6.2 3.7c1.8 1.1 1.8 2.8 0 3.9l-6.2 3.6-.1-.1Z" />
      <path fill="#EA4335" d="m22.8 23-5.3-5.5L1.7 33.9c.8.8 2 .9 3.4.1l17.7-11Z" />
      <path fill="#4285F4" d="M22.8 12 5.1 1C3.7.2 2.5.3 1.7 1.1l15.8 16.4L22.8 12Z" />
    </svg>
  );
}

function MarketingFooter() {
  return (
    <footer className="bg-neutral-800 px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-12 border-b border-white/10 pb-12 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="flex justify-center lg:justify-start" {...aos(0, 'fade-right')}>
          <BrandMark imageClassName="size-28 shrink-0 sm:size-36 lg:size-40" />
        </div>

        <div className="grid gap-8 sm:grid-cols-3" {...aos(1, 'fade-left')}>
          <FooterColumn title="Product" links={primaryNav} />
          <FooterColumn title="Company" links={footerNav.slice(0, 3)} />
          <FooterColumn title="Legal" links={footerNav.slice(3)} />
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

  return (
    <MarketingShell active={active}>
      <PageHero page={page} mailto={mailto} />
      <PageSections page={page} />
      {page.visual === 'premium' ? <PremiumPreview /> : null}
      {page.visual === 'journalist' ? <JournalistDetail /> : null}
      {page.visual === 'enterprise' || page.visual === 'solutions' ? <EnterpriseDetail /> : null}
      {page.visual === 'about' ? <AboutDetail /> : null}
      {page.visual === 'support' ? <SupportDetail /> : null}
      <HomeCta />
    </MarketingShell>
  );
}

function PageHero({ page, mailto }: { page: MarketingPage; mailto: string }) {
  const Icon = page.icon;
  const targetHref = page.visual === 'legal' || page.visual === 'support' ? mailto : '#join-beta';

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black px-5 pt-[96px] sm:px-8">
      <HeroGlow />
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

function MetricRow({ value, label }: Stat) {
  return (
    <div className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
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
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label">Newsroom workflow</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            Built for speed, volume, and scale.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {journalistTools.map((tool, index) => (
            <article className="rounded-[18px] border border-white/12 bg-black p-7" key={tool.label} {...aos(index, 'flip-up')}>
              <h3 className="text-2xl font-black leading-tight text-white">{tool.label}</h3>
              <p className="mt-4 text-base font-semibold leading-7 text-white/52">{tool.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
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

function SupportDetail() {
  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
        <div {...aos(0, 'fade-right')}>
          <p className="section-label">Common questions</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            Find the answer faster.
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-white/52">
            Still have questions? Send us an email and the SafeRoute team will help.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {supportTopics.slice(0, 5).map((topic) => (
              <span
                className="rounded-full border border-white/12 px-4 py-2 text-sm font-black text-white/48"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {commonQuestions.map((question, index) => (
            <details className="rounded-[16px] border border-white/12 bg-[var(--surface)] p-5" key={question} {...aos(index, 'fade-left')}>
              <summary className="cursor-pointer list-none text-base font-black text-white">{question}</summary>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/52">
                Our support team can help with this. Contact SafeRoute with your account email, city, and any relevant incident details.
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
