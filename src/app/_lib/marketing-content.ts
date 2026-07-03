import {
  BellRing,
  Building2,
  CircleHelp,
  Copyright,
  Crown,
  Database,
  FileDown,
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
    | 'enterprise'
    | 'about'
    | 'support'
    | 'legal';
  icon: LucideIcon;
  stats: Stat[];
  sections: ContentSection[];
};

export const primaryNav: NavItem[] = [
  { label: 'Premium', href: '/premium' },
  { label: 'Journalist', href: '/journalist' },
  { label: 'Enterprise', href: '/enterprise' }
];

export const footerNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Support', href: '/support' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Copyright', href: '/copyright' }
];

export const homeStats: Stat[] = [
  { value: 'Nearby', label: 'incidents mapped around your location' },
  { value: 'Broadcast', label: 'photo or video reports when safe' },
  { value: '112', label: 'emergency escalation in Nigeria' }
];

export const liveTicker = [
  'Road accident reported near a busy junction',
  'Fire outbreak update shared by nearby users',
  'Missing person notice active in the city feed',
  'Community alert active within a 1 km radius',
  'Security activity reported near a transit route'
];

export const homeSignals = [
  {
    title: 'Nearby Alerts',
    body: 'See incidents, active citizen alerts, feed posts, and trending safety updates near your current location.',
    icon: BellRing
  },
  {
    title: 'Broadcast Safely',
    body: 'Attach a photo or video, choose a category, and report what is happening only when it is safe to do so.',
    icon: Video
  },
  {
    title: 'Route Awareness',
    body: 'Search places, inspect nearby reports, and understand what is happening along the route before you move.',
    icon: Search
  }
];

export const homeNarratives = [
  {
    title: 'Open the nearby safety map.',
    body: 'SafeRoute starts with a live map around you. View incidents, citizen-alert regions, road hazards, security activity, fire, flood, medical emergencies, and missing-person reports.'
  },
  {
    title: 'Move between Alerts, Feed, and Trending.',
    body: 'The mobile app separates urgent nearby alerts from community posts and trending incidents so people can scan the right signal quickly.'
  },
  {
    title: 'Broadcast only when it is safe.',
    body: 'Reports are structured by category and location. Media is uploaded through controlled storage and can be moderated before wider visibility.'
  },
  {
    title: 'Alert the community and call 112.',
    body: 'Citizen alerts are built to warn people nearby, not send them toward danger. In an emergency, SafeRoute keeps the official 112 escalation front and center.'
  }
];

export const realStories = [
  'Driver reroutes after a collision report',
  'Family receives a missing-person alert',
  'Commuter avoids a flooded road',
  'Nearby users see a fire update faster',
  'Community alert reaches people in range'
];

export const premiumComparison = [
  { feature: 'Live incident alerts and updates', free: true, premium: true },
  { feature: 'Listen to real police radio', free: false, premium: true },
  { feature: 'Unlock past incidents in your area', free: false, premium: true },
  { feature: 'Search registered offenders near you', free: false, premium: true },
  { feature: 'Customize your alert radius and settings', free: false, premium: true }
];

export const journalistTools = [
  { label: 'AI-powered Radar', body: 'Continuously monitors and analyzes real-time data streams to detect, classify, and surface critical incidents with high precision.' },
  { label: '18+ Incident Categories', body: 'Comprehensive coverage across a wide range of incident categories, enabling structured detection and consistent response workflows.' },
  { label: 'Video Downloads', body: 'Easily view, download, or embed videos streamed on the ground and verified near incidents.' },
  { label: 'Pro Power Tools', body: 'Advanced tools for filtering and deeper analysis, designed to accelerate operational efficiency.' }
];

export const enterpriseCapabilities = [
  { label: 'Nearby incident monitoring', icon: Radio },
  { label: 'Community and employee alerting', icon: BellRing },
  { label: 'Location and category intelligence', icon: Database },
  { label: 'API access for safety systems', icon: Zap },
  { label: 'Moderation-aware workflows for teams', icon: ShieldCheck }
];

