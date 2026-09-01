import { ChevronDownIcon, SearchLgIcon } from './icons';

/* Figma 907:14093 — the search + selects row above a table.
   44h fields, fill #F6F6F6, 1px inside Gray/200, radius 8, text 16/24. */

export function FilterField({
  placeholder,
  width,
  search = false
}: {
  placeholder: string;
  width: number;
  search?: boolean;
}) {
  return (
    <div
      className="edge-gray200 flex h-11 items-center gap-2 rounded-lg bg-[#F6F6F6] px-[14px] py-[10px]"
      style={{ width }}
    >
      {search ? <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-500" /> : null}
      <span className="flex-1 truncate text-base font-normal leading-6 text-gray-700">
        {placeholder}
      </span>
      {search ? null : <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-900" />}
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-[10px] px-8 py-[15px]">{children}</div>;
}
