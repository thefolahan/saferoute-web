import {
  AlertTriangle,
  Apple,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  Flame,
  LockKeyhole,
  MapPin,
  Megaphone,
  Navigation,
  Play,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  Siren,
  UsersRound
} from 'lucide-react';
import type { ReactNode } from 'react';
import { betaMailto, siteConfig } from '../lib/config';
import {
  formatCategory,
  formatRelativeTime,
  getIncidentPreview,
  type PublicIncidentPreview
} from '../lib/incidents';

const stats = [
  { value: '3,200+', label: 'Verified alerts this month' },
  { value: '18,000+', label: 'Beta users in Nigeria' },
  { value: '92%', label: 'Alerts verified before push' },
  { value: '2.5 min', label: 'Average alert creation time' }
];

const features = [
  {
    title: 'Get Notified',
    body: 'See safety alerts around you in real time so you can plan better routes and avoid danger.',
    icon: BellRing
  },
  {
    title: 'Report Safely',
    body: 'Submit incidents with location, category, details, and media without exposing your identity publicly.',
    icon: Megaphone
  },
  {
    title: 'Search Incidents',
    body: 'Review recent incidents by city, category, and status before you head out.',
    icon: Search
  }
];

const trustItems = [
  {
    title: 'Verified Alerts',
    body: 'Reports are reviewed before broad public alerts are sent.',
    icon: ShieldCheck
  },
  {
    title: 'Human Moderation',
    body: 'Trained moderators review sensitive incidents, unsafe language, and media.',
    icon: UsersRound
  },
  {
    title: 'Privacy First',
    body: 'Reporter identity and exact private locations are not exposed publicly.',
    icon: LockKeyhole
  },
  {
    title: 'Responsible Reporting',
    body: 'Guidelines keep reports useful without encouraging panic or confrontation.',
    icon: Eye
  }
];

const cities = [
  { name: 'Lagos', state: 'Lagos', status: 'Most active', live: true },
  { name: 'Abuja', state: 'FCT', status: 'High activity', live: true },
  { name: 'Port Harcourt', state: 'Rivers', status: 'Rising', live: true },
  { name: 'Ibadan', state: 'Oyo', status: 'Rising', live: true },
  { name: 'Kano', state: 'Kano', status: 'Join beta', live: false },
  { name: 'Enugu', state: 'Enugu', status: 'Join beta', live: false }
];

export default async function HomePage() {
  const incidentPreview = await getIncidentPreview();
  const mailto = betaMailto();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader mailto={mailto} />
      <main id="main">
        <Hero incidents={incidentPreview} mailto={mailto} />
        <StatsRail />
        <FeatureSection />
        <TrustSection />
        <CoverageSection />
        <EmergencySection />
        <FinalCta mailto={mailto} />
      </main>
    </>
  );
}

function SiteHeader({ mailto }: { mailto: string }) {
  return (
    <header className="site-header">
      <a className="brand" href="#main" aria-label="SafeRoute home">
        <span className="brand-mark" aria-hidden="true">
          <ShieldAlert size={20} strokeWidth={2.4} />
        </span>
        <span>SafeRoute</span>
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#coverage">Coverage</a>
        <a href="#trust">Trust</a>
        <a href="#safety">Safety</a>
      </nav>
      <div className="header-actions">
        <a className="button button-ghost" href="#live-preview">
          See live preview
        </a>
        <a className="button button-primary" href={mailto}>
          Join Beta
        </a>
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
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>Know what is happening nearby before you move</h1>
          <p>
            SafeRoute helps people in Nigerian cities see verified safety
            alerts, report incidents responsibly, and call 112 when it matters.
          </p>
          <div className="hero-actions" aria-label="SafeRoute actions">
            <a className="button button-primary button-large" href={mailto}>
              Join Beta
            </a>
            <a className="button button-outline button-large" href="#live-preview">
              See live preview
              <ChevronRight size={18} strokeWidth={2.2} />
            </a>
          </div>
          <div className="store-actions" aria-label="App store links">
            <StoreLink
              href={siteConfig.appStoreUrl}
              label="App Store"
              sublabel="Download on the"
              icon={<Apple size={24} strokeWidth={2.2} />}
            />
            <StoreLink
              href={siteConfig.playStoreUrl}
              label="Google Play"
              sublabel="Get it on"
              icon={<Play size={23} strokeWidth={2.2} />}
            />
          </div>
        </div>
        <div className="hero-product" id="live-preview">
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
  icon
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: ReactNode;
}) {
  return (
    <a className="store-link" href={href} aria-label={`${label} app link`}>
      <span aria-hidden="true">{icon}</span>
      <span>
        <small>{sublabel}</small>
        <strong>{label}</strong>
      </span>
    </a>
  );
}

