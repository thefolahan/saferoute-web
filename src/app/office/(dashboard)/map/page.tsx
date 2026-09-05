import { officeFetch } from '../../_lib/session';
import { MapView, type MapCard } from './map-view';

export const dynamic = 'force-dynamic';

type ApiMap = {
  incidents: {
    id: string;
    title: string;
    category: string;
    severity: string;
    latitude: number;
    longitude: number;
    addressText: string | null;
    city: string;
    state: string | null;
    reportedAt: string;
  }[];
  total: number;
  truncated: boolean;
  states: { name: string; count: number }[];
};

/**
 * Every incident with a location, drawn where it is.
 *
 * The basemap used to be the designer's static export with markers at
 * hardcoded pixel offsets, so the `latitude` and `longitude` this endpoint
 * returns were fetched and thrown away — a report anywhere in the country
 * appeared wherever the designer had put a pin. The map is a real tile layer
 * now, so the coordinates are what places the markers, and the cards below
 * describe the same incidents.
 */
export default async function MapPage({
  searchParams
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;

  /**
   * The state filter is a query parameter rather than client-side filtering,
   * because it decides which rows are fetched: the endpoint caps at 800, so
   * narrowing here is what makes a busy state's map complete rather than the
   * 800 newest reports nationwide.
   */
  const query = new URLSearchParams();
  if (state) query.set('state', state);

  const data = await officeFetch<ApiMap>(
    `/admin/map/incidents${query.toString() ? `?${query.toString()}` : ''}`
  );

  // A row with no coordinates cannot be drawn; dropping it is better than
  // putting it at 0,0 in the Gulf of Guinea.
  const incidents = (data?.incidents ?? []).filter(
    (incident) =>
      typeof incident.latitude === 'number' &&
      typeof incident.longitude === 'number'
  );

  return (
    <MapView
      mapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null}
      states={data?.states ?? []}
      activeState={state ?? ''}
      total={data?.total ?? incidents.length}
      truncated={data?.truncated ?? false}
      cards={incidents.map((incident): MapCard => ({
        id: incident.id,
        title: incident.title || humanise(incident.category),
        place: incident.addressText ?? incident.city,
        away: new Date(incident.reportedAt).toLocaleDateString('en', {
          month: 'short',
          day: 'numeric'
        }),
        latitude: incident.latitude,
        longitude: incident.longitude,
        severity: incident.severity
      }))}
    />
  );
}

function humanise(category: string): string {
  return category.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}
