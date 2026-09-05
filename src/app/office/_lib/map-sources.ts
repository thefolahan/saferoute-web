/**
 * What each kind of coordinate is called, and how it is drawn.
 *
 * In `_lib/` rather than beside `PointMap`, which carries `'use client'`. The
 * Location tab renders server-side and reads these; a `'use client'` module's
 * exports are client references, so `SOURCE_LABEL[source]` came back undefined
 * there and fell through to a generic fallback. The result was one page
 * disagreeing with itself — the legend said "Report" and the table beside it
 * said "Incident" for the same row — with no error anywhere.
 *
 * Nothing here is a component or a hook, so it belongs to neither half.
 */
export const SOURCE_COLOR: Record<string, string> = {
  sos: '#B42318',
  incident: '#F04438',
  live_broadcast: '#DD2590',
  live_share: '#7A5AF8',
  device: '#0BA5EC',
  watched_place: '#3DC47E',
  search: '#98A2B3'
};

export const SOURCE_LABEL: Record<string, string> = {
  sos: 'SOS activation',
  incident: 'Report',
  live_broadcast: 'Live broadcast',
  live_share: 'Live location',
  device: 'Device position',
  watched_place: 'Saved place',
  search: 'Place search'
};
