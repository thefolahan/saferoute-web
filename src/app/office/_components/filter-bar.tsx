'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDownIcon, SearchLgIcon } from './icons';

/* Figma 907:14093 — the search + selects row above a table.
   44h fields, fill #F6F6F6, 1px inside Gray/200, radius 8, text 16/24. */

/**
 * One filter, bound to a search parameter.
 *
 * The whole row writes to the URL rather than to component state, because the
 * rows it filters are fetched by the server page from those same parameters —
 * local state would have filtered nothing, which is what it did before.
 * Changing a filter also drops `page`: page 4 of an unfiltered list is rarely
 * a page of the filtered one.
 */
export function FilterField({
  placeholder,
  width,
  param,
  options,
  search = false
}: {
  placeholder: string;
  width: number;
  /** The search parameter this field owns. */
  param: string;
  /** Omit for a free-text field; pass values for the chevron variant. */
  options?: { value: string; label: string }[];
  search?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const value = params.get(param) ?? '';

  function set(next: string) {
    const query = new URLSearchParams(params.toString());
    if (next) query.set(param, next);
    else query.delete(param);
    query.delete('page');

    const text = query.toString();
    router.replace(text ? `?${text}` : '?', { scroll: false });
  }

  return (
    <div
      className="edge-gray200 flex h-11 w-full shrink-0 items-center gap-2 rounded-lg bg-[#F6F6F6] px-[14px] py-[10px] sm:w-auto"
      style={{ maxWidth: width }}
    >
      {search ? <SearchLgIcon className="h-5 w-5 shrink-0 text-gray-500" /> : null}

      {options ? (
        <select
          value={value}
          aria-label={placeholder}
          onChange={(event) => set(event.target.value)}
          className={`w-full flex-1 appearance-none border-0 bg-transparent p-0 text-base font-normal leading-6 outline-none ${
            value ? 'text-gray-900' : 'text-gray-700'
          }`}
          style={{ width: width - 60 }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <SearchInput
          key={value}
          initial={value}
          placeholder={placeholder}
          onCommit={set}
        />
      )}

      {options ? (
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-900" />
      ) : null}
    </div>
  );
}

/**
 * A text filter that commits on Enter or on blur, not on every keystroke.
 *
 * Each commit is a server round trip for the whole table, so typing "lagos"
 * would otherwise be five of them, and the input would lose focus as the page
 * re-rendered under it.
 */
function SearchInput({
  initial,
  placeholder,
  onCommit
}: {
  initial: string;
  placeholder: string;
  onCommit: (value: string) => void;
}) {
  return (
    <input
      type="search"
      defaultValue={initial}
      placeholder={placeholder}
      aria-label={placeholder}
      onBlur={(event) => {
        if (event.target.value !== initial) onCommit(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className="w-full flex-1 border-0 bg-transparent p-0 text-base font-normal leading-6 text-gray-900 outline-none placeholder:text-gray-700"
    />
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px] px-4 py-[15px] sm:flex-row sm:items-center sm:overflow-x-auto sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
