'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '../_lib/nav';
import { officeHref, useOfficeBase } from '../_lib/office-path';
import { Logo, PanelIcon } from './icons';

/* Figma 907:17157 "Navigation" — 250x1024, fill #171817.
   Header 72h pad 16. Body pad 5/16. Groups gap 15, label→items gap 8,
   items gap 4. Item pad 8/8/8/12 gap 8 radius 8; active fill Error/500. */
export function Sidebar() {
  const pathname = usePathname();
  const base = useOfficeBase();

  return (
    <aside className="w-[250px] shrink-0 bg-sidebar">
      <div className="sticky top-0 flex h-screen flex-col">
      <div className="flex h-[72px] shrink-0 items-center justify-between p-4">
        <Logo className="h-[25px] w-[121px] text-white" />
        <PanelIcon className="h-5 w-5 text-[#F4F7F2]" />
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-[5px] overflow-y-auto px-4 py-[5px]">
        <div className="flex flex-col gap-[15px]">
          <span className="inline-flex w-fit items-center rounded-3xl bg-admin-tag px-[10px] py-[3px] text-[13px] font-semibold leading-4 tracking-[-0.5px] text-[#131313]">
            Admin
          </span>

          {NAV.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="text-xs font-medium leading-[18px] text-sidebar-label">
                {group.label}
              </span>

              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const href = officeHref(base, item.route);
                  const active = item.route
                    ? pathname.startsWith(href)
                    : pathname === base;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.route}
                      href={href}
                      className={`flex items-center gap-2 rounded-lg py-2 pl-3 pr-2 transition-colors ${
                        active ? 'bg-error-500' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* The active row wraps its icon in a 24x24 box, which is
                          what makes it 40px tall against the others' 37. */}
                      <span
                        className={`flex shrink-0 items-center justify-center ${
                          active ? 'h-6 w-6' : 'h-5 w-5'
                        }`}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: active ? '#FFFFFF' : item.iconColor }}
                        />
                      </span>

                      <span
                        className={`text-sm font-normal leading-[21px] ${
                          active ? 'flex-1 text-white' : 'text-sidebar-item'
                        } ${item.badge ? 'flex-1' : ''}`}
                      >
                        {item.label}
                      </span>

                      {item.badge ? (
                        <span className="inline-flex items-center justify-center rounded-3xl bg-error-400 px-[5px] py-[3px] text-xs font-semibold leading-4 tracking-[-0.5px] text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
      </div>
    </aside>
  );
}