export const supportTopics = [
  'Broadcasting reports',
  'Nearby alerts',
  'Map and route search',
  'Privacy and location',
  'Account and OTP',
  'Premium and notifications'
];

export const commonQuestions = [
  'How do I broadcast a report safely?',
  'Why does SafeRoute ask for location permission?',
  'What happens after I alert the community?',
  'When should I call 112 instead of using the app?',
  'How do Feed and Trending differ from Alerts?',
  'How do I manage notification preferences?'
];

export const termsPolicySections: ContentSection[] = [
  {
    title: '1. SafeRoute is for safety awareness, not emergency dispatch',
    body: 'SafeRoute helps people understand nearby safety reports, community alerts, road hazards, fire, flooding, accidents, missing-person notices, and other public-safety information. SafeRoute is not a police service, ambulance service, fire service, government emergency dispatch center, or guaranteed rescue service. In Nigeria, call 112 in an emergency.',
    points: []
  },
  {
    title: '2. Use the app without putting yourself in danger',
    body: 'You must not approach dangerous scenes, chase suspects, livestream active violence, interfere with responders, or encourage others to gather at a risky location. If you report an incident, do it only when it is safe. Stay away from danger and follow official instructions.',
    points: []
  },
  {
    title: '3. Reporting rules',
    body: 'Reports must be made in good faith and must describe what you reasonably believe is true. Do not submit hoaxes, rumors presented as facts, private accusations, ethnic or religious blame, exact private home addresses, threats, weapon guidance, or content that may trigger mob action. Serious allegations may be held for moderation before wide public alerting.',
    points: []
  },
  {
    title: '4. Verification and moderation',
    body: 'SafeRoute may mark reports as reported, under review, verified, resolved, rejected, duplicate, or expired. We may use moderator review, trusted reporters, multiple nearby reports, media evidence, official sources, confidence scoring, and abuse detection. We may remove, reduce visibility, or delay alerts when content creates panic, privacy risk, or harm.',
    points: []
  },
  {
    title: '5. Community alerts and SOS-style features',
    body: 'Community alerts are designed to ask nearby SafeRoute users to be aware, avoid danger, and call 112 where appropriate. They are not a request for vigilantism or confrontation. Users receiving alerts should not go to a dangerous scene unless they are trained responders acting within the law.',
    points: []
  },
  {
    title: '6. Account security',
    body: 'You are responsible for keeping your device and account secure. Sign-in methods may include Google, Apple, and phone OTP. Do not share verification codes or recovery details. We may suspend accounts involved in spam, impersonation, false emergency reporting, harassment, or unsafe behavior.',
    points: []
  },
  {
    title: '7. Media and user content',
    body: 'If you upload photos, videos, audio, text, or location details, you give SafeRoute permission to process, moderate, store, display, and share that content as needed to operate safety features. Do not upload graphic violence, private faces in sensitive contexts, private identity documents, illegal content, or media you do not have the right to share.',
    points: []
  },
  {
    title: '8. Privacy and location safety',
    body: 'SafeRoute is built around sensitive location data. We may hide exact locations, round locations, remove metadata, restrict media, or limit visibility to protect users and bystanders. You should not use SafeRoute to track private people, expose private homes, or identify alleged suspects.',
    points: []
  },
  {
    title: '9. No guarantee of accuracy',
    body: 'Incident information may be incomplete, delayed, wrong, duplicated, or later rejected. SafeRoute provides safety awareness, not legal, security, medical, or emergency advice. Always use your judgment, call 112 in emergencies, and follow official agency instructions.',
    points: []
  },
  {
    title: '10. Changes and enforcement',
    body: 'We may update these Terms as SafeRoute grows across Nigeria and Africa. We may enforce these Terms by limiting features, removing content, suspending accounts, preserving evidence of abuse, or cooperating with lawful requests where legally required and appropriate.',
    points: []
  }
];

