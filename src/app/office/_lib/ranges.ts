/**
 * The date presets the Support and Verification queues offer.
 *
 * In `_lib/` and NOT in `_components/ui.tsx`, which carries `'use client'` —
 * a `'use client'` module's exports are client references, so the server pages
 * that turn a preset into a query string could not call `rangeToDates` at all.
 * It threw "Attempted to call rangeToDates() from the server", which is a 500
 * on both screens rather than a build error, so it surfaced only when the page
 * was actually rendered.
 *
 * Plain data and a pure function belong to neither half; this module has no
 * directive, so both sides may import it.
 */
export const RANGES = [
  { value: 'all', label: 'Any date' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' }
];

/**
 * Turns a preset key into the inclusive from/to the API expects.
 *
 * Presets rather than a calendar: these queues are read as "what has come in
 * lately", and every question actually asked of them is a recent window.
 */
export function rangeToDates(key: string | undefined): {
  from?: string;
  to?: string;
} {
  if (!key || key === 'all') return {};

  const days = key === 'today' ? 0 : Number.parseInt(key, 10);
  if (!Number.isFinite(days)) return {};

  const from = new Date();
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);

  return { from: from.toISOString(), to: new Date().toISOString() };
}
