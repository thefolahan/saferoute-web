import type { ComponentType, SVGProps } from 'react';
import {
  AlertTriangleIcon,
  FeedIcon,
  HomeIcon,
  MapIcon,
  ShieldIcon,
  SignalIcon,
  SlidersIcon,
  SupportIcon,
  TrendingIcon,
  UserIcon,
  UserPlusIcon
} from '../_components/icons';

export type NavItem = {
  /** Verbatim from Figma 907:17157 — including the designer's spelling. */
  label: string;
  href: string;
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
      { label: 'Dashboard', href: '/admin', icon: HomeIcon, iconColor: '#FFFFFF' },
      { label: 'Broadcast center', href: '/admin/broadcast', icon: SignalIcon, iconColor: '#FAFAFA' },
      {
        label: 'Incidents',
        href: '/admin/incidents',
        icon: AlertTriangleIcon,
        iconColor: '#FAFAFA',
        badge: '10'
      }
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserIcon, iconColor: '#F5F5F5' },
      { label: 'Support', href: '/admin/support', icon: SupportIcon, iconColor: '#FFFFFF' },
      { label: 'Feed & contents', href: '/admin/contents', icon: FeedIcon, iconColor: '#FAFAFA' }
    ]
  },
  {
    label: 'TRUST & SAFTEY',
    items: [
      {
        label: 'Verification center',
        href: '/admin/verification',
        icon: ShieldIcon,
        iconColor: '#FAFAFA'
      }
    ]
  },
  {
    label: 'ANALYTIC',
    items: [
      { label: 'Reports', href: '/admin/reports', icon: TrendingIcon, iconColor: '#F5F5F5' },
      { label: 'Map', href: '/admin/map', icon: MapIcon, iconColor: '#F5F5F5' }
    ]
  },
  {
    label: 'SETTINGS',
    items: [
      {
        label: 'Configuratuion',
        href: '/admin/configuration',
        icon: SlidersIcon,
        iconColor: '#D5D7DA'
      },
      { label: 'Access control', href: '/admin/access-control', icon: UserPlusIcon, iconColor: '#F5F5F5' }
    ]
  }
];
