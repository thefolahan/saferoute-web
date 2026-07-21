import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { AvatarStack } from './avatar-stack';
import { WaitlistForm } from './waitlist-form';
import { SOCIALS } from '../social-icons';
import type { WaitlistConfig } from './waitlist-page';

/**
 * Mobile waitlist (Figma mobile frames 2042:24625 / 2042:25501). Light,
 * full-width, single-column: Back + wordmark, heading, subhead, social proof,
 * email form, then socials (enterprise) or trust note + value props
 * (journalist). Shown below lg; the dark desktop layout stays on lg+.
 */
export function WaitlistMobile({ config }: { config: WaitlistConfig }) {
  const isJournalist = config.orbVariant === 'journalist';
  const { heading, subhead, socialProof, form } = config;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#FAFAFA] lg:hidden">
      {/* Faint corner washes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[rgba(249,197,209,0.35)] blur-3xl" />
        <div className="absolute -right-40 -top-32 h-[440px] w-[440px] rounded-full bg-[rgba(196,181,253,0.35)] blur-3xl" />
        <div className="absolute left-1/2 top-64 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[rgba(251,207,232,0.28)] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-16 items-center px-6">
        <Link
          href="/"
          className="absolute left-6 text-[15px] font-medium text-gray-500 transition-opacity hover:opacity-70"
        >
          Back
        </Link>
        <div className="mx-auto flex items-center gap-2">
          <Image
            src="/images/landing/logo-mark.png"
            alt="SafeRoute"
            width={30}
            height={30}
            className="h-[30px] w-[30px]"
          />
          <span className="text-[22px] font-semibold text-gray-950">SafeRoute</span>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center gap-8 px-6 pb-16 pt-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[34px] font-bold leading-[42px] tracking-[-0.02em] text-[#0A0D12]">
            {heading.text}
          </h1>
          <p className="max-w-[440px] text-[17px] leading-[26px] text-gray-500">
            {subhead.text}
          </p>
        </div>

        {socialProof.orientation === 'vertical' ? (
          <div className="flex flex-col items-center gap-2.5">
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
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold text-gray-950">{socialProof.title}</span>
              <span className="text-[14px] text-gray-500">{socialProof.subtitle}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
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
            <div className="flex flex-col text-left">
              <span className="text-[15px] font-semibold text-gray-950">{socialProof.title}</span>
              <span className="text-[14px] text-gray-500">{socialProof.subtitle}</span>
            </div>
          </div>
        )}

        <WaitlistForm variant="card" placeholder={form.placeholder} width={520} />

        {isJournalist ? (
          <div className="flex flex-col items-center gap-6">
            {config.trustNote ? (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Shield size={14} strokeWidth={2} />
                <span className="text-[14px]">{config.trustNote.text}</span>
              </div>
            ) : null}
            {config.valueProps ? (
              <div className="flex flex-col items-start gap-3">
                {config.valueProps.map((p) => (
                  <div key={p.label} className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.dot }}
                    />
                    <span className="text-[16px] font-medium text-gray-600">{p.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex w-full flex-col items-start gap-4">
            <h3 className="text-[16px] font-semibold text-gray-950">Connect with us</h3>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A0D12] text-white transition-opacity hover:opacity-80"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