export const privacyPolicySections: ContentSection[] = [
  {
    title: '1. What SafeRoute collects',
    body: 'SafeRoute may collect account details such as your name or display name, phone number, email address, sign-in provider identity, profile settings, device identifiers, push tokens, preferred city, alert radius, emergency contacts you choose to save, and app activity needed to operate the service.',
    points: []
  },
  {
    title: '2. Location data',
    body: 'SafeRoute requests live location permission so it can show nearby incidents, determine whether you are inside an alert region, help you create safer reports, and support emergency sharing features. We do not use location to encourage confrontation or to publicly expose your precise private address.',
    points: []
  },
  {
    title: '3. Incident reports, alerts, and media',
    body: 'When you submit a report or alert, we may process location, category, description, timestamps, confidence signals, media attachments, device metadata, moderation results, and duplicate-detection signals. Media may be scanned, stripped of metadata, kept private until approved, rejected, or shown with safety limits.',
    points: []
  },
  {
    title: '4. How we use data',
    body: 'We use data to authenticate users, prevent abuse, deliver nearby alerts, operate moderation queues, verify reports, reduce duplicate incidents, send push notifications, improve safety guidance, maintain audit logs, support account deletion, and protect the SafeRoute community.',
    points: []
  },
  {
    title: '5. Data sharing',
    body: 'We do not sell sensitive location data. We may share limited safety information with users, moderators, service providers, emergency contacts you select, agency partners, or lawful authorities when needed to operate the app, prevent harm, comply with law, or protect people. We avoid sharing personal data unless there is a clear product, safety, legal, or consent basis.',
    points: []
  },
  {
    title: '6. Data rights and choices',
    body: 'You can manage notification settings, privacy settings, alert radius, watched places, emergency contacts, and account details. You may request access, correction, deletion, portability, restriction, objection, or other applicable data-rights support. Some records may be retained where needed for safety, fraud prevention, audit logs, legal compliance, or abuse investigations.',
    points: []
  },
  {
    title: '7. Security',
    body: 'SafeRoute uses security controls such as token-based sessions, rate limits, private media storage, signed uploads, moderation review, access controls, audit logs, and least-privilege practices. No system is perfectly secure, but we design the app to reduce exposure of sensitive identity, location, and media data.',
    points: []
  },
  {
    title: '8. Retention',
    body: 'We keep data only as long as needed for safety operations, account management, moderation, analytics, legal obligations, and abuse prevention. Public incident data may expire or be resolved. Account deletion will remove or anonymize personal profile data where possible, while some safety and audit records may be retained when necessary.',
    points: []
  },
  {
    title: '9. Children and vulnerable users',
    body: 'SafeRoute is not designed to expose children or vulnerable people to public identification. Missing-person and found-person reports require careful moderation. Users must avoid sharing private child details, private school addresses, sensitive images, or identity information unless lawful, necessary, and safe.',
    points: []
  },
  {
    title: '10. Nigeria and Africa expansion',
    body: 'SafeRoute is starting in Nigeria and is designed to expand across Africa with local emergency numbers, languages, moderation rules, country settings, and agency integrations. Privacy practices may be updated to reflect local laws, hosting requirements, and user rights in each supported country.',
    points: []
  }
];

