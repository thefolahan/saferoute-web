'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NavItem } from '../_lib/marketing-content';

type MobileMenuProps = {
  active?: string;
  primaryLinks: NavItem[];
};

export function MobileMenu({ active, primaryLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const links = primaryLinks;

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
        className="grid size-14 place-items-center rounded-[18px] border border-white/14 bg-[var(--surface)] text-white shadow-[0_18px_46px_rgba(0,0,0,0.34)] transition hover:border-[var(--gold)]/60"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? (
          <X size={30} strokeWidth={2.4} />
        ) : (
          <Menu size={30} strokeWidth={2.4} />
        )}
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 top-[76px] z-[80] overflow-y-auto bg-black/96 px-5 py-7 shadow-2xl backdrop-blur transition duration-300 sm:px-8 ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'}`}
        id="mobile-navigation"
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto grid max-w-[1280px] gap-3"
        >
          {links.map((item) => {
            const slug = item.href.replace(/^\//, '');
            const isActive =
              active === slug || active === item.label.toLowerCase();

            return (
              <a
                className={`flex min-h-16 items-center justify-between rounded-[18px] border px-5 text-xl font-black transition hover:border-[var(--gold)]/45 hover:bg-white/[0.07] ${isActive ? 'border-[var(--gold)]/50 bg-[var(--gold)]/10 text-[var(--gold)]' : 'border-white/12 bg-[var(--surface)] text-white'}`}
                href={item.href}
                key={`${item.label}-${item.href}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
