'use client';

type Props = {
  /** id of the section to scroll to, without the leading #. */
  target: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * An in-page jump that leaves the URL alone — a plain anchor would push
 * "#section" into the address bar and the history stack.
 *
 * scrollIntoView is called with no behavior on purpose: that defers to the
 * `scroll-behavior` on html, so it glides normally and snaps instantly under
 * prefers-reduced-motion, matching every other jump on the page. The target's
 * scroll-margin is honoured either way, so it clears the fixed nav.
 */
export function ScrollToButton({ target, className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        document.getElementById(target)?.scrollIntoView({ block: 'start' })
      }
    >
      {children}
    </button>
  );
}
