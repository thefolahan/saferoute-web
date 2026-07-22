'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Direction the element animates in from. */
  from?: 'up' | 'left' | 'right' | 'scale' | 'morph';
  /** Stagger delay in ms. */
  delay?: number;
  /** Re-animate every time it re-enters the viewport. */
  repeat?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
};

/**
 * Wraps content and animates it in the first time (or every time, with
 * `repeat`) it scrolls into view. Pairs with the `.reveal` CSS primitives.
 */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  repeat = false,
  className = '',
  style,
  as: Tag = 'div'
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (!repeat) io.unobserve(entry.target);
        } else if (repeat) {
          setVisible(false);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [repeat]);

  return (
    <Tag
      ref={ref}
      data-from={from}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}
