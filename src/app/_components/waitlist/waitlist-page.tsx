import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { AvatarStack } from './avatar-stack';
import { WaitlistForm } from './waitlist-form';
import { SOCIALS } from '../social-icons';

/**
 * Waitlist pages — enterprise (2016:12556) and journalist (2016:12557), plus
 * their mobile frames. Both are LIGHT, full-width, single-screen. One
 * responsive layout drives both; per-page differences (header side, social
 * proof orientation, form style, and the journalist trust-note / value-props /
 * footer) come from the config.
 */
export type WaitlistConfig = {
  orbVariant: 'enterprise' | 'journalist';
  heading: { text: string };
  subhead: { text: string };
  socialProof: {
    orientation: 'vertical' | 'horizontal';
    avatars: string[];
    avatarSize: number;
    overlap: number;
    countText: string;
    countBg: string;
    countColor: string;
    countSize: number;
    countLineHeight: number;
    title: string;
    subtitle: string;
  };
  form: { variant: 'card' | 'row'; placeholder: string; width: number };
  trustNote?: { text: string };
  valueProps?: { label: string; dot: string }[];
  footer?: { copyright: string; links: string[] };
  // Legacy color fields (kept so page configs still type-check; unused now).
  pageBg?: string;
  header?: unknown;
  badge?: unknown;
  followUs?: unknown;
};

function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* blob-pink (top-left), blob-purple (top-right), blob-lavender (centre) */}
      <div className="absolute -left-32 -top-24 h-[380px] w-[440px] rounded-full bg-[#F9C5D1] opacity-30 blur-[100px] sm:h-[500px] sm:w-[600px] sm:opacity-40" />
      <div className="absolute -right-40 -top-20 h-[420px] w-[480px] rounded-full bg-[#C4B5FD] opacity-30 blur-[100px] sm:h-[600px] sm:w-[700px] sm:opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[440px] -translate-x-1/2 rounded-full bg-[#FBCFE8] opacity-25 blur-[100px] sm:h-[400px] sm:w-[500px] sm:opacity-30" />
    </div>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/images/landing/logo-mark-dark.png"
        alt="SafeRoute"
        width={32}
        height={32}
        className="h-8 w-8"
        priority
      />
      <span className="text-[22px] font-medium leading-[29px] tracking-[-0.03em] text-[#1C1C1C] sm:text-[24px]">
        SafeRoute
      </span>
    </Link>
  );
}

export function WaitlistPage({ config }: { config: WaitlistConfig }) {
  const journalist = config.orbVariant === 'journalist';
  const { heading, subhead, socialProof, form } = config;
  const bg = journalist ? '#FAFAFA' : '#FFFFFF';

  const back = (
    <Link
      href="/"
      className="text-[13px] font-medium leading-4 text-gray-500 transition-opacity hover:opacity-70 sm:text-[14px]"
    >
      <span className="sm:hidden">Back</span>
      <span className="hidden sm:inline">Back to SafeRoute</span>
    </Link>
  );

  const proofText = (
    <div
      className={`flex flex-col gap-0.5 ${
        socialProof.orientation === 'vertical' ? 'items-center text-center' : 'text-left'
      }`}
    >
      <span className="text-[14px] font-semibold leading-[17px] text-[#0A0D12]">
        {socialProof.title}
      </span>
      <span className="text-[13px] font-normal leading-4 text-gray-400 sm:text-[14px]">
        {socialProof.subtitle}
      </span>
    </div>
  );

  const avatars = (
    <AvatarStack
      avatars={socialProof.avatars}
      size={socialProof.avatarSize}
      overlap={socialProof.overlap}
      countText={socialProof.countText}
      countBg={socialProof.countBg}
      countColor={socialProof.countColor}
      countSize={socialProof.countSize}
      countLineHeight={socialProof.countLineHeight}
    />
  );

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <div className="relative flex min-h-screen w-full flex-col">
        <Orbs />

        {/* Header — mobile: back left + logo centre; desktop: logo left + back
            right. Same for enterprise and journalist. */}
        <header className="relative z-10 flex h-[73px] items-center px-6 sm:h-[88px] sm:px-12">
          <div className="absolute left-6 sm:hidden">{back}</div>
          <div className="mx-auto sm:mx-0">
            <Wordmark />
          </div>
          <div className="ml-auto hidden sm:block">{back}</div>
        </header>

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-9 px-6 pb-16 pt-6 text-center sm:gap-10 sm:px-10 sm:pb-20">
          {/* Hero text */}
          <div className="flex max-w-[680px] flex-col items-center gap-4">
            <h1
              className={`font-bold tracking-[-0.02em] text-[#0A0D12] ${
                journalist
                  ? 'text-[34px] leading-[42px] sm:text-[58px] sm:leading-[68px]'
                  : 'text-[34px] leading-[42px] sm:text-[60px] sm:leading-[68px]'
              }`}
            >
              {heading.text}
            </h1>
            <p
              className={`font-normal text-gray-500 ${
                journalist
                  ? 'text-[17px] leading-[26px] sm:text-[18px] sm:leading-7'
                  : 'text-[17px] leading-[26px]'
              }`}
            >
              {subhead.text}
            </p>
          </div>

          {/* Social proof */}
          {socialProof.orientation === 'vertical' ? (
            <div className="flex flex-col items-center gap-2.5">
              {avatars}
              {proofText}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {avatars}
              {proofText}
            </div>
          )}

          {/* Form */}
          <WaitlistForm variant={form.variant} placeholder={form.placeholder} width={form.width} />

          {/* Enterprise: socials */}
          {!journalist && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-[14px] font-semibold leading-[17px] text-[#181D27]">
                Connect with us
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Journalist: trust note + value props */}
          {journalist && (
            <div className="flex flex-col items-center gap-6">
              {config.trustNote ? (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Shield size={13} strokeWidth={2} />
                  <span className="text-[13px] leading-4">{config.trustNote.text}</span>
                </div>
              ) : null}
              {config.valueProps ? (
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
                  {config.valueProps.map((p) => (
                    <div key={p.label} className="flex items-center gap-2">
                      <span
                        className="inline-block h-[7px] w-[7px] rounded-full"
                        style={{ backgroundColor: p.dot }}
                      />
                      <span className="text-[13px] font-medium leading-4 text-gray-600">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Journalist footer — desktop only (mobile design has no footer) */}
        {config.footer && (
          <footer className="relative z-10 hidden items-center justify-between px-6 py-5 sm:flex sm:px-12">
            <span className="text-[12px] leading-[15px] text-[#73737A]">
              {config.footer.copyright}
            </span>
            <div className="flex items-center gap-5">
              {config.footer.links.map((link) => (
                <Link
                  key={link}
                  href={link.toLowerCase().includes('privacy') ? '/privacy' : '/terms'}
                  className="text-[12px] leading-[15px] text-gray-400 transition-colors hover:text-gray-600"
                >
                  {link}
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
