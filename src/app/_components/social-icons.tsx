import type { ReactNode } from 'react';

export type Social = { label: string; href: string; icon: ReactNode };

// Order per Figma "Connect with us": X, Gmail, TikTok, LinkedIn, Instagram, Facebook.
export const SOCIALS: Social[] = [
  {
    label: 'X',
    href: '#',
    icon: (
      <path
        d="M13.9 2.5h2.5l-5.5 6.3 6.5 8.7h-5.1l-4-5.2-4.6 5.2H1.6l5.9-6.7L1.3 2.5h5.2l3.6 4.8L13.9 2.5Zm-.9 13.3h1.4L6.1 3.9H4.6l8.4 11.9Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'Email',
    href: '#',
    icon: (
      <path
        d="M2.5 4.5h15c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1v-9c0-.6.4-1 1-1Zm.5 2v.9l7 4.4 7-4.4V6.5l-7 4.4-7-4.4Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <path
        d="M13 2.5c.3 1.8 1.3 3 3 3.2v2.3c-1 .1-2-.2-3-.7v4.9c0 3-2.4 4.8-4.7 4.3-2.6-.5-3.6-3.6-1.9-5.6.9-1 2.2-1.3 3.4-1v2.4c-.5-.2-1.1-.1-1.5.3-.7.7-.5 2 .6 2.2.9.2 1.8-.4 1.8-1.5V2.5H13Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <path
        d="M6.1 7.5v9H3.3v-9h2.8Zm-1.4-4.3c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6Zm4 4.3h2.7v1.2c.4-.7 1.3-1.4 2.6-1.4 2.1 0 3.2 1.3 3.2 3.7v5.5h-2.8v-5c0-1.2-.4-1.9-1.5-1.9-1 0-1.5.7-1.5 1.9v5H8.7v-9Z"
        fill="currentColor"
      />
    )
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <>
        <rect x="3.8" y="3.8" width="12.4" height="12.4" rx="3.6" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="10" cy="10" r="2.9" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <circle cx="13.4" cy="6.6" r="0.95" fill="currentColor" />
      </>
    )
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <path
        d="M11.5 18v-6h2l.4-2.4h-2.4V8.1c0-.7.2-1.2 1.2-1.2h1.3V4.6c-.6-.1-1.3-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.7H6.3V12h2.4v6h2.8Z"
        fill="currentColor"
      />
    )
  }
];
