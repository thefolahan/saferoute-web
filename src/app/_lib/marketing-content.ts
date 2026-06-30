import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  Copyright,
  Crown,
  Database,
  Handshake,
  LifeBuoy,
  LockKeyhole,
  Megaphone,
  Newspaper,
  Radio,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: 'Premium', href: '/premium' },
  { label: 'Journalist', href: '/journalist' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Enterprise', href: '/enterprise' }
];

export const footerNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Partnership', href: '/partnership' },
  { label: 'Support', href: '/support' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Copyright', href: '/copyright' }
];

export type MarketingPage = {
  slug: string;
  label: string;
  kicker: string;
  title: string;
  description: string;
  cta: string;
  visual: 'premium' | 'journalist' | 'solutions' | 'enterprise' | 'about' | 'partnership' | 'support' | 'legal';
  icon: LucideIcon;
  stats: { value: string; label: string }[];
  sections: {
    title: string;
    body: string;
    points: string[];
  }[];
};

export const marketingPages: Record<string, MarketingPage> = {
  premium: {
    slug: 'premium',
    label: 'Premium',
    kicker: 'For everyday movement',
    title: 'Personal safety intelligence without the noise.',
    description:
      'Premium gives members faster context, smarter route awareness, and private safety circles for the moments when a basic alert is not enough.',
    cta: 'Get Premium',
    visual: 'premium',
    icon: Crown,
    stats: [
      { value: 'Live', label: 'member-only route context' },
      { value: '24/7', label: 'priority incident monitoring' },
      { value: 'Private', label: 'family and team circles' }
    ],
    sections: [
      {
        title: 'Move with a sharper read on your area',
        body: 'See verified incidents, nearby disruptions, and route-level context in one calm view before you leave.',
        points: ['Priority push alerts', 'Saved places and routes', 'Verified nearby updates']
      },
      {
        title: 'Share safety without broadcasting yourself',
        body: 'Create private circles for family, colleagues, or trusted friends while keeping public reporting responsible.',
        points: ['Private check-ins', 'Quiet location sharing', 'Emergency-ready contacts']
      }
    ]
  },
  journalist: {
    slug: 'journalist',
    label: 'Journalist',
    kicker: 'For reporters and desks',
    title: 'Verified local signal for faster, cleaner reporting.',
    description:
      'Journalist tools help newsrooms discover incidents, verify context, and follow unfolding public-safety stories without relying on rumor feeds.',
    cta: 'Request newsroom access',
    visual: 'journalist',
    icon: Newspaper,
    stats: [
      { value: 'Live', label: 'incident watch desk' },
      { value: 'Verified', label: 'source and location context' },
      { value: 'Export', label: 'clean reporting summaries' }
    ],
    sections: [
      {
        title: 'Start with verified context',
        body: 'Filter incidents by city, category, severity, verification state, and reporter proximity.',
        points: ['Verification trails', 'Source-safe summaries', 'Location confidence']
      },
      {
        title: 'Follow the story as it changes',
        body: 'Track updates over time and separate confirmed developments from noisy public chatter.',
        points: ['Timeline view', 'Media review queue', 'Desk-ready notes']
      }
    ]
  },
  solutions: {
    slug: 'solutions',
    label: 'Solutions',
    kicker: 'For operators',
    title: 'Safety workflows for teams that move through cities.',
    description:
      'SafeRoute Solutions supports campuses, logistics teams, venues, mobility operators, and field teams that need clear safety awareness.',
    cta: 'Explore solutions',
    visual: 'solutions',
    icon: BriefcaseBusiness,
    stats: [
      { value: '6', label: 'launch city corridors' },
      { value: 'API', label: 'incident and alert access' },
      { value: 'Teams', label: 'role-based workflows' }
    ],
    sections: [
      {
        title: 'Monitor where your people actually move',
        body: 'Create watch zones around routes, facilities, campuses, events, and active service areas.',
        points: ['Watch zones', 'Route disruption alerts', 'Operations dashboard']
      },
      {
        title: 'Send the right alert to the right group',
        body: 'Target alerts by area, role, route, or site so teams get useful instructions instead of noise.',
        points: ['Geo-targeted alerts', 'Escalation rules', 'Incident notes']
      }
    ]
  },
  enterprise: {
    slug: 'enterprise',
    label: 'Enterprise',
    kicker: 'For organizations',
    title: 'A command center for safety teams and enterprises.',
    description:
      'Enterprise brings live incident maps, team alerting, audit trails, and integration-ready safety data into one operational surface.',
    cta: 'Book enterprise demo',
    visual: 'enterprise',
    icon: Building2,
    stats: [
      { value: '99.9%', label: 'target API availability' },
      { value: 'RBAC', label: 'role-based controls' },
      { value: 'Audit', label: 'logged response activity' }
    ],
    sections: [
      {
        title: 'Monitor',
        body: 'Gain instant visibility into incidents around facilities, routes, offices, and field teams.',
        points: ['Real-time map', 'Heatmaps', 'Team watchlists']
      },
      {
        title: 'Alert',
        body: 'Reach employees, students, or staff with targeted messages and consistent response guidance.',
        points: ['Mass alerts', 'Geo-targeted delivery', 'Multi-channel support']
      }
    ]
  },
  about: {
    slug: 'about',
    label: 'About',
    kicker: 'Why SafeRoute exists',
    title: 'Making movement safer starts with shared intelligence.',
    description:
      'SafeRoute is building a responsible public-safety network for Nigerian cities: fast enough to matter, careful enough to protect people.',
    cta: 'Meet SafeRoute',
    visual: 'about',
    icon: UsersRound,
    stats: [
      { value: 'Nigeria', label: 'built around local city movement' },
      { value: 'Human', label: 'moderation before broad alerts' },
      { value: '112', label: 'emergency guidance stays visible' }
    ],
    sections: [
      {
        title: 'Community signal, responsibly handled',
        body: 'People see things first. SafeRoute turns that signal into structured, moderated, useful awareness.',
        points: ['Structured reports', 'Moderator review', 'Public safety guidelines']
      },
      {
        title: 'Built for real streets',
        body: 'The product is designed for dense movement corridors, changing road conditions, and city-specific safety needs.',
        points: ['Local categories', 'City-by-city rollout', 'Low-noise alerting']
      }
    ]
  },
  partnership: {
    slug: 'partnership',
    label: 'Partnership',
    kicker: 'Work with SafeRoute',
    title: 'Partner with us to build safer movement systems.',
    description:
      'We work with campuses, transport operators, civic groups, venues, emergency partners, and media teams to improve safety awareness.',
    cta: 'Start a partnership',
    visual: 'partnership',
    icon: Handshake,
    stats: [
      { value: 'Cities', label: 'launch and expansion partners' },
      { value: 'Data', label: 'responsible safety integrations' },
      { value: 'Teams', label: 'joint response workflows' }
    ],
    sections: [
      {
        title: 'Expand verified coverage',
        body: 'Help bring trusted safety signal to areas where people need faster awareness and clearer context.',
        points: ['Coverage partnerships', 'Community education', 'Incident category design']
      },
      {
        title: 'Connect operations',
        body: 'Integrate SafeRoute awareness into dispatch, campus safety, mobility, and venue operations.',
        points: ['API access', 'Operational dashboards', 'Response playbooks']
      }
    ]
  },
  support: {
    slug: 'support',
    label: 'Support',
    kicker: 'Help center',
    title: 'Get help reporting, verifying, and using SafeRoute.',
    description:
      'Find guidance for responsible reports, account help, incident corrections, safety escalation, and abuse reporting.',
    cta: 'Contact support',
    visual: 'support',
    icon: LifeBuoy,
    stats: [
      { value: '24h', label: 'target response for critical reports' },
      { value: 'Guides', label: 'responsible reporting help' },
      { value: 'Review', label: 'incident correction workflow' }
    ],
    sections: [
      {
        title: 'Report responsibly',
        body: 'Use categories, locations, and short notes that help others avoid danger without creating panic.',
        points: ['Incident report help', 'Media guidelines', 'Emergency reminders']
      },
      {
        title: 'Fix or challenge an alert',
        body: 'Submit corrections when an incident is outdated, unclear, duplicated, or potentially harmful.',
        points: ['Correction requests', 'Abuse reports', 'Privacy concerns']
      }
    ]
  },
  privacy: {
    slug: 'privacy',
    label: 'Privacy',
    kicker: 'Privacy principles',
    title: 'Safety technology must protect the people using it.',
    description:
      'SafeRoute is designed around data minimization, location care, reporter protection, and responsible visibility.',
    cta: 'Review privacy',
    visual: 'legal',
    icon: LockKeyhole,
    stats: [
      { value: 'Minimal', label: 'data collection posture' },
      { value: 'Protected', label: 'reporter identity handling' },
      { value: 'Limited', label: 'location precision where needed' }
    ],
    sections: [
      {
        title: 'What we collect',
        body: 'We collect the information needed to operate alerts, verify reports, improve safety workflows, and secure the service.',
        points: ['Account and device basics', 'Incident report content', 'Approximate or report-specific location']
      },
      {
        title: 'How we protect it',
        body: 'Access is limited by operational need, and sensitive reporting flows are designed to reduce public exposure.',
        points: ['Reporter privacy controls', 'Review and moderation', 'Security logging']
      }
    ]
  },
  terms: {
    slug: 'terms',
    label: 'Terms',
    kicker: 'Terms of service',
    title: 'Clear rules for responsible safety reporting.',
    description:
      'SafeRoute is for awareness and responsible reporting. It is not for harassment, vigilantism, suspect identification, or emergency replacement.',
    cta: 'Read terms',
    visual: 'legal',
    icon: ScrollText,
    stats: [
      { value: 'No', label: 'vigilantism or confrontation' },
      { value: '112', label: 'call emergency services when needed' },
      { value: 'Review', label: 'unsafe reports can be removed' }
    ],
    sections: [
      {
        title: 'Acceptable use',
        body: 'Reports must be truthful, useful, and focused on safety conditions rather than targeting private individuals.',
        points: ['No harassment', 'No doxxing', 'No fabricated incidents']
      },
      {
        title: 'Safety disclaimer',
        body: 'SafeRoute helps with awareness, but it does not replace emergency services, professional advice, or official instructions.',
        points: ['Call 112 in emergencies', 'Avoid dangerous areas', 'Follow local authorities']
      }
    ]
  },
  copyright: {
    slug: 'copyright',
    label: 'Copyright',
    kicker: 'Copyright and media',
    title: 'Respecting ownership while keeping communities informed.',
    description:
      'SafeRoute content, marks, interface, and original materials are protected. User-submitted media remains governed by submission rights and law.',
    cta: 'Copyright policy',
    visual: 'legal',
    icon: Copyright,
    stats: [
      { value: 'SafeRoute', label: 'protected brand and interface' },
      { value: 'Reports', label: 'submitted under platform terms' },
      { value: 'Takedown', label: 'review path for claims' }
    ],
    sections: [
      {
        title: 'Platform materials',
        body: 'The SafeRoute brand, UI, copy, layouts, and generated product materials are owned by SafeRoute or licensed for use.',
        points: ['No unauthorized reproduction', 'No confusing brand use', 'No scraping protected materials']
      },
      {
        title: 'Media claims',
        body: 'Rights holders can contact support for copyright concerns, corrections, or takedown review.',
        points: ['Describe the work', 'Identify the content', 'Provide contact details']
      }
    ]
  }
};

export const marketingPageSlugs = Object.keys(marketingPages);

export function getMarketingPage(slug: string): MarketingPage | undefined {
  return marketingPages[slug];
}

export const homeSignals = [
  {
    title: 'Get Notified',
    body: 'Instant push alerts about verified incidents near you, built to help you avoid risk without feeding panic.',
    icon: BellRing
  },
  {
    title: 'Report Safely',
    body: 'Share what you see through structured reports that protect your identity and help moderators verify context.',
    icon: Megaphone
  },
  {
    title: 'Search Incidents',
    body: 'Check what is happening around a route, city, venue, or neighborhood before you move.',
    icon: Search
  }
];

export const enterpriseCapabilities = [
  { label: 'Live incident dashboard', icon: Radio },
  { label: 'Team alerts and escalation workflows', icon: Zap },
  { label: 'API access and system integrations', icon: Database },
  { label: 'Verified alerts from trusted sources', icon: ShieldCheck },
  { label: 'Community intelligence workflows', icon: Sparkles }
];
