import type { CSSProperties } from 'react';

/**
 * Someone's photograph, or their initials.
 *
 * Never a stock face. Every avatar on this dashboard used to fall back to one
 * of the Figma export's model photographs, so an account with no picture was
 * shown wearing a stranger's — beside their real name, on a screen where the
 * decision being taken is about that person. Initials say "no photograph" and
 * cannot be mistaken for one.
 *
 * The tint is derived from the name so a given person keeps the same colour
 * everywhere they appear, which is what makes a wall of initials scannable.
 */

/** Muted, readable on white, and distinct from the status chips' palette. */
const TINTS = [
  { bg: '#E8EDF5', fg: '#33456B' },
  { bg: '#EAF2EC', fg: '#2F5D42' },
  { bg: '#F5EDE6', fg: '#6B4A2F' },
  { bg: '#F0EAF5', fg: '#4F3A6B' },
  { bg: '#E6F1F3', fg: '#26555E' },
  { bg: '#F5E9EC', fg: '#6B3344' }
] as const;

export function initialsOf(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? '');

  return (letters.join('') || '?').toUpperCase();
}

function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TINTS[hash % TINTS.length]!;
}

export function Avatar({
  src,
  name,
  size,
  rounded = '50%',
  className = ''
}: {
  /** The account's own photograph. Null or empty falls back to initials. */
  src?: string | null;
  name: string;
  size: number;
  /** Square-ish for organisations, a circle for people. */
  rounded?: string;
  className?: string;
}) {
  const box: CSSProperties = {
    width: size,
    height: size,
    borderRadius: rounded
  };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={box}
        className={`shrink-0 object-cover ${className}`}
      />
    );
  }

  const tint = tintFor(name);

  return (
    <span
      aria-label={name}
      role="img"
      style={{
        ...box,
        backgroundColor: tint.bg,
        color: tint.fg,
        // Keeps two letters comfortably inside the circle at any size.
        fontSize: Math.round(size * 0.38),
        lineHeight: 1
      }}
      className={`flex shrink-0 select-none items-center justify-center font-semibold ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
