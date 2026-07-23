'use client';

import type { ReactNode } from 'react';

/**
 * Smooth-scrolls to the top of the page or to an element by id, without ever
 * putting a `#` hash in the URL.
 */
export function ScrollButton({
  target,
  className,
  children,
  ariaLabel
}: {
  /** "top" to scroll to the top, otherwise an element id to scroll into view. */
  target: string;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
}) {
  const handleClick = () => {
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