export const marketingPages: Record<string, MarketingPage> = {
  premium: {
    slug: 'premium',
    label: 'Premium',
    title: 'No commitment. Cancel anytime.',
    description:
      'Compare Free and Premium access, start with a 30 day trial, and cancel anytime.',
    cta: 'Start Premium',
    visual: 'premium',
    icon: Crown,
    stats: [
      { value: '30 days', label: 'free trial before billing' },
      { value: '5', label: 'premium safety controls' },
      { value: 'Anytime', label: 'cancel without commitment' }
    ],
    sections: []
  },
  journalist: {
    slug: 'journalist',
    label: 'Journalist',
    title: 'Make SafeRoute your unfair advantage.',
    description:
      'Move from incident to publish with searchable reports, media workflows, and newsroom-ready context.',
    cta: 'Book a newsroom meeting',
    visual: 'journalist',
    icon: Newspaper,
    stats: [
      { value: 'Feed', label: 'community posts and media' },
      { value: 'Trending', label: 'fast-rising public reports' },
      { value: 'Context', label: 'category, city, status, time' }
    ],
    sections: []
  },
  enterprise: {
    slug: 'enterprise',
    label: 'Enterprise',
    title: 'Location-aware incident awareness.',
    description:
      'Monitor incidents, alert teams, and review location-aware public safety context.',
    cta: 'Book a demo',
    visual: 'enterprise',
    icon: Building2,
    stats: [
      { value: 'Nearby', label: 'incident and alert context' },
      { value: 'Live', label: 'feed and media updates' },
      { value: 'Scale', label: 'for teams, venues, cities' }
    ],
    sections: [
      {
        title: 'Location-aware incident awareness',
        body: 'See nearby incidents, alert regions, categories, status, report count, timestamps, and public context before risks become harder to manage.',
        points: [
          'Incident notifications for desktop and mobile',
          'Incident categories that match operations',
          'Media-aware moderation and review',
          'Live updates as situations develop'
        ]
      },
      {
        title: 'Take action with confidence',
        body: 'Notify the people who matter, route them away from danger, and keep official emergency instructions separate from community reporting.',
        points: [
          'Real-time incident updates',
          'Radius-based alerting',
          'Role-based response groups',
          'Audit-ready communication trails'
        ]
      },
      {
        title: 'Signal from the source',
        body: 'Review public posts, attached media, status changes, and engagement patterns while preserving safety, privacy, and moderation controls.',
        points: [
          'Trusted partner feeds where available',
          'Photo and video evidence workflows',
          'Dedicated safety review workflows',
          'API delivery into your system of record'
        ]
      }
    ]
  },
  about: {
    slug: 'about',
    label: 'About',
    title: 'Who are we?',
    description:
      'SafeRoute believes people move safer when nearby information is timely, structured, and responsible. The app turns community signal into calmer decisions.',
    cta: 'About SafeRoute',
    visual: 'about',
    icon: UsersRound,
    stats: [
      { value: 'Individuals', label: 'checking routes and alerts' },
      { value: 'Communities', label: 'broadcasting useful context' },
      { value: 'Responders', label: 'kept separate from app reporting' }
    ],
    sections: [
      {
        title: 'SafeRoute is on a mission to make movement safer.',
        body: 'We believe in public information for the good of the public: nearby safety maps, structured reports, alert radius controls, and tools that empower people without encouraging panic.',
        points: [
          'Technology connects us',
          'Community protects us',
          'Broadcasting should happen only when safe',
          '112 remains the emergency escalation in Nigeria'
        ]
      },
      {
        title: 'For the greater good',
        body: 'Families, commuters, schools, workplaces, venues, and local communities make better decisions when they receive faster, clearer updates.',
        points: [
          'Avoid unsafe routes earlier',
          'Understand what nearby users are reporting',
          'Increase transparency between cities and residents',
          'Build responsible public safety technology together'
        ]
      }
    ]
  },
  support: {
    slug: 'support',
    label: 'Support',
    title: 'Help Center',
    description:
      'Get help with broadcasting reports, nearby alerts, location permission, Feed and Trending, account OTP, Premium, privacy, and using SafeRoute safely.',
    cta: 'Contact support',
    visual: 'support',
    icon: LifeBuoy,
    stats: [
      { value: 'Broadcast', label: 'safe reporting help' },
      { value: 'Location', label: 'map and alert support' },
      { value: 'Account', label: 'OTP, profile, notifications' }
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
    label: 'Privacy Policy',
    title: 'Privacy Policy',
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
    sections: privacyPolicySections
  },
  terms: {
    slug: 'terms',
    label: 'Terms of Service',
    title: 'Terms of Service',
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
    sections: termsPolicySections
  },
  copyright: {
    slug: 'copyright',
    label: 'Copyright',
    title: 'Copyright Policy',
    description:
      'SafeRoute respects intellectual property rights and responds to valid copyright notices under Nigerian copyright law.',
    cta: 'Submit a copyright concern',
    visual: 'legal',
    icon: Copyright,
    stats: [
      { value: 'Nigeria', label: 'copyright law focus' },
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
          'Email the copyright contact with the subject: Copyright Takedown Notice',
          'Include a physical or electronic signature',
          'We review notices under Nigerian copyright law',
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
