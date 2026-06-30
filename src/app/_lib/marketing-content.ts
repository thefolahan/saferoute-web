import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  Copyright,
  Crown,
  Database,
  FileDown,
  Handshake,
  Landmark,
  LifeBuoy,
  LockKeyhole,
  Megaphone,
  Newspaper,
  Radio,
  ScrollText,
  Search,
  ShieldCheck,
  Siren,
  UsersRound,
  Video,
  Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type ContentSection = {
  title: string;
  body: string;
  points: string[];
};

export type MarketingPage = {
  slug: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  visual:
    | 'premium'
    | 'journalist'
    | 'solutions'
    | 'enterprise'
    | 'about'
    | 'partnership'
    | 'support'
    | 'legal';
  icon: LucideIcon;
  stats: Stat[];
  sections: ContentSection[];
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

export const homeStats: Stat[] = [
  { value: 'Real-time', label: 'alerts and incident updates' },
  { value: 'Verified', label: 'community safety signal' },
  { value: 'Always on', label: 'awareness for movement' }
];

export const liveTicker = [
  'Suspicious activity near a transit corridor',
  'Traffic accident reported near a busy junction',
  'Smoke heard around a residential block',
  'Power outage affecting evening movement',
  'Road hazard slowing vehicles nearby'
];

export const homeSignals = [
  {
    title: 'Get Notified',
    body: 'Receive real-time alerts about incidents and safety updates happening near you.',
    icon: BellRing
  },
  {
    title: 'Go Live',
    body: 'Share what you see in real time so your eyes and voice can help keep others safe.',
    icon: Video
  },
  {
    title: 'Search Incidents',
    body: 'Search incidents by location, time, and type to stay informed before you move.',
    icon: Search
  }
];

export const homeNarratives = [
  {
    title: 'Get the full story, faster.',
    body: 'When there is police activity, road closure, fire, flooding, or public disruption, SafeRoute helps people understand what is happening before rumor fills the gap.'
  },
  {
    title: 'Watch incidents unfold.',
    body: 'Live community updates, verified notes, and incident timelines give people a clearer view from more than one angle.'
  },
  {
    title: 'Know instantly.',
    body: 'Speed matters when people need to avoid a street, check on a loved one, or change their route.'
  },
  {
    title: 'Broadcast to help others.',
    body: 'Structured reporting lets people add useful context without turning safety into panic or speculation.'
  }
];

export const realStories = [
  'Man rescued from building fire',
  'Lost child safely reunited',
  'Family avoids flooded route',
  'Driver warned before road hazard',
  'Clinic prepares before emergency arrival'
];

export const premiumComparison = [
  { feature: 'Live incident alerts and updates', free: true, premium: true },
  { feature: 'Go live and share video', free: true, premium: true },
  { feature: 'Advanced incident search', free: true, premium: true },
  { feature: 'Ad-free experience', free: false, premium: true },
  { feature: 'Incident history and saved places', free: false, premium: true },
  { feature: 'Priority incident notifications', free: false, premium: true },
  { feature: 'Custom alert radius and settings', free: false, premium: true },
  { feature: 'Premium support', free: false, premium: true }
];

export const journalistTools = [
  { label: 'Live incident feed', body: 'Monitor incidents from your city, region, or beat.' },
  { label: 'Search and filter incidents', body: 'Filter by location, time, category, and story window.' },
  { label: 'Download and embed verified video', body: 'Use attributed, newsroom-ready clips with cleaner review paths.' },
  { label: 'Archive access', body: 'Build context from historical incidents and developing stories.' }
];

export const enterpriseCapabilities = [
  { label: 'Real-time situational awareness', icon: Radio },
  { label: 'Incident monitoring and alerts', icon: BellRing },
  { label: 'Data insights and analytics', icon: Database },
  { label: 'API access and integrations', icon: Zap },
  { label: 'Scalable workflows for teams and cities', icon: ShieldCheck }
];

export const supportTopics = [
  'SafeRoute Enterprise',
  'SafeRoute Premium',
  'General questions',
  'Privacy',
  'Your account',
  'Using SafeRoute'
];

export const commonQuestions = [
  'What is SafeRoute Premium?',
  'How do I edit my profile or picture?',
  'Where is SafeRoute available?',
  'What is SafeRoute criteria for reporting incidents?',
  'How do I log into or sign up for SafeRoute?',
  'Can I report an incident on SafeRoute?'
];

export const marketingPages: Record<string, MarketingPage> = {
  premium: {
    slug: 'premium',
    label: 'Premium',
    title: 'Get the full picture.',
    description:
      'Unlock deeper incident context, historical reports, personalized alerts, and safety tools built for people who move through the city every day.',
    cta: 'Start Premium',
    visual: 'premium',
    icon: Crown,
    stats: [
      { value: 'More tools', label: 'for personal awareness' },
      { value: 'More context', label: 'before you move' },
      { value: 'Cancel anytime', label: 'no long commitment' }
    ],
    sections: [
      {
        title: 'Everything included with Premium',
        body: 'Premium is for daily commuters, families, power users, and community leaders who want more awareness with less noise.',
        points: [
          'Live incident alerts and updates',
          'Historical incidents and saved places',
          'Customized alert radius and settings',
          'Priority incident notifications'
        ]
      },
      {
        title: 'No commitment. Cancel anytime.',
        body: 'Use deeper search, incident history, and structured updates to understand whether an event affects your street, route, school, workplace, or family.',
        points: [
          'Police and emergency context where available',
          'Nearby registered safety notices where supported',
          'Personalized safety insights',
          'Premium support for account issues'
        ]
      }
    ]
  },
  journalist: {
    slug: 'journalist',
    label: 'Journalist',
    title: 'SafeRoute for media organizations.',
    description:
      'Real-time, human-reviewed, hyper-local incident context for newsrooms that need faster discovery, cleaner verification, and story-ready material.',
    cta: 'Book a newsroom meeting',
    visual: 'journalist',
    icon: Newspaper,
    stats: [
      { value: 'Live', label: 'incident feed' },
      { value: 'Archive', label: 'search by location and time' },
      { value: 'Tools', label: 'for newsroom workflows' }
    ],
    sections: [
      {
        title: 'Why SafeRoute for journalists',
        body: 'News teams need speed, volume, and structure. SafeRoute helps reporters separate verified local signal from noise while preserving source and context discipline.',
        points: [
          'AI-assisted radar for incident discovery',
          'Coverage across key incident categories',
          'Video review and download workflows',
          'Advanced filtering for beats and desks'
        ]
      },
      {
        title: 'Make SafeRoute your unfair advantage',
        body: 'Start from a reported incident, search by category or location, review the timeline, and use attributed media or summary context for faster reporting.',
        points: [
          'Location, date, and time search',
          'Embeddable videos and attributed clips',
          'Three-year archive planning',
          'Story windows that match how journalists work'
        ]
      }
    ]
  },
  solutions: {
    slug: 'solutions',
    label: 'Solutions',
    title: 'Transparent, flexible safety systems for every team.',
    description:
      'SafeRoute Solutions helps teams monitor nearby incidents, reach the right people quickly, and provide safety benefits beyond the workplace.',
    cta: 'Contact sales',
    visual: 'solutions',
    icon: BriefcaseBusiness,
    stats: [
      { value: 'Monitor', label: 'nearby incidents and assets' },
      { value: 'Alert', label: 'targeted people and places' },
      { value: 'Support', label: 'employee safety benefits' }
    ],
    sections: [
      {
        title: 'Monitor',
        body: 'Gain instant visibility into nearby incidents to keep your people and assets aware of unfolding events.',
        points: [
          'Live incident dashboard',
          'Constant monitoring for relevant activity',
          'Real-time incident map',
          'Situational context for better decisions'
        ]
      },
      {
        title: 'Alert',
        body: 'Quickly reach those who need to know with targeted alerts that keep your organization responsive.',
        points: [
          'Rapid mass alerts',
          'Geo-targeted notifications',
          'Multi-channel delivery',
          'Employee and student groups'
        ]
      },
      {
        title: 'Safety agents for employees',
        body: 'Offer extra protection through Premium subscriptions, safety guidance, and advanced tools for people outside work or school hours.',
        points: [
          'Discounted Premium subscriptions',
          'Access to trained safety guidance',
          'Historical incident data',
          'Corporate safety benefit'
        ]
      }
    ]
  },
  enterprise: {
    slug: 'enterprise',
    label: 'Enterprise',
    title: 'Be the first to know, first to act.',
    description:
      'Real-time, verified alerts delivered where your teams work, so you can protect people and operations with confidence.',
    cta: 'Book a demo',
    visual: 'enterprise',
    icon: Building2,
    stats: [
      { value: 'Instant', label: 'verified awareness' },
      { value: 'Live', label: 'incident updates' },
      { value: 'Scale', label: 'for teams and cities' }
    ],
    sections: [
      {
        title: 'Instant, verified awareness',
        body: 'Get notified of exact alert locations from trusted sources and community reports so teams can respond before risks escalate.',
        points: [
          'Incident notifications for desktop and mobile',
          'Incident categories that match your organization',
          'Source-backed context and review',
          'Live updates as situations develop'
        ]
      },
      {
        title: 'Take action with confidence',
        body: 'Notify the people who matter in seconds and receive updates as the situation changes.',
        points: [
          'Real-time incident updates',
          'Easy sharing across teams',
          'Role-based response groups',
          'Audit-ready communication trails'
        ]
      },
      {
        title: 'Rich coverage from the source',
        body: 'Watch verified media, review incident notes, and keep operational teams continuously informed.',
        points: [
          'Public agency and trusted partner feeds where available',
          'Live incident videos',
          'Dedicated safety review workflows',
          'API delivery into your system of record'
        ]
      }
    ]
  },
  about: {
    slug: 'about',
    label: 'About',
    title: 'Making your world a safer place.',
    description:
      'SafeRoute believes stronger communities are safer communities. We are building technology that helps people look out for each other with speed, care, and accountability.',
    cta: 'About SafeRoute',
    visual: 'about',
    icon: UsersRound,
    stats: [
      { value: 'Individuals', label: 'protecting daily movement' },
      { value: 'Communities', label: 'sharing verified context' },
      { value: 'Responders', label: 'benefiting from faster signal' }
    ],
    sections: [
      {
        title: 'SafeRoute is on a mission to make movement safer.',
        body: 'We believe in public information for the good of the public: real-time safety alerts, transparent context, and tools that empower people without encouraging panic.',
        points: [
          'Technology connects us',
          'Community protects us',
          'Transparency builds trust',
          'Safety works better when everyone can access the same signal'
        ]
      },
      {
        title: 'For the greater good',
        body: 'Hospitals, emergency responders, schools, workplaces, and local communities make better decisions when they receive faster, clearer updates.',
        points: [
          'Prepare before an emergency arrives',
          'Direct resources more effectively',
          'Increase transparency between cities and residents',
          'Build the future of public safety together'
        ]
      }
    ]
  },
  partnership: {
    slug: 'partnership',
    label: 'Partnership',
    title: 'Build the future of public safety together.',
    description:
      'SafeRoute partners with civic groups, campuses, media teams, venues, transport operators, employers, and emergency stakeholders to expand responsible safety awareness.',
    cta: 'Partner with us',
    visual: 'partnership',
    icon: Handshake,
    stats: [
      { value: 'Coverage', label: 'for places people move through' },
      { value: 'Trust', label: 'with accountable workflows' },
      { value: 'Action', label: 'from shared information' }
    ],
    sections: [
      {
        title: 'Community-first partnerships',
        body: 'Work with SafeRoute to bring verified incident awareness to the people and places that need it most.',
        points: [
          'Local coverage programs',
          'Campus and venue safety',
          'Mobility and transport partners',
          'Community education'
        ]
      },
      {
        title: 'Operational partnerships',
        body: 'Connect SafeRoute alerts, dashboards, and APIs to the systems your teams already use.',
        points: [
          'Safety dashboards',
          'Incident integrations',
          'Partner reporting channels',
          'Shared response playbooks'
        ]
      }
    ]
  },
  support: {
    slug: 'support',
    label: 'Support',
    title: 'Help Center',
    description:
      'Search for your question or pick a topic below. Get help with Premium, Enterprise, reporting, privacy, accounts, and using SafeRoute.',
    cta: 'Contact support',
    visual: 'support',
    icon: LifeBuoy,
    stats: [
      { value: 'Topics', label: 'organized by product area' },
      { value: 'Questions', label: 'answered clearly' },
      { value: 'Email', label: 'for unresolved issues' }
    ],
    sections: [
      {
        title: 'Welcome to SafeRoute Help Center',
        body: 'Find help for account setup, incident reporting, Premium features, enterprise access, privacy, and general questions.',
        points: supportTopics
      },
      {
        title: 'Common questions',
        body: 'Start with the questions people ask most often, then contact support if you still need help.',
        points: commonQuestions
      }
    ]
  },
  privacy: {
    slug: 'privacy',
    label: 'Privacy',
    title: 'Privacy at SafeRoute.',
    description:
      'SafeRoute mission is to help make movement safer. The same principle applies to your data: collect less, protect more, and use location only for safety.',
    cta: 'Read privacy policy',
    visual: 'legal',
    icon: LockKeyhole,
    stats: [
      { value: 'Minimal', label: 'data collection' },
      { value: 'Logged', label: 'internal access controls' },
      { value: 'Safety', label: 'location use purpose' }
    ],
    sections: [
      {
        title: 'Protecting you means protecting your data',
        body: 'Our infrastructure is designed to store as little personal data as practical, for the shortest duration needed, while keeping the service reliable and secure.',
        points: [
          'Access limited by operational need',
          'Internal access is logged and reviewed',
          'New features receive privacy review',
          'Sensitive reports are handled with extra care'
        ]
      },
      {
        title: 'Your location only for your safety',
        body: 'Location helps SafeRoute route safety alerts to you, such as a fire nearby, road hazard, missing person alert, or dangerous situation in your area.',
        points: [
          'We do not sell your location data',
          'We do not run an advertising business',
          'Public videos may be shared in limited safety or media contexts',
          'Users retain rights to media they create, subject to platform terms'
        ]
      }
    ]
  },
  terms: {
    slug: 'terms',
    label: 'Terms',
    title: 'Terms of Service.',
    description:
      'These terms explain the rules for using SafeRoute, submitting content, receiving alerts, and using safety features responsibly.',
    cta: 'Review terms',
    visual: 'legal',
    icon: ScrollText,
    stats: [
      { value: '18+', label: 'for account eligibility' },
      { value: 'No harm', label: 'unsafe conduct prohibited' },
      { value: 'Alerts', label: 'awareness, not emergency replacement' }
    ],
    sections: [
      {
        title: 'Basic terms and risk assumption',
        body: 'SafeRoute provides awareness tools and safety information. Users must not travel toward, remain near, or interfere with unsafe incidents to capture content.',
        points: [
          'Do not incite or encourage unsafe activity',
          'Do not submit false or misleading reports',
          'Do not harass, identify, or target private individuals',
          'Call emergency services when immediate help is needed'
        ]
      },
      {
        title: 'Content, communications, and subscriptions',
        body: 'By using SafeRoute, you agree to receive service communications, follow platform rules, and understand that Premium or Enterprise features may have additional terms.',
        points: [
          'Push notifications and email may support safety workflows',
          'Some support conversations may be reviewed for quality and training',
          'Subscriptions may renew unless cancelled',
          'Terms may be updated by posting or direct notice'
        ]
      },
      {
        title: 'General terms',
        body: 'If part of these terms cannot be enforced, the remaining terms still apply. SafeRoute may transfer these terms as part of lawful business operations.',
        points: [
          'No waiver from delayed enforcement',
          'No unauthorized assignment by users',
          'Official notices may be provided electronically',
          'These terms work alongside the privacy policy'
        ]
      }
    ]
  },
  copyright: {
    slug: 'copyright',
    label: 'Copyright',
    title: 'Copyright Policy.',
    description:
      'SafeRoute respects intellectual property rights and expects users to upload only content they created, own, or have permission to use.',
    cta: 'Submit a copyright concern',
    visual: 'legal',
    icon: Copyright,
    stats: [
      { value: 'DMCA', label: 'review process' },
      { value: 'Original', label: 'content encouraged' },
      { value: '24-48h', label: 'target review for valid notices' }
    ],
    sections: [
      {
        title: 'What content is prohibited',
        body: 'Do not upload or broadcast content you did not create or do not have permission to use.',
        points: [
          'No footage from other creators without written permission',
          'No copyrighted music without a license',
          'No news broadcasts or clips from media organizations',
          'No content downloaded from other platforms without rights'
        ]
      },
      {
        title: 'What you may upload',
        body: 'You may upload content you personally filmed or created, content with written permission, original commentary, or confirmed public-domain material.',
        points: [
          'Content you personally filmed',
          'Content with explicit written permission',
          'Original commentary and narration',
          'Public-domain content after verification'
        ]
      },
      {
        title: 'How to submit a notice',
        body: 'A copyright notice should identify the work, identify the SafeRoute content at issue, include your contact information, and include good-faith and accuracy statements.',
        points: [
          'Email support with the subject: DMCA Takedown Notice',
          'Include a physical or electronic signature',
          'We review notices for DMCA requirements',
          'Users may submit a counter-notification when appropriate'
        ]
      }
    ]
  }
};

export const marketingPageSlugs = Object.keys(marketingPages);

export function getMarketingPage(slug: string): MarketingPage | undefined {
  return marketingPages[slug];
}

export const iconBank = {
  alert: Siren,
  help: CircleHelp,
  report: Megaphone,
  agency: Landmark,
  download: FileDown
};