function PhonePreview({ incidents }: { incidents: PublicIncidentPreview[] }) {
  return (
    <div className="phone-frame" aria-label="SafeRoute app preview">
      <div className="phone-speaker" aria-hidden="true" />
      <div className="phone-status">
        <span>9:41</span>
        <span>SafeRoute</span>
        <BellRing size={15} strokeWidth={2.2} />
      </div>
      <div className="phone-tabs" aria-hidden="true">
        <span>Live</span>
        <span className="active">Map</span>
        <span>Updates</span>
      </div>
      <div className="mini-map" aria-hidden="true">
        <span className="map-label label-yaba">Yaba</span>
        <span className="map-label label-lekki">Lekki</span>
        <span className="pin pin-danger pin-one" />
        <span className="pin pin-danger pin-two" />
        <span className="pin pin-safe pin-three" />
        <span className="pin pin-danger pin-four" />
      </div>
      <div className="phone-alerts">
        <div className="phone-alerts-header">
          <strong>Nearby alerts</strong>
          <span>
            Verified only
            <span className="toggle-on" aria-hidden="true" />
          </span>
        </div>
        <div className="alert-list">
          {incidents.map((incident) => (
            <IncidentRow key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
      <div className="phone-nav" aria-hidden="true">
        <Navigation size={16} />
        <Radio size={16} />
        <span className="sos-button">112</span>
        <Search size={16} />
        <UsersRound size={16} />
      </div>
    </div>
  );
}

function IncidentRow({ incident }: { incident: PublicIncidentPreview }) {
  const verified =
    incident.status === 'verified' ||
    incident.verificationStatus === 'moderator_verified' ||
    incident.verificationStatus === 'official_verified';

  return (
    <article className="incident-row">
      <span
        className={
          incident.severity === 'critical'
            ? 'incident-icon incident-critical'
            : 'incident-icon'
        }
        aria-hidden="true"
      >
        {incident.category === 'fire_outbreak' ? (
          <Flame size={15} strokeWidth={2.4} />
        ) : (
          <AlertTriangle size={15} strokeWidth={2.4} />
        )}
      </span>
      <div>
        <strong>{formatCategory(incident.category)}</strong>
        <span>
          {incident.city}
          {incident.state ? `, ${incident.state}` : ''}
        </span>
      </div>
      <time dateTime={incident.reportedAt}>
        {verified ? 'Verified' : formatRelativeTime(incident.reportedAt)}
      </time>
    </article>
  );
}

function StatsRail() {
  return (
    <section className="stats-rail" aria-label="SafeRoute beta statistics">
      {stats.map((item) => (
        <div className="stat-item" key={item.label}>
          <CheckCircle2 size={30} strokeWidth={2.1} />
          <div>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="section feature-section" id="how-it-works">
      <div className="section-heading">
        <h2>Everything you need to stay safer</h2>
        <p>
          Built for city movement, fast reporting, and cautious public alerts.
        </p>
      </div>
      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <span className="feature-icon" aria-hidden="true">
              <feature.icon size={32} strokeWidth={2.1} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>
      <div className="workflow-grid">
        <div className="workflow-panel map-panel">
          <MapPin className="floating-pin" size={30} strokeWidth={2.2} />
          <div className="incident-card">
            <span className="incident-icon incident-critical" aria-hidden="true">
              <Flame size={18} strokeWidth={2.3} />
            </span>
            <div>
              <strong>Fire outbreak reported</strong>
              <span>Yaba, Lagos</span>
            </div>
          </div>
        </div>
        <div className="workflow-panel report-panel">
          <h3>Report an incident</h3>
          <label>
            What happened?
            <span>Select incident type</span>
          </label>
          <label>
            Where did it happen?
            <span className="field-success">Use my location</span>
          </label>
          <label>
            Add details
            <span>Share helpful, safe details</span>
          </label>
          <button type="button">Submit report</button>
        </div>
        <div className="workflow-panel search-panel">
          <div className="search-input">
            <Search size={17} strokeWidth={2.1} />
            <span>Lekki</span>
            <ChevronRight size={16} strokeWidth={2.1} />
          </div>
          <IncidentMini title="Accident" location="Lekki Expressway" />
          <IncidentMini title="Road obstruction" location="Lekki Phase 1" />
          <IncidentMini title="Fire incident" location="Ikate, Lekki" />
        </div>
      </div>
    </section>
  );
}

function IncidentMini({ title, location }: { title: string; location: string }) {
  return (
    <div className="incident-mini">
      <ShieldAlert size={18} strokeWidth={2.2} />
      <div>
        <strong>{title}</strong>
        <span>{location}</span>
      </div>
      <Clock3 size={15} strokeWidth={2.1} />
    </div>
  );
}

function TrustSection() {
  return (
    <section className="section trust-section" id="trust">
      <div className="section-heading">
        <h2>Built on trust and privacy</h2>
        <p>
          Public safety tools can cause harm if they publish too fast. SafeRoute
          is designed around moderation, location privacy, and auditability.
        </p>
      </div>
      <div className="trust-grid">
        {trustItems.map((item) => (
          <article className="trust-item" key={item.title}>
            <span aria-hidden="true">
              <item.icon size={34} strokeWidth={2.1} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CoverageSection() {
  return (
    <section className="section coverage-section" id="coverage">
      <div className="section-heading">
        <h2>Cities we cover</h2>
        <p>
          SafeRoute starts with Nigeria&apos;s highest-density movement
          corridors and expands city by city.
        </p>
      </div>
      <div className="city-grid">
        {cities.map((city) => (
          <article className="city-card" key={city.name}>
            <div>
              <h3>{city.name}</h3>
              <p>{city.state}</p>
            </div>
            <span className={city.live ? 'city-live' : 'city-soon'}>
              {city.live ? 'Live coverage' : 'Coming soon'}
            </span>
            <strong>{city.status}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmergencySection() {
  return (
    <section className="emergency-section" id="safety">
      <div>
        <Siren size={42} strokeWidth={2.1} />
        <h2>Emergency action stays simple</h2>
      </div>
      <p>
        Every SafeRoute flow keeps one clear instruction visible: stay away from
        danger and call 112 in an emergency. The product does not encourage
        pursuit, confrontation, or public suspect identification.
      </p>
    </section>
  );
}

function FinalCta({ mailto }: { mailto: string }) {
  return (
    <section className="final-cta" id="join-beta">
      <div>
        <h2>Help build a safer Nigeria</h2>
        <p>
          Join the beta, share feedback, and help make every move a safer one.
        </p>
        <div className="store-actions">
          <StoreLink
            href={siteConfig.appStoreUrl}
            label="App Store"
            sublabel="Download on the"
            icon={<Apple size={24} strokeWidth={2.2} />}
          />
          <StoreLink
            href={siteConfig.playStoreUrl}
            label="Google Play"
            sublabel="Get it on"
            icon={<Play size={23} strokeWidth={2.2} />}
          />
        </div>
      </div>
      <a className="button button-primary button-large" href={mailto}>
        Request Beta Access
      </a>
    </section>
  );
}


