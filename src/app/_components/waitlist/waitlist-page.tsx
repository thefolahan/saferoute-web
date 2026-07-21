import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Shield } from 'lucide-react';
import { GradientOrbs } from './gradient-orbs';
import { AvatarStack } from './avatar-stack';
import { WaitlistForm } from './waitlist-form';
import { WaitlistMobile } from './waitlist-mobile';

export type WaitlistConfig = {
  orbVariant: 'enterprise' | 'journalist';
  pageBg: string;
  header: {
    variant: 'back-left' | 'back-right';
    logo: 'globe' | 'pin';
    brandColor: string;
    brandSize: number;
    brandLineHeight: number;
    backColor: string;
  };
  badge: {
    text: string;
    dotColor: string;
    textColor: string;
    borderColor: string;
    shadow: string;
    fontSize: number;
    lineHeight: number;
    gap: number;
    uppercase?: boolean;
  };
  heading: { text: string; color: string; size: number; lineHeight: number };
  subhead: { text: string; color: string; size: number; lineHeight: number };
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
    titleColor: string;
    subtitle: string;
    subtitleColor: string;
  };
  form: { variant: 'card' | 'row'; placeholder: string; width: number };
  followUs?: { text: string; color: string };
  trustNote?: { text: string; color: string };
  valueProps?: { label: string; dot: string; color: string }[];
  footer?: {
    copyright: string;
    copyrightColor: string;
    links: string[];
    linkColor: string;
  };
};

function Logo({ config }: { config: WaitlistConfig['header'] }) {
  return (
    <div className="flex items-center gap-2">
      {config.logo === 'globe' ? (
        <Image
          src="/images/landing/logo-mark.png"
          alt="SafeRoute"
          width={32}
          height={32}
          className="h-8 w-8"
          priority
        />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A0D12]">
          <MapPin size={14} strokeWidth={2} className="text-white" />
        </span>
      )}
      <span
        className="font-semibold"
        style={{
          color: config.brandColor,
          fontSize: config.brandSize,
          lineHeight: `${config.brandLineHeight}px`,
          fontWeight: config.logo === 'globe' ? 500 : 600
        }}
      >
        SafeRoute
      </span>
    </div>
  );
}

export function WaitlistPage({ config }: { config: WaitlistConfig }) {
  const { header, badge, heading, subhead, socialProof, form, footer } = config;
  const backLink = (
    <Link
      href="/"
      className="font-medium transition-opacity hover:opacity-70"
      style={{ color: header.backColor, fontSize: 13, lineHeight: '16px' }}
    >
      Back to SafeRoute
    </Link>
  );

  const proofBlock = (
    <div className="flex flex-col gap-1 text-center">
      <span
        className="font-semibold"
        style={{ color: socialProof.titleColor, fontSize: 14, lineHeight: '17px' }}
      >
        {socialProof.title}
      </span>
      <span style={{ color: socialProof.subtitleColor, fontSize: 13, lineHeight: '16px' }}>
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
    <main className="relative w-full">
      {/* Mobile (light, full-width) */}
      <WaitlistMobile config={config} />

      {/* Desktop */}
      <div
        className="relative hidden min-h-screen w-full overflow-hidden lg:block"
        style={{ backgroundColor: config.pageBg }}
      >
      <div className="relative flex min-h-screen w-full flex-col">
        <GradientOrbs variant={config.orbVariant} />

        {/* Header / TopBar */}
        <header
          className={`relative z-10 flex items-center px-12 ${
            header.variant === 'back-left' ? 'h-[73px]' : 'h-[84px]'
          }`}
        >
          {header.variant === 'back-left' ? (
            <>
              <div className="absolute left-12">{backLink}</div>
              <div className="mx-auto">
                <Logo config={header} />
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto">
                <Logo config={header} />
              </div>
              <div className="absolute right-12">{backLink}</div>
            </>
          )}
        </header>

        {/* Centered content */}
        <div
          className={`relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-10 ${
            header.variant === 'back-left' ? 'pb-20 pt-10' : 'pb-20 pt-[60px]'
          }`}
        >
          {/* Badge pill */}
          <div
            className="inline-flex items-center rounded-full border bg-white px-[14px] py-1.5"
            style={{
              borderColor: badge.borderColor,
              boxShadow: badge.shadow,
              gap: badge.gap
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: badge.dotColor }}
            />
            <span
              className="font-semibold"
              style={{
                color: badge.textColor,
                fontSize: badge.fontSize,
                lineHeight: `${badge.lineHeight}px`,
                letterSpacing: badge.uppercase ? '0.06em' : undefined,
                textTransform: badge.uppercase ? 'uppercase' : undefined
              }}
            >
              {badge.text}
            </span>
          </div>

          {/* Hero text */}
          <div className="flex w-[680px] max-w-full flex-col items-center gap-4 text-center">
            <h1
              className="font-bold"
              style={{
                color: heading.color,
                fontSize: heading.size,
                lineHeight: `${heading.lineHeight}px`,
                letterSpacing: '-0.02em'
              }}
            >
              {heading.text}
            </h1>
            <p
              style={{
                color: subhead.color,
                fontSize: subhead.size,
                lineHeight: `${subhead.lineHeight}px`
              }}
            >
              {subhead.text}
            </p>
          </div>

          {/* Social proof */}
          {socialProof.orientation === 'vertical' ? (
            <div className="flex flex-col items-center gap-2.5">
              {avatars}
              {proofBlock}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {avatars}
              <div className="flex flex-col gap-0.5">
                <span
                  className="font-semibold"
                  style={{ color: socialProof.titleColor, fontSize: 14, lineHeight: '17px' }}
                >
                  {socialProof.title}
                </span>
                <span
                  style={{ color: socialProof.subtitleColor, fontSize: 13, lineHeight: '16px' }}
                >
                  {socialProof.subtitle}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <WaitlistForm variant={form.variant} placeholder={form.placeholder} width={form.width} />

          {/* Follow us (Enterprise) */}
          {config.followUs && (
            <div className="flex items-center gap-5">
              <span
                style={{ color: config.followUs.color, fontSize: 13, lineHeight: '16px' }}
              >
                {config.followUs.text}
              </span>
            </div>
          )}

          {/* Trust note (Journalist) */}
          {config.trustNote && (
            <div className="flex items-center gap-1.5">
              <Shield size={13} strokeWidth={2} style={{ color: config.trustNote.color }} />
              <span style={{ color: config.trustNote.color, fontSize: 13, lineHeight: '16px' }}>
                {config.trustNote.text}
              </span>
            </div>
          )}

          {/* Value props (Journalist) */}
          {config.valueProps && (
            <div className="flex items-center gap-7">
              {config.valueProps.map((prop) => (
                <div key={prop.label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-[7px] w-[7px] rounded-full"
                    style={{ backgroundColor: prop.dot }}
                  />
                  <span
                    className="font-medium"
                    style={{ color: prop.color, fontSize: 13, lineHeight: '16px' }}
                  >
                    {prop.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Journalist) */}
        {footer && (
          <footer className="relative z-10 flex items-center justify-between px-12 py-5">
            <span style={{ color: footer.copyrightColor, fontSize: 12, lineHeight: '15px' }}>
              {footer.copyright}
            </span>
            <div className="flex items-center gap-5">
              {footer.links.map((link) => (
                <span
                  key={link}
                  style={{ color: footer.linkColor, fontSize: 12, lineHeight: '15px' }}
                >
                  {link}
                </span>
              ))}
            </div>
          </footer>
        )}
      </div>
      </div>
    </main>
  );
}
