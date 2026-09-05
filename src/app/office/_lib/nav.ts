import type { ComponentType, SVGProps } from 'react';
import {
  AlertTriangleIcon,
  FeedIcon,
  HomeIcon,
  MapIcon,
  InviteIcon,
  ShieldIcon,
  ShieldOutlineIcon,
  SignalIcon,
  ClockIcon,
  SlidersIcon,
  SupportIcon,
  TrendingIcon,
  UserIcon,
  UserPlusIcon
} from '../_components/icons';

export type NavItem = {
  /** Verbatim from Figma 907:17157 — including the designer's spelling. */
  label: string;
  /** Dashboard-relative route; '' is the index. Joined onto the served base. */
  route: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** The designer tinted each icon slightly differently; kept as drawn. */
  iconColor: string;
  badge?: string;
};

export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: 'MAIN MENU',
    items: [
      { label: 'Dashboard', route: '', icon: HomeIcon, iconColor: '#FFFFFF' },
      { label: 'Broadcast center', route: 'broadcast', icon: SignalIcon, iconColor: '#FAFAFA' },
      {
        label: 'Incidents',
        route: 'incidents',
        icon: AlertTriangleIcon,
        iconColor: '#FAFAFA',
        badge: '10'
      }
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Users', route: 'users', icon: UserIcon, iconColor: '#F5F5F5' },
      { label: 'Support', route: 'support', icon: SupportIcon, iconColor: '#FFFFFF' },
      { label: 'Feed & contents', route: 'contents', icon: FeedIcon, iconColor: '#FAFAFA' },
      /*
        The website's waitlist. Under MANAGEMENT rather than ANALYTIC because
        it is a list of people to act on, not a chart — and not under Users,
        because a signup is an address on a form, not an account.
      */
      { label: 'Waitlist', route: 'waitlist', icon: InviteIcon, iconColor: '#F5F5F5' }
    ]
  },
  {
    label: 'TRUST & SAFTEY',
    items: [
      {
        label: 'Verification center',
        route: 'verification',
        icon: ShieldIcon,
        iconColor: '#FAFAFA'
      }
    ]
  },
  {
    label: 'ANALYTIC',
    items: [
      { label: 'Reports', route: 'reports', icon: TrendingIcon, iconColor: '#F5F5F5' },
      { label: 'Map', route: 'map', icon: MapIcon, iconColor: '#F5F5F5' }
    ]
  },
  {
    label: 'SETTINGS',
    items: [
      {
        label: 'Configuratuion',
        route: 'configuration',
        icon: SlidersIcon,
        iconColor: '#D5D7DA'
      },
      { label: 'Access control', route: 'access-control', icon: UserPlusIcon, iconColor: '#F5F5F5' },
      /*
        Two screens the designer did not draw, for two tables the API has
        always written and nothing could ever read: every admin action, and
        who is signed into the dashboard. Added under Settings because they
        are about the team rather than about the citizens.
      */
      { label: 'Audit log', route: 'audit-log', icon: ClockIcon, iconColor: '#D5D7DA' },
      { label: 'Security', route: 'security', icon: ShieldOutlineIcon, iconColor: '#F5F5F5' }
    ]
  }
];
