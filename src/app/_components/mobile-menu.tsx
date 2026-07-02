'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NavItem } from '../_lib/marketing-content';

type MobileMenuProps = {
  active?: string;
  ctaHref: string;
  primaryLinks: NavItem[];
  secondaryLinks: NavItem[];
};

export function MobileMenu({
  active,
  ctaHref,
  primaryLinks,
  secondaryLinks
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const links = [...primaryLinks, ...secondaryLinks];

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="grid size-11 place-items-center rounded-full border border-white/14 text-white transition hover:border-[var(--gold)]/60"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X size={20} strokeWidth={2.4} /> : <Menu size={20} strokeWidth={2.4} />}
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 top-[96px] z-[80] overflow-y-auto border-t border-white/10 bg-neutral-800 px-5 py-6 shadow-2xl transition duration-300 sm:px-8 ${
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
        id="mobile-navigation"
      >
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-[1280px] gap-2">
          {links.map((item) => {
            const slug = item.href.replace(/^\//, '');
            const isActive = active === slug || active === item.label.toLowerCase();

            return (
            <a
              className={`rounded-[14px] px-4 py-4 text-lg font-black transition hover:bg-white/[0.07] ${
                isActive ? 'text-[var(--gold)]' : 'text-white'
              }`}
              href={item.href}
              key={`${item.label}-${item.href}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
            );
          })}
          <a
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--gold)] px-7 text-base font-black text-black transition hover:bg-[var(--gold-strong)]"
            href={ctaHref}
            onClick={() => setIsOpen(false)}
          >
            Get app
          </a>
        </nav>
      </div>
    </div>
  );
}
