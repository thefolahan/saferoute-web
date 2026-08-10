'use client';

import {
  createElement,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from 'react';

/**
 * Anchor attributes rather than the plain HTML set: `as` can be an <a>, and
 * everything else (id, role, aria-*) is shared with it. Extra props are spread
 * onto the rendered element untouched.
 */
type PassThrough = Omit<
  AnchorHTMLAttributes<HTMLElement>,
  'children' | 'className' | 'style'
>;

type RevealProps = PassThrough & {
  children: ReactNode;
  /** Element to render. Defaults to a div; pass 'section', 'li', 'header'… */
  as?: ElementType;
  className?: string;
  /** Stagger, in milliseconds, before this element starts. */
  delay?: number;
  /** How far it travels up, in pixels. 0 gives a straight cross-fade. */
  y?: number;
  /** Override the transition length, in milliseconds. */
  duration?: number;
  style?: CSSProperties;
};

/**
 * One observer for the whole document rather than one per element. A landing
 * page runs this component 30-odd times; separate observers would each carry
 * their own callback queue for no benefit.
 */
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.shown = 'true';
        // Reveal once. Re-hiding on scroll-up reads as a glitch, and it means
        // the animation replays every time someone scrolls past.
        sharedObserver?.unobserve(entry.target);
      }
    },
    {
      // Positive bottom margin, so the root extends past the fold and elements
      // start animating shortly *before* they scroll into view. Triggering on
      // entry instead leaves a fading-in strip along the bottom edge during a
      // quick scroll, which reads as the page failing to keep up.
      rootMargin: '0px 0px 12% 0px',
      threshold: 0.01
    }
  );
  return sharedObserver;
}

/**
 * Fades content up as it scrolls into view.
 *
 * The hidden state lives in CSS under `html[data-reveal="on"]`, which only
 * `revealGate` sets — see that file for why the polarity runs this way. This
 * component's job is just to observe and flip `data-shown`.
 *
 * Content is always in the server-rendered HTML. Only opacity and transform
 * ever change, so crawlers, reader modes and text search see a normal page.
 */
export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y,
  duration,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Hydration happened, so the fallback in revealGate is no longer needed.
    const timer = (window as { __srRevealFallback?: number }).__srRevealFallback;
    if (timer) {
      window.clearTimeout(timer);
      (window as { __srRevealFallback?: number }).__srRevealFallback = undefined;
    }

    const el = ref.current;
    if (!el) return;

    // Gate never armed — reduced motion, or a browser without
    // IntersectionObserver. The element is already visible; leave it alone.
    if (document.documentElement.getAttribute('data-reveal') !== 'on') return;

    const observer = getObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  const vars: Record<string, string> = {};
  if (delay) vars['--reveal-delay'] = `${delay}ms`;
  if (y !== undefined) vars['--reveal-y'] = `${y}px`;
  if (duration) vars['--reveal-duration'] = `${duration}ms`;

  return createElement(
    as,
    {
      ref,
      className: className ? `reveal ${className}` : 'reveal',
      style: Object.keys(vars).length ? { ...style, ...vars } : style,
      ...rest
    },
    children
  );
}
