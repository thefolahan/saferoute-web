import type { CSSProperties } from 'react';

type Orb = {
  left?: number;
  right?: number;
  centerX?: boolean;
  top: number;
  width: number;
  height: number;
  color: string;
};

// Blob geometry is identical across both frames (bg-gradient node); only the
// centre-stop opacity differs so the orbs read against their page background.
// Real Figma stops are pink rgb(249,197,209), purple rgb(196,181,253),
// lavender rgb(251,207,232). On the dark Enterprise page the centre opacity is
// lifted so the glow is visible against #000; on the light Journalist page the
// real ~0.2 stops are used so they stay as pale washes over #FAFAFA.
// The Figma render shows the orbs at near-full brightness and large enough to
// bleed off the page edges (sampled pink #F8C2CF, purple #C2B3FC). On the dark
// Enterprise page they read as vivid glows; on the light Journalist page the
// same blobs are pale washes over #FAFAFA.
// Orbs anchor to the viewport corners/centre so they bleed off the real screen
// edges at any width (page fills the screen, matching Figma).
const ORBS: Record<'enterprise' | 'journalist', Orb[]> = {
  enterprise: [
    { left: -300, top: -280, width: 940, height: 820, color: 'rgba(249,197,209,0.95)' },
    { right: -300, top: -300, width: 980, height: 900, color: 'rgba(196,181,253,0.92)' },
    { centerX: true, top: 330, width: 820, height: 720, color: 'rgba(251,207,232,0.9)' }
  ],
  journalist: [
    { left: -300, top: -280, width: 940, height: 820, color: 'rgba(249,197,209,0.22)' },
    { right: -300, top: -300, width: 980, height: 900, color: 'rgba(196,181,253,0.22)' },
    { centerX: true, top: 330, width: 820, height: 720, color: 'rgba(251,207,232,0.16)' }
  ]
};

export function GradientOrbs({ variant }: { variant: 'enterprise' | 'journalist' }) {
  const blur = variant === 'enterprise' ? 12 : 40;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ORBS[variant].map((orb, i) => {
        const style: CSSProperties = {
          top: orb.top,
          width: orb.width,
          height: orb.height,
          background: `radial-gradient(ellipse at center, ${orb.color} 0%, ${orb.color} 34%, rgba(0,0,0,0) 62%)`,
          filter: `blur(${blur}px)`,
          ...(orb.centerX
            ? { left: '50%', transform: 'translateX(-50%)' }
            : orb.right !== undefined
              ? { right: orb.right }
              : { left: orb.left })
        };
        return <div key={i} className="absolute rounded-full" style={style} />;
      })}
    </div>
  );
}
