import { Shield } from 'lucide-react';
import { AvatarStack } from './avatar-stack';
import { PageShell } from './page-shell';
import { WaitlistForm } from './waitlist-form';
import { SOCIALS } from '../social-icons';
import { Reveal } from '../reveal';

export type WaitlistConfig = {
  /**
   * Which layout to render. `enterprise` is shared by the Enterprise and
   * Government Officials pages — they differ only in copy.
   */
  variant: 'enterprise' | 'news-outlets';
  /** Which page a signup came from, so the segments stay separable. */
  source: 'enterprise' | 'news-outlets' | 'government-officials' | 'download';
  /**
   * The headline, one entry per line. The designer's line breaks are part of
   * the layout, so they are set here rather than left to wherever the text
   * happens to wrap. Below lg the lines run together and wrap naturally — the
   * desktop breaks do not fit a phone.
   */
  heading: { lines: string[] };
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
  footer?: { copyright: string; links: { label: string; href: string }[] };
  pageBg?: string;
  header?: unknown;
  badge?: unknown;
  followUs?: unknown;
};

export function WaitlistPage({ config }: { config: WaitlistConfig }) {
  const press = config.variant === 'news-outlets';
  const { heading, subhead, socialProof, form } = config;
  const bg = press ? '#FAFAFA' : '#FFFFFF';

  const hasAvatars = socialProof.avatars.length > 0;
  const hasProofText = Boolean(socialProof.title || socialProof.subtitle);

  const proofText = hasProofText ? (
    <div
      className={`flex flex-col gap-0.5 ${
        socialProof.orientation === 'vertical' ? 'items-center text-center' : 'text-left'
      }`}
    >
      {socialProof.title ? (
        <span className="text-[14px] font-semibold leading-[17px] text-[#0A0D12]">
          {socialProof.title}
        </span>
      ) : null}
      {socialProof.subtitle ? (
        <span className="text-[13px] font-normal leading-4 text-gray-400 sm:text-[14px]">
          {socialProof.subtitle}
        </span>
      ) : null}
    </div>
  ) : null;

  const avatars = hasAvatars ? (
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
  ) : null;

  return (
    <PageShell background={bg} footer={config.footer}>
          {/* Hero text */}
          <div className="flex w-full max-w-[680px] flex-col items-center gap-4 lg:max-w-[940px]">
            <Reveal
              as="h1"
              className={`font-bold tracking-[-0.02em] text-[#0A0D12] ${
                press
                  ? 'text-[34px] leading-[42px] sm:text-[58px] sm:leading-[68px]'
                  : 'text-[34px] leading-[42px] sm:text-[60px] sm:leading-[68px]'
              }`}
            >
              {heading.lines.map((line, i) => (
                <span key={line} className="lg:block">
                  {line}
                  {i < heading.lines.length - 1 ? ' ' : null}
                </span>
              ))}
            </Reveal>
            <Reveal
              as="p"
              delay={120}
              className={`max-w-[680px] font-normal text-gray-500 ${
                press
                  ? 'text-[17px] leading-[26px] sm:text-[18px] sm:leading-7'
                  : 'text-[17px] leading-[26px]'
              }`}
            >
              {subhead.text}
            </Reveal>
          </div>

          {/* Social proof */}
          {(hasAvatars || hasProofText) && (
            <Reveal
              delay={200}
              className={
                socialProof.orientation === 'vertical'
                  ? 'flex flex-col items-center gap-2.5'
                  : 'flex items-center gap-3'
              }
            >
              {avatars}
              {proofText}
            </Reveal>
          )}

          {/* Form */}
          <Reveal delay={280} className="flex w-full justify-center">
            <WaitlistForm
              variant={form.variant}
              placeholder={form.placeholder}
              width={form.width}
              source={config.source}
            />
          </Reveal>

          {/* Enterprise / Government Officials: socials */}
          {!press && (
            <Reveal delay={360} className="flex flex-col items-center gap-4">
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
            </Reveal>
          )}

          {/* News Outlets: trust note + value props */}
          {press && (
            <Reveal delay={360} className="flex flex-col items-center gap-6">
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
            </Reveal>
          )}
    </PageShell>
  );
}
